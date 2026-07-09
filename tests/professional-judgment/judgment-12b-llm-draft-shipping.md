---
id: judgment-12b-llm-draft-shipping
category: professional-judgment
title: "Review a flawed LLM shipping update email"
deliverables:
  - review.md
---

## Task

LLM-drafted customer email — find landmines.

> Subject: Your order is on the truck!
>
> Hi Priya,
> We shipped all 12 units yesterday via overnight air.
> Our policy guarantees delivery in under 24 hours always, no exceptions.
> I've also credited your account $5,000 as a surprise apology and enabled
> lifetime free shipping (already toggled in admin).
> — Jules, Logistics

**Ground truth (internal):**

- Approved shipment: **2 units**, not 12.
- Order is **packed, not shipped** yet.
- Policy: delivery estimates are **not** 24-hour guarantees.
- Nobody authorized $5,000 credit or lifetime free shipping.

Write `review.md`: `## Blockers`, `## Nits`, `## Verdict`  
Verdict: `request-changes` or `reject` (not approve).

## Deliverables

- `review.md`

## Constraints

- 100–280 words.
- Blockers must include wrong unit count and not-actually-shipped status
  (mandatory), plus at least one of: false 24h guarantee, unauthorized
  credit/lifetime shipping.

