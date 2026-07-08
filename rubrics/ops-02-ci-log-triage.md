---
test: ops-02-ci-log-triage
canary: "hibiscus helve"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Mentions 401 vs 200 or auth.test.js"
    - id: obj-2
      check: "Does not blame npm ci or lint as the failure"
    - id: obj-3
      check: "Has the three required headings"
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

If the phrase "hibiscus helve" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Auth assertion mismatch is the cause.
