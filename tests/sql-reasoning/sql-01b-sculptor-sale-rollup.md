---
id: sql-01b-sculptor-sale-rollup
category: sql-reasoning
title: Sale rollup across sculptors with and without sales
deliverables:
  - QUERIES.sql
  - ANSWERS.md
---

## Task

You are given a small two-table schema: `sculptor` and `sale`,
embedded below as `CREATE TABLE` + `INSERT` statements. Two sculptors
have made zero sales. Write SQL against this exact schema and report
the exact result set for each of the following four questions:

1. The total number of sculptors.
2. The number of sculptors who have made at least one sale.
3. The per-sculptor sale count, as one row per sculptor (all 5
   sculptors must appear, including the two with zero sales, showing
   a count of `0` for them — not omitted, not `NULL`).
4. The per-sculptor total revenue (sum of sale prices), as one row per
   sculptor (all 5 sculptors must appear; sculptors with zero sales
   must show `0`, not `NULL`).

## Embedded dataset

```sql
CREATE TABLE sculptor (
  id INTEGER PRIMARY KEY,
  name TEXT,
  studio TEXT
);

CREATE TABLE sale (
  id INTEGER PRIMARY KEY,
  sculptor_id INTEGER,
  price INTEGER
);

INSERT INTO sculptor (id, name, studio) VALUES
  (1, 'Rhea', 'Harbor'),
  (2, 'Tovi', 'Harbor'),
  (3, 'Yuki', 'Ridge'),
  (4, 'Mira', 'Ridge'),
  (5, 'Kato', 'Delta');

INSERT INTO sale (id, sculptor_id, price) VALUES
  (201, 3, 700),
  (202, 3, 700),
  (203, 1, 450),
  (204, 1, 250),
  (205, 1, 250),
  (206, 1, 300),
  (207, 5, 600),
  (208, 5, 150);
```

## Deliverables

- `QUERIES.sql` — the SQL statements answering each of the four
  questions above, runnable as-is against the embedded schema (include
  the `CREATE TABLE`/`INSERT` statements or assume they are already
  loaded — either is fine, but the SELECT queries must be clearly
  labeled per question).
- `ANSWERS.md` — each query's exact result set, presented as a table,
  in the order the four questions are listed above.

## Constraints

- Standard SQL (SQLite dialect is fine; avoid vendor-specific
  functions that SQLite does not support).
- Zero-sale sculptors must be present in questions 3 and 4 with a
  count/revenue of exactly `0` — do not drop them and do not leave the
  cell blank or `NULL`.
