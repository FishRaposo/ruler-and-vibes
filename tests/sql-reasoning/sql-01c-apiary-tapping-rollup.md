---
id: sql-01c-apiary-tapping-rollup
category: sql-reasoning
title: Tapping rollup across apiaries with and without harvests
deliverables:
  - QUERIES.sql
  - ANSWERS.md
---

## Task

You are given a small two-table schema: `apiary` (a beekeeping site) and
`tapping` (a honey-extraction event), embedded below as `CREATE TABLE` +
`INSERT` statements. Two apiaries have recorded zero tappings. Write SQL
against this exact schema and report the exact result set for each of the
following four questions:

1. The total number of apiaries.
2. The number of apiaries that have at least one recorded tapping.
3. The per-apiary tapping count, as one row per apiary (all 5 apiaries
   must appear, including the two with zero tappings, showing a count of
   `0` for them — not omitted, not `NULL`).
4. The per-apiary total jars collected (sum of `jars` across tappings),
   as one row per apiary (all 5 apiaries must appear; zero-tapping
   apiaries must show `0`, not `NULL`).

## Embedded dataset

```sql
CREATE TABLE apiary (
  id INTEGER PRIMARY KEY,
  name TEXT,
  county TEXT
);

CREATE TABLE tapping (
  id INTEGER PRIMARY KEY,
  apiary_id INTEGER,
  jars INTEGER
);

INSERT INTO apiary (id, name, county) VALUES
  (1, 'Alder', 'Kestrel'),
  (2, 'Brier', 'Kestrel'),
  (3, 'Clover', 'Marrow'),
  (4, 'Dornick', 'Marrow'),
  (5, 'Ewell', 'Vane');

INSERT INTO tapping (id, apiary_id, jars) VALUES
  (201, 1, 15),
  (202, 1, 15),
  (203, 1, 22),
  (204, 3, 40),
  (205, 3, 8),
  (206, 4, 9),
  (207, 4, 9),
  (208, 4, 9),
  (209, 4, 27);
```

## Deliverables

- `QUERIES.sql` — the SQL statements answering each of the four questions
  above, runnable as-is against the embedded schema (include the
  `CREATE TABLE`/`INSERT` statements or assume they are already loaded —
  either is fine, but the SELECT queries must be clearly labeled per
  question).
- `ANSWERS.md` — each query's exact result set, presented as a table, in
  the order the four questions are listed above.

## Constraints

- Standard SQL (SQLite dialect is fine; avoid vendor-specific functions
  that SQLite does not support).
- Zero-tapping apiaries must be present in questions 3 and 4 with a
  count/total of exactly `0` — do not drop them and do not leave the cell
  blank or `NULL`.
