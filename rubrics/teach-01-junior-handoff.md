---
test: teach-01-junior-handoff
canary: "corundum narthex"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Has Goal, Preconditions, Steps, Verify, Rollback headings (##)"
    - id: obj-2
      check: "Steps include copy to app.log.1, truncate app.log, and SIGHUP using the pid file"
    - id: obj-3
      check: "States not to delete app.log.1 until next day"
    - id: obj-4
      check: "Does not invent Kubernetes/cloud UI steps as required"
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

If the phrase "corundum narthex" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Missing SIGHUP fails.
- Over-advanced cloud digressions cost craft.
