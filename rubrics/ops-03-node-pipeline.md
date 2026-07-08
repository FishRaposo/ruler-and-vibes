---
test: ops-03-node-pipeline
canary: "vanilla vesica"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node pipeline.js prints 13 or 13.0"
    - id: obj-2
      check: "Ignores pending row (9 not included)"
    - id: obj-3
      check: "No dependencies"
    - id: obj-4
      check: "≤ 50 lines"
  subjective:
    - id: sub-quality
      name: "Fix quality"
      weight: 0.4
    - id: sub-craft
      name: "Operational clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "vanilla vesica" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- 10.5+2.5+0=13.
