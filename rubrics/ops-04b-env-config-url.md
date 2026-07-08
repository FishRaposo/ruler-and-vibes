---
test: ops-04b-env-config-url
canary: "zatar zoccolo"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node verify.js PASS"
    - id: obj-2
      check: "Default is http://127.0.0.1:4000"
    - id: obj-3
      check: "verify.js unchanged"
    - id: obj-4
      check: "≤ 25 lines client.js"
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

If the phrase "zatar zoccolo" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Fix default string only.
