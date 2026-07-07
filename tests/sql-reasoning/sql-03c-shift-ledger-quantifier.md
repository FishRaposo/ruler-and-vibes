---
id: sql-03c-shift-ledger-quantifier
category: sql-reasoning
title: Volunteer shift value with cancellation exclusion and universal quantifier
deliverables:
  - QUERIES.sql
  - ANSWERS.md
---

## Task

You are given a `shift` table (embedded below) recording volunteer shifts
at a community nonprofit, with 9 shift records across 3 programs. Some
shifts are flagged `cancelled = 1` (a cancelled shift was scheduled but
never worked, and contributes no service value). Write SQL against this
exact schema and report the exact result set for:

1. Service value per program — `SUM(hours * valuation_rate)` —
   **excluding** cancelled shifts, showing only programs whose
   (non-cancelled) value exceeds 100, ordered by value descending.
2. The programs in which **every** shift has `hours >= 4` (i.e. there is
   no shift in that program with `hours < 4`).

## Embedded dataset

```sql
CREATE TABLE shift (
  id INTEGER PRIMARY KEY,
  volunteer TEXT,
  program TEXT,
  hours INTEGER,
  valuation_rate INTEGER,
  cancelled INTEGER
);

INSERT INTO shift (id, volunteer, program, hours, valuation_rate, cancelled) VALUES
  (1, 'Reza', 'Cedarbrook', 4, 12, 0),
  (2, 'Reza', 'Cedarbrook', 3, 12, 1),
  (3, 'Nadia', 'Cedarbrook', 6, 15, 0),
  (4, 'Nadia', 'Cedarbrook', 2, 15, 0),
  (5, 'Owen', 'Fernglen', 8, 6, 0),
  (6, 'Owen', 'Fernglen', 5, 6, 1),
  (7, 'Sasha', 'Fernglen', 3, 25, 0),
  (8, 'Farah', 'Lanternwood', 20, 4, 0),
  (9, 'Milo', 'Lanternwood', 5, 6, 0);
```

## Deliverables

- `QUERIES.sql` — the two queries described above, clearly labeled.
- `ANSWERS.md` — exact result sets as tables, plus a short explanation
  (a few sentences) of why the cancellation exclusion must be applied
  per-row before aggregation rather than as a post-aggregation filter,
  and why "every shift has hours >= 4" cannot be expressed as a simple
  per-row filter on `hours`.

## Constraints

- Standard SQL (SQLite dialect is fine).
- Cancelled shifts must be excluded from the value computation itself
  (not merely from the display) — the aggregate values must reflect
  only non-cancelled rows.
