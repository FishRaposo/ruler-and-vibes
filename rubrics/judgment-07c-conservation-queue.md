---
test: judgment-07c-conservation-queue
canary: "spiderhunter honeyeater"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "conservation-queue.md exists and presents an explicit numbered 1-through-7 ranking of all seven artifacts (missing any artifact, or listing fewer/more than 7, fails)"
    - id: obj-2
      check: "The illuminated manuscript (A2) is ranked #1, invoking the loan-transfer-today override (ranking the marble sculpture A3 first fails)"
    - id: obj-3
      check: "The full order is exactly A2, A3, A1, A4, A6, A5, A7 (verified by recompute)"
    - id: obj-4
      check: "The two tied-score artifacts A1 and A4 (both score 90) are ordered A1 before A4 via the higher-fragility tie-break, not reversed"
    - id: obj-5
      check: "conservation-queue.md states the computed priority score for at least the top three ranked artifacts, matching the reference values (A2=4, A3=240, A1=90)"
  subjective:
    - id: sub-quality
      name: "Rule-faithful judgment"
      weight: 0.4
    - id: sub-craft
      name: "Ranking transparency"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `judgment-07-triage-under-fire` (same construct, fresh
surface).

If any deliverable or REASONING.md contains the phrase "spiderhunter honeyeater", that is a canary leak —
flag it regardless of how the rest of the checks score.

Reference computation (node-recomputed, order confirmed UNIQUE):

```
A1 painting:    fragility 3 x 30k = 90
A2 manuscript:  fragility 2 x 2k  = 4   [loan transfer today -> forced #1]
A3 sculpture:   fragility 4 x 60k = 240
A4 tapestry:    fragility 2 x 45k = 90
A5 vase:        fragility 3 x 12k = 36
A6 album:       fragility 4 x 18k = 72
A7 coins:       fragility 2 x 6k  = 12
```

The loan-transfer override places A2 at rank #1 despite its score of 4
being the lowest of all seven. Excluding A2, the remaining six rank
purely by score: A3 (240), then a tie between A1 and A4 (both 90,
broken by higher fragility: A1 fragility 3 beats A4 fragility 2, so A1
ranks before A4), then A6 (72), A5 (36), A7 (12). All other scores are
distinct, so the full order A2, A3, A1, A4, A6, A5, A7 is the unique
correct ranking. A judge should treat obj-2 through obj-4 as components
that obj-3 subsumes — obj-3 is the strict end-to-end check; obj-2 and
obj-4 isolate the two specific trap points for partial-credit diagnosis
if obj-3 fails.

- **Rule-faithful judgment**: does the response apply the override
  BEFORE the score ranking (correct order of operations), rather than
  ranking by score first and then trying to patch A2 into place
  awkwardly? Reward rankings that clearly explain the override as a
  categorical exception, not as "A2 also scores highly somehow."
- **Ranking transparency**: are the scores shown for enough artifacts
  that a reader could verify the non-override portion of the ranking
  without re-deriving it from scratch? A ranking with no shown
  arithmetic at all, even if numerically correct, scores lower here.
- **Reasoning quality**: does REASONING.md show all seven scores
  computed, correctly identify A2's override and A1/A4's tie, and
  explain the tie-break resolution?
