---
id: security-01b-railway-volunteer-fix
category: cybersecurity
title: Three flaws in the Sedgewick Heritage Railway volunteer lookup
deliverables:
  - FINDINGS.md
  - fixed.js
---

## Task

The Sedgewick Heritage Railway's volunteer-lookup service is below,
complete and runnable with plain `node`, no dependencies. It has three
security flaws. Find them, then produce a fixed version that preserves
every legitimate behavior — including the self-test at the bottom.

```js
// Sedgewick Heritage Railway volunteer lookup service (original, flawed)
'use strict';
const VOLUNTEERS = [
  { name: 'Bex', post: '17', lead: false },
  { name: "O'Rourke", post: '42', lead: true },
  { name: 'Nkemelu', post: '09', lead: false }
];

function makeDb() {
  return {
    lastText: null, lastParams: null,
    query(text, params) {
      this.lastText = text;
      this.lastParams = params || [];
      if (/\?/.test(text)) {
        const wanted = this.lastParams[0];
        const row = VOLUNTEERS.find(v => v.name === wanted);
        return row ? [row] : [];
      }
      const row = VOLUNTEERS.find(v => text.includes(v.name));
      return row ? [row] : [];
    }
  };
}

// Flaw 1: SQL built by string-concatenating the volunteer name
function lookupVolunteer(db, name) {
  const query = "SELECT name, post, lead FROM volunteers WHERE name = '" + name + "'";
  return db.query(query, [])[0] || null;
}

// Flaw 2: hardcoded dispatch secret compared with ==
const DISPATCH_SECRET = 'sedgewick-dispatch-2021';
function checkDispatch(secret) { return secret == DISPATCH_SECRET; }

// Flaw 3: session tokens from Math.random
function makeSessionToken() { return Math.random().toString(36).slice(2); }

function handleVolunteerLookup(db, req) {
  const vol = lookupVolunteer(db, req.name);
  return vol ? { status: 200, body: vol } : { status: 404, body: 'not found' };
}
function handleDispatchAction(req) {
  return checkDispatch(req.secret) ? { status: 200, body: 'dispatch ok' } : { status: 403, body: 'forbidden' };
}
function handleSignIn(req) { return { status: 200, body: { token: makeSessionToken() } }; }

function selftest() {
  const db = makeDb();
  const vol = lookupVolunteer(db, "O'Rourke");
  const usedPlaceholder = /\?/.test(db.lastText);
  const nameInParams = Array.isArray(db.lastParams) && db.lastParams.includes("O'Rourke");
  const foundVol = !!vol && vol.name === "O'Rourke" && vol.post === '42';
  if (usedPlaceholder && nameInParams && foundVol) {
    console.log('SELFTEST OK');
  } else {
    console.log('SELFTEST FAIL');
    console.log('  placeholder used:', usedPlaceholder, '| name in params:', nameInParams, '| vol found:', foundVol);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else console.log('Sedgewick Heritage Railway volunteer lookup service (library mode).');
}

module.exports = { makeDb, lookupVolunteer, checkDispatch, makeSessionToken, handleVolunteerLookup, handleDispatchAction, handleSignIn, DISPATCH_SECRET };
```

Save this exact script (with your fixes applied) as `fixed.js` and run
`node fixed.js --selftest` yourself before you finish — it must print
exactly `SELFTEST OK` as its final line. The self-test's volunteer
lookup uses a name with an apostrophe; a fix that merely strips or
hand-escapes quotes instead of parameterizing the query will not
satisfy it.

## Deliverables

- `FINDINGS.md` — one entry per flaw: what it is, the approximate line
  it's on, and the concrete risk if left in production.
- `fixed.js` — the same script with all three flaws corrected and
  every legitimate behavior (including `--selftest`) still working.
  Keep the same overall structure and self-test harness; don't rewrite
  the file from scratch.

## Constraints

- Plain Node.js, no dependencies, no framework additions.
- `node fixed.js --selftest` must print `SELFTEST OK` as its last line.
- Do not change what the self-test checks — only fix the flaws it
  exposes.
