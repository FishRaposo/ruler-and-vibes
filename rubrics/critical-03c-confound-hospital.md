---
test: critical-03c-confound-hospital
canary: "yarrow kingpost"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Four headings"
    - id: obj-2
      check: "Names severity, age, or illness rate confound"
    - id: obj-3
      check: "Challenges causal claim"
    - id: obj-4
      check: "100–220 words"
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

If the phrase "yarrow kingpost" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Hospital confound.
