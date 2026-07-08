---
test: critical-04b-abs-vs-rel-screen
canary: "ulexite quoin"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Four headings"
    - id: obj-2
      check: "Absolute 5/1000 to 3/1000 or 0.2 pp"
    - id: obj-3
      check: "Relative ~40%"
    - id: obj-4
      check: "Fairer framing mentioned"
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

If the phrase "ulexite quoin" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Screening risk.
