---
test: security-03b-badge-reader-replay
canary: "willywaw caravel"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Attack pattern named as a badge/credential replay (or cloning) sweep, or precisely described as one reader presenting many distinct badge IDs with few attempts each; calling it single-badge brute force fails"
    - id: obj-2
      check: "Compromised cardholder identified as badge bd-4602 AND the compromise timestamp exactly matches 2026-05-09T14:44:07Z (line 43, the ACCESS_GRANT from the attacker reader); citing the earlier legitimate grant (line 03, 08:52:19Z) as the compromise timestamp fails"
    - id: obj-3
      check: "Attacker reader identified exactly as RDR-LOBBY-3"
    - id: obj-4
      check: "The svc-hvac burst (lines 05-20) is explicitly classified as benign/not-the-attack, citing at least one of: single badge, internal maintenance reader (RDR-B7), or the fixed 40-second cadence; treating it as part of the attack fails"
    - id: obj-5
      check: "Containment answer includes BOTH revoking or deactivating badge bd-4602 (or forcing its re-enrollment) AND disabling, quarantining, or blocking the attacker reader RDR-LOBBY-3"
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
anchors:
  - id: Evidence-grounded narrative
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Containment plan practicality
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `security-03-authlog-stuffing` (same construct, fresh
surface).

This test has no code artifact — it is pure reading and reasoning over
a fixed log, so every answer should be checkable directly against line
numbers. If the phrase "willywaw caravel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Reference key (verified by generating the log deterministically)

- **Attack pattern**: a badge/credential replay (cloning) sweep — one
  reader, ~21 distinct badge IDs, 1-2 attempts each, rather than many
  attempts against one badge. This is the physical-access analogue of
  credential stuffing, not brute force.
- **Attacker reader**: `RDR-LOBBY-3` (lines 21-45).
- **Distinct badges touched by the attacker reader**: 22 (21 swept
  badge IDs on lines 21-42, plus `bd-4602` on line 43) — confirmed by
  computation during authoring. `bd-9108` is the only swept badge with
  2 attempts (lines 28-29); every other swept badge has exactly 1.
- **Compromised cardholder**: badge `bd-4602`.
- **Compromise timestamp**: exactly `2026-05-09T14:44:07Z`, line 43 —
  the ONLY `ACCESS_GRANT` from the attacker reader in the entire log
  (confirmed by computation: filtering all lines for `ACCESS_GRANT` AND
  `RDR-LOBBY-3` yields exactly one match). This uniqueness is what makes
  the exact-timestamp check binary-decidable. `bd-4602` also has an
  earlier, legitimate `ACCESS_GRANT` at `08:52:19Z` from its normal
  reader `RDR-WEST-2` (line 03) — a submission that cites this earlier
  timestamp as "the compromise" has anchored to the wrong grant and
  fails obj-2.
- **Post-compromise actions**: `PIN_CHANGE` (line 44) and `VAULT_OPEN`
  (line 45), both from the attacker reader, both after line 43 —
  consistent with an attacker locking out the legitimate cardholder and
  reaching restricted space.
- **svc-hvac burst** (lines 05-20): exactly 16 lines, all
  `ACCESS_DENIED`, all for a single service badge `svc-hvac` at a single
  internal maintenance reader `RDR-B7`, at an exact 40-second cadence
  (`11:15:00`, `11:15:40`, `11:16:20`, ...). This is a misconfigured or
  stuck service badge retrying on a fixed timer, not an attack — one
  badge, one internal reader, mechanical timing (a person or a replay
  sweep would not produce a perfectly uniform 40-second interval, and
  the sweep never touches a second badge).
- **Containment**: revoke or deactivate badge `bd-4602` (and force
  re-enrollment / revoke its sessions), AND disable, quarantine, or
  block the attacker reader `RDR-LOBBY-3` (take its controller offline
  or isolate it). Both parts are required — fixing only the badge leaves
  the reader free to grant the next cloned badge; disabling only the
  reader leaves the already-compromised badge usable at other doors.

### Per-check guidance

- **obj-1**: accept "badge replay", "credential replay", "badge
  cloning sweep", or an equivalent precise description (one reader, many
  distinct badges, few attempts each); reject "brute force" alone (brute
  force implies repeated attempts against one identity, which is the
  svc-hvac pattern, not this one).
- **obj-2**: both the badge id AND the exact timestamp
  `2026-05-09T14:44:07Z` (or unambiguous line 43) are required; either
  wrong fails the whole check.
- **obj-3**: exact string match on the reader, `RDR-LOBBY-3`.
- **obj-4**: the justification must cite log evidence, not just assert
  "that's normal." Accept any one of the three distinguishing features
  listed above.
- **obj-5**: both containment actions must be present in some form;
  a plan that only mentions one half (e.g. "disable the reader" with no
  mention of the badge) fails.

### Example phrasings — svc-hvac classification (benign)

PASSING:
- "The svc-hvac burst (lines 05-20) is a misconfigured service badge,
  not an attacker: it's a single badge failing repeatedly at one
  internal maintenance reader (RDR-B7) at an exact 40-second interval —
  a cadence far too regular for a person or a replay sweep, and it never
  touches a second badge."
- "Benign: one badge, one internal reader, mechanical fixed timing.
  This is a stuck service credential on a timer, not a replay sweep
  (which hits many badges) or brute force against one door."
- "Not the attack — svc-hvac retries every 40 seconds like clockwork on
  RDR-B7 alone; that uniformity and single-badge scope mark it as a
  malfunctioning reader/badge, not an intrusion."

FAILING:
- "This is also an attack and RDR-B7 should be blocked along with the
  other reader." (misclassifies the benign burst as the attack)
- "16 denied swipes in a row is clearly malicious." (asserts severity
  from volume alone, ignores the internal reader and single-badge,
  fixed-cadence evidence that distinguishes it)
- "svc-hvac is brute-forcing RDR-B7 and must be stopped." (affirmatively
  labels the decoy an attack)

### Example phrasings — compromise timestamp anchoring

PASSING:
- "bd-4602 was compromised at 2026-05-09T14:44:07Z (line 43) — the only
  ACCESS_GRANT from the attacker reader RDR-LOBBY-3. Note bd-4602 also
  has an earlier, legitimate grant from its usual reader RDR-WEST-2 at
  08:52:19Z (line 03); that one is not the compromise."
- "Line 43 is the moment of compromise: it's the sole granted access
  from the sweeping reader, immediately followed by a PIN change and a
  vault opening from the same reader."
- "The compromise is line 43 (14:44:07Z). The 08:52:19Z grant on line
  03 is bd-4602's normal morning entry at RDR-WEST-2, not the breach."

FAILING:
- "bd-4602 was compromised at 08:52:19Z." (anchors to the legitimate
  early grant instead of the attacker-reader grant)
- "The badge was compromised sometime around 14:40-14:44." (too vague
  to be checked against a specific line; doesn't identify the exact
  granted-access line)
- "It was compromised when it first appears in the log, on line 03."
  (mistakes the first appearance for the compromise)

### Subjective guidance

- **Evidence-grounded narrative**: does the account cite specific line
  numbers/timestamps for every claim rather than paraphrase the log in
  general terms?
- **Containment plan practicality**: is the plan ordered, immediately
  actionable, and does it go beyond the two required actions (e.g.
  auditing what VAULT_OPEN on line 45 reached, checking every badge
  presented at RDR-LOBBY-3) without losing focus on the first step?
- **Reasoning quality**: does REASONING.md show the process of ruling
  out the svc-hvac burst and the early legitimate grant as candidates,
  rather than jumping straight to the answer?
