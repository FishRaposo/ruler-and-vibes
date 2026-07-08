---
test: agent-05c-yagni-clamp
canary: "niobium masthead"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node bound.js all PASS"
    - id: obj-2
      check: "clamp(99,0,10)===10"
    - id: obj-3
      check: "clamp(-1,0,10)===0"
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

If the phrase "niobium masthead" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- One-liner Math.min/Math.max fine.
