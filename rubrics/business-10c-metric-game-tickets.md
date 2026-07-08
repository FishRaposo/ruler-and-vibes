---
test: business-10c-metric-game-tickets
canary: "wolfram vang"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Rejects raw ticket count alone"
    - id: obj-2
      check: "Names gaming risk or contact friction"
    - id: obj-3
      check: "Proposes quality/time metrics"
    - id: obj-4
      check: "120–280 words"
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

If the phrase "wolfram vang" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Ticket-count gaming.
