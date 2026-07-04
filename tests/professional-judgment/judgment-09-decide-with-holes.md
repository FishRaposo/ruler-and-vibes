---
id: judgment-09-decide-with-holes
category: professional-judgment
title: "Recommend an action under contradictory and incomplete data"
deliverables:
  - decision-memo.md
---

## Task

You advise Corrigan Hardware, a fictional manufacturer, on whether to
ship a hardware batch by a hard customer deadline this Friday, or hold
it for re-testing. Read the three inputs and the cost data below, then
recommend ship or hold.

**QA sample report:**

> A random sample of 40 units from the batch was tested. 1 unit failed
> (approximately 2.5% of the sample). No further sampling has been
> done.

**Supplier certificate:**

> The component supplier certifies that this production run passed
> their internal spec testing before shipment to us.

**Field-support return note:**

> Two units have been returned by customers this month citing a
> failure mode consistent with this batch's component. However, the
> batch IDs of both returned units were never recorded at intake, so
> we cannot confirm whether either return actually came from this
> batch or from a different, unrelated batch.

**Cost data:**

> - Shipping now and the batch turning out defective: estimated
>   $140,000 in warranty/replacement/reputational cost.
> - Holding for full re-testing: guarantees missing Friday's deadline,
>   estimated $120,000 in penalty and expedite costs, plus strain on
>   the customer relationship.

## Deliverables

- `decision-memo.md` — a memo recommending ship or hold, at most 400
  words.

## Constraints

- At most 400 words (whole file, `wc -w`).
- Commit to a single recommendation: ship or hold.
- Do not treat the 40-unit sample's 2.5% observed rate as an
  established or precise batch failure rate.
- Name the specific missing fact that would most change the decision.
- Do not invent a specific figure for how many of the two field returns
  came from this batch.
