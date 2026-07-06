---
id: business-06b-subscription-cohort-dump
category: business-planning
title: Subscription unit economics from a raw cohort dump
deliverables:
  - unit-economics.md
---

## Task

You are handed the following unsorted notes from last quarter's growth
review for Caskwell, a direct-to-consumer specialty coffee subscription.
Reconstruct the unit economics from this dump.

- Paid acquisition spend (social + search ads) for the quarter: 30,000.
- Referral commissions paid out for the quarter: 24,000. These are paid
  per confirmed new subscriber.
- A one-time packaging rebrand: 8,000. This was a production redesign
  applied to **every** shipment that went out; it was **not** an
  acquisition channel and no signups were attributed to it.
- New subscribers acquired this quarter: 50.
- Average revenue per subscriber: 80/month.
- Gross margin: 75%.
- Monthly subscriber churn: 5.5%.

## Deliverable

`unit-economics.md` must compute and state, with the arithmetic shown:

- **CAC** (customer acquisition cost per new subscriber).
- **LTV** (subscriber lifetime value), using gross margin and the
  churn-derived average subscriber lifetime.
- **LTV:CAC ratio.**
- **CAC payback period**, in months.
- A one-paragraph verdict on whether these unit economics are healthy.

## Constraints

- Decide explicitly whether the packaging-rebrand cost belongs in the
  CAC calculation, and state your reasoning.
- Use gross margin (not gross revenue) wherever a margin-adjusted figure
  is called for.
- At most 450 words (whole file, `wc -w`).
