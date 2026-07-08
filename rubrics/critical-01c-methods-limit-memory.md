---
test: critical-01c-methods-limit-memory
canary: "brookite athwart"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Four headings"
    - id: obj-2
      check: "Mentions open-label or no placebo/control"
    - id: obj-3
      check: "Mentions sponsor conflict or overclaim dementia"
    - id: obj-4
      check: "Challenges FDA-ready or prevention claim"
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

If the phrase "brookite athwart" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Methods.
