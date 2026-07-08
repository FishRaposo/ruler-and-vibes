---
test: support-02b-policy-reply-ship
canary: "umbrawood1 upset1"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Credit/offer ≤ $15"
    - id: obj-2
      check: "No free product replacement of full order"
    - id: obj-3
      check: "No review-for-credit bribe"
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

If the phrase "umbrawood1 upset1" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- $15 cap.
