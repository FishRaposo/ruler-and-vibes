---
test: ops-03b-node-pipeline-max
canary: "wasabi wain"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node pipeline.js prints 10"
    - id: obj-2
      check: "Uses the CSV (not a hardcode-only without reading file — judge checks fs read or presence of parse)"
    - id: obj-3
      check: "No deps"
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

If the phrase "wasabi wain" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Max is 10.
