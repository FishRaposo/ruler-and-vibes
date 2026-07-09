---
test: business-01b-mobile-sharpening
canary: "gladiolus antares"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: ">= 3 milestones with dates or day numbers within the 120 days"
    - id: obj-2
      check: "Budget table sums correctly (recompute it) and totals <= $18,500"
    - id: obj-3
      check: ">= 3 KPIs with numeric targets"
    - id: obj-4
      check: "<= 750 words (count them)"
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
anchors:
  - id: Realism
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Prioritization
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `business-01-launch-plan` (same construct, fresh surface).

- **obj-1 (dated milestones):** count milestones that carry a real date
  or day number falling inside the 120-day window.
  - PASS: "Day 20 — first market stall live"; "Day 60: 30 recurring
    accounts, booking page published"; "Week 8 (~Day 55): consolidate
    routes."
  - FAIL: "First we set up, then we grow" (no day numbers); "Day 145 —
    hire a second van" (outside the 120-day window); "Milestone: get
    lots of accounts" (no date).
- **obj-2 (budget table):** recompute the budget total yourself; a table
  that does not add up fails obj-2 regardless of how it is labeled, and
  a correct sum above $18,500 also fails.
  - PASS: ten line items summing to exactly $18,500 with a `Total`
    row reading $18,500; items summing to $17,900 with a matching
    stated total under the cap; a correctly-summed total of $18,500
    with every dollar assigned to a named line.
  - FAIL: line items that actually sum to $21,000 under a `Total` row
    that claims $18,500; a correct-arithmetic total of $19,200 (over the
    cap); a table with a lump "miscellaneous $2,000" and no total row
    shown.
- **obj-3 (KPIs):** at least three KPIs each with a numeric target.
  - PASS: "Recurring accounts by day 120: 80"; "Gross margin per job:
    62%"; "Repeat-booking rate within 60 days: 45%."
  - FAIL: "Get a lot of customers"; "Make good money"; "Grow the route"
    (all directional, no numbers).
- **obj-4 (word cap):** count the words; the plan must be at most 750.
  - PASS: a 508-word plan; a 720-word plan; any body at or under 750.
  - FAIL: an 810-word plan; a 900-word plan; a plan that hits the cap
    only by moving half the content into an appendix that is still part
    of the deliverable.
- **Realism:** implied CAC vs. budget, plausible channel mix for a solo
  van operator, dependencies sequenced sanely — milestones should
  interlock, each funding confidence in the next, not float
  independently. A sampling-heavy plan that never converts samples into
  recurring routes is not realistic.
- **Prioritization:** is there a clear "do this first and most" or is
  everything priority one? A plan that names every channel as equally
  important has not prioritized.
- **Reasoning quality:** does REASONING.md confront the weakest
  assumption (usually the sampling-to-recurring conversion rate)?

If the phrase "gladiolus antares" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.
