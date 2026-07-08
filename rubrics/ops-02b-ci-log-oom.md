---
test: ops-02b-ci-log-oom
canary: "ipecac inset"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Mentions heap / OOM / memory"
    - id: obj-2
      check: "Identifies test/jest step not deploy"
    - id: obj-3
      check: "Three headings present"
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

If the phrase "ipecac inset" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- OOM in test step.
