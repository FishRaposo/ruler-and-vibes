---
id: sql-04-window-rank-frames
category: sql-reasoning
title: Leaderboard ranking, per-region top scorer, and running totals
deliverables:
  - QUERIES.sql
  - ANSWERS.md
---

## Task

You are given a `score` table (embedded below): 7 rows of players in
two regions, with tied point values. Write SQL against this exact
schema using window functions and report the exact result set for
each of the following:

1. The global ranking of all 7 rows by `points` descending, showing
   `RANK()`, `DENSE_RANK()`, and `ROW_NUMBER()` side by side as three
   separate columns in the same result set (also include `player` and
   `points` so the ranks are legible).
2. The single top scorer per region — exactly one row per region —
   using `PARTITION BY region`, with ties broken by **lowest `id`**.
3. All players who tie at their region's maximum score (i.e. every
   player whose score equals the max for their region, not just one of
   them).
4. The running (cumulative) point total per player, ordered by
   `played_on`, as one row per (player, date) showing the running
   total after that date's game.

## Embedded dataset

```sql
CREATE TABLE score (
  id INTEGER PRIMARY KEY,
  player TEXT,
  region TEXT,
  points INTEGER,
  played_on TEXT
);

INSERT INTO score (id, player, region, points, played_on) VALUES
  (1, 'Ada', 'North', 30, '2020-01-01'),
  (2, 'Ada', 'North', 50, '2020-01-02'),
  (3, 'Ben', 'North', 50, '2020-01-01'),
  (4, 'Cal', 'South', 40, '2020-01-01'),
  (5, 'Cal', 'South', 40, '2020-01-02'),
  (6, 'Dot', 'South', 70, '2020-01-01'),
  (7, 'Eve', 'South', 20, '2020-01-01');
```

## Deliverables

- `QUERIES.sql` — the four window-function queries described above,
  clearly labeled.
- `ANSWERS.md` — exact result sets as tables, plus a short explanation
  (a few sentences) of the `RANK` vs `DENSE_RANK` vs `ROW_NUMBER`
  distinction as it applies to the ties in this dataset, how the
  per-region top-scorer tie-break was implemented, and what frame/
  ordering produces the running total.

## Constraints

- Standard SQL window-function syntax (SQLite dialect is fine).
- Question 2 must return exactly one row per region — resolve ties
  deterministically by lowest `id`.
- Question 3 must return every tied player, not a single representative.
