---
id: business-08b-vineyard-graft-sensitivity
category: business-planning
title: Three-scenario vine-revenue forecast with dominant-driver sensitivity
deliverables:
  - forecast.md
---

## Task

Marrowdale Estate needs a full-year projection of revenue from its
productive grapevines for its investor letter, built from three drivers,
plus a sensitivity analysis to tell the partners which driver matters
most.

**Model:** Start of year: 800 productive vines. Each month, the running
stock loses `monthly dieback %` of its prior-month vines and gains
`monthly new grafts`. Revenue for a month is `end-of-month vines *
(annual yield per vine / 12)`. Full-year revenue is the sum of all 12
monthly revenue figures. Formally, for month *m*:

```
vines_m   = vines_(m-1) - vines_(m-1) * dieback + grafts
revenue_m = vines_m * (yield / 12)
```

**Base case:** grafts = 60/month, dieback = 4%/month, yield = 900/vine/year.

**Bands for each driver** (used one at a time for sensitivity, and
together for the lean/rich scenarios):

| Driver | Lean | Base | Rich |
|---|---|---|---|
| Monthly new grafts | 30 | 60 | 90 |
| Monthly dieback | 6.5% | 4% | 2.5% |
| Annual yield per vine | 810 | 900 | 1,035 |

## Deliverables
`forecast.md` must:

- State full-year revenue for the **base case**, the **lean case**
  (all three drivers at their lean band value simultaneously), and the
  **rich case** (all three drivers at their rich band value
  simultaneously).
- Show the month-over-month compounding logic (vines carried forward with
  dieback applied and grafts added each month) — not a shortcut that
  multiplies one month's revenue by 12.
- Run a **one-at-a-time sensitivity**: starting from the base case, vary
  each of the three banded drivers individually across its full band
  (holding the other two at base) and report the resulting swing in
  full-year revenue for each driver.
- Rank the three drivers by sensitivity swing and name the single
  dominant driver.

## Constraints

- Starting vines (800) has no lean/rich band and is not part of the
  sensitivity ranking.
- At most 550 words (whole file, `wc -w`).
