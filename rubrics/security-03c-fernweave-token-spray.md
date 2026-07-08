---
test: security-03c-fernweave-token-spray
canary: "brickfielder dhow"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Attack pattern named as credential stuffing (accept 'password/token spraying' as an equivalent one-IP-many-accounts description), or precisely described as one source IP trying many distinct accounts with few attempts each; calling it single-account brute force fails"
    - id: obj-2
      check: "Compromised account identified as rkhan AND the compromise timestamp exactly matches 2026-05-09T14:26:38Z (line 48, the TOKEN_GRANT from the attacker IP); citing the earlier legitimate login (line 03, 09:33:58Z) as the compromise timestamp fails"
    - id: obj-3
      check: "Attacker source IP identified exactly as 192.0.2.140"
    - id: obj-4
      check: "The svc-thumbnailer burst (lines 05-22) is explicitly classified as benign/not-the-attack, citing at least one of: single account, internal/private IP (172.16.8.5), or the fixed 45-second cadence; treating it as part of the attack fails"
    - id: obj-5
      check: "Containment answer includes BOTH revoking rkhan's tokens/sessions or forcing a credential reset AND blocking or rate-limiting source IP 192.0.2.140"
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

Parallel form of `security-03-authlog-stuffing` (same construct, fresh
surface).

If the phrase "brickfielder dhow" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

This test has no code artifact — it is pure reading and reasoning over
a fixed log, so every answer should be checkable directly against line
numbers.

### Reference key (verified by generating the log deterministically)

- **Attack pattern**: credential stuffing — one IP, ~24 distinct
  usernames, 1-2 attempts each, rather than many attempts against one
  account. ("Password spraying" / "token spraying" describe the same
  one-IP-many-accounts shape and are acceptable.)
- **Attacker IP**: `192.0.2.140` (lines 23-50).
- **Distinct usernames touched by the attacker IP**: 24 (23 stuffed
  usernames on lines 23-47, plus `rkhan` on line 48) — confirmed by
  computation during authoring. `lmarsh` is the only stuffed username
  with 2 attempts (lines 33-34); every other stuffed username has
  exactly 1.
- **Compromised account**: `rkhan`.
- **Compromise timestamp**: exactly `2026-05-09T14:26:38Z`, line 48 —
  the ONLY `TOKEN_GRANT` from the attacker IP in the entire log
  (confirmed by computation: filtering all lines for `TOKEN_GRANT` AND
  `192.0.2.140` yields exactly one match). This uniqueness is what
  makes the exact-timestamp check binary-decidable. `rkhan` also has an
  earlier, legitimate `TOKEN_GRANT` at `09:33:58Z` from their normal IP
  `198.51.100.27` (line 03) — a submission that cites this earlier
  timestamp as "the compromise" has anchored to the wrong login and
  fails obj-2.
- **Post-compromise actions**: `RECOVERY_SET` (line 49) and `ALBUM_PULL`
  (line 50), both from the attacker IP, both after line 48 — consistent
  with an attacker seizing the recovery email and exfiltrating the
  account's albums.
- **svc-thumbnailer burst** (lines 05-22): exactly 18 lines, all
  `TOKEN_DENY`, all from a single internal/private IP `172.16.8.5`
  (RFC 1918), at an exact 45-second cadence (`11:30:00`, `11:30:45`,
  `11:31:30`, ...). This is a misconfigured service credential
  retrying on a fixed timer, not an attack — one account, one internal
  source, mechanical timing (a human or a distributed attack would not
  produce a perfectly uniform 45-second interval).
- **Containment**: force a credential reset / revoke tokens for
  `rkhan`, AND block or rate-limit `192.0.2.140` at the edge (WAF,
  firewall, or application-level IP block). Both parts are required —
  fixing only the account leaves the attacker free to stuff the next
  account; blocking only the IP leaves the already-compromised account
  usable from anywhere else.

### Per-check guidance

- **obj-1**: accept "credential stuffing" or an equivalent precise
  description (including "password/token spraying" — one IP, many
  distinct accounts, few attempts each); reject "brute force" alone
  (brute force implies repeated attempts against one account, which is
  the svc-thumbnailer pattern, not this one).
- **obj-2**: both the account name AND the exact timestamp
  `2026-05-09T14:26:38Z` (or unambiguous line 48) are required; either
  wrong fails the whole check.
- **obj-3**: exact string match on the IP, `192.0.2.140`.
- **obj-4**: the justification must cite log evidence, not just assert
  "that's normal." Accept any one of the three distinguishing features
  listed above.
- **obj-5**: both containment actions must be present in some form;
  a plan that only mentions one half (e.g. "block the IP" with no
  mention of the account) fails.

### Example phrasings — svc-thumbnailer classification (benign)

PASSING:
- "The svc-thumbnailer burst (lines 05-22) is a misconfigured service
  credential, not an attacker: it's a single account failing
  repeatedly from an internal RFC 1918 address (172.16.8.5) at an
  exact 45-second interval — a cadence far too regular for a human or
  distributed attack, and an internal IP an external attacker
  wouldn't have."
- "Benign: one account, one internal source, mechanical fixed timing.
  This is a scheduled job with a stale credential, not credential
  stuffing (which hits many accounts) or brute force from outside."
- "Lines 05-22 are just svc-thumbnailer hammering 172.16.8.5 every 45
  seconds on the dot — a stuck internal cron, not the incident."

FAILING:
- "This is also a brute-force attack and should be blocked along with
  the other IP." (misclassifies the benign burst as the attack)
- "18 failed token requests in a row is clearly malicious." (asserts
  severity from volume alone, ignores the internal IP and
  single-account, fixed-cadence evidence that distinguishes it)
- "Both bursts are the same credential-stuffing campaign from two
  IPs." (conflates the two bursts the task warned not to conflate)

### Example phrasings — compromise timestamp anchoring

PASSING:
- "rkhan's account was compromised at 2026-05-09T14:26:38Z (line 48)
  — the only TOKEN_GRANT from the attacker IP 192.0.2.140. Note rkhan
  also has an earlier, legitimate login from their usual IP
  198.51.100.27 at 09:33:58Z (line 03); that one is not the
  compromise."
- "Line 48 is the moment of compromise: it's the sole successful token
  issuance from the stuffing IP, immediately followed by a recovery
  email change and an album export from the same IP."
- "Compromise = 14:26:38Z (line 48), the single TOKEN_GRANT on
  192.0.2.140; the 09:33:58Z grant (line 03) is rkhan's own legitimate
  session and must not be mistaken for it."

FAILING:
- "rkhan was compromised at 09:33:58Z." (anchors to the legitimate
  early login instead of the attacker-IP login)
- "The account was compromised sometime around 14:20-14:26." (too
  vague to be checked against a specific line; doesn't identify the
  exact successful-login line)
- "The compromise is the first denied attempt on rkhan at 14:22:33Z
  (line 40)." (anchors to a failed attempt, not the successful grant)

### Subjective guidance

- **Evidence-grounded narrative**: does the account cite specific
  line numbers/timestamps for every claim rather than paraphrase the
  log in general terms?
- **Containment plan practicality**: is the plan ordered, immediately
  actionable, and does it go beyond the two required actions (e.g.
  reverting the recovery email set on line 49, auditing what the
  `ALBUM_PULL` exported, checking for other accounts touched by the
  same IP) without losing focus on the first step?
- **Reasoning quality**: does REASONING.md show the process of ruling
  out the svc-thumbnailer burst and the early legitimate login as
  candidates, rather than jumping straight to the answer?
