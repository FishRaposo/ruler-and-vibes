---
test: critical-01b-methods-limit-sleep
canary: "anatase zulu"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Four headings"
    - id: obj-2
      check: "Mentions small sample or n=12"
    - id: obj-3
      check: "Mentions self-report or no baseline or founder conflict"
    - id: obj-4
      check: "Challenges clinically proven claim"
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

If the phrase "anatase zulu" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Same skill.
