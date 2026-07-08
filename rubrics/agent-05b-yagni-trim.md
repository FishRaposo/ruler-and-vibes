---
test: agent-05b-yagni-trim
canary: "magnolia leeboard"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node trim.js all PASS"
    - id: obj-2
      check: "trim(\"  hi  \")===\"hi\""
    - id: obj-3
      check: "No require of external packages"
    - id: obj-4
      check: "≤ 15 lines"
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

If the phrase "magnolia leeboard" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- .trim() or both-end regex is enough.
