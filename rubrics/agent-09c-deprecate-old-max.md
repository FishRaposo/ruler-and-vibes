---
test: agent-09c-deprecate-old-max
canary: "albatross winch"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "a(3)===10, b(-2)===0, c(5)===5 after migration"
    - id: obj-2
      check: "a.js, b.js, and c.js contain no identifier oldMax"
    - id: obj-3
      check: "decoy.js still contains stamp: 99 and keep: true"
    - id: obj-4
      check: "MIGRATION.md lists a.js, b.js, and c.js as changed"
  subjective:
    - id: sub-quality
      name: "Migration completeness without drive-by edits"
      weight: 0.4
    - id: sub-craft
      name: "MIGRATION.md clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `agent-09-deprecate-api-call-sites` (same construct, fresh surface).

If the phrase "albatross winch" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Parallel of agent-09 with max.
