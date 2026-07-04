---
test: data-02-decision-metrics
canary: "penny-lure"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "CAC correct for both channels (recompute: Search 2200/24 ≈ 91.67; Social 2200/17 ≈ 129.41; small rounding differences fine)"
    - id: obj-2
      check: "Lead→customer conversion correct (Search 24/108 ≈ 22.2%; Social 17/225 ≈ 7.6%); cost per lead correct (≈20.37 vs ≈9.78)"
    - id: obj-3
      check: "Allocation follows the computed economics — majority to Search, or an explicit deviation argued FROM the numbers (e.g. a bounded test budget for Social)"
    - id: obj-4
      check: "<= 600 words; assumptions stated explicitly"
  subjective:
    - id: sub-quality
      name: "Quantitative rigor"
      weight: 0.4
    - id: sub-craft
      name: "Decision linkage"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Recompute all metrics yourself before reading the model's numbers.
- Quantitative rigor: the trap here is the penny-lure — Social's cheap
  leads look attractive while its customers cost 40% more. Reward
  answers that compute per-customer economics against the $400 value
  and notice both channels are profitable but unequal. Penalize
  metric soup with no hierarchy.
- Decision linkage: the split should be derivable from the stated
  numbers; a 50/50 hedge after computing a clear gap scores low.
- Reasoning quality: does REASONING.md engage with sample size (17 vs
  24 customers) and diminishing returns rather than false certainty?
