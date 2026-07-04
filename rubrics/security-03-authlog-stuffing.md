---
test: security-03-authlog-stuffing
canary: "nutmeg trellis quadrille"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Attack pattern named as credential stuffing, or precisely described as one source IP trying many distinct accounts with few attempts each; calling it single-account brute force fails"
    - id: obj-2
      check: "Compromised account identified as mreyes AND the compromise timestamp exactly matches 2026-03-14T13:11:52Z (line 51, the LOGIN_OK from the attacker IP); citing the earlier legitimate login (line 03, 09:10:03Z) as the compromise timestamp fails"
    - id: obj-3
      check: "Attacker source IP identified exactly as 203.0.113.77"
    - id: obj-4
      check: "The svc-backup burst (lines 05-24) is explicitly classified as benign/not-the-attack, citing at least one of: single account, internal/private IP (10.0.4.12), or the fixed 30-second cadence; treating it as part of the attack fails"
    - id: obj-5
      check: "Containment answer includes BOTH revoking mreyes's sessions or forcing a credential reset AND blocking or rate-limiting source IP 203.0.113.77"
  subjective:
    - id: sub-quality
      name: "Evidence-grounded narrative"
      weight: 0.4
    - id: sub-craft
      name: "Containment plan practicality"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

This test has no code artifact — it is pure reading and reasoning over
a fixed log, so every answer should be checkable directly against line
numbers. If the coined phrase "nutmeg trellis quadrille" appears
anywhere in TRIAGE.md or REASONING.md, that is a canary leak — flag it
regardless of how the rest of the checks score.

### Reference key (verified by generating the log deterministically)

- **Attack pattern**: credential stuffing — one IP, ~25 distinct
  usernames, 1-2 attempts each, rather than many attempts against one
  account.
- **Attacker IP**: `203.0.113.77` (lines 25-53).
- **Distinct usernames touched by the attacker IP**: 26 (25 stuffed
  usernames on lines 25-50, plus `mreyes` on line 51) — confirmed by
  computation during authoring. `llopez` is the only stuffed username
  with 2 attempts (lines 36-37); every other stuffed username has
  exactly 1.
- **Compromised account**: `mreyes`.
- **Compromise timestamp**: exactly `2026-03-14T13:11:52Z`, line 51 —
  the ONLY `LOGIN_OK` from the attacker IP in the entire log (confirmed
  by computation: filtering all lines for `LOGIN_OK` AND
  `203.0.113.77` yields exactly one match). This uniqueness is what
  makes the exact-timestamp check binary-decidable. `mreyes` also has
  an earlier, legitimate `LOGIN_OK` at `09:10:03Z` from their normal IP
  `198.51.100.24` (line 03) — a submission that cites this earlier
  timestamp as "the compromise" has anchored to the wrong login and
  fails obj-2.
- **Post-compromise actions**: `PWD_CHANGE` (line 52) and `EXPORT`
  (line 53), both from the attacker IP, both after line 51 — consistent
  with an attacker locking out the legitimate owner and exfiltrating
  data.
- **svc-backup burst** (lines 05-24): exactly 20 lines, all
  `LOGIN_FAIL`, all from a single internal/private IP `10.0.4.12`
  (RFC 1918), at an exact 30-second cadence (`12:00:00`, `12:00:30`,
  `12:01:00`, ...). This is a misconfigured service credential
  retrying on a fixed timer, not an attack — one account, one internal
  source, mechanical timing (a human or a distributed attack would not
  produce a perfectly uniform 30-second interval).
- **Containment**: force a credential reset / revoke sessions for
  `mreyes`, AND block or rate-limit `203.0.113.77` at the edge (WAF,
  firewall, or application-level IP block). Both parts are required —
  fixing only the account leaves the attacker free to stuff the next
  account; blocking only the IP leaves the already-compromised account
  usable from anywhere else.

### Per-check guidance

- **obj-1**: accept "credential stuffing" or an equivalent precise
  description; reject "brute force" alone (brute force implies
  repeated attempts against one account, which is the svc-backup
  pattern, not this one).
- **obj-2**: both the account name AND the exact timestamp
  `2026-03-14T13:11:52Z` (or unambiguous line 51) are required; either
  wrong fails the whole check.
- **obj-3**: exact string match on the IP, `203.0.113.77`.
- **obj-4**: the justification must cite log evidence, not just assert
  "that's normal." Accept any one of the three distinguishing features
  listed above.
- **obj-5**: both containment actions must be present in some form;
  a plan that only mentions one half (e.g. "block the IP" with no
  mention of the account) fails.

### Example phrasings — svc-backup classification (benign)

PASSING:
- "The svc-backup burst (lines 05-24) is a misconfigured service
  credential, not an attacker: it's a single account failing
  repeatedly from an internal RFC 1918 address (10.0.4.12) at an
  exact 30-second interval — a cadence far too regular for a human or
  distributed attack, and an internal IP an external attacker
  wouldn't have."
- "Benign: one account, one internal source, mechanical fixed timing.
  This is a scheduled job with a stale credential, not credential
  stuffing (which hits many accounts) or brute force from outside."

FAILING:
- "This is also a brute-force attack and should be blocked along with
  the other IP." (misclassifies the benign burst as the attack)
- "20 failed logins in a row is clearly malicious." (asserts severity
  from volume alone, ignores the internal IP and single-account,
  fixed-cadence evidence that distinguishes it)

### Example phrasings — compromise timestamp anchoring

PASSING:
- "mreyes's account was compromised at 2026-03-14T13:11:52Z (line 51)
  — the only LOGIN_OK from the attacker IP 203.0.113.77. Note mreyes
  also has an earlier, legitimate login from their usual IP
  198.51.100.24 at 09:10:03Z (line 03); that one is not the
  compromise."
- "Line 51 is the moment of compromise: it's the sole successful login
  from the stuffing IP, immediately followed by a password change and
  export from the same IP."

FAILING:
- "mreyes was compromised at 09:10:03Z." (anchors to the legitimate
  early login instead of the attacker-IP login)
- "The account was compromised sometime around 13:05-13:11." (too
  vague to be checked against a specific line; doesn't identify the
  exact successful-login line)

### Subjective guidance

- **Evidence-grounded narrative**: does the account cite specific
  line numbers/timestamps for every claim rather than paraphrase the
  log in general terms?
- **Containment plan practicality**: is the plan ordered, immediately
  actionable, and does it go beyond the two required actions (e.g.
  auditing what was exported, checking for other accounts touched by
  the same IP) without losing focus on the first step?
- **Reasoning quality**: does REASONING.md show the process of ruling
  out the svc-backup burst and the early legitimate login as
  candidates, rather than jumping straight to the answer?
