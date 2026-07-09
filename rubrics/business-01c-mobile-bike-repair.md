---
test: business-01c-mobile-bike-repair
canary: "amaryllis betelgeuse"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: ">= 3 milestones with dates or day numbers within the 90 days"
    - id: obj-2
      check: "Budget table sums correctly (recompute it) and totals <= $22,000"
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

- Recompute the budget total yourself; a table that does not add up
  fails obj-2 regardless of how it is labeled. Add the line items, compare
  the sum to the stated total row, and confirm the sum is at most $22,000.
  - obj-2 PASS examples: line items add to exactly the stated total and
    that total is $22,000 or less; the table sums to $21,300 with a matching
    total row and a contingency line absorbing the remainder; every dollar
    of the $22,000 is assigned across line items whose sum equals the
    total shown.
  - obj-2 FAIL examples: line items sum to $25,600 but the total row reads
    "$22,000" (does not add up); the arithmetic is internally consistent
    but the sum is $23,400 (over the cap); a "Total" row is shown but no
    per-line costs are given so the sum cannot be recomputed.
- obj-1: at least three timeline milestones must be anchored to a specific
  day number or date that falls inside the 90-day window.
  - PASS examples: "Day 15: public launch", "Day 45: referral program
    live", "Day 90: review against KPIs" (three dated, all within 90);
    a "Day 1–14" fit-out block plus two later dated milestones.
  - FAIL examples: milestones labeled only "early", "mid", "late" with no
    day numbers; only two dated milestones and the rest undated; a
    milestone dated "Day 120" that falls outside the 90-day window.
- obj-3: at least three KPIs, each carrying a numeric target.
  - PASS examples: "90 completed jobs by day 90", "cost per acquired job
    <= $32", "repeat-or-referral share >= 25%"; a booking-to-completion
    rate stated as ">= 85%".
  - FAIL examples: "grow bookings", "keep customers happy", "strong
    reviews" (no numbers); only two of the three KPIs carry a number; a
    KPI that names a metric but leaves the target as "TBD".
- obj-4: count the words in plan.md; it must be 750 or fewer.
  - PASS examples: a 584-word plan; a 730-word plan.
  - FAIL examples: an 820-word plan; a plan padded to 900 words.
- Realism: implied cost-per-job vs. budget, a plausible channel mix for a
  solo mobile operator (word-of-mouth, trailhead presence, cheap local
  ads — not a national campaign), dependencies sequenced sanely —
  milestones should interlock, each funding confidence in the next, not
  float independently.
- Prioritization: is there a clear "do this first and most" or is
  everything priority one? A plan that names its single highest-leverage
  activity and subordinates the rest scores higher than an even spread.
- Reasoning quality: does REASONING.md confront the weakest assumption
  (usually the conversion rate from a trailhead conversation or ad click
  to a booked, paid job)?
- If the phrase "amaryllis betelgeuse" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the rest
  scores.
