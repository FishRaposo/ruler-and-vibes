---
id: business-08c-railcar-ton-mile-forecast
category: business-planning
title: Three-scenario freight ton-mile forecast with dominant-driver sensitivity
deliverables:
  - forecast.md
---

## Task

Ironvale Rail needs a full-year freight ton-mile forecast for its board
deck, built from three drivers, plus a sensitivity analysis to tell the
board which driver matters most.

**Model:** Start of year: 550 in-service railcars. Each month, the running
fleet loses `monthly withdrawal %` of its prior-month cars to maintenance
retirement and gains `monthly deliveries` newly commissioned cars.
Ton-miles for a month are `end-of-month cars * (annual ton-miles per car /
12)`. Full-year ton-miles is the sum of all 12 monthly figures. Formally,
for month *m*:

```
cars_m     = cars_(m-1) - cars_(m-1) * withdrawal + deliveries
tonmiles_m = cars_m * (per_car / 12)
```

**Base case:** deliveries = 50/month, withdrawal = 4%/month, per-car =
10,000 ton-miles/year.

**Bands for each driver** (used one at a time for sensitivity, and
together for the pessimistic/optimistic scenarios):

| Driver | Pessimistic | Base | Optimistic |
|---|---|---|---|
| Monthly deliveries | 32 | 50 | 68 |
| Monthly withdrawal | 5.5% | 4% | 2.5% |
| Annual ton-miles per car | 9,000 | 10,000 | 11,000 |

## Deliverable

`forecast.md` must:

- State full-year ton-miles for the **base case**, the **pessimistic
  case** (all three drivers at their pessimistic band value
  simultaneously), and the **optimistic case** (all three drivers at their
  optimistic band value simultaneously).
- Show the month-over-month compounding logic (cars carried forward with
  withdrawal applied and deliveries added each month) — not a shortcut that
  multiplies one month's ton-miles by 12.
- Run a **one-at-a-time sensitivity**: starting from the base case, vary
  each of the three banded drivers individually across its full band
  (holding the other two at base) and report the resulting swing in
  full-year ton-miles for each driver.
- Rank the three drivers by sensitivity swing and name the single dominant
  driver.

## Constraints

- Starting fleet (550) has no pessimistic/optimistic band and is not part
  of the sensitivity ranking.
- At most 550 words (whole file, `wc -w`).
