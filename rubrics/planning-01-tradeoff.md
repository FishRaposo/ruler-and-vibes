---
test: planning-01-tradeoff
canary: "equinox solstice"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Decision matrix with >= 4 criteria, each with an explicit weight"
    - id: obj-2
      check: "Exactly one explicit recommendation"
    - id: obj-3
      check: "Risks-and-mitigations section for the recommended option"
    - id: obj-4
      check: "<= 600 words; given numbers used without contradiction"
  subjective:
    - id: sub-quality
      name: "Decision rigor"
      weight: 0.4
    - id: sub-craft
      name: "Memo clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "equinox solstice" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
of the submission scores.

- Decision rigor: are the criterion weights defended, not decorative? A
  matrix reverse-engineered to justify a pre-picked winner scores low —
  check whether plausible alternative weights would flip the result and
  whether that risk is acknowledged.
- Memo clarity: an owner with five minutes should get the answer, the
  cost picture, and the biggest risk.
- Reasoning quality: does REASONING.md engage with multi-year cost math
  and the staffing reality, not just restate the memo?
