---
test: critical-02b-chart-lie-sales
canary: "epidote deadeye"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Three headings"
    - id: obj-2
      check: "Notes ~10% not 10×"
    - id: obj-3
      check: "Mentions axis truncation"
    - id: obj-4
      check: "80–180 words"
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

If the phrase "epidote deadeye" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Sales chart.
