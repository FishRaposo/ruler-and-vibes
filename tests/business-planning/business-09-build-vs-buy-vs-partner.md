---
id: business-09-build-vs-buy-vs-partner
category: business-planning
title: Build-versus-buy-versus-partner strategy call
deliverables:
  - decision.md
---

## Task

Ridgeline Pay, an early-stage payments startup, needs a fraud-scoring and
payments-compliance capability. Leadership has narrowed it to three
options and needs a single recommendation for the board.

**Option 1 — Build in-house:**
- 4 engineers for 9 months to reach MVP, then ongoing maintenance by 2
  engineers indefinitely.
- Fully-loaded engineer cost: 180,000/year.
- Gives full control over the fraud model and data.
- The team has no prior fraud-detection or payments-compliance
  expertise.

**Option 2 — Buy a vendor SaaS:**
- A proven, already-certified vendor product. 8 weeks to integrate.
- Cost: 6,000/month.
- Customer transaction data leaves Ridgeline's platform and is processed
  by the vendor.

**Option 3 — Partner with a fraud firm:**
- Revenue-share deal with an established fraud-prevention firm: 15% of
  recovered/prevented fraud losses, paid to the partner.
- 12 weeks to integrate.
- Deeper technical integration than Option 2, with more ongoing
  coordination risk between the two systems.

**Binding facts, seeded by the business context:**

- Fraud-scoring/compliance is **table-stakes** for a payments product —
  it is not something Ridgeline's customers will pay a premium for or
  choose Ridgeline because of. It is non-differentiating.
- A well-funded competitor is launching a directly competing product
  **next quarter**. Time-to-market is a binding constraint, not a nice-
  to-have.
- Ridgeline's engineering team has **no in-house fraud or compliance
  expertise** today.
- Payments compliance in this space requires a **regulatory
  certification** that takes significant time and specialized expertise
  to obtain and maintain.

## Deliverables
`decision.md` must:

- Evaluate all three options, with at least one concrete pro and one
  concrete con for each, drawn from the facts above.
- Explicitly name time-to-market and the non-differentiating/table-stakes
  nature of the capability as decision factors.
- Make exactly **one** unambiguous recommendation — not a hedge, not "it
  depends."
- Ensure the recommendation is consistent with the binding constraints:
  it cannot recommend building in-house while also conceding that
  time-to-market is binding and the team lacks fraud/compliance
  expertise.

## Constraints

- You may cite a rough 3-year cost comparison if useful, but the
  recommendation must rest on the strategic constraints above, not on
  headcount cost alone.
- At most 600 words (whole file, `wc -w`).
