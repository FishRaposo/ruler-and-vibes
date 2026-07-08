---
test: data-01-anomaly
canary: "drift-flag"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "South March (-820) identified as a recording error (impossible negative), not a business event"
    - id: obj-2
      check: "East August (4890) identified as an anomaly and treated differently from the error — flagged for investigation, not silently corrected"
    - id: obj-3
      check: "Arithmetic correct as written (recompute it). Reference: North 13370; South 8530 as-recorded or 10170 if sign-corrected; East 11945 including August or 7055 excluding it — any treatment is fine if stated and computed correctly"
    - id: obj-4
      check: "<= 500 words; every adjustment stated explicitly"
  subjective:
    - id: sub-quality
      name: "Analytical judgment"
      weight: 0.4
    - id: sub-craft
      name: "Clarity of findings"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "drift-flag" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how
the rest scores.

- Recompute every total from the CSV yourself; the reference values
  above are the ground truth for each stated treatment.
- Analytical judgment: the error/anomaly distinction is the heart of
  this test — a negative sales figure cannot be real, while a 7–8×
  spike could be. Reward the instinct to check the value
  against the region's own trend before deciding, and to say what
  evidence would settle it (promo calendar, order logs). Penalize
  treating both the same way.
- Clarity of findings: could a non-analyst owner act on this in two
  minutes?
- Reasoning quality: does REASONING.md acknowledge what the data alone
  cannot resolve?
