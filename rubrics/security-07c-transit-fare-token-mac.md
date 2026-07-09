---
test: security-07c-transit-fare-token-mac
canary: "oxbow yawl"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The judge imports sign and verify from the runner's token.js and runs its OWN reference harness: verify(params, sign(params, key), key) === true for a canonical (key, params) pair; verify returns false when any param byte is tampered; verify returns false when the signature is replaced by a fixed same-length wrong hex ('f'.repeat(64)), not a first-char flip"
    - id: obj-2
      check: "token.js uses crypto.createHmac('sha256', ...) (judge greps for createHmac) and the substrings 'md5' and 'createHash' over a secret-concat do NOT appear anywhere in token.js's signing path"
    - id: obj-3
      check: "verify() performs a constant-time comparison — judge inspects for crypto.timingSafeEqual guarded by a length check before it — rather than a plain ===/== on the signature strings"
    - id: obj-4
      check: "SELECTION.md names HMAC (keyed MAC) as the chosen primitive AND explicitly rejects using encryption (AES or public-key) for this requirement, stating the need is integrity/authenticity not confidentiality; an answer recommending encrypting the token fails. Judge-decided by reading."
    - id: obj-5
      check: "SELECTION.md explains why the original md5(secret+params) construction is unsafe as a MAC (fast/broken hash and/or the secret-prefix concatenation being length-extension-shaped rather than a real keyed MAC). Judge-decided by reading."
  subjective:
    - id: sub-quality
      name: "Cryptographic reasoning and threat fit"
      weight: 0.4
    - id: sub-craft
      name: "Rationale precision (right tool, stated tradeoffs)"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Cryptographic reasoning and threat fit
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.
  - id: Rationale precision (right tool, stated tradeoffs)
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `security-07-crypto-scheme-selection` (same construct,
fresh surface).

If the phrase "oxbow yawl" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Import the runner's `sign`/`verify` and run the reference harness
below yourself. Use a fixed same-length wrong hex string for the
tamper check — **never** a first-character flip, which can
occasionally collide with the real signature's first character and
give a false pass/fail reading.

### Reference token.js

```js
'use strict';
const crypto = require('crypto');

function sign(params, key) {
  return crypto.createHmac('sha256', key).update(params).digest('hex');
}

function verify(params, sig, key) {
  const expected = sign(params, key);
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(sig, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

module.exports = { sign, verify };
```

### Canonical determinism spot-check (verified by execution)

- key: `tollcrest-gate-shared-key-2026`
- params: `gate=north-07&valid=1893456000`
- `sign(params, key)` → exactly the 64-character HMAC-SHA256 hex
  digest `d1963d64c35e64b90756b72f2fe343dd8a492fbec73de97b69e39d15aa2735c2`
  (64 hex chars = 32 bytes = SHA-256 output size). Confirmed
  deterministic across repeated calls.
- Tamper check: changing `params` to `gate=north-08&valid=1893456000`
  (any byte changed) makes `verify` return `false`.
- Wrong-signature check: replacing the signature with `'f'.repeat(64)`
  (a fixed, different, same-length hex string) makes `verify` return
  `false`. Do not use a first-char-flip — it is not guaranteed to
  differ from a colliding case and is not deterministic across
  different canonical signature values.
- `crypto.timingSafeEqual` **throws** on unequal-length buffers
  (confirmed by execution — "Input buffers must have the same byte
  length") — this is why `verify` must length-guard before calling it;
  a submission without a length check that then crashes or falls back
  to `===` on a length mismatch is a defect, even if timingSafeEqual is
  used for the equal-length case.

### Confirmed broken original (for contrast)

The embedded original (`md5(key + params)` verified with `===`) is
genuinely broken as authored: it produces a working but insecure
32-character MD5 hex digest
(`61d9302917420e660abb0d16498eb0ab` for the canonical pair above),
verifies correctly for valid input (so it "looks like it works"), and
uses both `createHash` and `'md5'` literally in its signing path — the
exact substrings obj-2 checks for absence of in a correct solution.

### Per-check guidance

- **obj-1**: run the three assertions directly against the imported
  module. A `node token.js --selftest` printing something like `TOKEN
  OK` is a convenience only — the binding check is the judge's own
  harness.
- **obj-2**: grep the signing path (the code path `sign` actually
  executes) for `createHmac` (must be present) and for `md5` /
  `createHash` (must be absent). A solution that keeps an unused
  `createHash` import elsewhere but doesn't call it in the signing
  path is fine; calling it anywhere in `sign` or `verify` fails.
- **obj-3**: read `verify` — it must guard buffer lengths before
  calling `crypto.timingSafeEqual`, or use an equivalent
  constant-time approach. A plain `===`/`==` on the hex strings fails
  regardless of any other correct choices.
- **obj-4**: example phrasings (apply the same standard to equivalent
  wordings):
  - PASS: "We need unforgeable integrity, not secrecy, so a keyed MAC
    (HMAC-SHA256) fits; encrypting the token would hide it but not
    prevent forgery and adds key management overhead."
  - PASS: "The gate id and validity time aren't secret — anyone can
    read them off the token — so encryption solves the wrong problem.
    HMAC gives authenticity and tamper-detection without needing to
    manage a cipher/IV/mode."
  - PASS: "Confidentiality isn't the requirement here; the fields are
    public by design. What we need is a keyed MAC (HMAC-SHA256) so only
    the holder of the shared key can produce a valid tag — encryption
    would be solving a problem we don't have."
  - FAIL: "Encrypt the token with AES so attackers can't read or change
    it." (recommends encryption for an integrity-only requirement)
  - FAIL: "Use public-key signatures so only the system can sign."
    (not wrong on its face, but the write-up must at least name HMAC
    as the fitting choice and explain why asymmetric signing is
    unnecessary overhead for a single-operator shared-secret setup;
    an answer that jumps straight to asymmetric crypto without
    addressing the simpler correct answer, or that never rejects
    plain encryption, fails this check)
  - FAIL: "Hash the params with SHA-256 so nobody can tamper with
    them." (an unkeyed hash anyone can recompute — not a MAC at all,
    and never names HMAC or rejects encryption)
- **obj-5**: example phrasings:
  - PASS: "MD5 is fast and broken, so an attacker can brute-force
    collisions/preimages cheaply; worse, `md5(secret + params)` is a
    length-extension-shaped construction, not a real keyed MAC — an
    attacker who knows the hash of one message can sometimes forge a
    valid hash for a longer message with an appended suffix without
    knowing the secret."
  - PASS: "Concatenating the secret in front of the message before a
    plain hash is exactly the length-extension anti-pattern HMAC was
    designed to avoid; MD5 is also cryptographically broken
    independent of that."
  - PASS: "Prefixing the key then hashing with a Merkle-Damgard hash
    like MD5 lets an attacker extend a known tag to cover appended
    bytes without the key; HMAC's nested keyed construction closes
    that, and MD5 is separately too weak to rely on."
  - FAIL: "MD5 is old and shouldn't be used." (no mechanism — doesn't
    explain what breaks or why the concatenation is unsafe as a MAC)
  - FAIL: "The secret should be longer." (misses the actual
    construction flaw entirely — length of the secret does not fix a
    length-extension-shaped scheme or a broken hash)

### Subjective guidance

- **Cryptographic reasoning and threat fit**: does the write-up
  correctly separate integrity/authenticity from confidentiality and
  match the primitive to the actual threat, rather than reflexively
  reaching for "more crypto is better"?
- **Rationale precision**: are the rejected alternatives (encryption,
  bare hash) addressed with a concrete reason each, not just listed
  and dismissed?
- **Reasoning quality**: does REASONING.md show the runner actually
  tested tamper/wrong-signature cases before finishing, and reason
  about why constant-time comparison matters here specifically (a
  timing side-channel on a verify function that a rider-facing gate
  runs on every tap)?
