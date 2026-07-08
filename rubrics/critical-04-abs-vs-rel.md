---
test: critical-04-abs-vs-rel
canary: "celestine updraft"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Four headings"
    - id: obj-2
      check: "States absolute change 2%→1% or 1 percentage point"
    - id: obj-3
      check: "States relative 50%"
    - id: obj-4
      check: "Notes side effects or base rate context"
  subjective:
    - id: sub-quality
      name: "Critical insight"
      weight: 0.4
    - id: sub-craft
      name: "Clarity of critique"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "celestine updraft" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Risk framing.
