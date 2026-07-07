---
id: sql-02c-relay-latency-nulls
category: sql-reasoning
title: Leaf devices and latency statistics under NULLs
deliverables:
  - QUERIES.sql
  - ANSWERS.md
---

## Task

You are given a `device` table (embedded below) where `parent_id` and
`latency_ms` are both nullable. Write SQL against this exact schema and
report the exact result set for each of the following:

1. The devices that are leaf nodes — i.e. devices whose `id` never
   appears as another device's `parent_id`.
2. Latency statistics in one row: `COUNT(*)` (all devices), `COUNT(latency_ms)`
   (non-null latencies only), `SUM(latency_ms)`, and `AVG(latency_ms)`.
3. The devices for whom `latency_ms <> 45` holds.
4. The devices for whom `latency_ms IS NULL OR latency_ms <> 45` holds.

Report questions 3 and 4 as two **separate, clearly labeled** tables —
part of the point of this exercise is showing how the result sets
differ.

## Embedded dataset

```sql
CREATE TABLE device (
  id INTEGER PRIMARY KEY,
  hostname TEXT,
  parent_id INTEGER,
  region TEXT,
  latency_ms INTEGER
);

INSERT INTO device (id, hostname, parent_id, region, latency_ms) VALUES
  (1, 'Brask', NULL, 'us-east', NULL),
  (2, 'Tolvane', 1, 'us-east', 45),
  (3, 'Quirren', 1, 'us-east', NULL),
  (4, 'Fenmark', 2, 'eu-west', 20),
  (5, 'Ostrel', 2, 'eu-west', NULL),
  (6, 'Corvent', NULL, 'apac', 115),
  (7, 'Delling', 3, 'apac', 45),
  (8, 'Wrenlow', 7, 'us-west', 30),
  (9, 'Marrow', NULL, 'us-west', 45);
```

## Deliverables

- `QUERIES.sql` — SQL for the leaf-devices question, the latency
  aggregate row, and BOTH latency predicates (`latency_ms <> 45` and
  `latency_ms IS NULL OR latency_ms <> 45`), each clearly labeled.
- `ANSWERS.md` — exact result sets as tables, including both
  `latency_ms <> 45` and `latency_ms IS NULL OR latency_ms <> 45` as
  separate labeled tables, plus a short explanation (a few sentences is
  enough) of why the leaf-devices query needs to account for NULL in
  the `parent_id` column, and why the two latency predicates produce
  different result sets.

## Constraints

- Standard SQL (SQLite dialect is fine).
- Do not assume `NOT IN` behaves the same regardless of whether its
  subquery can contain NULL — verify your query against the embedded
  data rather than assuming.
