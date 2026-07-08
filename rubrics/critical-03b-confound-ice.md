---
test: critical-03b-confound-ice
canary: "yttrium handrail"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Four headings"
    - id: obj-2
      check: "Names heat/summer/season confound"
    - id: obj-3
      check: "Rejects direct causation"
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

If the phrase "yttrium handrail" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Classic confound.
