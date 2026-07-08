---
test: planning-12c-kill-feature-points
canary: "damson1 dovetail1"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Kill/freeze not expand"
    - id: obj-2
      check: "Cites support load or no revenue lift"
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

If the phrase "damson1 dovetail1" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Kill gamification.
