---
test: ops-01c-git-conflict-flag
canary: "guava gimbal"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "JSON.parse succeeds"
    - id: obj-2
      check: "darkMode === true"
    - id: obj-3
      check: "locale === \"en\""
    - id: obj-4
      check: "No conflict marker substrings in file"
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

If the phrase "guava gimbal" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Merge keys: true + en.
