---
test: agent-09b-deprecate-old-add
canary: "anemone grapnel"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "a(5)===6, b(5)===7, c(5)===8 after migration"
    - id: obj-2
      check: "a.js, b.js, and c.js contain no identifier oldAdd"
    - id: obj-3
      check: "decoy.js still contains build: 7 and unchanged note"
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

If the phrase "anemone grapnel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Touching decoy fails craft.
