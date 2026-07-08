---
test: planning-12b-kill-feature-reports
canary: "cassia1 crucible1"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Kill/retire/freeze recommendation"
    - id: obj-2
      check: "Mentions low use or overlap with dashboard"
    - id: obj-3
      check: "Five headings"
    - id: obj-4
      check: "180–400 words"
  subjective:
    - id: sub-quality
      name: "Decision quality"
      weight: 0.4
    - id: sub-craft
      name: "Memo craft"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "cassia1 crucible1" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Retire legacy.
