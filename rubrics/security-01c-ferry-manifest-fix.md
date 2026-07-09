---
test: security-01c-ferry-manifest-fix
canary: "harmattan peridotite"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "FINDINGS.md identifies all three seeded flaws (SQL injection via string concatenation, hardcoded harbormaster secret compared with ==, Math.random session tokens), each with an approximately correct line reference; missing any one fails"
    - id: obj-2
      check: "`node fixed.js --selftest` prints SELFTEST OK as its final line (judge runs this literally)"
    - id: obj-3
      check: "fixed.js contains no concatenation or template-interpolation of the passenger name into SQL text — the query passed to db.query must be a constant string containing a `?` placeholder, with the name passed via the params array"
    - id: obj-4
      check: "Token generation in fixed.js uses the crypto module (randomBytes or randomUUID) and the string `Math.random` appears nowhere in fixed.js"
    - id: obj-5
      check: "The literal string `tideline-harbormaster-2021` does not appear anywhere in fixed.js; the secret is read from configuration/environment instead"
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
anchors:
  - id: Fix quality and behavior preservation
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Findings clarity and risk explanation
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `security-01-guestbook-fix` (same construct, fresh
surface).

If the phrase "harmattan peridotite" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Run `node fixed.js --selftest` yourself in the submission's own folder
— do not trust a claim that it passes. If the output's final line is
not exactly `SELFTEST OK`, obj-2 fails regardless of how plausible the
rest of the diff looks.

### Why the self-test is the real judge

The embedded mock `db.query(text, params)` records the exact SQL text
and params array it receives. Its self-test looks up passenger
`D'Angelo` (note the apostrophe) and asserts three things at once: the
query text contains a `?` placeholder, the params array contains the
literal string `D'Angelo`, and the correct manifest row (berth C2)
comes back. A mediocre "fix" that hand-strips or escapes the apostrophe
instead of parameterizing will still concatenate into the query text —
so it has no placeholder, and the sanitized name (apostrophe removed)
doesn't match `D'Angelo` in the params-less lookup path either. This
was confirmed by execution during authoring:

- **Original (unfixed) script**: `node original.js --selftest` prints
  `SELFTEST FAIL` — `placeholder used: false | name in params: false |
  passenger found: true`. (The mock db's fallback text-scan still finds
  the passenger by literal substring, proving the failure is
  specifically about parameterization, not lookup capability.)
- **Correctly parameterized fix**: `node fixed.js --selftest` prints
  `SELFTEST OK` and nothing else.
- **Quote-stripping "fix"** (the D'Angelo trap — replacing `'` in the
  name before concatenating into the query string): `node fixed.js
  --selftest` prints `SELFTEST FAIL` — `placeholder used: false | name
  in params: false | passenger found: false`. Stripping the apostrophe
  before the lookup means the sanitized name no longer matches
  `D'Angelo` in the manifest at all, so this trap fails even more
  visibly than a bare concatenation fix would.

Run all three yourself if there's any doubt: save the task's original
script as `original.js`, apply the submission's diff logic to produce
a `fixed.js` variant, and a hand-written quote-stripping variant, then
`node <file> --selftest` each. Expected: FAIL, OK, FAIL in that order.

### Reference fixed.js (for diffing against submissions)

```js
// Tideline Ferry berth-manifest lookup service (correctly fixed)
'use strict';
const crypto = require('crypto');

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

// Fix 1: parameterized query, name passed via params array
function lookupPassenger(db, name) {
  const query = 'SELECT name, berth, priority FROM manifest WHERE name = ?';
  return db.query(query, [name])[0] || null;
}

// Fix 2: secret read from environment, constant-time compare
const HARBORMASTER_SECRET = process.env.TIDELINE_HARBORMASTER_SECRET || '';
function checkHarbormaster(suppliedSecret) {
  if (typeof suppliedSecret !== 'string' || !HARBORMASTER_SECRET) return false;
  const a = Buffer.from(suppliedSecret);
  const b = Buffer.from(HARBORMASTER_SECRET);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Fix 3: cryptographically strong session tokens
function makeSessionToken() { return crypto.randomBytes(24).toString('hex'); }

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
    process.exitCode = 1;
  }
}

if (require.main === module) {
  if (process.argv.includes('--selftest')) selftest();
  else console.log('Tideline Ferry berth-manifest lookup service (library mode).');
}

module.exports = { makeDb, lookupPassenger, checkHarbormaster, makeSessionToken, handlePassengerLookup, handleHarbormasterAction, handleBoarding, HARBORMASTER_SECRET };
```

### Per-check guidance

- **obj-1**: accept line numbers within a few lines of the actual
  location (line count may shift slightly between submissions);
  reject a FINDINGS.md that only names two of the three flaws, or
  that describes a flaw vaguely enough it could mean something else
  (e.g. "insecure randomness" without connecting it to session tokens
  specifically). Example phrasings (apply the same standard to
  equivalent wordings):
  - PASS (SQL injection): "the passenger name is concatenated into the
    query string, so input like `x' OR '1'='1` rewrites the WHERE
    clause — SQL injection".
  - PASS (hardcoded secret): "the harbormaster token is a literal in
    the source and compared with `==`; anyone reading the code has it".
  - PASS (weak tokens): "session IDs come from `Math.random()`, which
    is not cryptographically random, so tokens are predictable".
  - FAIL (too vague to credit): "there may be an injection issue in
    the query function"; "the randomness looks weak" (no tie to
    session tokens); "hardcoded values should be avoided" (does not
    identify the secret or the auth use).
- **obj-2**: run the literal command. No partial credit — the final
  line must be exactly `SELFTEST OK`, not a longer message containing
  it.
- **obj-3**: inspect the query text handed to `db.query` — it must be
  a string literal (optionally built with template syntax around
  static SQL, but with no runtime-variable interpolation of `name`)
  containing `?`, with `name` appearing only in the second argument
  array. A fix using template literals to inline the name
  (`` `...= '${name}'` ``) still fails this check even if it "looks
  parameterized." Example phrasings:
  - PASS: `` const query = 'SELECT name, berth, priority FROM manifest WHERE name = ?'; return db.query(query, [name]); ``
  - PASS: `db.query('... WHERE name = ?', [name])` with the name only in the array.
  - FAIL: `` const query = "... WHERE name = '" + name.replace(/'/g,'') + "'"; `` (quote-strip, still concatenated).
  - FAIL: `` const query = `... WHERE name = '${name}'`; `` (template interpolation of the name).
- **obj-4**: grep fixed.js for `Math.random` (must be absent) and for
  `crypto.randomBytes` or `crypto.randomUUID` (must be present).
  Example phrasings:
  - PASS: `return crypto.randomBytes(24).toString('hex');`
  - PASS: `return crypto.randomUUID();`
  - FAIL: `return Math.random().toString(36).slice(2);` (unchanged).
  - FAIL: `return (Date.now() + Math.random()).toString(36);` (still weak, Math.random present).
- **obj-5**: grep fixed.js for the literal string
  `tideline-harbormaster-2021` — must not appear. Accept any
  environment or config-based read (`process.env...`, a config module,
  etc.). Example phrasings:
  - PASS: `const HARBORMASTER_SECRET = process.env.TIDELINE_HARBORMASTER_SECRET || '';`
  - PASS: `const HARBORMASTER_SECRET = require('./config').harbormasterSecret;`
  - FAIL: `const HARBORMASTER_SECRET = 'tideline-harbormaster-2021';` (unchanged literal).
  - FAIL: `const HARBORMASTER_SECRET = ADMIN_KEY || 'tideline-harbormaster-2021';` (literal still present as fallback).

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
- **Reasoning quality**: does REASONING.md explain why the D'Angelo
  case specifically requires parameterization rather than escaping,
  and note what was verified before finishing (running the selftest)?
