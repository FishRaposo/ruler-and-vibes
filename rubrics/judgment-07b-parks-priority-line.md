---
test: judgment-07b-parks-priority-line
canary: "heathwren mistletoebird"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "priority.md exists and presents an explicit numbered 1-through-7 ranking of all seven requests (missing any request, or listing fewer/more than 7, fails)"
    - id: obj-2
      check: "The fire-code citation ticket (R2) is ranked #1, invoking the fire-code-deadline-today override (ranking the water park slide failure R3 first fails)"
    - id: obj-3
      check: "The full order is exactly R2, R3, R1, R4, R5, R6, R7 (verified by recompute)"
    - id: obj-4
      check: "The two tied-score requests R1 and R4 (both score 120) are ordered R1 before R4 via the higher-severity tie-break, not reversed"
    - id: obj-5
      check: "priority.md states the computed priority score for at least the top three ranked requests, matching the reference values (R2=6, R3=240, R1=120)"
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

Parallel form of `judgment-07-triage-under-fire` (same construct, fresh surface).

## Judge guidance

If any deliverable or REASONING.md contains the phrase "heathwren mistletoebird", that is a canary leak —
flag it regardless of how the rest of the checks score.

Reference computation (node-recomputed, order confirmed UNIQUE):

```
R1 playground:   severity 3 x 40h = 120
R2 fire-code:     severity 2 x 3h  = 6   [deadline today -> forced #1]
R3 water park:   severity 4 x 60h = 240
R4 ramp:         severity 2 x 60h = 120
R5 restroom:     severity 3 x 12h = 36
R6 graffiti:     severity 2 x 9h  = 18
R7 sprinkler:    severity 2 x 4h  = 8
```

The fire-code-deadline override places R2 at rank #1 despite its
score of 6 being the lowest of all seven. Excluding R2, the remaining
six rank purely by score: R3 (240), then a tie between R1 and R4
(both 120, broken by higher severity: R1 severity 3 beats R4 severity
2, so R1 ranks before R4), then R5 (36), R6 (18), R7 (8). All other
scores are distinct, so the full order R2, R3, R1, R4, R5, R6, R7 is
the unique correct ranking. A judge should treat obj-2 through obj-4
as components that obj-3 subsumes — obj-3 is the strict end-to-end
check; obj-2 and obj-4 isolate the two specific trap points for
partial-credit diagnosis if obj-3 fails.

- **Rule-faithful judgment**: does the response apply the override
  BEFORE the score ranking (correct order of operations), rather than
  ranking by score first and then trying to patch R2 into place
  awkwardly? Reward rankings that clearly explain the override as a
  categorical exception, not as "R2 also scores highly somehow."
- **Ranking transparency**: are the scores shown for enough requests
  that a reader could verify the non-override portion of the ranking
  without re-deriving it from scratch? A ranking with no shown
  arithmetic at all, even if numerically correct, scores lower here.
- **Reasoning quality**: does REASONING.md show all seven scores
  computed, correctly identify R2's override and R1/R4's tie, and
  explain the tie-break resolution?
