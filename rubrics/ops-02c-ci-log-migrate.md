---
test: ops-02c-ci-log-migrate
canary: "umbrawood upset"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Mentions migration or users relation already exists"
    - id: obj-2
      check: "Does not blame lint/build as failed step"
    - id: obj-3
      check: "Three headings"
    - id: obj-4
      check: "≤ 150 words"
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

If the phrase "umbrawood upset" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Duplicate migration / existing table.
