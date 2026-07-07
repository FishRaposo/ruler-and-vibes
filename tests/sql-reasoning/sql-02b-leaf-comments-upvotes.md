---
id: sql-02b-leaf-comments-upvotes
category: sql-reasoning
title: Leaf comments and upvote statistics under NULLs
deliverables:
  - QUERIES.sql
  - ANSWERS.md
---

## Task

You are given a `comment` table (embedded below) where `parent_comment_id`
and `upvotes` are both nullable. Write SQL against this exact schema and
report the exact result set for each of the following:

1. The comments that have NOT been replied to by any other comment (i.e.
   whose `id` never appears as another comment's `parent_comment_id`).
2. Upvote statistics in one row: `COUNT(*)` (all comments), `COUNT(upvotes)`
   (non-null upvote counts only), `SUM(upvotes)`, and `AVG(upvotes)`.
3. The comments for which `upvotes <> 40` holds.
4. The comments for which `upvotes IS NULL OR upvotes <> 40` holds.

Report questions 3 and 4 as two **separate, clearly labeled** tables —
part of the point of this exercise is showing how the result sets
differ.

## Embedded dataset

```sql
CREATE TABLE comment (
  id INTEGER PRIMARY KEY,
  author TEXT,
  parent_comment_id INTEGER,
  board TEXT,
  upvotes INTEGER
);

INSERT INTO comment (id, author, parent_comment_id, board, upvotes) VALUES
  (1, 'pixelfox',   NULL, 'space',    NULL),
  (2, 'driftbyte',  1,    'space',    20),
  (3, 'vaultmoth',  1,    'space',    NULL),
  (4, 'cinderloop', 2,    'tabletop', 60),
  (5, 'glasswren',  2,    'tabletop', NULL),
  (6, 'hexbloom',   NULL, 'synth',    40),
  (7, 'tidalspur',  2,    'tabletop', 40);
```

## Deliverables

- `QUERIES.sql` — SQL for the never-replied-to question, the upvote
  aggregate row, and BOTH upvote predicates (`upvotes <> 40` and
  `upvotes IS NULL OR upvotes <> 40`), each clearly labeled.
- `ANSWERS.md` — exact result sets as tables, including both
  `upvotes <> 40` and `upvotes IS NULL OR upvotes <> 40` as separate
  labeled tables, plus a short explanation (a few sentences is enough)
  of why the never-replied-to query needs to account for NULL in the
  `parent_comment_id` column, and why the two upvote predicates
  produce different result sets.

## Constraints

- Standard SQL (SQLite dialect is fine).
- Do not assume `NOT IN` behaves the same whether or not its subquery
  can contain NULL — verify your query against the embedded data
  rather than assuming.
