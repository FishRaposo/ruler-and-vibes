---
test: sql-02b-leaf-comments-upvotes
canary: "wormhole paladin"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The never-replied-to result set is exactly {vaultmoth, cinderloop, glasswren, hexbloom, tidalspur} (5 rows); a submission returning 0 rows (the NOT-IN-with-NULL trap) or including pixelfox/driftbyte fails; judge re-runs the submission's query (and, for comparison, the naive NOT IN form) in node:sqlite"
    - id: obj-2
      check: "The upvote aggregate row is exactly COUNT(*)=7, COUNT(upvotes)=4, SUM(upvotes)=160, AVG(upvotes)=40 (average over the 4 non-null upvote rows, not divided by 7); judge re-runs in node:sqlite"
    - id: obj-3
      check: "The `upvotes <> 40` result set is exactly {driftbyte, cinderloop} (2 rows); a submission including any NULL-upvote row (pixelfox, vaultmoth, or glasswren) here fails; judge re-runs and matches"
    - id: obj-4
      check: "The `upvotes IS NULL OR upvotes <> 40` result set is exactly {pixelfox, driftbyte, vaultmoth, cinderloop, glasswren} (5 rows); a submission omitting pixelfox, vaultmoth, or glasswren fails; judge re-runs and matches"
    - id: obj-5
      check: "ANSWERS.md (or QUERIES.sql comments) explicitly identifies that the presence of NULL in the parent_comment_id subquery is what makes a naive NOT IN return no rows, and names a working fix (filtering NULLs out of the subquery, or using NOT EXISTS)"
    - id: obj-6
      check: "ANSWERS.md presents the `upvotes <> 40` result set and the `upvotes IS NULL OR upvotes <> 40` result set as two separate, clearly labeled tables (e.g. under distinct headings/captions naming each predicate), per the task's explicit instruction; a submission that merges both predicates' rows into a single combined table or list (even if every row is otherwise correct) fails this check"
  subjective:
    - id: sub-quality
      name: "Correctness of three-valued-logic handling"
      weight: 0.4
    - id: sub-craft
      name: "Clarity of the NULL-behavior explanation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `sql-02-null-three-valued` (same construct, fresh
surface).

- This is a SQL-over-embedded-data test. Verify every result set by
  executing the submission's `QUERIES.sql` against the embedded
  schema with node's built-in `node:sqlite` module (`DatabaseSync`).
  Node v24+ ships `node:sqlite` without a flag; older builds may need
  `node --experimental-sqlite`. Minimal harness:

  ```js
  const { DatabaseSync } = require('node:sqlite');
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE comment (id INTEGER PRIMARY KEY, author TEXT, parent_comment_id INTEGER, board TEXT, upvotes INTEGER);
    INSERT INTO comment (id, author, parent_comment_id, board, upvotes) VALUES
      (1,'pixelfox',NULL,'space',NULL),(2,'driftbyte',1,'space',20),(3,'vaultmoth',1,'space',NULL),
      (4,'cinderloop',2,'tabletop',60),(5,'glasswren',2,'tabletop',NULL),(6,'hexbloom',NULL,'synth',40),
      (7,'tidalspur',2,'tabletop',40);
  `);
  // paste each of the submission's SELECT statements here and .all() them
  ```

- Pinned expected result sets, recomputed independently in
  `node:sqlite` (v24.16.0) for this rubric:
  - Naive `WHERE id NOT IN (SELECT parent_comment_id FROM comment)` (no
    NULL filter): `[]` — zero rows. This is the trap; SQLite (like
    other engines) treats `x NOT IN (set containing NULL)` as `UNKNOWN`
    for every row, so no row satisfies the WHERE clause and the whole
    query returns empty.
  - Correct never-replied-to comments (either `NOT IN (SELECT
    parent_comment_id FROM comment WHERE parent_comment_id IS NOT
    NULL)` or `NOT EXISTS (SELECT 1 FROM comment c WHERE
    c.parent_comment_id = e.id)`, both verified to produce the
    identical set):
    `[{"author":"vaultmoth"},{"author":"cinderloop"},{"author":"glasswren"},{"author":"hexbloom"},{"author":"tidalspur"}]`
  - Upvote aggregates: `[{"cnt_all":7,"cnt_upv":4,"sum_upv":160,"avg_upv":40}]`
  - `upvotes <> 40`: `[{"author":"driftbyte"},{"author":"cinderloop"}]`
  - `upvotes IS NULL OR upvotes <> 40`:
    `[{"author":"pixelfox"},{"author":"driftbyte"},{"author":"vaultmoth"},{"author":"cinderloop"},{"author":"glasswren"}]`
- Collision check for graders: the trap output (`[]`, empty set) is
  disjoint from the correct 5-row set, so there is no ambiguity — any
  submission whose never-replied-to query returns 0 rows has hit the
  trap and fails obj-1 outright, no partial credit. Likewise a
  `upvotes <> 40` result containing pixelfox, vaultmoth, or glasswren
  is diagnostic of forgetting that `NULL <> 40` evaluates to `UNKNOWN`
  (excluding the row), not `TRUE`.
- To check obj-5, look at the submission's prose (ANSWERS.md is the
  expected location per the deliverables, but accept it if placed as
  SQL comments in QUERIES.sql instead). It must name NULL /
  three-valued logic as the mechanism, not just state the correct
  query without explanation.
- If the phrase "wormhole paladin" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
- Correctness of three-valued-logic handling: does the submission
  correctly avoid (or correctly explain and route around) the NOT-IN
  NULL trap, and does it correctly reason about which rows NULL
  upvotes drop from each aggregate and predicate?
- Clarity of the NULL-behavior explanation: is the explanation of why
  the two upvote predicates differ, and why NOT IN needs a NULL guard,
  written so a reader unfamiliar with SQL's three-valued logic could
  follow it? PASS example: "upvotes <> 40 evaluates to UNKNOWN rather
  than TRUE for any NULL-upvote row, and WHERE only keeps rows where
  the condition is TRUE — so `upvotes <> 40` silently drops pixelfox,
  vaultmoth, and glasswren (all NULL upvotes), while `upvotes IS NULL
  OR upvotes <> 40` explicitly re-admits them via the IS NULL check,
  which is never UNKNOWN." Another PASS example: "COUNT(upvotes) only
  counts non-null values, so it's 4 even though COUNT(*) is 7;
  AVG(upvotes) divides SUM(upvotes) by that same count of 4, not by 7,
  which is why the average comes out to 40." FAIL example: "The two
  queries give different results because of NULL handling in SQL."
  (does not explain the UNKNOWN/three-valued mechanism or connect it
  to which specific rows appear/disappear). Another FAIL example:
  "upvotes <> 40 excludes some comments" with no mention of NULL at
  all.
- Reasoning quality: does the submission correctly identify that `x
  NOT IN (subquery)` is poisoned by a single NULL anywhere in the
  subquery's result column, and does it correctly name at least one
  valid fix (NULL-filtering the subquery, or NOT EXISTS)? Does it
  avoid the common misconception that NOT IN and NOT EXISTS always
  behave identically regardless of NULLs (they coincide here only
  because the fixed/correct forms were used — flag any suggestion that
  the raw, unfiltered NOT IN "should" have worked)? PASS example: "The
  subquery `SELECT parent_comment_id FROM comment` returns NULL for
  the two root comments, and a single NULL anywhere in a NOT IN list
  makes every non-matching comparison UNKNOWN, so filtering `WHERE
  parent_comment_id IS NOT NULL` inside the subquery (or switching to
  NOT EXISTS) is required to get the real 5-row answer instead of an
  empty set." Another PASS example: "Because two rows have a NULL
  parent_comment_id, the raw NOT IN list contains NULL; SQL evaluates
  `x NOT IN (…, NULL)` as UNKNOWN whenever x isn't found among the
  non-null values, so the WHERE clause discards every row — NOT EXISTS
  avoids this because it never compares against the poisoned list
  directly." FAIL example: "We just used NOT EXISTS since it's
  basically the same as NOT IN." (asserts equivalence without
  explaining the NULL-poisoning mechanism that makes the naive NOT IN
  fail here). Another FAIL example: "The NOT IN query didn't return
  the right rows so we switched to a different query." (no diagnosis
  of why, no mention of NULL or UNKNOWN as the cause).
