---
id: judgment-06b-steel-fabricator-pick
category: professional-judgment
title: "Select one contractor from a weighted scoring matrix"
deliverables:
  - recommendation.md
---

## Task

You are the procurement engineer at a mid-size manufacturing company
choosing among three fictional structural-steel fabrication
contractors for a warehouse expansion project: Galebrook, Ferrowind,
and Marrowstone. Read the scoring matrix and the binding weight vector
below, then recommend exactly one contractor.

**Scoring matrix (each criterion scored 0-10, higher is better):**

| Contractor | Durability | Price | Delivery Speed | Warranty |
|---|---|---|---|---|
| Galebrook | 9 | 5 | 5 | 6 |
| Ferrowind | 4 | 8 | 9 | 8 |
| Marrowstone | 6 | 6 | 6 | 5 |

**Binding weight vector (use these weights, not a simple average):**

> Durability: 0.45
> Price: 0.25
> Delivery Speed: 0.20
> Warranty: 0.10

Compute each contractor's weighted total score (sum of criterion score
x its weight) and base your recommendation on the weighted totals.

## Deliverables

- `recommendation.md` — a memo recommending exactly one contractor, at
  most 400 words.

## Constraints

- At most 400 words (whole file, `wc -w`).
- Recommend exactly one contractor; do not decline to choose or
  recommend more than one.
- Base the recommendation on the weighted computation given, not on an
  unweighted average or a simple count of criteria won.
- Explicitly address the tradeoff: name which contractor wins the most
  individual criteria and explain why that contractor is not the
  recommendation, if applicable.
