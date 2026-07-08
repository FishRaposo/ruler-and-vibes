---
test: security-04-shareconfig-hardening
canary: "speckled bathysphere lullaby"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node -e \"JSON.parse(require('fs').readFileSync('hardened-config.json'))\"` parses without error, AND cors.allowedOrigins is no longer wildcard-with-credentials, AND session.cookie has secure:true and httpOnly:true, AND auth.passwordHashAlgorithm is a modern KDF (bcrypt/scrypt/argon2/pbkdf2, case-insensitive), AND shareLinks token is >=16 chars of a high-entropy charset (or otherwise >=128-bit equivalent) with a finite (non-zero) expiry"
    - id: obj-2
      check: "Both decoys are unchanged in hardened-config.json (auth.passwordMinLength still 12, session.sessionIdleTimeoutMinutes still 15) AND neither is listed in HARDENING.md as a weakness requiring a fix; changing either value, or flagging either as needing remediation, fails this check (noting a value as already adequate in prose does not fail)"
    - id: obj-3
      check: "HARDENING.md identifies at least 5 of the 6 seeded weaknesses, specifically calling out the wildcard-origin-plus-credentials combination as a combination (flagging \"*\" alone without naming the credentials interaction does not satisfy this) and the inline-served .html upload vector"
    - id: obj-4
      check: "The debug endpoint is disabled or removed in hardened-config.json (debugEndpointEnabled:false or the key removed) and its risk (environment/secret disclosure) is stated in HARDENING.md"
    - id: obj-5
      check: "THREATMODEL.md contains a table with >=3 named assets and >=6 distinct threat rows each paired with a concrete mitigation, at least 4 of which are specific to the share-link feature rather than generic platitudes"
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
---

## Judge guidance

If the phrase "speckled bathysphere lullaby" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

The surgical-fix discipline matters as much as finding the weaknesses:
two config values are deliberately already correct, and touching them
(or flagging them in HARDENING.md) is a failure just as real as
missing an actual weakness.

### The six seeded weaknesses (reference)

1. **CORS wildcard + credentials**: `allowedOrigins: ["*"]` combined
   with `allowCredentials: true` lets any origin make credentialed
   requests — browsers normally block credentialed wildcard CORS, but
   a server that reflects the wildcard (or misconfigures this) opens
   cross-site credentialed access. The fix must address the
   *combination*, not just narrow the origin list without discussing
   credentials, or vice versa.
2. **Session cookie flags**: `secure:false, httpOnly:false,
   sameSite:"none"` — the cookie can be sent over plain HTTP, read by
   JavaScript (XSS-exfiltrable), and attached cross-site. Fix: `secure:
   true, httpOnly:true`, and `sameSite` tightened to `"strict"` or
   `"lax"`.
3. **Password hashing**: `md5` is not a password hash (fast, no salt
   mechanism, broken). Fix: bcrypt/scrypt/argon2/pbkdf2.
4. **Share-link tokens**: `tokenLength:6` digits-only with
   `expiryDays:0` (never expires) is brute-forceable (10^6 space) and
   permanent once guessed or leaked. Fix: >=16 chars of a high-entropy
   charset (or equivalent bits) and a finite expiry.
5. **Debug endpoint**: a production endpoint dumping environment
   variables discloses secrets (DB credentials, API keys) to anyone
   who finds the path. Fix: disable/remove it in production.
6. **HTML upload served inline from the app origin**: allowing
   `.html` uploads served inline (`serveInline:true`) from the same
   origin as the app is a stored-XSS vector — an uploaded HTML file
   executes with the app's own origin's privileges when viewed. This
   is the subtle one most mediocre answers miss (they catch the
   obvious CORS/cookie/hash/token/debug issues but not this). Fix:
   remove `.html` from allowed extensions, and/or stop serving
   uploads inline from the app origin (serve as attachment / from an
   isolated origin instead).

### The two decoys (must remain byte-identical, must not be flagged)

- `auth.passwordMinLength: 12` — already a strong minimum; lowering it
  or flagging it as weak is simply wrong.
- `session.sessionIdleTimeoutMinutes: 15` — a sound, defensible value
  with no reasonable "improvement." Noting in prose that it's already
  adequate is fine; changing the value or listing it as a weakness in
  HARDENING.md is not.

### Reference hardened-config.json (diff against submissions)

```json
{
  "appName": "Petrel Docs",
  "environment": "production",
  "server": {
    "port": 8443,
    "debugEndpointEnabled": false,
    "debugEndpointPath": "/internal/debug/env"
  },
  "cors": {
    "allowedOrigins": ["https://app.petrel.example.com"],
    "allowCredentials": true,
    "allowedMethods": ["GET", "POST", "PUT", "DELETE"]
  },
  "session": {
    "cookie": {
      "name": "petrel_sid",
      "secure": true,
      "httpOnly": true,
      "sameSite": "strict"
    },
    "sessionIdleTimeoutMinutes": 15
  },
  "auth": {
    "passwordHashAlgorithm": "argon2id",
    "passwordMinLength": 12,
    "maxLoginAttemptsPerMinute": 10
  },
  "shareLinks": {
    "tokenLength": 22,
    "tokenCharset": "base62",
    "expiryDays": 30,
    "allowPublicUnauthenticated": true
  },
  "uploads": {
    "allowedExtensions": [".pdf", ".docx", ".png", ".jpg"],
    "serveInline": false,
    "servedFromOrigin": "https://usercontent-petrel.example.net",
    "maxSizeMb": 25
  },
  "logging": {
    "level": "info",
    "redactSecrets": true
  }
}
```

Verified during authoring: this parses cleanly with `node -e
"JSON.parse(require('fs').readFileSync('hardened-config.json'))"`; a
diff against the original config shows exactly the 6 intended keys
changed (debugEndpointEnabled, cors.allowedOrigins,
session.cookie.{secure,httpOnly,sameSite}, passwordHashAlgorithm,
shareLinks.{tokenLength,tokenCharset,expiryDays},
uploads.{allowedExtensions,serveInline,servedFromOrigin}), with
`passwordMinLength` and `sessionIdleTimeoutMinutes` untouched. The
22-char base62 token gives log2(62)*22 ≈ 131 bits of entropy, above
the 128-bit bar. Any submission's specific values may differ (a
different modern KDF, a different finite expiry, a different origin
name) — judge by mechanism against the six-weakness list, not by
exact string match against this reference, except for the two decoys
which must match exactly.

### Model threat-model table (>=3 assets, >=6 threat/mitigation rows)

| Asset | Threat | Mitigation |
|---|---|---|
| Shared document content | Share-link token guessed via brute force | High-entropy (>=128-bit) token, rate-limit link-resolution attempts |
| Shared document content | Link leaks via `Referer` header when a viewer clicks an outbound link from the doc | `Referrer-Policy: no-referrer` (or `same-origin`) on share-link pages |
| Shared document content | Link shared indefinitely / forwarded after it should have expired | Finite expiry enforced server-side, plus revocation support |
| User session / app origin | Uploaded `.html` executes as script when viewed inline (stored XSS) | Disallow `.html` uploads and/or serve uploads from an isolated origin, not inline from the app domain |
| User accounts | Credential compromise via weak password hashing at rest | Modern KDF (argon2/bcrypt/scrypt) with per-user salt |
| Session cookies | Cookie theft via XSS or network interception | `httpOnly`, `secure`, restrictive `sameSite` |
| Internal configuration/secrets | Debug endpoint exposes environment variables | Disable debug endpoints in production |
| Cross-origin API surface | Wildcard CORS with credentials allows any origin to make authenticated requests | Explicit origin allowlist when credentials are enabled |

### Per-check guidance

- **obj-1**: run the literal `node -e` command against the submitted
  file. Then check each condition programmatically or by inspection;
  all must hold for this check to pass.
- **obj-2**: diff the submission's hardened-config.json against the
  original — `passwordMinLength` and `sessionIdleTimeoutMinutes` must
  be byte-identical (12 and 15). Then read HARDENING.md — neither may
  appear as a numbered weakness. A parenthetical "already adequate,
  left unchanged" note is fine and does not fail this check.
- **obj-3**: count how many of the 6 weaknesses above are named; 5 or
  6 passes. The CORS sub-check requires the write-up to connect
  wildcard origins WITH credentials, not just say "CORS is too
  permissive." The upload sub-check requires recognizing the
  inline-serving + `.html` combination as an XSS vector, not just
  "uploads should have a size limit" or similarly generic advice.
- **obj-4**: check both the config (endpoint disabled/removed) and the
  prose (risk named as secret/environment disclosure, not just
  "debug endpoints are bad practice").
- **obj-5**: count table rows and named assets directly; judge
  "specific to share-links" by whether the row would make no sense
  without the share-link feature (token guessing, referrer leakage,
  link lifetime — yes; "use HTTPS everywhere" — generic, doesn't
  count toward the 4).

### Example phrasings — CORS weakness (combination, not just wildcard)

PASSING:
- "allowedOrigins is `[\"*\"]` while allowCredentials is `true` — this
  combination allows any origin to make authenticated, credentialed
  requests against the API; the origin list must be an explicit
  allowlist whenever credentials are enabled."
- "Wildcard CORS is only dangerous here because credentials are also
  allowed; the fix is to replace `*` with the app's real origin(s)
  since credentialed requests can't safely use a wildcard."

FAILING:
- "CORS allows `*`, which is too permissive." (never connects it to
  `allowCredentials`, so doesn't satisfy the "combination" requirement)
- "Should restrict CORS to trusted domains." (correct instinct, but
  doesn't identify why the wildcard is dangerous specifically here)

### Example phrasings — HTML upload / inline-serving vector

PASSING:
- "Uploads allow `.html` files and `serveInline:true` serves them from
  the app's own origin — an uploaded HTML file can contain `<script>`
  that then executes with the app's origin's cookies and permissions
  when a user opens the link: stored XSS via file upload."
- "The combination of accepting `.html` and serving uploads inline
  from `docs.petrel.example.com` (the app's own domain) means any
  user's uploaded page runs as if it were first-party app code."

FAILING:
- "Uploads should be scanned for malware." (misses the specific
  mechanism — this isn't about malware scanning, it's about the file
  type + serving origin combination)
- "Limit upload size to prevent abuse." (addresses a different,
  unseeded concern; doesn't engage with the actual XSS vector)

### Subjective guidance

- **Threat model completeness and specificity**: are the threats
  actually about the share-link feature (guessing, leakage, lifetime,
  unauthenticated access) rather than a generic security checklist
  copy-pasted for any web app?
- **Hardened config craftsmanship**: is the diff minimal and
  well-justified — no unrelated keys touched, sensible concrete
  replacement values (not placeholders like `"TODO"` or
  `"CHANGE_ME"`)?
- **Reasoning quality**: does REASONING.md explain why the two decoys
  were left alone, and does it show the reasoning process for
  spotting the inline-HTML vector rather than just listing it?
