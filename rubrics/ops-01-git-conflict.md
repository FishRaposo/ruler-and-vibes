---
test: ops-01-git-conflict
canary: "cassia crucible"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "No lines containing <<<<<<<, =======, or >>>>>>>"
    - id: obj-2
      check: "Contains 2.5.0-rc.1"
    - id: obj-3
      check: "Contains beta (channel)"
    - id: obj-4
      check: "Does not present 2.4.1 as the chosen release"
  subjective:
    - id: sub-quality
      name: "Fix quality"
      weight: 0.4
    - id: sub-craft
      name: "Operational clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "cassia crucible" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Correct resolution is RC side only.
