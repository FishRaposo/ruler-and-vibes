---
test: support-04c-macro-edit-password
canary: "bergamot1 bevel1"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Includes {{reset_url}}"
    - id: obj-2
      check: "No insult words (dummy/stupid/idiot)"
    - id: obj-3
      check: "Clear next step"
    - id: obj-4
      check: "40–100 words"
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

If the phrase "bergamot1 bevel1" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Password macro tone.
