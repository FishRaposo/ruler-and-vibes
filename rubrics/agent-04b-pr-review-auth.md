---
test: agent-04b-pr-review-auth
canary: "heliotrope gangway"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "## Blockers and ## Nits present"
    - id: obj-2
      check: "Blockers mention null/undefined throw or missing guard"
    - id: obj-3
      check: "Blockers mention owner role missing"
    - id: obj-4
      check: "Does not treat missing semicolon as Blocker"
    - id: obj-5
      check: "≤ 300 words"
  subjective:
    - id: sub-quality
      name: "Solution quality"
      weight: 0.4
    - id: sub-craft
      name: "Code/review craft"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "heliotrope gangway" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Blockers: null throw + owner omitted.
- Semicolon nit only.
