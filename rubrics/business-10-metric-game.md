---
test: business-10-metric-game
canary: "rutile quarter"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Rejects signups-only success definition"
    - id: obj-2
      check: "Proposes activation or retention-style primary metric"
    - id: obj-3
      check: "Mentions signups as secondary/guardrail or input metric"
    - id: obj-4
      check: "120–280 words; no insult vocabulary (idiot/stupid/dumb)"
  subjective:
    - id: sub-quality
      name: "Decision quality"
      weight: 0.4
    - id: sub-craft
      name: "Memo craft"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "rutile quarter" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Metric gaming pushback.
