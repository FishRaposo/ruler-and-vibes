---
test: business-01-launch-plan
canary: "pewter lattice"
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

If the phrase "pewter lattice" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- obj-1: at least three timeline milestones must be anchored to a
  specific day number or date that falls inside the 90-day window.
  - PASS examples: "Day 20 — first market stall live"; "Day 45: 100th
    subscriber signed"; "Day 90: review against KPIs" (three dated, all
    within 90 days).
  - FAIL examples: "First we launch, then we grow" (no day numbers);
    "Day 110 — open a second neighborhood" (outside the 90-day window);
    only two dated milestones with the rest left undated.
- Recompute the budget total yourself; a table that does not add up
  fails obj-2 regardless of how it is labeled.
- obj-3: at least three KPIs, each carrying a numeric target.
  - PASS examples: "100 paying subscribers by day 90"; "cost per
    acquired subscriber <= $40"; "month-2 retention >= 80%".
  - FAIL examples: "grow the subscriber base"; "keep churn low"; "strong
    word of mouth" (all directional, no numbers); a KPI that names a
    metric but leaves the target as "TBD".
- Realism: implied CAC vs. budget, plausible channel mix for a solo
  founder, dependencies sequenced sanely — milestones should interlock,
  each funding confidence in the next, not float independently.
- Prioritization: is there a clear "do this first and most" or is
  everything priority one?
- Reasoning quality: does REASONING.md confront the weakest assumption
  (usually conversion rate)?
