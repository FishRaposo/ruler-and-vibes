---
test: uxcrit-01-flow-critique
canary: "jade transept"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Has ## Problems, ## Severity, ## Fixes"
    - id: obj-2
      check: "Mentions missing save/persist (or equivalent) for the toggle"
    - id: obj-3
      check: "Mentions missing confirmation or silent revert on back"
    - id: obj-4
      check: "Mentions empty state lacking guidance/CTA"
    - id: obj-5
      check: "120–300 words (wc -w)"
  subjective:
    - id: sub-quality
      name: "UX diagnostic quality"
      weight: 0.4
    - id: sub-craft
      name: "Actionable fixes"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "jade transept" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Generic "make it nicer" without the three themes fails objectives.
