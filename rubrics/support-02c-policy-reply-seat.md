---
test: support-02c-policy-reply-seat
canary: "vanilla1 vesica1"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Does not refund full $125"
    - id: obj-2
      check: "Offer ≤ $50 or explicit 40% policy"
    - id: obj-3
      check: "No free seats forever"
    - id: obj-4
      check: "80–180 words"
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

If the phrase "vanilla1 vesica1" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- $50 cap.
