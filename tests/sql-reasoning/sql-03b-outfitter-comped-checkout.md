---
id: sql-03b-outfitter-comped-checkout
category: sql-reasoning
title: Craft revenue with comp exclusion and universal quantifier
deliverables:
  - QUERIES.sql
  - ANSWERS.md
---

## Task

You are given a `checkout` table (embedded below) recording gear
checkouts at a river outfitter, with 9 checkout records across 3 craft
types. Some checkouts are flagged `comped = 1` (a comped checkout is a
complimentary loan — e.g. a staff demo or a goodwill replacement — and
generates no revenue). Write SQL against this exact schema and report
the exact result set for:

1. Revenue per craft type — `SUM(hours * rate)` — **excluding** comped
   checkouts, showing only craft types whose (non-comped) revenue
   exceeds 90, ordered by revenue descending.
2. The craft types in which **every** checkout has `hours >= 3` (i.e.
   there is no checkout of that craft type with `hours < 3`).

## Embedded dataset

```sql
CREATE TABLE checkout (
  id INTEGER PRIMARY KEY,
  gear TEXT,
  craft TEXT,
  hours INTEGER,
  rate INTEGER,
  comped INTEGER
);

INSERT INTO checkout (id, gear, craft, hours, rate, comped) VALUES
  (1, 'Emerald Kayak', 'Kayak', 4, 17, 0),
  (2, 'Fjord Kayak', 'Kayak', 2, 13, 1),
  (3, 'Summit Kayak', 'Kayak', 6, 22, 0),
  (4, 'Basin Kayak', 'Kayak', 3, 18, 0),
  (5, 'Driftwood Canoe', 'Canoe', 7, 11, 0),
  (6, 'Cedar Canoe', 'Canoe', 5, 9, 1),
  (7, 'Portage Canoe', 'Canoe', 2, 38, 0),
  (8, 'Glide Paddleboard', 'Paddleboard', 75, 1, 0),
  (9, 'Trail Paddleboard', 'Paddleboard', 4, 9, 0);
```

## Deliverables

- `QUERIES.sql` — the two queries described above, clearly labeled.
- `ANSWERS.md` — exact result sets as tables, plus a short explanation
  (a few sentences) of why the comp exclusion must be applied per-row
  before aggregation rather than as a post-aggregation filter, and why
  "every checkout has hours >= 3" cannot be expressed as a simple
  per-row filter on `hours`.

## Constraints

- Standard SQL (SQLite dialect is fine).
- Comped checkouts must be excluded from the revenue computation
  itself (not merely from the display) — the aggregate values must
  reflect only non-comped rows.
