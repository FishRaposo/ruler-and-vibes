---
test: security-01b-railway-volunteer-fix
canary: "levanter andesite"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "FINDINGS.md identifies all three seeded flaws (SQL injection via string concatenation, hardcoded dispatch secret compared with ==, Math.random session tokens), each with an approximately correct line reference; missing any one fails"
    - id: obj-2
      check: "`node fixed.js --selftest` prints SELFTEST OK as its final line (judge runs this literally)"
    - id: obj-3
      check: "fixed.js contains no concatenation or template-interpolation of the volunteer name into SQL text — the query passed to db.query must be a constant string containing a `?` placeholder, with the name passed via the params array"
    - id: obj-4
      check: "Token generation in fixed.js uses the crypto module (randomBytes or randomUUID) and the string `Math.random` appears nowhere in fixed.js"
    - id: obj-5
      check: "The literal string `sedgewick-dispatch-2021` does not appear anywhere in fixed.js; the secret is read from configuration/environment instead"
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

Parallel form of `security-01-guestbook-fix` (same construct, fresh
surface).

If the phrase "levanter andesite" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Run `node fixed.js --selftest` yourself in the submission's own folder
— do not trust a claim that it passes. If the output's final line is
not exactly `SELFTEST OK`, obj-2 fails regardless of how plausible the
rest of the diff looks.

### Why the self-test is the real judge

The embedded mock `db.query(text, params)` records the exact SQL text
and params array it receives. Its self-test looks up volunteer
`O'Rourke` (note the apostrophe) and asserts three things at once: the
query text contains a `?` placeholder, the params array contains the
literal string `O'Rourke`, and the correct volunteer row (post 42)
comes back. A mediocre "fix" that hand-strips or escapes the apostrophe
instead of parameterizing will still concatenate into the query text —
so it has no placeholder, and the sanitized name (apostrophe removed)
doesn't match `O'Rourke` in the params-less lookup path either. This
was confirmed by execution during authoring:

- **Original (unfixed) script**: `node original.js --selftest` prints
  `SELFTEST FAIL` — `placeholder used: false | name in params: false |
  vol found: true`. (The mock db's fallback text-scan still finds the
  volunteer by literal substring, proving the failure is specifically
  about parameterization, not lookup capability.)
- **Correctly parameterized fix**: `node fixed.js --selftest` prints
  `SELFTEST OK` and nothing else.
- **Quote-stripping "fix"** (the O'Rourke trap — replacing `'` in the
  name before concatenating into the query string): `node fixed.js
  --selftest` prints `SELFTEST FAIL` — `placeholder used: false | name
  in params: false | vol found: false`. Stripping the apostrophe
  before the lookup means the sanitized name no longer matches
  `O'Rourke` in the volunteer table at all, so this trap fails even
  more visibly than a bare concatenation fix would.

Run all three yourself if there's any doubt: save the task's original
script as `original.js`, apply the submission's diff logic to produce
a `fixed.js` variant, and a hand-written quote-stripping variant, then
`node <file> --selftest` each. Expected: FAIL, OK, FAIL in that order.

### Reference fixed.js (for diffing against submissions)

```js
// Sedgewick Heritage Railway volunteer lookup service (correctly fixed)
'use strict';
const crypto = require('crypto');

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

// Fix 1: parameterized query, name passed via params array
function lookupVolunteer(db, name) {
  const query = 'SELECT name, post, lead FROM volunteers WHERE name = ?';
  return db.query(query, [name])[0] || null;
}

// Fix 2: secret read from environment, constant-time compare
const DISPATCH_SECRET = process.env.SEDGEWICK_DISPATCH_SECRET || '';
function checkDispatch(suppliedSecret) {
  if (typeof suppliedSecret !== 'string' || !DISPATCH_SECRET) return false;
  const a = Buffer.from(suppliedSecret);
  const b = Buffer.from(DISPATCH_SECRET);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Fix 3: cryptographically strong session tokens
function makeSessionToken() { return crypto.randomBytes(24).toString('hex'); }

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
    process.exitCode = 1;
  }
}

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else console.log('Sedgewick Heritage Railway volunteer lookup service (library mode).');
}

module.exports = { makeDb, lookupVolunteer, checkDispatch, makeSessionToken, handleVolunteerLookup, handleDispatchAction, handleSignIn, DISPATCH_SECRET };
```

### Per-check guidance

- **obj-1**: accept line numbers within a few lines of the actual
  location (line count may shift slightly between submissions);
  reject a FINDINGS.md that only names two of the three flaws, or
  that describes a flaw vaguely enough it could mean something else
  (e.g. "insecure randomness" without connecting it to session tokens
  specifically). Example phrasings (apply the same standard to
  equivalent wordings):
  - PASS (SQL injection): "the volunteer name is concatenated into the
    query string, so input like `x' OR '1'='1` rewrites the WHERE
    clause — SQL injection".
  - PASS (hardcoded secret): "the dispatch token is a literal in the
    source and compared with `==`; anyone reading the code has it".
  - PASS (weak tokens): "session IDs come from `Math.random()`, which
    is not cryptographically random, so tokens are predictable".
  - FAIL (too vague to credit): "there may be an injection issue in
    the query function"; "the randomness looks weak" (no tie to
    session tokens); "hardcoded values should be avoided" (does not
    identify the secret or the dispatch-auth use).
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
  `sedgewick-dispatch-2021` — must not appear. Accept any environment
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
- **Reasoning quality**: does REASONING.md explain why the O'Rourke
  case specifically requires parameterization rather than escaping,
  and note what was verified before finishing (running the selftest)?
