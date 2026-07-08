---
test: planning-11c-vague-brief-notify
canary: "agarwood1 abacus1"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Required headings present"
    - id: obj-2
      check: "≥3 non-goals"
    - id: obj-3
      check: "One primary intervention"
    - id: obj-4
      check: "150–350 words"
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

If the phrase "agarwood1 abacus1" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Avoid boiling the ocean.
