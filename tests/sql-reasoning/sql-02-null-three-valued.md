---
id: sql-02-null-three-valued
category: sql-reasoning
title: Non-managers and bonus statistics under NULLs
deliverables:
  - QUERIES.sql
  - ANSWERS.md
---

## Task

You are given an `employee` table (embedded below) where `manager_id`
and `bonus` are both nullable. Write SQL against this exact schema and
report the exact result set for each of the following:

1. The employees who are NOT anyone's manager (i.e. whose `id` never
   appears as someone else's `manager_id`).
2. Bonus statistics in one row: `COUNT(*)` (all employees), `COUNT(bonus)`
   (non-null bonuses only), `SUM(bonus)`, and `AVG(bonus)`.
3. The employees for whom `bonus <> 500` holds.
4. The employees for whom `bonus IS NULL OR bonus <> 500` holds.

Report questions 3 and 4 as two **separate, clearly labeled** tables —
part of the point of this exercise is showing how the result sets
differ.

## Embedded dataset

```sql
CREATE TABLE employee (
  id INTEGER PRIMARY KEY,
  name TEXT,
  manager_id INTEGER,
  dept TEXT,
  bonus INTEGER
);

INSERT INTO employee (id, name, manager_id, dept, bonus) VALUES
  (1, 'Ren', NULL, 'Eng', NULL),
  (2, 'Sol', 1, 'Eng', 500),
  (3, 'Tam', 1, 'Eng', NULL),
  (4, 'Uma', 2, 'Sales', 300),
  (5, 'Vic', 2, 'Sales', NULL),
  (6, 'Wyn', NULL, 'Ops', 700);
```

## Deliverables

- `QUERIES.sql` — SQL for the non-managers question, the bonus
  aggregate row, and BOTH bonus predicates (`bonus <> 500` and
  `bonus IS NULL OR bonus <> 500`), each clearly labeled.
- `ANSWERS.md` — exact result sets as tables, including both
  `bonus <> 500` and `bonus IS NULL OR bonus <> 500` as separate
  labeled tables, plus a short explanation (a few sentences is enough)
  of why the non-managers query needs to account for NULL in the
  `manager_id` column, and why the two bonus predicates produce
  different result sets.

## Constraints

- Standard SQL (SQLite dialect is fine).
- Do not assume `NOT IN` behaves the same whether or not its subquery
  can contain NULL — verify your query against the embedded data
  rather than assuming.
