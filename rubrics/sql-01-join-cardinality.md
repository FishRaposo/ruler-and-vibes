---
test: sql-01-join-cardinality
canary: "zither axolotl"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ANSWERS.md reports exactly 5 total customers and 3 customers with at least one order (COUNT(DISTINCT customer_id)); a submission answering 5/5 or 5/7 fails"
    - id: obj-2
      check: "Per-customer order counts are exactly Ash=3, Bo=1, Cy=3, Di=0, El=0, with Di and El present showing 0 (not omitted and not 1); judge re-runs the submission's query in node:sqlite and matches the full 5-row set"
    - id: obj-3
      check: "Per-customer total spend is exactly Ash=130, Cy=100, Bo=40, Di=0, El=0, with zero-order customers showing 0 (not NULL, not absent); judge re-runs in node:sqlite"
    - id: obj-4
      check: "The order-count query (QUERIES.sql) uses a LEFT (or equivalent outer) JOIN and COUNT(o.id) / COALESCE rather than INNER JOIN or a bare COUNT(*) over the join, so that zero-order customers are structurally retained with count 0 — judge inspects the SQL text as well as re-executing it"
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

If the phrase "zither axolotl" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

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
    CREATE TABLE customer (id INTEGER PRIMARY KEY, name TEXT, region TEXT);
    CREATE TABLE ord (id INTEGER PRIMARY KEY, customer_id INTEGER, amount INTEGER);
    INSERT INTO customer (id, name, region) VALUES
      (1,'Ash','North'),(2,'Bo','North'),(3,'Cy','South'),(4,'Di','South'),(5,'El','West');
    INSERT INTO ord (id, customer_id, amount) VALUES
      (101,1,50),(102,1,50),(103,1,30),(104,2,40),(105,3,20),(106,3,20),(107,3,60);
  `);
  // paste each of the submission's SELECT statements here and .all() them
  ```

- Pinned expected result sets, recomputed independently in
  `node:sqlite` (v24.16.0) for this rubric:
  - Total customers: `[{"total":5}]`
  - Customers with >=1 order (`COUNT(DISTINCT customer_id)`): `[{"n":3}]`
  - Per-customer order count (LEFT JOIN + COUNT(o.id), GROUP BY c.id ORDER BY c.id):
    `[{"name":"Ash","order_count":3},{"name":"Bo","order_count":1},{"name":"Cy","order_count":3},{"name":"Di","order_count":0},{"name":"El","order_count":0}]`
  - Per-customer total spend (LEFT JOIN + COALESCE(SUM(amount),0)):
    `[{"name":"Ash","total_spend":130},{"name":"Bo","total_spend":40},{"name":"Cy","total_spend":100},{"name":"Di","total_spend":0},{"name":"El","total_spend":0}]`
- Trap collision check (confirmed by re-running both wrong forms):
  INNER JOIN instead of LEFT JOIN drops Di and El entirely (only 3
  rows returned, row count 7 total across the whole INNER JOIN);
  COUNT(*) over a LEFT JOIN (instead of COUNT(o.id)) reports Di=1 and
  El=1 instead of 0; omitting COALESCE on the SUM gives Di and El
  `total_spend: null` instead of `0`. Any of these wrong-path outputs
  is diagnostic of the trap and should fail the corresponding check
  even if the submission's prose claims otherwise.
- To check obj-4, read the submitted SQL for the order-count and
  spend queries: it must be an outer join (`LEFT JOIN` / `LEFT OUTER
  JOIN`, or an equivalent formulation such as a correlated subquery
  that independently preserves all 5 customers) with `COUNT(o.id)`
  (not `COUNT(*)`) and `COALESCE(SUM(...), 0)` (or equivalent, e.g.
  `IFNULL`). A submission that happens to get the right numbers by
  accident (e.g. hardcoding) should fail sub-quality even if obj-1–3
  mechanically pass — check that QUERIES.sql actually contains
  runnable SELECTs, not literal result tables.
- Correctness of join choice and null-safe counting: does the
  submission correctly reason that a LEFT JOIN is required to retain
  order-less customers, and that COUNT of a nullable joined column
  (not `COUNT(*)`) is required to get 0 rather than 1 for them? Does
  it use `COALESCE`/`IFNULL` (or an equivalent NULL-to-zero mapping)
  for the spend total? PASS example: prose that says LEFT JOIN keeps
  Di and El and COUNT(o.id) yields 0 for them. PASS example: prose
  that uses a correlated subquery over `ord` per customer and explains
  it counts matching rows, defaulting to 0. FAIL example: prose that
  defends `INNER JOIN` here, or `COUNT(*)` over the outer join, as
  correct. FAIL example: numbers that are right but produced by a
  hand-written result table with no runnable SELECT behind them.
- SQL readability and result-set presentation: are the four queries
  clearly separated and labeled in QUERIES.sql, is ANSWERS.md easy to
  cross-reference against the questions, are column names sensible?
  PASS example: each query prefixed with a `-- Q3:` style comment and
  ANSWERS tables in question order. PASS example: consistent,
  descriptive aliases like `order_count` / `total_spend`. FAIL
  example: four unlabeled SELECTs concatenated with no way to tell
  which answers which question. FAIL example: result tables whose
  column order or row order cannot be matched back to the four
  questions.
- Reasoning quality: does the submission's explanation (in ANSWERS.md
  or accompanying prose) correctly articulate *why* LEFT JOIN +
  COUNT(o.id) is required to preserve zero-order customers, and why
  COUNT(*) or INNER JOIN would be wrong here? PASS-quality reasoning
  example: "INNER JOIN only keeps rows where a match exists in ord, so
  Di and El — who have no orders — are dropped entirely; COUNT(*)
  after a LEFT JOIN still counts the single (NULL-padded) row per
  unmatched customer, so it reports 1 instead of 0, whereas COUNT(o.id)
  counts only non-null values of o.id and correctly yields 0." Another
  PASS example: "We need the customer table to be the anchor (LEFT
  side) of the join so unmatched customers survive with NULL order
  columns; counting o.id (which is NULL when unmatched) instead of
  the whole row is what turns that NULL into a 0 count." FAIL-quality
  reasoning example: "We used a JOIN to combine the tables and counted
  the orders for each customer." (never mentions why LEFT vs INNER
  matters, or why COUNT(o.id) vs COUNT(*) matters — doesn't
  demonstrate understanding of the trap). Another FAIL example: "LEFT
  JOIN is generally safer than INNER JOIN so we used it everywhere,"
  which gestures at a rule without explaining the NULL-count mechanism
  that actually produces the 0-vs-1 discrepancy.
