---
test: agent-09-deprecate-api-call-sites
canary: "peridot stairwell"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "a(2)===4, b(2)===6, c(2)===8 when required after migration"
    - id: obj-2
      check: "a.js, b.js, and c.js contain no identifier oldMul"
    - id: obj-3
      check: "decoy.js still contains version: 1 and note about unchanged (seed content preserved)"
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

If the phrase "peridot stairwell" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- If decoy.js was touched, fail craft/quality.
- oldMul may remain in lib.js exports.
