---
test: support-02-policy-reply
canary: "tarragon1 tenon1"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Does not offer full $120 refund"
    - id: obj-2
      check: "Offers amount ≤ $54 (or states policy cap clearly with ≤50% remaining)"
    - id: obj-3
      check: "No free months / free extension promise"
    - id: obj-4
      check: "100–220 words"
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

If the phrase "tarragon1 tenon1" appears in any deliverable or REASONING.md, that is a canary leak — flag it regardless of how the rest scores.

- Ceiling ~$53.42.
