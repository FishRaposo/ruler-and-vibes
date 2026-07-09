---
test: security-04c-wardstone-guestpin
canary: "corrie xebec"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node -e \"JSON.parse(require('fs').readFileSync('hardened-config.json'))\"` parses without error, AND broker no longer permits wildcard command publishers together with anonymous access (broker.anonymousAccess is false AND broker.allowedCommandPublishers is not [\"*\"]), AND firmwareUpdate has verifySignature:true and allowHttpDownload:false and pinToVendorCert:true, AND credentials.devicePasswordHash is a modern KDF (bcrypt/scrypt/argon2/pbkdf2, case-insensitive), AND guestPins token has computed entropy (log2(charset size) * length) >=128 bits, with a finite (non-zero) validity window"
    - id: obj-2
      check: "Both decoys are unchanged in hardened-config.json (credentials.installerPinMinLength still 8, credentials.maxUnlockAttemptsPerMinute still 5) AND neither is listed in HARDENING.md as a weakness requiring a fix; changing either value, or flagging either as needing remediation, fails this check (noting a value as already adequate in prose does not fail)"
    - id: obj-3
      check: "HARDENING.md identifies at least 5 of the 6 seeded weaknesses, specifically calling out the wildcard-publisher-plus-anonymous-access combination as a combination (flagging the \"*\" ACL alone without naming the anonymous-access interaction does not satisfy this) and the http/https deep-link scheme hijack vector"
    - id: obj-4
      check: "The diagnostics shell is disabled or removed in hardened-config.json (companionApp.exposeDiagnosticsShell:false or the key removed) and its risk (device-secret / command-execution disclosure on a production lock) is stated in HARDENING.md"
    - id: obj-5
      check: "THREATMODEL.md contains a table with >=3 named assets and >=6 distinct threat rows each paired with a concrete mitigation, at least 4 of which are specific to the guest-PIN feature rather than generic platitudes"
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

Parallel form of `security-04-shareconfig-hardening` (same construct, fresh surface)
for four of the six weakness categories: wildcard-access-plus-credentials
combination, weak password hashing, token/PIN entropy+expiry, and an exposed
debug/diagnostics endpoint. The remaining two categories are a deliberate
domain substitution, not a one-for-one analog: this smart-lock surface swaps
in firmware-signature verification (a supply-chain/code-signing weakness, in
place of 04/04b's session-cookie flag hardening) and companion-app deep-link
scheme hijacking (a mobile trust-boundary weakness, in place of 04/04b's
inline-served-upload XSS). Both substitutes are comparable in difficulty and
"subtle, easy to miss" character to the weaknesses they replace, but they
exercise different security knowledge. Score 04c's HARDENING.md and
THREATMODEL.md against its own six-weakness list below on their own terms;
do not assume per-weakness equivalence with 04/04b's cookie- and
upload-specific checks when comparing forms across this facet.

If the phrase "corrie xebec" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

The surgical-fix discipline matters as much as finding the weaknesses:
two config values are deliberately already correct, and touching them
(or flagging them in HARDENING.md) is a failure just as real as
missing an actual weakness.

### The six seeded weaknesses (reference)

1. **Wildcard command publishers + anonymous broker access**:
   `broker.allowedCommandPublishers: ["*"]` combined with
   `broker.anonymousAccess: true` lets any client — including an
   unauthenticated one — publish to the lock's command topics and open
   every door. It is the *combination* that is fatal: a wildcard
   publisher ACL is survivable if every publisher must authenticate, and
   anonymous access is survivable if publishers are restricted to the
   hub. The fix must address the *combination*, not just narrow the ACL
   without discussing anonymous access, or vice versa. Fix: disable
   anonymous access AND restrict publishers to the trusted hub identity.
2. **Firmware update channel flags**: `verifySignature:false,
   allowHttpDownload:true, pinToVendorCert:false` — the lock will accept
   an unsigned image fetched over plain HTTP with no cert pinning, so a
   network attacker can serve forged firmware and gain remote code
   execution on the device. Fix: `verifySignature:true,
   allowHttpDownload:false, pinToVendorCert:true`.
3. **Password hashing**: `sha1` is not a password hash (fast, unsalted,
   broken). Fix: bcrypt/scrypt/argon2/pbkdf2.
4. **Guest PIN entropy + lifetime**: `pinLength:4` digits-only with
   `validityHours:0` (never expires) is brute-forceable (10^4 space) and
   permanent once guessed, forwarded, or leaked. Fix: >=128 bits of
   entropy (e.g., a 26+-char base32 PIN) and a finite validity window.
5. **Diagnostics shell**: a production lock exposing an interactive
   diagnostics/shell surface (`exposeDiagnosticsShell:true` at
   `/debug/shell`) discloses device secrets (broker credentials, paired
   keys) and likely allows command execution to anyone who reaches the
   path. Fix: disable/remove it in production.
6. **`http`/`https` deep-link schemes registered by the companion app**:
   `deepLinkSchemes` includes the generic web schemes alongside the
   custom `wardstone` scheme. Registering `http`/`https` lets an
   arbitrary web page the user merely visits hand the app a crafted link
   the app treats as a first-party deep link, driving privileged actions
   (trigger an unlock, mint a guest PIN) without a prompt. This is the
   subtle one most mediocre answers miss (they catch the obvious
   broker/firmware/hash/PIN/diagnostics issues but not this). Fix: drop
   `http`/`https` and keep only the custom `wardstone` scheme, or move
   web entry points to verified App Links / Universal Links with
   domain-association checks.

### The two decoys (must remain byte-identical, must not be flagged)

- `credentials.installerPinMinLength: 8` — a reasonable minimum for an
  installer PIN; lowering it or flagging it as weak is simply wrong.
- `credentials.maxUnlockAttemptsPerMinute: 5` — a sound anti-brute-force
  rate limit with no reasonable "improvement." Noting in prose that it's
  already adequate is fine; changing the value or listing it as a
  weakness in HARDENING.md is not.

Note also `guestPins.allowRemoteUnauthenticatedRedeem: true` is
intrinsic to the feature (guests hold no account) and should be left
`true`; it is made safe by the entropy/expiry fixes, not by disabling
it. Flipping it to `false` guts the feature and is not the intended fix,
but it is not one of the two scored decoys.

### Reference hardened-config.json (diff against submissions)

```json
{
  "appName": "Wardstone Access",
  "environment": "production",
  "broker": {
    "host": "mqtt.wardstone.example.net",
    "anonymousAccess": false,
    "allowedCommandPublishers": ["service://wardstone-hub"]
  },
  "firmwareUpdate": {
    "channel": "stable",
    "verifySignature": true,
    "allowHttpDownload": false,
    "pinToVendorCert": true
  },
  "credentials": {
    "devicePasswordHash": "argon2id",
    "installerPinMinLength": 8,
    "maxUnlockAttemptsPerMinute": 5
  },
  "guestPins": {
    "pinLength": 26,
    "pinCharset": "base32",
    "validityHours": 24,
    "allowRemoteUnauthenticatedRedeem": true
  },
  "companionApp": {
    "deepLinkSchemes": ["wardstone"],
    "logUnlockEvents": true,
    "exposeDiagnosticsShell": false,
    "diagnosticsShellPath": "/debug/shell"
  },
  "telemetry": {
    "samplingRate": 0.25,
    "redactPii": true
  }
}
```

Verified during authoring: this parses cleanly with `node -e
"JSON.parse(require('fs').readFileSync('hardened-config.json'))"`; a
diff against the original config shows exactly the 6 intended weakness
areas changed (broker.{anonymousAccess,allowedCommandPublishers},
firmwareUpdate.{verifySignature,allowHttpDownload,pinToVendorCert},
credentials.devicePasswordHash, guestPins.{pinLength,pinCharset,
validityHours}, companionApp.{deepLinkSchemes,exposeDiagnosticsShell}),
with `installerPinMinLength` and `maxUnlockAttemptsPerMinute` untouched.
The 26-char base32 PIN gives log2(32)*26 = 130 bits of entropy, above
the 128-bit bar. Any submission's specific values may differ (a
different modern KDF, a different finite validity window, a different
publisher identity, a different high-entropy charset/length) — judge by
mechanism against the six-weakness list, not by exact string match
against this reference, except for the two decoys which must match
exactly.

### Model threat-model table (>=3 assets, >=6 threat/mitigation rows)

| Asset | Threat | Mitigation |
|---|---|---|
| Physical door / premises access | Guest PIN guessed by brute force against the redeem endpoint | High-entropy PIN (>=128-bit), rate-limit and lock out repeated redeem attempts |
| Physical door / premises access | Issued PIN keeps working long after the visit (never expires) | Finite validity window enforced server-side, plus host revocation |
| Physical door / premises access | PIN forwarded or screenshotted and redeemed by an unintended party | Bind PIN to one door + narrow window, cap redemption count, notify host on redeem |
| Lock firmware / device integrity | Attacker serves a forged firmware image to the lock | Require signed firmware, HTTPS-only download, and vendor-cert pinning |
| Broker command channel (unlock topic) | Unauthenticated client publishes an unlock command | Disable anonymous access, restrict publishers to the hub identity (no wildcard ACL) |
| Companion-app session | Malicious web page drives an unlock via a hijacked `http`/`https` deep link | Register only the custom scheme or use verified App Links; confirm sensitive actions in-app |
| Redemption telemetry / guest PII | Redeem events log identifying data revealing who visited when | Keep PII redaction on for redeem telemetry, minimize retention |

### Per-check guidance

- **obj-1**: run the literal `node -e` command against the submitted
  file. Then check each condition programmatically or by inspection;
  all must hold for this check to pass. The guest-PIN clause passes only
  when computed entropy (log2(charset size) * length) is >=128 bits,
  and requires a non-zero validity window.
- **obj-2**: diff the submission's hardened-config.json against the
  original — `installerPinMinLength` and `maxUnlockAttemptsPerMinute`
  must be byte-identical (8 and 5). Then read HARDENING.md — neither may
  appear as a numbered weakness. A parenthetical "already adequate, left
  unchanged" note is fine and does not fail this check.
- **obj-3**: count how many of the 6 weaknesses above are named; 5 or 6
  passes. The broker sub-check requires the write-up to connect the
  wildcard publisher ACL WITH anonymous access, not just "the broker ACL
  is too broad." The deep-link sub-check requires recognizing that
  registering the `http`/`https` schemes lets an untrusted web page
  invoke privileged app actions, not just "review deep links" or
  "validate input."
- **obj-4**: check both the config (shell disabled/removed) and the
  prose (risk named as device-secret / command-execution disclosure on a
  production lock, not just "debug features are bad practice").
- **obj-5**: count table rows and named assets directly; judge "specific
  to guest-PINs" by whether the row would make no sense without the
  guest-PIN feature (PIN guessing, PIN forwarding/reuse, PIN lifetime,
  unauthenticated redeem — yes; "use HTTPS everywhere" — generic,
  doesn't count toward the 4).

### Example phrasings — broker weakness (combination, not just wildcard)

PASSING:
- "`allowedCommandPublishers` is `[\"*\"]` while `anonymousAccess` is
  `true` — this combination lets any unauthenticated client publish
  unlock commands to the broker; the publisher ACL must be an explicit
  allowlist AND anonymous access must be disabled."
- "The wildcard publisher ACL is only catastrophic because anonymous
  access is also on; fix both — require broker auth and restrict
  publishers to the hub identity, since a wildcard ACL can't be trusted
  once anyone can connect."

FAILING:
- "The broker ACL allows `*`, which is too permissive." (never connects
  it to `anonymousAccess`, so doesn't satisfy the "combination"
  requirement)
- "Should restrict which clients can publish to the broker." (correct
  instinct, but doesn't identify why the wildcard is dangerous
  specifically here)

### Example phrasings — deep-link scheme hijack vector

PASSING:
- "`deepLinkSchemes` includes `http` and `https`, so any web page the
  user opens can hand the companion app a link it treats as a
  first-party deep link and trigger a privileged action like an unlock —
  drop the web schemes and keep only `wardstone`, or use verified App
  Links with domain association."
- "Registering the generic `http`/`https` schemes means a malicious site
  can deep-link straight into the app's authenticated action handlers
  (mint a PIN, unlock) without the user's intent; only the custom scheme
  (or a domain-verified universal link) should be registered."

FAILING:
- "Deep links should be validated before use." (generic; misses the
  specific mechanism — the danger is registering the web schemes at all,
  letting arbitrary pages reach the app)
- "The app should sanitize URL input." (addresses a different concern;
  doesn't engage with the scheme-registration hijack)

### Subjective guidance

- **Threat model completeness and specificity**: are the threats
  actually about the guest-PIN feature (guessing, forwarding/reuse,
  lifetime, unauthenticated redeem, the newly exposed unlock command
  path) rather than a generic security checklist copy-pasted for any web
  app?
- **Hardened config craftsmanship**: is the diff minimal and
  well-justified — no unrelated keys touched, sensible concrete
  replacement values (not placeholders like `"TODO"` or `"CHANGE_ME"`)?
- **Reasoning quality**: does REASONING.md explain why the two decoys
  were left alone, and does it show the reasoning process for spotting
  the `http`/`https` deep-link hijack rather than just listing it?
