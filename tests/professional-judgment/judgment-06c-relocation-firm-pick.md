---
id: judgment-06c-relocation-firm-pick
category: professional-judgment
title: "Pick one relocation firm from a weighted scoring matrix"
deliverables:
  - recommendation.md
---

## Task

You are the facilities director at a mid-size firm choosing among three
fictional commercial office-relocation companies for an upcoming
headquarters move: Thistlecombe, Brackenvale, and Stonecroft. Read the
scoring matrix and the binding weight vector below, then recommend
exactly one company.

**Scoring matrix (each criterion scored 0-10, higher is better):**

| Company | On-Time Rate | Budget Fit | Damage-Free Rate | Claims Support |
|---|---|---|---|---|
| Thistlecombe | 9 | 5 | 5 | 6 |
| Brackenvale | 3 | 8 | 8 | 7 |
| Stonecroft | 6 | 6 | 6 | 5 |

**Binding weight vector (use these weights, not a simple average):**

> On-Time Rate: 0.35
> Budget Fit: 0.30
> Damage-Free Rate: 0.20
> Claims Support: 0.15

Compute each company's weighted total score (sum of criterion score x
its weight) and base your recommendation on the weighted totals.

## Deliverables

- `recommendation.md` — a memo recommending exactly one company, at
  most 400 words.

## Constraints

- At most 400 words (whole file, `wc -w`).
- Recommend exactly one company; do not decline to choose or recommend
  more than one.
- Base the recommendation on the weighted computation given, not on an
  unweighted average or a simple count of criteria won.
- Explicitly address the tradeoff: name which company wins the most
  individual criteria and explain why that company is not the
  recommendation, if applicable.
