---
id: data-07c-filing-season-dip
category: data-analysis
title: Filing-season dip that spooked the partners
deliverables:
  - TREND.md
---

## Task

Meadowvale Tax & Advisory tracks how many individual tax returns it
files each month. The firm's office manager just saw May's count land
far below April's and sent this note to the partners:

> "Filings cratered 40% from April to May — the practice is shrinking.
> We need to freeze hiring and trim costs now."

Below is 25 months of monthly returns filed, May 2024 through May 2026.

`filings.csv`:

```csv
month,returns_filed
2024-05,372
2024-06,378
2024-07,384
2024-08,390
2024-09,396
2024-10,402
2024-11,408
2024-12,414
2025-01,420
2025-02,426
2025-03,434
2025-04,722
2025-05,424
2025-06,430
2025-07,437
2025-08,443
2025-09,450
2025-10,456
2025-11,463
2025-12,470
2026-01,477
2026-02,484
2026-03,495
2026-04,810
2026-05,484
```

## Deliverables

- `TREND.md` (max 500 words) containing exactly these sections, in
  order:
  - `## Month-over-month` — the Apr-2026 to May-2026 change, with
    arithmetic shown.
  - `## Year-over-year` — the May-2026 vs May-2025 change, with
    arithmetic shown.
  - `## Is this a pattern?` — check whether the same Apr-to-May drop
    happened in the prior year transition, with arithmetic shown, and
    say what that implies.
  - `## Verdict` — accept or reject the note's "shrinking, freeze
    hiring and trim costs" recommendation, and why.

## Constraints

- At most 500 words total (`wc -w` on the whole file).
- Every percentage must be computed from the CSV on this page and the
  formula shown, not just asserted.
