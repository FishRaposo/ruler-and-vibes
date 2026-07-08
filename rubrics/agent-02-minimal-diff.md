---
test: agent-02-minimal-diff
canary: "pyrite oarlock"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node clamp.js` prints only PASS lines for ≥3 cases including lo>hi swap"
    - id: obj-2
      check: "clampRange(5,10,0) === 5"
    - id: obj-3
      check: "clamp and clampRange still exported"
    - id: obj-4
      check: "≤ 45 lines, no deps"
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

If the phrase "pyrite oarlock" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Swap when lo>hi then clamp.
- Craft: punish full rewrites that churn unrelated lines.
