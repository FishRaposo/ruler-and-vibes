---
test: agent-03c-slugify-until-green
canary: "eucrite dogleg"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "node tests.js only PASS"
    - id: obj-2
      check: "tests.js unchanged"
    - id: obj-3
      check: "slugify(\"Hello World\")===\"hello-world\""
    - id: obj-4
      check: "slug.js ≤ 40 lines"
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

If the phrase "eucrite dogleg" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Collapse non [a-z0-9] to - after lowercasing.
