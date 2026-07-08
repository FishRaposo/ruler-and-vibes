---
test: agent-02c-minimal-avg-skip
canary: "tamarind railhead"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node avg.js self-tests all PASS"
    - id: obj-2
      check: "avg([]) === null and avg([null]) === null"
    - id: obj-3
      check: "avg([1,2,3]) === 2"
    - id: obj-4
      check: "≤ 35 lines"
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

If the phrase "tamarind railhead" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- if (n===0) return null before divide.
