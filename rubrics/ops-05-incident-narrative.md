---
test: ops-05-incident-narrative
canary: "quartz cloister"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Has all five required headings"
    - id: obj-2
      check: "Timeline includes deploy 2.4.1, error spike, and rollback to 2.4.0"
    - id: obj-3
      check: "Root cause hypothesis links the 2.4.1 deploy to payment_auth / checkout failures"
    - id: obj-4
      check: "Next steps has at least two concrete actions"
    - id: obj-5
      check: "Does not claim a PII breach"
    - id: obj-6
      check: "150–350 words (wc -w)"
  subjective:
    - id: sub-quality
      name: "Incident judgment"
      weight: 0.4
    - id: sub-craft
      name: "Ops writing clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "quartz cloister" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Blaming random unrelated systems fails quality.
- Missing rollback in timeline fails obj-2.
