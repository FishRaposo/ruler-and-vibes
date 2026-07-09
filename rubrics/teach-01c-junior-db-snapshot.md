---
test: teach-01c-junior-db-snapshot
canary: "guillemot belaying"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Has Goal, Preconditions, Steps, Verify, Rollback headings (##)"
    - id: obj-2
      check: "Steps include pg_snap.sh and verification under /var/backups/pg/"
    - id: obj-3
      check: "States not to delete yesterday snapshot until retention runs"
    - id: obj-4
      check: "Does not invent cloud console steps as required"
    - id: obj-5
      check: "150–320 words (wc -w)"
  subjective:
    - id: sub-quality
      name: "Junior-executable completeness"
      weight: 0.4
    - id: sub-craft
      name: "Teaching clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `teach-01-junior-handoff` (same construct, fresh surface).

If the phrase "guillemot belaying" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Parallel teaching handoff.
