---
test: sql-01b-sculptor-sale-rollup
canary: "plover chub"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ANSWERS.md reports exactly 5 total sculptors and 3 sculptors with at least one sale (COUNT(DISTINCT sculptor_id)); a submission answering 5/5 or 5/8 fails"
    - id: obj-2
      check: "Per-sculptor sale counts are exactly Rhea=4, Tovi=0, Yuki=2, Mira=0, Kato=2, with Tovi and Mira present showing 0 (not omitted and not 1); judge re-runs the submission's query in node:sqlite and matches the full 5-row set"
    - id: obj-3
      check: "Per-sculptor total revenue is exactly Rhea=1250, Yuki=1400, Kato=750, Tovi=0, Mira=0, with zero-sale sculptors showing 0 (not NULL, not absent); judge re-runs in node:sqlite"
    - id: obj-4
      check: "The sale-count query (QUERIES.sql) uses a LEFT (or equivalent outer) JOIN and COUNT(s.id) / COALESCE rather than INNER JOIN or a bare COUNT(*) over the join, so that zero-sale sculptors are structurally retained with count 0 — judge inspects the SQL text as well as re-executing it"
  subjective:
    - id: sub-quality
      name: "Correctness of join choice and null-safe counting"
      weight: 0.4
    - id: sub-craft
      name: "SQL readability and result-set presentation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `sql-01-join-cardinality` (same construct, fresh surface).

- This is a SQL-over-embedded-data test. Verify every result set by
  actually executing the submission's `QUERIES.sql` against the
  embedded schema with node's built-in `node:sqlite` module
  (`DatabaseSync`), not by eyeballing the SQL. Node v24+ ships
  `node:sqlite` without a flag; if your node build still gates it,
  run with `node --experimental-sqlite`. Minimal harness:

  ```js
  const { DatabaseSync } = require('node:sqlite');
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE sculptor (id INTEGER PRIMARY KEY, name TEXT, studio TEXT);
    CREATE TABLE sale (id INTEGER PRIMARY KEY, sculptor_id INTEGER, price INTEGER);
    INSERT INTO sculptor (id, name, studio) VALUES
      (1,'Rhea','Harbor'),(2,'Tovi','Harbor'),(3,'Yuki','Ridge'),(4,'Mira','Ridge'),(5,'Kato','Delta');
    INSERT INTO sale (id, sculptor_id, price) VALUES
      (201,3,700),(202,3,700),(203,1,450),(204,1,250),(205,1,250),(206,1,300),(207,5,600),(208,5,150);
  `);
  // paste each of the submission's SELECT statements here and .all() them
  ```

- Pinned expected result sets, recomputed independently in
  `node:sqlite` (v24.16.0) for this rubric:
  - Total sculptors: `[{"total":5}]`
  - Sculptors with >=1 sale (`COUNT(DISTINCT sculptor_id)`): `[{"n":3}]`
  - Per-sculptor sale count (LEFT JOIN + COUNT(s.id), GROUP BY c.id ORDER BY c.id):
    `[{"name":"Rhea","sale_count":4},{"name":"Tovi","sale_count":0},{"name":"Yuki","sale_count":2},{"name":"Mira","sale_count":0},{"name":"Kato","sale_count":2}]`
  - Per-sculptor total revenue (LEFT JOIN + COALESCE(SUM(price),0)):
    `[{"name":"Rhea","total_revenue":1250},{"name":"Tovi","total_revenue":0},{"name":"Yuki","total_revenue":1400},{"name":"Mira","total_revenue":0},{"name":"Kato","total_revenue":750}]`
- Trap collision check (confirmed by re-running both wrong forms):
  INNER JOIN instead of LEFT JOIN drops Tovi and Mira entirely (only 3
  rows returned, row count 8 total across the whole INNER JOIN);
  COUNT(*) over a LEFT JOIN (instead of COUNT(s.id)) reports Tovi=1 and
  Mira=1 instead of 0; omitting COALESCE on the SUM gives Tovi and Mira
  `total_revenue: null` instead of `0`. A naive count of sale rows
  (`COUNT(*)` or `COUNT(sculptor_id)` over `sale`) reports 8 instead of
  the correct 3 distinct sculptors for question 2. Any of these
  wrong-path outputs is diagnostic of the trap and should fail the
  corresponding check even if the submission's prose claims otherwise.
- To check obj-4, read the submitted SQL for the sale-count and
  revenue queries: it must be an outer join (`LEFT JOIN` / `LEFT OUTER
  JOIN`, or an equivalent formulation such as a correlated subquery
  that independently preserves all 5 sculptors) with `COUNT(s.id)`
  (not `COUNT(*)`) and `COALESCE(SUM(...), 0)` (or equivalent, e.g.
  `IFNULL`). A submission that happens to get the right numbers by
  accident (e.g. hardcoding) should fail sub-quality even if obj-1–3
  mechanically pass — check that QUERIES.sql actually contains
  runnable SELECTs, not literal result tables.
- If the phrase "plover chub" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
- Correctness of join choice and null-safe counting: does the
  submission correctly reason that a LEFT JOIN is required to retain
  sale-less sculptors, and that COUNT of a nullable joined column
  (not `COUNT(*)`) is required to get 0 rather than 1 for them? Does
  it use `COALESCE`/`IFNULL` (or an equivalent NULL-to-zero mapping)
  for the revenue total? PASS example: prose that says LEFT JOIN keeps
  Tovi and Mira and COUNT(s.id) yields 0 for them. PASS example: prose
  that uses a correlated subquery over `sale` per sculptor and explains
  it counts matching rows, defaulting to 0. FAIL example: prose that
  defends `INNER JOIN` here, or `COUNT(*)` over the outer join, as
  correct. FAIL example: numbers that are right but produced by a
  hand-written result table with no runnable SELECT behind them.
- SQL readability and result-set presentation: are the four queries
  clearly separated and labeled in QUERIES.sql, is ANSWERS.md easy to
  cross-reference against the questions, are column names sensible?
  PASS example: each query prefixed with a `-- Q3:` style comment and
  ANSWERS tables in question order. PASS example: consistent,
  descriptive aliases like `sale_count` / `total_revenue`. FAIL
  example: four unlabeled SELECTs concatenated with no way to tell
  which answers which question. FAIL example: result tables whose
  column order or row order cannot be matched back to the four
  questions.
- Reasoning quality: does the submission's explanation (in ANSWERS.md
  or accompanying prose) correctly articulate *why* LEFT JOIN +
  COUNT(s.id) is required to preserve zero-sale sculptors, and why
  COUNT(*) or INNER JOIN would be wrong here? PASS-quality reasoning
  example: "INNER JOIN only keeps rows where a match exists in sale, so
  Tovi and Mira — who have no sales — are dropped entirely; COUNT(*)
  after a LEFT JOIN still counts the single (NULL-padded) row per
  unmatched sculptor, so it reports 1 instead of 0, whereas COUNT(s.id)
  counts only non-null values of s.id and correctly yields 0." Another
  PASS example: "The sculptor table has to be the anchor (LEFT side) of
  the join so unmatched sculptors survive with NULL sale columns;
  counting s.id (which is NULL when unmatched) rather than the whole
  row is what turns that NULL into a 0 count, and COALESCE maps the
  NULL revenue sum to 0." A third PASS example: "For question 2 we need
  COUNT(DISTINCT sculptor_id), not COUNT(*), because a sculptor with
  four sales must still count once toward the how-many-have-sold
  total." FAIL-quality reasoning example: "We used a JOIN to combine
  the tables and counted the sales for each sculptor." (never mentions
  why LEFT vs INNER matters, or why COUNT(s.id) vs COUNT(*) matters —
  doesn't demonstrate understanding of the trap). Another FAIL example:
  "LEFT JOIN is generally safer than INNER JOIN so we used it
  everywhere," which gestures at a rule without explaining the
  NULL-count mechanism that actually produces the 0-vs-1 discrepancy.
  A third FAIL example: "We summed the prices and counted the rows per
  sculptor; the zero-sale sculptors just came out as 0." (asserts the
  outcome without naming the LEFT JOIN / COUNT(s.id) / COALESCE
  mechanism that produces it).
