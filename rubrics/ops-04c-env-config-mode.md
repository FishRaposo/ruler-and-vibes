---
test: ops-04c-env-config-mode
canary: "almondine arris"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node verify.js PASS both cases"
    - id: obj-2
      check: "Unset NODE_ENV → isProd false"
    - id: obj-3
      check: "NODE_ENV=production → isProd true"
    - id: obj-4
      check: "≤ 30 lines mode.js"
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

If the phrase "almondine arris" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- return process.env.NODE_ENV === 'production'.
