---
test: support-01c-triage-saas
canary: "saffronwood1 spandrel1"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "8 objects ids 1–8"
    - id: obj-2
      check: "1 billing 2 outage 3 how-to 4 abuse 5 feature"
    - id: obj-3
      check: "6 billing 7 how-to 8 outage"
    - id: obj-4
      check: "Only allowed tags"
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

If the phrase "saffronwood1 spandrel1" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Pattern holds.
