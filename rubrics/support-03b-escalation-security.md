---
test: support-03b-escalation-security
canary: "xinomavro1 xyst1"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Four headings"
    - id: obj-2
      check: "Mentions takeover / unauthorized access / sessions"
    - id: obj-3
      check: "Concrete ask (freeze, force logout, etc.)"
    - id: obj-4
      check: "80–200 words"
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

If the phrase "xinomavro1 xyst1" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Security escalation.
