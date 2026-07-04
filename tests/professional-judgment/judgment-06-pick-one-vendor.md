---
id: judgment-06-pick-one-vendor
category: professional-judgment
title: "Choose one vendor from a weighted multi-criteria matrix"
deliverables:
  - recommendation.md
---

## Task

You are the procurement lead at a mid-size firm choosing among three
fictional vendors for a platform contract: Aldermarsh, Brightfen, and
Corvane. Read the scoring matrix and the binding weight vector below,
then recommend exactly one vendor.

**Scoring matrix (each criterion scored 0-10, higher is better):**

| Vendor | Reliability | Cost | Integration | Support |
|---|---|---|---|---|
| Aldermarsh | 10 | 6 | 6 | 6 |
| Brightfen | 5 | 9 | 8 | 9 |
| Corvane | 7 | 7 | 7 | 5 |

**Binding weight vector (use these weights, not a simple average):**

> Reliability: 0.40
> Cost: 0.30
> Integration: 0.20
> Support: 0.10

Compute each vendor's weighted total score (sum of criterion score x
its weight) and base your recommendation on the weighted totals.

## Deliverables

- `recommendation.md` — a memo recommending exactly one vendor, at
  most 400 words.

## Constraints

- At most 400 words (whole file, `wc -w`).
- Recommend exactly one vendor; do not decline to choose or recommend
  more than one.
- Base the recommendation on the weighted computation given, not on an
  unweighted average or a simple count of criteria won.
- Explicitly address the tradeoff: name which vendor wins the most
  individual criteria and explain why that vendor is not the
  recommendation, if applicable.
