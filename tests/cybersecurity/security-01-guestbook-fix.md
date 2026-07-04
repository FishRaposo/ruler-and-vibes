---
id: security-01-guestbook-fix
category: cybersecurity
title: Three flaws in the Harborlight Inn guest lookup
deliverables:
  - FINDINGS.md
  - fixed.js
---

## Task

The Harborlight Inn's guest-lookup service is below, complete and
runnable with plain `node`, no dependencies. It has three security
flaws. Find them, then produce a fixed version that preserves every
legitimate behavior — including the self-test at the bottom.

```js
// Harborlight Inn guest lookup service (original, flawed)
'use strict';
const GUESTS = [
  { name: 'Alvarez', room: '204', vip: false },
  { name: "O'Malley", room: '311', vip: true },
  { name: 'Chen', room: '108', vip: false }
];

function makeDb() {
  return {
    lastText: null, lastParams: null,
    query(text, params) {
      this.lastText = text;
      this.lastParams = params || [];
      if (/\?/.test(text)) {
        const wanted = this.lastParams[0];
        const row = GUESTS.find(g => g.name === wanted);
        return row ? [row] : [];
      }
      const row = GUESTS.find(g => text.includes(g.name));
      return row ? [row] : [];
    }
  };
}

// Flaw 1: SQL built by string-concatenating the guest name
function lookupGuest(db, name) {
  const query = "SELECT name, room, vip FROM guests WHERE name = '" + name + "'";
  return db.query(query, [])[0] || null;
}

// Flaw 2: hardcoded admin secret compared with ==
const ADMIN_SECRET = 'harborlight-admin-2019';
function checkAdmin(secret) { return secret == ADMIN_SECRET; }

// Flaw 3: session tokens from Math.random
function makeSessionToken() { return Math.random().toString(36).slice(2); }

function handleGuestLookup(db, req) {
  const guest = lookupGuest(db, req.name);
  return guest ? { status: 200, body: guest } : { status: 404, body: 'not found' };
}
function handleAdminAction(req) {
  return checkAdmin(req.secret) ? { status: 200, body: 'admin ok' } : { status: 403, body: 'forbidden' };
}
function handleLogin(req) { return { status: 200, body: { token: makeSessionToken() } }; }

function selftest() {
  const db = makeDb();
  const guest = lookupGuest(db, "O'Malley");
  const usedPlaceholder = /\?/.test(db.lastText);
  const nameInParams = Array.isArray(db.lastParams) && db.lastParams.includes("O'Malley");
  const foundGuest = !!guest && guest.name === "O'Malley" && guest.room === '311';
  if (usedPlaceholder && nameInParams && foundGuest) {
    console.log('SELFTEST OK');
  } else {
    console.log('SELFTEST FAIL');
    console.log('  placeholder used:', usedPlaceholder, '| name in params:', nameInParams, '| guest found:', foundGuest);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else console.log('Harborlight Inn guest lookup service (library mode).');
}

module.exports = { makeDb, lookupGuest, checkAdmin, makeSessionToken, handleGuestLookup, handleAdminAction, handleLogin, ADMIN_SECRET };
```

Save this exact script (with your fixes applied) as `fixed.js` and run
`node fixed.js --selftest` yourself before you finish — it must print
exactly `SELFTEST OK` as its final line. The self-test's guest lookup
uses a name with an apostrophe; a fix that merely strips or
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
