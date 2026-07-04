---
id: sql-01-join-cardinality
category: sql-reasoning
title: Order rollup across customers with and without orders
deliverables:
  - QUERIES.sql
  - ANSWERS.md
---

## Task

You are given a small two-table schema: `customer` and `ord` (order),
embedded below as `CREATE TABLE` + `INSERT` statements. Two customers
have placed zero orders. Write SQL against this exact schema and
report the exact result set for each of the following four questions:

1. The total number of customers.
2. The number of customers who have placed at least one order.
3. The per-customer order count, as one row per customer (all 5
   customers must appear, including the two with zero orders, showing
   a count of `0` for them — not omitted, not `NULL`).
4. The per-customer total spend (sum of order amounts), as one row per
   customer (all 5 customers must appear; zero-order customers must
   show `0`, not `NULL`).

## Embedded dataset

```sql
CREATE TABLE customer (
  id INTEGER PRIMARY KEY,
  name TEXT,
  region TEXT
);

CREATE TABLE ord (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  amount INTEGER
);

INSERT INTO customer (id, name, region) VALUES
  (1, 'Ash', 'North'),
  (2, 'Bo', 'North'),
  (3, 'Cy', 'South'),
  (4, 'Di', 'South'),
  (5, 'El', 'West');

INSERT INTO ord (id, customer_id, amount) VALUES
  (101, 1, 50),
  (102, 1, 50),
  (103, 1, 30),
  (104, 2, 40),
  (105, 3, 20),
  (106, 3, 20),
  (107, 3, 60);
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
- Zero-order customers must be present in questions 3 and 4 with a
  count/spend of exactly `0` — do not drop them and do not leave the
  cell blank or `NULL`.
