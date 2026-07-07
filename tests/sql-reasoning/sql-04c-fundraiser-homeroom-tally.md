---
id: sql-04c-fundraiser-homeroom-tally
category: sql-reasoning
title: Fundraiser sales ranking, per-homeroom top seller, and running totals
deliverables:
  - QUERIES.sql
  - ANSWERS.md
---

## Task

You are given a `fundraiser_sales` table (embedded below): 7 rows of
students in two homerooms, with tied sale amounts. Write SQL against
this exact schema using window functions and report the exact result
set for each of the following:

1. The global ranking of all 7 rows by `amount_usd` descending, showing
   `RANK()`, `DENSE_RANK()`, and `ROW_NUMBER()` side by side as three
   separate columns in the same result set (also include `seller` and
   `amount_usd` so the ranks are legible).
2. The single top seller per homeroom — exactly one row per homeroom —
   using `PARTITION BY homeroom`, with ties broken by **lowest `id`**.
3. All students who tie at their homeroom's maximum sale amount (i.e.
   every student whose amount equals the max for their homeroom, not
   just one of them).
4. The running (cumulative) amount raised per student, ordered by
   `sold_on`, as one row per (student, date) showing the running total
   after that date's sale.

## Embedded dataset

```sql
CREATE TABLE fundraiser_sales (
  id INTEGER PRIMARY KEY,
  seller TEXT,
  homeroom TEXT,
  amount_usd INTEGER,
  sold_on TEXT
);

INSERT INTO fundraiser_sales (id, seller, homeroom, amount_usd, sold_on) VALUES
  (1, 'Kiran', 'Room 214', 46, '2025-09-08'),
  (2, 'Kiran', 'Room 214', 74, '2025-09-09'),
  (3, 'Dax', 'Room 214', 74, '2025-09-08'),
  (4, 'Marisol', 'Room 118', 58, '2025-09-08'),
  (5, 'Marisol', 'Room 118', 58, '2025-09-09'),
  (6, 'Anders', 'Room 118', 99, '2025-09-08'),
  (7, 'Yara', 'Room 118', 21, '2025-09-08');
```

## Deliverables

- `QUERIES.sql` — the four window-function queries described above,
  clearly labeled.
- `ANSWERS.md` — exact result sets as tables, plus a short explanation
  (a few sentences) of the `RANK` vs `DENSE_RANK` vs `ROW_NUMBER`
  distinction as it applies to the ties in this dataset, how the
  per-homeroom top-seller tie-break was implemented, and what frame/
  ordering produces the running total.

## Constraints

- Standard SQL window-function syntax (SQLite dialect is fine).
- Question 2 must return exactly one row per homeroom — resolve ties
  deterministically by lowest `id`.
- Question 3 must return every tied student, not a single representative.
