---
test: judgment-07-triage-under-fire
canary: "brackenfen windchime"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "triage.md exists and presents an explicit numbered 1-through-7 ranking of all seven tickets (missing any ticket, or listing fewer/more than 7, fails)"
    - id: obj-2
      check: "The GDPR erasure ticket (T2) is ranked #1, invoking the legal-deadline-today override (ranking the login outage T3 first fails)"
    - id: obj-3
      check: "The full order is exactly T2, T3, T1, T4, T6, T5, T7 (verified by recompute)"
    - id: obj-4
      check: "The two tied-score tickets T1 and T4 (both score 80) are ordered T1 before T4 via the higher-impact tie-break, not reversed"
    - id: obj-5
      check: "triage.md states the computed priority score for at least the top three ranked tickets, matching the reference values (T2=3, T3=250, T1=80)"
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
anchors:
  - id: Rule-faithful judgment
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Ranking transparency
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "brackenfen windchime" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Reference computation (node-recomputed, order confirmed UNIQUE):

```
T1 billing:   impact 4 x 20k = 80
T2 gdpr:      impact 3 x 1k  = 3   [legal deadline today -> forced #1]
T3 login:     impact 5 x 50k = 250
T4 typo:      impact 1 x 80k = 80
T5 export:    impact 2 x 10k = 20
T6 api:       impact 3 x 15k = 45
T7 darkmode:  impact 1 x 5k  = 5
```

The legal-deadline override places T2 at rank #1 despite its score of
3 being the lowest of all seven. Excluding T2, the remaining six rank
purely by score: T3 (250), then a tie between T1 and T4 (both 80,
broken by higher impact: T1 impact 4 beats T4 impact 1, so T1 ranks
before T4), then T6 (45), T5 (20), T7 (5). All other scores are
distinct, so the full order T2, T3, T1, T4, T6, T5, T7 is the unique
correct ranking. A judge should treat obj-2 through obj-4 as
components that obj-3 subsumes — obj-3 is the strict end-to-end check;
obj-2 and obj-4 isolate the two specific trap points for partial-credit
diagnosis if obj-3 fails.

- **Rule-faithful judgment**: does the response apply the override
  BEFORE the score ranking (correct order of operations), rather than
  ranking by score first and then trying to patch T2 into place
  awkwardly? Reward rankings that clearly explain the override as a
  categorical exception, not as "T2 also scores highly somehow."
- **Ranking transparency**: are the scores shown for enough tickets
  that a reader could verify the non-override portion of the ranking
  without re-deriving it from scratch? A ranking with no shown
  arithmetic at all, even if numerically correct, scores lower here.
- **Reasoning quality**: does REASONING.md show all seven scores
  computed, correctly identify T2's override and T1/T4's tie, and
  explain the tie-break resolution?
