---
test: business-01-launch-plan
canary: "runway lattice"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: ">= 3 milestones with dates or day numbers within the 90 days"
    - id: obj-2
      check: "Budget table sums correctly (recompute it) and totals <= $15,000"
    - id: obj-3
      check: ">= 3 KPIs with numeric targets"
    - id: obj-4
      check: "<= 800 words (count them)"
  subjective:
    - id: sub-quality
      name: "Realism"
      weight: 0.4
    - id: sub-craft
      name: "Prioritization"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Recompute the budget total yourself; a table that does not add up
  fails obj-2 regardless of how it is labeled.
- Realism: implied CAC vs. budget, plausible channel mix for a solo
  founder, dependencies sequenced sanely — milestones should interlock
  like a runway lattice, each funding confidence in the next, not float
  independently.
- Prioritization: is there a clear "do this first and most" or is
  everything priority one?
- Reasoning quality: does REASONING.md confront the weakest assumption
  (usually conversion rate)?
