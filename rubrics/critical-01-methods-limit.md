---
test: critical-01-methods-limit
canary: "zeolite yardstick"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Four required headings"
    - id: obj-2
      check: "Mentions no control or lack of control group"
    - id: obj-3
      check: "Mentions small n or n=18 or bias/funding/employees"
    - id: obj-4
      check: "Rejects or challenges \"cures ADHD\" as unsupported"
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

If the phrase "zeolite yardstick" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Methods literacy.
