---
id: sql-03-group-having-filter
category: sql-reasoning
title: Category revenue with refund exclusion and universal quantifier
deliverables:
  - QUERIES.sql
  - ANSWERS.md
---

## Task

You are given a `sale` table (embedded below) with 9 line items across
3 categories; some line items are flagged `refunded = 1`. Write SQL
against this exact schema and report the exact result set for:

1. Revenue per category — `SUM(qty * unit_price)` — **excluding**
   refunded line items, showing only categories whose (non-refunded)
   revenue exceeds 60, ordered by revenue descending.
2. The categories in which **every** line item has `qty >= 3` (i.e.
   there is no line item in that category with `qty < 3`).

## Embedded dataset

```sql
CREATE TABLE sale (
  id INTEGER PRIMARY KEY,
  product TEXT,
  category TEXT,
  qty INTEGER,
  unit_price INTEGER,
  refunded INTEGER
);

INSERT INTO sale (id, product, category, qty, unit_price, refunded) VALUES
  (1, 'Widget', 'Hardware', 3, 10, 0),
  (2, 'Widget', 'Hardware', 2, 10, 1),
  (3, 'Gadget', 'Hardware', 5, 20, 0),
  (4, 'Gadget', 'Hardware', 2, 20, 0),
  (5, 'Manual', 'Media', 10, 5, 0),
  (6, 'Manual', 'Media', 4, 5, 1),
  (7, 'Course', 'Media', 2, 50, 0),
  (8, 'Sticker', 'Swag', 100, 1, 0),
  (9, 'Pin', 'Swag', 3, 2, 0);
```

## Deliverables

- `QUERIES.sql` — the two queries described above, clearly labeled.
- `ANSWERS.md` — exact result sets as tables, plus a short explanation
  (a few sentences) of why the refund exclusion must be applied
  per-row before aggregation rather than as a post-aggregation filter,
  and why "every line item has qty >= 3" cannot be expressed as a
  simple per-row filter on `qty`.

## Constraints

- Standard SQL (SQLite dialect is fine).
- Refunded line items must be excluded from the revenue computation
  itself (not merely from the display) — the aggregate values must
  reflect only non-refunded rows.
