---
id: business-08-forecast-sensitivity
category: business-planning
title: Three-scenario revenue forecast with dominant-driver sensitivity
deliverables:
  - forecast.md
---

## Task

Ferro Metrics needs a full-year subscription revenue forecast for its
board deck, built from three drivers, plus a sensitivity analysis to tell
the board which driver matters most.

**Model:** Start of year: 500 customers. Each month, the running customer
base loses `monthly churn %` of its prior-month customers and gains
`monthly gross adds`. Revenue for a month is `end-of-month customers *
(annual ARPA / 12)`. Full-year revenue is the sum of all 12 monthly
revenue figures. Formally, for month *m*:

```
customers_m = customers_(m-1) - customers_(m-1) * churn + adds
revenue_m   = customers_m * (ARPA / 12)
```

**Base case:** adds = 40/month, churn = 3%/month, ARPA = 1,200/year.

**Bands for each driver** (used one at a time for sensitivity, and
together for the pessimistic/optimistic scenarios):

| Driver | Pessimistic | Base | Optimistic |
|---|---|---|---|
| Monthly gross adds | 25 | 40 | 55 |
| Monthly churn | 5% | 3% | 2% |
| Annual ARPA | 1,080 | 1,200 | 1,320 |

## Deliverables
`forecast.md` must:

- State full-year revenue for the **base case**, the **pessimistic case**
  (all three drivers at their pessimistic band value simultaneously), and
  the **optimistic case** (all three drivers at their optimistic band
  value simultaneously).
- Show the month-over-month compounding logic (customers carried forward
  with churn applied and adds added each month) — not a shortcut that
  multiplies one month's revenue by 12.
- Run a **one-at-a-time sensitivity**: starting from the base case, vary
  each of the three banded drivers individually across its full band
  (holding the other two at base) and report the resulting swing in
  full-year revenue for each driver.
- Rank the three drivers by sensitivity swing and name the single
  dominant driver.

## Constraints

- Starting customers (500) has no pessimistic/optimistic band and is not
  part of the sensitivity ranking.
- At most 550 words (whole file, `wc -w`).
