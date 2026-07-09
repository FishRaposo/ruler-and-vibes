---
test: security-04b-cygnet-guestpass-hardening
canary: "chinook felucca"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node -e \"JSON.parse(require('fs').readFileSync('hardened-settings.json'))\"` parses without error, AND crossOrigin.allowedOrigins is no longer wildcard-with-credentials, AND session.cookie has secure:true and httpOnly:true, AND auth.passphraseHashAlgorithm is a modern KDF (bcrypt/scrypt/argon2/pbkdf2, case-insensitive), AND the guest-pass code has computed entropy (log2(charset size) * length) >=128 bits, with a finite (non-zero) validity window"
    - id: obj-2
      check: "Both decoys are unchanged in hardened-settings.json (auth.passphraseMinLength still 14, session.idleTimeoutMinutes still 20) AND neither is listed in HARDENING.md as a weakness requiring a fix; changing either value, or flagging either as needing remediation, fails this check (noting a value as already adequate in prose does not fail)"
    - id: obj-3
      check: "HARDENING.md identifies at least 5 of the 6 seeded weaknesses, specifically calling out the wildcard-origin-plus-credentials combination as a combination (flagging \"*\" alone without naming the credentials interaction does not satisfy this) and the inline-rendered .svg upload vector"
    - id: obj-4
      check: "The diagnostics endpoint is disabled or removed in hardened-settings.json (diagnosticsEndpointEnabled:false or the key removed) and its risk (environment/secret disclosure) is stated in HARDENING.md"
    - id: obj-5
      check: "THREATMODEL.md contains a table with >=3 named assets and >=6 distinct threat rows each paired with a concrete mitigation, at least 4 of which are specific to the guest-pass feature rather than generic platitudes"
  subjective:
    - id: sub-quality
      name: "Threat model completeness and specificity"
      weight: 0.4
    - id: sub-craft
      name: "Hardened config craftsmanship"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Threat model completeness and specificity
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Hardened config craftsmanship
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `security-04-shareconfig-hardening` (same construct,
fresh surface).

If the phrase "chinook felucca" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

The surgical-fix discipline matters as much as finding the weaknesses:
two config values are deliberately already correct, and touching them
(or flagging them in HARDENING.md) is a failure just as real as
missing an actual weakness.

### The six seeded weaknesses (reference)

1. **Cross-origin wildcard + credentials**: `allowedOrigins: ["*"]`
   combined with `allowCredentials: true` lets any origin make
   credentialed requests — browsers normally block credentialed
   wildcard CORS, but a server that reflects the wildcard (or
   misconfigures this) opens cross-site credentialed access. The fix
   must address the *combination*, not just narrow the origin list
   without discussing credentials, or vice versa.
2. **Session cookie flags**: `secure:false, httpOnly:false,
   sameSite:"none"` — the cookie can be sent over plain HTTP, read by
   JavaScript (XSS-exfiltrable), and attached cross-site. Fix: `secure:
   true, httpOnly:true`, and `sameSite` tightened to `"strict"` or
   `"lax"`.
3. **Passphrase hashing**: `sha1` is not a password hash (fast,
   unsalted, collision-broken). Fix: bcrypt/scrypt/argon2/pbkdf2.
4. **Guest-pass codes**: `codeLength:5` digits-only with
   `validityHours:0` (never expires) is brute-forceable (10^5 space)
   and permanent once guessed or leaked. Fix: >=128 bits of entropy
   (e.g., a 24+-char base62 token) and a finite validity window.
5. **Diagnostics endpoint**: a production endpoint dumping environment
   variables discloses secrets (DB credentials, API keys) to anyone
   who finds the path. Fix: disable/remove it in production.
6. **SVG upload rendered inline from the app origin**: allowing
   `.svg` uploads rendered inline (`renderInline:true`) from the same
   origin as the app is a stored-XSS vector — an SVG is an XML
   document that can carry `<script>`, so an uploaded SVG executes
   with the app origin's privileges when a resident opens it. This is
   the subtle one most mediocre answers miss (they catch the obvious
   cross-origin/cookie/hash/code/diagnostics issues but not this).
   Fix: remove `.svg` from allowed extensions, and/or stop rendering
   uploads inline from the app origin (serve as attachment / from an
   isolated origin instead).

### The two decoys (must remain byte-identical, must not be flagged)

- `auth.passphraseMinLength: 14` — already a strong minimum; lowering
  it or flagging it as weak is simply wrong.
- `session.idleTimeoutMinutes: 20` — a sound, defensible value with no
  reasonable "improvement." Noting in prose that it's already adequate
  is fine; changing the value or listing it as a weakness in
  HARDENING.md is not.

### Reference hardened-settings.json (diff against submissions)

```json
{
  "appName": "Cygnet Hub",
  "environment": "production",
  "server": {
    "listenPort": 9600,
    "diagnosticsEndpointEnabled": false,
    "diagnosticsEndpointPath": "/ops/diagnostics/env"
  },
  "crossOrigin": {
    "allowedOrigins": ["https://app.cygnet.example.io"],
    "allowCredentials": true,
    "allowedMethods": ["GET", "POST", "PATCH", "DELETE"]
  },
  "session": {
    "cookie": {
      "name": "cygnet_session",
      "secure": true,
      "httpOnly": true,
      "sameSite": "strict"
    },
    "idleTimeoutMinutes": 20
  },
  "auth": {
    "passphraseHashAlgorithm": "argon2id",
    "passphraseMinLength": 14,
    "maxUnlockAttemptsPerMinute": 8
  },
  "guestPasses": {
    "codeLength": 24,
    "codeCharset": "base62",
    "validityHours": 48,
    "allowAnonymousEntry": true
  },
  "attachments": {
    "allowedExtensions": [".pdf", ".png", ".jpg", ".mp4"],
    "renderInline": false,
    "servedFromOrigin": "https://usercontent-cygnet.example.net",
    "maxSizeMb": 40
  },
  "telemetry": {
    "level": "info",
    "maskCredentials": true
  }
}
```

Verified during authoring: this parses cleanly with `node -e
"JSON.parse(require('fs').readFileSync('hardened-settings.json'))"`; a
diff against the original settings shows exactly the 6 intended weak
areas changed (diagnosticsEndpointEnabled, crossOrigin.allowedOrigins,
session.cookie.{secure,httpOnly,sameSite},
passphraseHashAlgorithm, guestPasses.{codeLength,codeCharset,validityHours},
attachments.{allowedExtensions,renderInline,servedFromOrigin}), with
`passphraseMinLength` and `idleTimeoutMinutes` untouched. The 24-char
base62 code gives log2(62)*24 ≈ 143 bits of entropy, above the 128-bit
bar. Any submission's specific values may differ (a different modern
KDF, a different finite validity, a different origin name) — judge by
mechanism against the six-weakness list, not by exact string match
against this reference, except for the two decoys which must match
exactly.

### Model threat-model table (>=3 assets, >=6 threat/mitigation rows)

| Asset | Threat | Mitigation |
|---|---|---|
| Building access / lobby door | Guest-pass code guessed via brute force | High-entropy (>=128-bit) code, rate-limit code-redemption attempts |
| Guest-pass link/QR | Pass leaks via `Referer` header when a holder clicks an outbound link from the pass page | `Referrer-Policy: no-referrer` (or `same-origin`) on guest-pass pages |
| Building access / lobby door | Pass shared indefinitely / forwarded after it should have expired | Finite validity enforced server-side, plus revocation support |
| Resident session / app origin | Uploaded `.svg` executes as script when rendered inline (stored XSS) | Disallow `.svg` uploads and/or serve uploads from an isolated origin, not inline from the app domain |
| Tenant accounts | Credential compromise via weak passphrase hashing at rest | Modern KDF (argon2/bcrypt/scrypt) with per-user salt |
| Session cookies | Cookie theft via XSS or network interception | `httpOnly`, `secure`, restrictive `sameSite` |
| Internal configuration/secrets | Diagnostics endpoint exposes environment variables | Disable diagnostics endpoints in production |
| Cross-origin API surface | Wildcard cross-origin with credentials allows any origin to make authenticated requests | Explicit origin allowlist when credentials are enabled |

### Per-check guidance

- **obj-1**: run the literal `node -e` command against the submitted
  file. Then check each condition programmatically or by inspection;
  all must hold for this check to pass.
- **obj-2**: diff the submission's hardened-settings.json against the
  original — `passphraseMinLength` and `idleTimeoutMinutes` must be
  byte-identical (14 and 20). Then read HARDENING.md — neither may
  appear as a numbered weakness. A parenthetical "already adequate,
  left unchanged" note is fine and does not fail this check.
- **obj-3**: count how many of the 6 weaknesses above are named; 5 or
  6 passes. The cross-origin sub-check requires the write-up to
  connect wildcard origins WITH credentials, not just say "CORS is too
  permissive." The upload sub-check requires recognizing the
  inline-rendering + `.svg` combination as an XSS vector, not just
  "uploads should have a size limit" or similarly generic advice.
- **obj-4**: check both the config (endpoint disabled/removed) and the
  prose (risk named as secret/environment disclosure, not just
  "diagnostics endpoints are bad practice").
- **obj-5**: count table rows and named assets directly; judge
  "specific to guest-passes" by whether the row would make no sense
  without the guest-pass feature (code guessing, referrer leakage,
  pass lifetime — yes; "use HTTPS everywhere" — generic, doesn't count
  toward the 4).

### Example phrasings — cross-origin weakness (combination, not just wildcard)

PASSING:
- "allowedOrigins is `[\"*\"]` while allowCredentials is `true` — this
  combination allows any origin to make authenticated, credentialed
  requests against the API; the origin list must be an explicit
  allowlist whenever credentials are enabled."
- "Wildcard cross-origin is only dangerous here because credentials
  are also allowed; the fix is to replace `*` with the app's real
  origin(s) since credentialed requests can't safely use a wildcard."
- "Reflecting `*` back with `allowCredentials:true` is the actual bug —
  narrow the allowlist to the known front-end origin now that
  credentials ride along."

FAILING:
- "Cross-origin allows `*`, which is too permissive." (never connects
  it to `allowCredentials`, so doesn't satisfy the "combination"
  requirement)
- "Should restrict cross-origin access to trusted domains." (correct
  instinct, but doesn't identify why the wildcard is dangerous
  specifically here)
- "Remove the DELETE method from allowedMethods to reduce attack
  surface." (addresses an unseeded, different concern; ignores the
  wildcard+credentials interaction entirely)

### Example phrasings — SVG upload / inline-rendering vector

PASSING:
- "Uploads allow `.svg` files and `renderInline:true` renders them
  from the app's own origin — an SVG is XML and can embed `<script>`
  that then executes with the app origin's cookies and permissions
  when a resident opens it: stored XSS via file upload."
- "The combination of accepting `.svg` and rendering uploads inline
  from `hub.cygnet.example.io` (the app's own domain) means any user's
  uploaded image runs as if it were first-party app code."
- "`.svg` is an active content type, not a passive image; served
  inline from the app origin it becomes a persistent XSS payload —
  drop `.svg` or serve attachments from a separate origin as
  downloads."

FAILING:
- "Uploads should be scanned for malware." (misses the specific
  mechanism — this isn't about malware scanning, it's about the file
  type + serving origin combination)
- "Limit upload size to prevent abuse." (addresses a different,
  unseeded concern; doesn't engage with the actual XSS vector)
- "Block `.mp4` uploads since video can be large and costly to serve."
  (wrong file type, wrong risk; the seeded vector is the inline-served
  `.svg`)

### Subjective guidance

- **Threat model completeness and specificity**: are the threats
  actually about the guest-pass feature (guessing, leakage, lifetime,
  anonymous entry) rather than a generic security checklist
  copy-pasted for any web app?
- **Hardened config craftsmanship**: is the diff minimal and
  well-justified — no unrelated keys touched, sensible concrete
  replacement values (not placeholders like `"TODO"` or
  `"CHANGE_ME"`)?
- **Reasoning quality**: does REASONING.md explain why the two decoys
  were left alone, and does it show the reasoning process for spotting
  the inline-SVG vector rather than just listing it?
