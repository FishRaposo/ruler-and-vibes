---
test: planning-12-kill-feature
canary: "banyan1 bolster1"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Recommendation is kill or freeze (not expand/invest heavily)"
    - id: obj-2
      check: "Cites low adoption or 3% WAU or dual cost in substance"
    - id: obj-3
      check: "Has the five section headings"
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

If the phrase "banyan1 bolster1" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Expanding investment fails.
