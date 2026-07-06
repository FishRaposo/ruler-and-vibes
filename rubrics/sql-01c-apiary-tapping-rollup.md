---
test: sql-01c-apiary-tapping-rollup
canary: "lapwing barbel"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ANSWERS.md reports exactly 5 total apiaries and 3 apiaries with at least one tapping (COUNT(DISTINCT apiary_id)); a submission answering 5/5 or 5/9 fails"
    - id: obj-2
      check: "Per-apiary tapping counts are exactly Alder=3, Brier=0, Clover=2, Dornick=4, Ewell=0, with Brier and Ewell present showing 0 (not omitted and not 1); judge re-runs the submission's query in node:sqlite and matches the full 5-row set"
    - id: obj-3
      check: "Per-apiary total jars is exactly Alder=52, Clover=48, Dornick=54, Brier=0, Ewell=0, with zero-tapping apiaries showing 0 (not NULL, not absent); judge re-runs in node:sqlite"
    - id: obj-4
      check: "The tapping-count query (QUERIES.sql) uses a LEFT (or equivalent outer) JOIN and COUNT(t.id) / COALESCE rather than INNER JOIN or a bare COUNT(*) over the join, so that zero-tapping apiaries are structurally retained with count 0 — judge inspects the SQL text as well as re-executing it"
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

If the phrase "lapwing barbel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- This is a SQL-over-embedded-data test. Verify every result set by
  actually executing the submission's `QUERIES.sql` against the embedded
  schema with node's built-in `node:sqlite` module (`DatabaseSync`), not
  by eyeballing the SQL. Node v24+ ships `node:sqlite` without a flag; if
  your node build still gates it, run with `node --experimental-sqlite`.
  Minimal harness:

  ```js
  const { DatabaseSync } = require('node:sqlite');
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE apiary (id INTEGER PRIMARY KEY, name TEXT, county TEXT);
    CREATE TABLE tapping (id INTEGER PRIMARY KEY, apiary_id INTEGER, jars INTEGER);
    INSERT INTO apiary (id, name, county) VALUES
      (1,'Alder','Kestrel'),(2,'Brier','Kestrel'),(3,'Clover','Marrow'),(4,'Dornick','Marrow'),(5,'Ewell','Vane');
    INSERT INTO tapping (id, apiary_id, jars) VALUES
      (201,1,15),(202,1,15),(203,1,22),(204,3,40),(205,3,8),(206,4,9),(207,4,9),(208,4,9),(209,4,27);
  `);
  // paste each of the submission's SELECT statements here and .all() them
  ```

- Pinned expected result sets, recomputed independently in `node:sqlite`
  (v24.16.0) for this rubric:
  - Total apiaries: `[{"total":5}]`
  - Apiaries with >=1 tapping (`COUNT(DISTINCT apiary_id)`): `[{"n":3}]`
  - Per-apiary tapping count (LEFT JOIN + COUNT(t.id), GROUP BY a.id ORDER BY a.id):
    `[{"name":"Alder","tapping_count":3},{"name":"Brier","tapping_count":0},{"name":"Clover","tapping_count":2},{"name":"Dornick","tapping_count":4},{"name":"Ewell","tapping_count":0}]`
  - Per-apiary total jars (LEFT JOIN + COALESCE(SUM(jars),0)):
    `[{"name":"Alder","total_jars":52},{"name":"Brier","total_jars":0},{"name":"Clover","total_jars":48},{"name":"Dornick","total_jars":54},{"name":"Ewell","total_jars":0}]`
- Trap collision check (confirmed by re-running both wrong forms): INNER
  JOIN instead of LEFT JOIN drops Brier and Ewell entirely (only 3 rows
  returned, row count 9 total across the whole INNER JOIN); COUNT(*) over
  a LEFT JOIN (instead of COUNT(t.id)) reports Brier=1 and Ewell=1
  instead of 0; omitting COALESCE on the SUM gives Brier and Ewell
  `total_jars: null` instead of `0`. Any of these wrong-path outputs is
  diagnostic of the trap and should fail the corresponding check even if
  the submission's prose claims otherwise.
- To check obj-4, read the submitted SQL for the tapping-count and jars
  queries: it must be an outer join (`LEFT JOIN` / `LEFT OUTER JOIN`, or
  an equivalent formulation such as a correlated subquery that
  independently preserves all 5 apiaries) with `COUNT(t.id)` (not
  `COUNT(*)`) and `COALESCE(SUM(...), 0)` (or equivalent, e.g.
  `IFNULL`). A submission that happens to get the right numbers by
  accident (e.g. hardcoding) should fail sub-quality even if obj-1–3
  mechanically pass — check that QUERIES.sql actually contains runnable
  SELECTs, not literal result tables.
- Correctness of join choice and null-safe counting: does the submission
  correctly reason that a LEFT JOIN is required to retain tapping-less
  apiaries, and that COUNT of a nullable joined column (not `COUNT(*)`)
  is required to get 0 rather than 1 for them? Does it use
  `COALESCE`/`IFNULL` (or an equivalent NULL-to-zero mapping) for the
  jars total? PASS example: prose that says LEFT JOIN keeps Brier and
  Ewell and COUNT(t.id) yields 0 for them. PASS example: prose that uses
  a correlated subquery over `tapping` per apiary and explains it counts
  matching rows, defaulting to 0. FAIL example: prose that defends
  `INNER JOIN` here, or `COUNT(*)` over the outer join, as correct. FAIL
  example: numbers that are right but produced by a hand-written result
  table with no runnable SELECT behind them.
- SQL readability and result-set presentation: are the four queries
  clearly separated and labeled in QUERIES.sql, is ANSWERS.md easy to
  cross-reference against the questions, are column names sensible? PASS
  example: each query prefixed with a `-- Q3:` style comment and ANSWERS
  tables in question order. PASS example: consistent, descriptive aliases
  like `tapping_count` / `total_jars`. FAIL example: four unlabeled
  SELECTs concatenated with no way to tell which answers which question.
  FAIL example: result tables whose column order or row order cannot be
  matched back to the four questions.
- Reasoning quality: does the submission's explanation (in ANSWERS.md or
  accompanying prose) correctly articulate *why* LEFT JOIN + COUNT(t.id)
  is required to preserve zero-tapping apiaries, and why COUNT(*) or
  INNER JOIN would be wrong here? PASS-quality reasoning example: "INNER
  JOIN only keeps rows where a match exists in tapping, so Brier and
  Ewell — who have no tappings — are dropped entirely; COUNT(*) after a
  LEFT JOIN still counts the single (NULL-padded) row per unmatched
  apiary, so it reports 1 instead of 0, whereas COUNT(t.id) counts only
  non-null values of t.id and correctly yields 0." Another PASS example:
  "We need the apiary table to be the anchor (LEFT side) of the join so
  unmatched apiaries survive with NULL tapping columns; counting t.id
  (which is NULL when unmatched) instead of the whole row is what turns
  that NULL into a 0 count." FAIL-quality reasoning example: "We used a
  JOIN to combine the tables and counted the tappings for each apiary."
  (never mentions why LEFT vs INNER matters, or why COUNT(t.id) vs
  COUNT(*) matters — doesn't demonstrate understanding of the trap).
  Another FAIL example: "LEFT JOIN is generally safer than INNER JOIN so
  we used it everywhere," which gestures at a rule without explaining the
  NULL-count mechanism that actually produces the 0-vs-1 discrepancy.
