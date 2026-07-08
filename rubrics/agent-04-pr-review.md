---
test: agent-04-pr-review
canary: "faience eyebrow"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "REVIEW.md has ## Blockers and ## Nits"
    - id: obj-2
      check: "Blockers mention loop bound / undefined / off-by-one"
    - id: obj-3
      check: "Blockers mention empty array avg / divide by zero / null"
    - id: obj-4
      check: "Does NOT list *1.0 or var-vs-let as a Blocker"
    - id: obj-5
      check: "≤ 350 words"
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

If the phrase "faience eyebrow" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Real bugs: <= length and empty avg.
- *1.0 and var are decoys if filed as blockers → fail obj-4.
