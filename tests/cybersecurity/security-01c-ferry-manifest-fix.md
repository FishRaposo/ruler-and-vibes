---
id: security-01c-ferry-manifest-fix
category: cybersecurity
title: Three flaws in the Tideline Ferry berth-manifest lookup
deliverables:
  - FINDINGS.md
  - fixed.js
---

## Task

The Tideline Ferry's berth-manifest lookup service is below, complete
and runnable with plain `node`, no dependencies. It has three security
flaws. Find them, then produce a fixed version that preserves every
legitimate behavior — including the self-test at the bottom.

```js
// Tideline Ferry berth-manifest lookup service (original, flawed)
'use strict';
const PASSENGERS = [
  { name: 'Larsson', berth: 'A7', priority: false },
  { name: "D'Angelo", berth: 'C2', priority: true },
  { name: 'Kealoha', berth: 'B4', priority: false }
];

function makeDb() {
  return {
    lastText: null, lastParams: null,
    query(text, params) {
      this.lastText = text;
      this.lastParams = params || [];
      if (/\?/.test(text)) {
        const wanted = this.lastParams[0];
        const row = PASSENGERS.find(p => p.name === wanted);
        return row ? [row] : [];
      }
      const row = PASSENGERS.find(p => text.includes(p.name));
      return row ? [row] : [];
    }
  };
}

// Flaw 1: SQL built by string-concatenating the passenger name
function lookupPassenger(db, name) {
  const query = "SELECT name, berth, priority FROM manifest WHERE name = '" + name + "'";
  return db.query(query, [])[0] || null;
}

// Flaw 2: hardcoded harbormaster secret compared with ==
const HARBORMASTER_SECRET = 'tideline-harbormaster-2021';
function checkHarbormaster(secret) { return secret == HARBORMASTER_SECRET; }

// Flaw 3: session tokens from Math.random
function makeSessionToken() { return Math.random().toString(36).slice(2); }

function handlePassengerLookup(db, req) {
  const passenger = lookupPassenger(db, req.name);
  return passenger ? { status: 200, body: passenger } : { status: 404, body: 'not found' };
}
function handleHarbormasterAction(req) {
  return checkHarbormaster(req.secret) ? { status: 200, body: 'harbormaster ok' } : { status: 403, body: 'forbidden' };
}
function handleBoarding(req) { return { status: 200, body: { token: makeSessionToken() } }; }

function selftest() {
  const db = makeDb();
  const passenger = lookupPassenger(db, "D'Angelo");
  const usedPlaceholder = /\?/.test(db.lastText);
  const nameInParams = Array.isArray(db.lastParams) && db.lastParams.includes("D'Angelo");
  const foundPassenger = !!passenger && passenger.name === "D'Angelo" && passenger.berth === 'C2';
  if (usedPlaceholder && nameInParams && foundPassenger) {
    console.log('SELFTEST OK');
  } else {
    console.log('SELFTEST FAIL');
    console.log('  placeholder used:', usedPlaceholder, '| name in params:', nameInParams, '| passenger found:', foundPassenger);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else console.log('Tideline Ferry berth-manifest lookup service (library mode).');
}

module.exports = { makeDb, lookupPassenger, checkHarbormaster, makeSessionToken, handlePassengerLookup, handleHarbormasterAction, handleBoarding, HARBORMASTER_SECRET };
```

Save this exact script (with your fixes applied) as `fixed.js` and run
`node fixed.js --selftest` yourself before you finish — it must print
exactly `SELFTEST OK` as its final line. The self-test's passenger
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
