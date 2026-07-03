---
test: planning-02-estimate
canary: "anchor-and-fan"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "All four sections present in order: Assumptions, Calculation, Result, Sensitivity"
    - id: obj-2
      check: "Arithmetic is correct as written (recompute it)"
    - id: obj-3
      check: "Result gives a range for BOTH storage growth and egress"
    - id: obj-4
      check: "Sensitivity names one specific assumption with a why"
  subjective:
    - id: sub-quality
      name: "Estimation judgment"
      weight: 0.4
    - id: sub-craft
      name: "Transparency"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Estimation judgment: plausible assumption values (posting rates, photo
  sizes, view multipliers) and sound structure — good estimates anchor on
  one defensible number and fan the rest out from it (anchor-and-fan),
  rather than stacking six wild guesses.
- Transparency: could you rebuild the whole estimate from the page alone?
- Reasoning quality: does REASONING.md admit which assumptions are
  weakest?
