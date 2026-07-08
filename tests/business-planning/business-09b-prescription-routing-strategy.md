---
id: business-09b-prescription-routing-strategy
category: business-planning
title: Prescription-routing capability build-buy-partner call
deliverables:
  - decision.md
---

## Task

Cadence Health, an early-stage telehealth startup, needs an e-prescribing
capability: routing prescriptions to pharmacies with an integrated
drug-interaction and controlled-substance compliance check. Leadership has
narrowed it to three options and needs a single recommendation for the
board.

**Option 1 — Build in-house:**
- 5 engineers for 7 months to reach MVP, then ongoing maintenance by 3
  engineers indefinitely.
- Fully-loaded engineer cost: 165,000/year.
- Gives full control over the interaction model and the prescription data.
- The team has no prior e-prescribing or clinical-compliance expertise.

**Option 2 — Buy a vendor SaaS:**
- A proven, already-certified vendor product. 7 weeks to integrate.
- Cost: 7,500/month.
- Patient prescription data leaves Cadence's platform and is processed by
  the vendor.

**Option 3 — Partner with an e-prescribing network:**
- Revenue-share deal with an established prescription-routing network: 12%
  of prescription-transaction revenue, paid to the partner.
- 14 weeks to integrate.
- Deeper technical integration than Option 2, with more ongoing
  coordination risk between the two systems.

**Binding facts, seeded by the business context:**

- E-prescribing with a compliant drug-interaction check is **table-stakes**
  for a telehealth product — it is not something Cadence's patients will
  pay a premium for or choose Cadence because of. It is non-differentiating.
- A well-funded competitor is opening a directly competing clinic **in two
  months**, and Cadence's anchor payer contract requires a live
  e-prescribing path by then. Time-to-market is a binding constraint, not a
  nice-to-have.
- Cadence's engineering team has **no in-house e-prescribing or clinical-
  compliance expertise** today.
- Controlled-substance e-prescribing in this space requires a **mandatory
  regulatory certification** that takes significant time and specialized
  expertise to obtain and maintain.

## Deliverable

`decision.md` must:

- Evaluate all three options, with at least one concrete pro and one
  concrete con for each, drawn from the facts above.
- Explicitly name time-to-market and the non-differentiating/table-stakes
  nature of the capability as decision factors.
- Make exactly **one** unambiguous recommendation — not a hedge, not "it
  depends."
- Ensure the recommendation is consistent with the binding constraints:
  it cannot recommend building in-house while also conceding that
  time-to-market is binding and the team lacks e-prescribing/compliance
  expertise.

## Constraints

- You may cite a rough 3-year cost comparison if useful, but the
  recommendation must rest on the strategic constraints above, not on
  headcount cost alone.
- At most 600 words (whole file, `wc -w`).
