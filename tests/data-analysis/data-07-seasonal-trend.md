---
id: data-07-seasonal-trend
category: data-analysis
title: Seasonal panic over a January dip
deliverables:
  - TREND.md
---

## Task

A subscription-box company's finance lead just saw January's revenue
land far below December's and sent this memo to the founders:

> "Revenue crashed 40% from December to January — we are in free
> fall. We need to cut spend now."

Below is 25 months of monthly revenue ($K), January 2024 through
January 2026.

`revenue.csv`:

```csv
month,revenue
2024-01,100
2024-02,102
2024-03,104
2024-04,106
2024-05,108
2024-06,110
2024-07,112
2024-08,114
2024-09,116
2024-10,118
2024-11,120
2024-12,190
2025-01,112
2025-02,114
2025-03,117
2025-04,119
2025-05,121
2025-06,123
2025-07,125
2025-08,128
2025-09,130
2025-10,132
2025-11,135
2025-12,214
2026-01,128
```

## Deliverables

- `TREND.md` (max 500 words) containing exactly these sections, in
  order:
  - `## Month-over-month` — the Dec-2025 to Jan-2026 change, with
    arithmetic shown.
  - `## Year-over-year` — the Jan-2026 vs Jan-2025 change, with
    arithmetic shown.
  - `## Is this a pattern?` — check whether the same Dec-to-Jan drop
    happened in the prior year transition, with arithmetic shown, and
    say what that implies.
  - `## Verdict` — accept or reject the memo's "free fall, cut spend"
    recommendation, and why.

## Constraints

- At most 500 words total (`wc -w` on the whole file).
- Every percentage must be computed from the CSV on this page and the
  formula shown, not just asserted.
