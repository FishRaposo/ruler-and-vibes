---
id: business-09c-identity-screening-strategy
category: business-planning
title: Fernbank KYC/AML capability build-buy-partner call
deliverables:
  - decision.md
---

## Task

Fernbank Credit, an early-stage consumer-lending neobank, needs an applicant
onboarding capability: identity verification plus sanctions and AML screening
run on every new loan applicant. Leadership has narrowed it to three options
and needs a single recommendation for the board.

**Option 1 — Build in-house:**
- 6 engineers for 8 months to reach MVP, then ongoing maintenance by 4
  engineers indefinitely.
- Fully-loaded engineer cost: 150,000/year.
- Gives full control over the screening model and the applicant data.
- The team has no prior identity-verification or AML-screening expertise.

**Option 2 — Buy a vendor SaaS:**
- A proven, already-certified vendor product. 6 weeks to integrate.
- Cost: 8,000/month.
- Applicant identity data leaves Fernbank's platform and is processed by the
  vendor.

**Option 3 — Partner with a screening bureau:**
- Revenue-share deal with an established identity-and-AML screening bureau: 10%
  of screened-onboarding revenue, paid to the partner.
- 11 weeks to integrate.
- Deeper technical integration than Option 2, with more ongoing coordination
  risk between the two systems.

**Binding facts, seeded by the business context:**

- Identity and AML screening is **table-stakes** for a lending product — it is
  not something Fernbank's applicants will pay a premium for or choose Fernbank
  because of. It is non-differentiating.
- A well-funded competitor is entering Fernbank's exact segment **this
  quarter**, and Fernbank's launch commitment to its anchor lending partner
  assumes a live onboarding path by then. Time-to-market is a binding
  constraint, not a nice-to-have.
- Fernbank's engineering team has **no in-house identity-verification or AML
  expertise** today.
- Sanctions/AML screening in this space requires a **mandatory regulatory
  registration** that takes significant time and specialized expertise to
  obtain and maintain.

## Deliverables
`decision.md` must:

- Evaluate all three options, with at least one concrete pro and one concrete
  con for each, drawn from the facts above.
- Explicitly name time-to-market and the non-differentiating/table-stakes
  nature of the capability as decision factors.
- Make exactly **one** unambiguous recommendation — not a hedge, not "it
  depends."
- Ensure the recommendation is consistent with the binding constraints: it
  cannot recommend building in-house while also conceding that time-to-market
  is binding and the team lacks identity/AML expertise.

## Constraints

- You may cite a rough 3-year cost comparison if useful, but the recommendation
  must rest on the strategic constraints above, not on headcount cost alone.
- At most 600 words (whole file, `wc -w`).
