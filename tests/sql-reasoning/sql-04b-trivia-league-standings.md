---
id: sql-04b-trivia-league-standings
category: sql-reasoning
title: Trivia league standings, division leader, and running totals
deliverables:
  - QUERIES.sql
  - ANSWERS.md
---

## Task

You are given a `standings` table (embedded below): 7 rows of teams in
two divisions, with tied scores. Write SQL against this exact schema
using window functions and report the exact result set for each of the
following:

1. The global ranking of all 7 rows by `score` descending, showing
   `RANK()`, `DENSE_RANK()`, and `ROW_NUMBER()` side by side as three
   separate columns in the same result set (also include `team` and
   `score` so the ranks are legible).
2. The single division leader — exactly one row per division — using
   `PARTITION BY division`, with ties broken by **lowest `id`**.
3. All teams who tie at their division's maximum score (i.e. every team
   whose score equals the max for their division, not just one of
   them).
4. The running (cumulative) point total per team, ordered by
   `game_date`, as one row per (team, date) showing the running total
   after that date's game.

## Embedded dataset

```sql
CREATE TABLE standings (
  id INTEGER PRIMARY KEY,
  team TEXT,
  division TEXT,
  score INTEGER,
  game_date TEXT
);

INSERT INTO standings (id, team, division, score, game_date) VALUES
  (1, 'Wildcats', 'Crimson', 48, '2024-03-04'),
  (2, 'Wildcats', 'Crimson', 65, '2024-03-11'),
  (3, 'Foxes', 'Crimson', 65, '2024-03-04'),
  (4, 'Owls', 'Slate', 55, '2024-03-04'),
  (5, 'Owls', 'Slate', 55, '2024-03-11'),
  (6, 'Falcons', 'Slate', 90, '2024-03-04'),
  (7, 'Beavers', 'Slate', 35, '2024-03-04');
```

## Deliverables

- `QUERIES.sql` — the four window-function queries described above,
  clearly labeled.
- `ANSWERS.md` — exact result sets as tables, plus a short explanation
  (a few sentences) of the `RANK` vs `DENSE_RANK` vs `ROW_NUMBER`
  distinction as it applies to the ties in this dataset, how the
  division-leader tie-break was implemented, and what frame/ordering
  produces the running total.

## Constraints

- Standard SQL window-function syntax (SQLite dialect is fine).
- Question 2 must return exactly one row per division — resolve ties
  deterministically by lowest `id`.
- Question 3 must return every tied team, not a single representative.
