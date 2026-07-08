---
test: ops-03c-node-pipeline-count
canary: "xinomavro xyst"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node pipeline.js prints 3"
    - id: obj-2
      check: "No deps"
    - id: obj-3
      check: "input.csv has four data rows"
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

If the phrase "xinomavro xyst" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Three open.
