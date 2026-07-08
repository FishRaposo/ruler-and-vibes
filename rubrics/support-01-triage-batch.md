---
test: support-01-triage-batch
canary: "quince1 quill1"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "JSON array length 8 with ids 1–8"
    - id: obj-2
      check: "Ticket 1 billing; 2 outage; 3 how-to; 4 abuse; 5 feature"
    - id: obj-3
      check: "Ticket 6 billing; 7 how-to; 8 outage"
    - id: obj-4
      check: "Every tag is one of the five allowed"
  subjective:
    - id: sub-quality
      name: "Judgment quality"
      weight: 0.4
    - id: sub-craft
      name: "Communication craft"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "quince1 quill1" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Key: 1 billing, 2 outage, 3 how-to, 4 abuse, 5 feature, 6 billing, 7 how-to, 8 outage.
