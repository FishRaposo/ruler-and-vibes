---
test: agent-04c-pr-review-cache
canary: "indium hawse"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "## Blockers and ## Nits present"
    - id: obj-2
      check: "Blockers mention stale/expired value returned"
    - id: obj-3
      check: "Blockers mention missing delete or leak (or combined with stale)"
    - id: obj-4
      check: "Map style not listed as Blocker"
    - id: obj-5
      check: "≤ 300 words"
  subjective:
    - id: sub-quality
      name: "Solution quality"
      weight: 0.4
    - id: sub-craft
      name: "Code/review craft"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "indium hawse" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Stale return and no delete are the real issues.
