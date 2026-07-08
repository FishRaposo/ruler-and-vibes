---
test: support-03-escalation-note
canary: "wasabi1 wain1"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Four required headings"
    - id: obj-2
      check: "Mentions enterprise or ARR or export outage"
    - id: obj-3
      check: "Has a concrete ask"
    - id: obj-4
      check: "80–200 words; no insult to customer"
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

If the phrase "wasabi1 wain1" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Internal escalation structure.
