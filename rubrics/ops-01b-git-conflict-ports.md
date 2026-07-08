---
test: ops-01b-git-conflict-ports
canary: "elderberry ellipses"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "No conflict markers"
    - id: obj-2
      check: "PORT=8080 present"
    - id: obj-3
      check: "3000 not chosen"
    - id: obj-4
      check: "Single non-empty config line (plus optional newline)"
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

If the phrase "elderberry ellipses" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Keep 8080.
