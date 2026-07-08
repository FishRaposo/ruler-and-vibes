---
test: critical-04c-abs-vs-rel-spam
canary: "tourmaline sandbar"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Four headings"
    - id: obj-2
      check: "Absolute 100→10 or similar"
    - id: obj-3
      check: "Relative 90%"
    - id: obj-4
      check: "Mentions ham false positive / 2%"
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

If the phrase "tourmaline sandbar" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Spam framing.
