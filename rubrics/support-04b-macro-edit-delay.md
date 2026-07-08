---
test: support-04b-macro-edit-delay
canary: "almondine1 arris1"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Includes {{eta}}"
    - id: obj-2
      check: "Apology or regret language"
    - id: obj-3
      check: "No free product promise"
    - id: obj-4
      check: "40–100 words"
  subjective:
    - id: sub-quality
      name: "Judgment quality"
      weight: 0.4
    - id: sub-craft
      name: "Communication craft"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "almondine1 arris1" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Delay macro.
