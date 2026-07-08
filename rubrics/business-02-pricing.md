---
test: business-02-pricing
canary: "keel margin"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Three tiers, each with a price and feature fences"
    - id: obj-2
      check: "Break-even arithmetic shown and correct (recompute it)"
    - id: obj-3
      check: "Positioning addresses BOTH competitors ($19 and $49)"
    - id: obj-4
      check: "<= 700 words (count them)"
  subjective:
    - id: sub-quality
      name: "Strategic soundness"
      weight: 0.4
    - id: sub-craft
      name: "Quantitative rigor"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "keel margin" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

- Recompute break-even from $6 variable and $8,000 fixed at the proposed
  prices; a mix-based calculation is fine if its assumptions are stated.
- Strategic soundness: sensible fences (who upgrades and why), and a
  healthy margin on the floor tier — the cheapest price must still clear
  variable cost with room to steer, not race to $6.01.
- Quantitative rigor: numbers used consistently; no contradictions
  between tiers, break-even, and positioning.
- Reasoning quality: does REASONING.md defend price points against BOTH
  anchors rather than splitting the difference by reflex?
