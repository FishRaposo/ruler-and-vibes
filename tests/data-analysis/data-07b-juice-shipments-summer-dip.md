---
id: data-07b-juice-shipments-summer-dip
category: data-analysis
title: Summer-shipment alarm at a juice bottler
deliverables:
  - TREND.md
---

## Task

Brannock & Merriweather is a cold-pressed juice bottler that ships cases
to grocery and cafe accounts. The operations lead just saw August's
shipments land far below July's and sent this memo to the owners:

> "Shipments cratered 40% from July to August — we are in free fall.
> We need to cut spend now."

Below is 25 months of monthly cases shipped, August 2024 through
August 2026.

`shipments.csv`:

```csv
month,cases
2024-08,340
2024-09,348
2024-10,356
2024-11,364
2024-12,372
2025-01,380
2025-02,388
2025-03,396
2025-04,404
2025-05,412
2025-06,420
2025-07,645
2025-08,380
2025-09,396
2025-10,404
2025-11,412
2025-12,420
2026-01,430
2026-02,438
2026-03,446
2026-04,454
2026-05,462
2026-06,470
2026-07,725
2026-08,434
```

## Deliverables

- `TREND.md` (max 500 words) containing exactly these sections, in
  order:
  - `## Month-over-month` — the Jul-2026 to Aug-2026 change, with
    arithmetic shown.
  - `## Year-over-year` — the Aug-2026 vs Aug-2025 change, with
    arithmetic shown.
  - `## Is this a pattern?` — check whether the same Jul-to-Aug drop
    happened in the prior year transition, with arithmetic shown, and
    say what that implies.
  - `## Verdict` — accept or reject the memo's "free fall, cut spend"
    recommendation, and why.

## Constraints

- At most 500 words total (`wc -w` on the whole file).
- Every percentage must be computed from the CSV on this page and the
  formula shown, not just asserted.
