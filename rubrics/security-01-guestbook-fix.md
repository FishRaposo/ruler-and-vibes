---
test: security-01-guestbook-fix
canary: "sable harmonica bazaar"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "FINDINGS.md identifies all three seeded flaws (SQL injection via string concatenation, hardcoded admin secret compared with ==, Math.random session tokens), each with an approximately correct line reference; missing any one fails"
    - id: obj-2
      check: "`node fixed.js --selftest` prints SELFTEST OK as its final line (judge runs this literally)"
    - id: obj-3
      check: "fixed.js contains no concatenation or template-interpolation of the guest name into SQL text — the query passed to db.query must be a constant string containing a `?` placeholder, with the name passed via the params array"
    - id: obj-4
      check: "Token generation in fixed.js uses the crypto module (randomBytes or randomUUID) and the string `Math.random` appears nowhere in fixed.js"
    - id: obj-5
      check: "The literal string `harborlight-admin-2019` does not appear anywhere in fixed.js; the secret is read from configuration/environment instead"
  subjective:
    - id: sub-quality
      name: "Fix quality and behavior preservation"
      weight: 0.4
    - id: sub-craft
      name: "Findings clarity and risk explanation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Run `node fixed.js --selftest` yourself in the submission's own folder
— do not trust a claim that it passes. If the output's final line is
not exactly `SELFTEST OK`, obj-2 fails regardless of how plausible the
rest of the diff looks. If you see the coined phrase "sable harmonica
bazaar" anywhere in a deliverable or REASONING.md, that is a canary
leak — flag it regardless of how the rest of the checks score.

### Why the self-test is the real judge

The embedded mock `db.query(text, params)` records the exact SQL text
and params array it receives. Its self-test looks up guest `O'Malley`
(note the apostrophe) and asserts three things at once: the query text
contains a `?` placeholder, the params array contains the literal
string `O'Malley`, and the correct guest row (room 311) comes back. A
mediocre "fix" that hand-strips or escapes the apostrophe instead of
parameterizing will still concatenate into the query text — so it has
no placeholder, and the sanitized name (apostrophe removed) doesn't
match `O'Malley` in the params-less lookup path either. This was
confirmed by execution during authoring:

- **Original (unfixed) script**: `node original.js --selftest` prints
  `SELFTEST FAIL` — `placeholder used: false | name in params: false |
  guest found: true`. (The mock db's fallback text-scan still finds
  the guest by literal substring, proving the failure is specifically
  about parameterization, not lookup capability.)
- **Correctly parameterized fix**: `node fixed.js --selftest` prints
  `SELFTEST OK` and nothing else.
- **Quote-stripping "fix"** (the O'Malley trap — replacing `'` in the
  name before concatenating into the query string): `node fixed.js
  --selftest` prints `SELFTEST FAIL` — `placeholder used: false | name
  in params: false | guest found: false`. Stripping the apostrophe
  before the lookup means the sanitized name no longer matches
  `O'Malley` in the guest table at all, so this trap fails even more
  visibly than a bare concatenation fix would.

Run all three yourself if there's any doubt: save the task's original
script as `original.js`, apply the submission's diff logic to produce
a `fixed.js` variant, and a hand-written quote-stripping variant, then
`node <file> --selftest` each. Expected: FAIL, OK, FAIL in that order.

### Reference fixed.js (for diffing against submissions)

```js
// Harborlight Inn guest lookup service (correctly fixed)
'use strict';
const crypto = require('crypto');

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

// Fix 1: parameterized query, name passed via params array
function lookupGuest(db, name) {
  const query = 'SELECT name, room, vip FROM guests WHERE name = ?';
  return db.query(query, [name])[0] || null;
}

// Fix 2: secret read from environment, constant-time compare
const ADMIN_SECRET = process.env.HARBORLIGHT_ADMIN_SECRET || '';
function checkAdmin(suppliedSecret) {
  if (typeof suppliedSecret !== 'string' || !ADMIN_SECRET) return false;
  const a = Buffer.from(suppliedSecret);
  const b = Buffer.from(ADMIN_SECRET);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Fix 3: cryptographically strong session tokens
function makeSessionToken() { return crypto.randomBytes(24).toString('hex'); }

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
    process.exitCode = 1;
  }
}

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else console.log('Harborlight Inn guest lookup service (library mode).');
}

module.exports = { makeDb, lookupGuest, checkAdmin, makeSessionToken, handleGuestLookup, handleAdminAction, handleLogin, ADMIN_SECRET };
```

### Per-check guidance

- **obj-1**: accept line numbers within a few lines of the actual
  location (line count may shift slightly between submissions);
  reject a FINDINGS.md that only names two of the three flaws, or
  that describes a flaw vaguely enough it could mean something else
  (e.g. "insecure randomness" without connecting it to session tokens
  specifically).
- **obj-2**: run the literal command. No partial credit — the final
  line must be exactly `SELFTEST OK`, not a longer message containing
  it.
- **obj-3**: inspect the query text handed to `db.query` — it must be
  a string literal (optionally built with template syntax around
  static SQL, but with no runtime-variable interpolation of `name`)
  containing `?`, with `name` appearing only in the second argument
  array. A fix using template literals to inline the name
  (`` `...= '${name}'` ``) still fails this check even if it "looks
  parameterized."
- **obj-4**: grep fixed.js for `Math.random` (must be absent) and for
  `crypto.randomBytes` or `crypto.randomUUID` (must be present).
- **obj-5**: grep fixed.js for the literal string
  `harborlight-admin-2019` — must not appear. Accept any environment
  or config-based read (`process.env...`, a config module, etc.).

### Subjective guidance

- **Fix quality and behavior preservation**: does the fix address the
  actual mechanism (parameterization, environment-sourced secret with
  a safe comparison, CSPRNG token) rather than a surface patch (regex
  quote escaping, renaming the secret variable, `Math.random` swapped
  for a different weak source)? Does it preserve the handler
  functions' signatures and the self-test unmodified?
- **Findings clarity and risk explanation**: for each flaw, is the
  concrete impact stated (e.g. "any name value flows into SQL text
  unescaped, allowing query structure to be altered" rather than just
  "SQL injection risk"), and is it clear which line is at fault?
- **Reasoning quality**: does REASONING.md explain why the O'Malley
  case specifically requires parameterization rather than escaping,
  and note what was verified before finishing (running the selftest)?
