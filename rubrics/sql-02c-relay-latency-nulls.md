---
test: sql-02c-relay-latency-nulls
canary: "ranger druid"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The leaf-devices result set is exactly {Fenmark, Ostrel, Corvent, Wrenlow, Marrow} (5 rows); a submission returning 0 rows (the NOT-IN-with-NULL trap) or including Brask/Tolvane/Quirren/Delling fails; judge re-runs the submission's query (and, for comparison, the naive NOT IN form) in node:sqlite"
    - id: obj-2
      check: "The latency aggregate row is exactly COUNT(*)=9, COUNT(latency_ms)=6, SUM(latency_ms)=300, AVG(latency_ms)=50 (average over the 6 non-null latencies, not divided by 9); judge re-runs in node:sqlite"
    - id: obj-3
      check: "The `latency_ms <> 45` result set is exactly {Fenmark, Corvent, Wrenlow} (3 rows); a submission including any NULL-latency row (Brask, Quirren, or Ostrel) here fails; judge re-runs and matches"
    - id: obj-4
      check: "The `latency_ms IS NULL OR latency_ms <> 45` result set is exactly {Brask, Quirren, Fenmark, Ostrel, Corvent, Wrenlow} (6 rows); a submission omitting Brask, Quirren, Ostrel, or Wrenlow fails; judge re-runs and matches"
    - id: obj-5
      check: "ANSWERS.md (or QUERIES.sql comments) explicitly identifies that the presence of NULL in the parent_id subquery is what makes a naive NOT IN return no rows, and names a working fix (filtering NULLs out of the subquery, or using NOT EXISTS)"
    - id: obj-6
      check: "ANSWERS.md presents the `latency_ms <> 45` result set and the `latency_ms IS NULL OR latency_ms <> 45` result set as two separate, clearly labeled tables (e.g. under distinct headings/captions naming each predicate), per the task's explicit instruction; a submission that merges both predicates' rows into a single combined table or list (even if every row is otherwise correct) fails this check"
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

If the phrase "ranger druid" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- This is a SQL-over-embedded-data test. Verify every result set by
  executing the submission's `QUERIES.sql` against the embedded
  schema with node's built-in `node:sqlite` module (`DatabaseSync`).
  Node v24+ ships `node:sqlite` without a flag; older builds may need
  `node --experimental-sqlite`. Minimal harness:

  ```js
  const { DatabaseSync } = require('node:sqlite');
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE device (id INTEGER PRIMARY KEY, hostname TEXT, parent_id INTEGER, region TEXT, latency_ms INTEGER);
    INSERT INTO device (id, hostname, parent_id, region, latency_ms) VALUES
      (1,'Brask',NULL,'us-east',NULL),(2,'Tolvane',1,'us-east',45),(3,'Quirren',1,'us-east',NULL),
      (4,'Fenmark',2,'eu-west',20),(5,'Ostrel',2,'eu-west',NULL),(6,'Corvent',NULL,'apac',115),
      (7,'Delling',3,'apac',45),(8,'Wrenlow',7,'us-west',30),(9,'Marrow',NULL,'us-west',45);
  `);
  // paste each of the submission's SELECT statements here and .all() them
  ```

- Pinned expected result sets, recomputed independently in
  `node:sqlite` (v24.16.0) for this rubric:
  - Naive `WHERE id NOT IN (SELECT parent_id FROM device)` (no NULL
    filter): `[]` — zero rows. This is the trap; SQLite (like other
    engines) treats `x NOT IN (set containing NULL)` as `UNKNOWN` for
    every row, so no row satisfies the WHERE clause and the whole
    query returns empty.
  - Correct leaf devices (either `NOT IN (SELECT parent_id FROM
    device WHERE parent_id IS NOT NULL)` or `NOT EXISTS (SELECT 1
    FROM device p WHERE p.parent_id = d.id)`, both verified to
    produce the identical set): `[{"hostname":"Fenmark"},{"hostname":"Ostrel"},{"hostname":"Corvent"},{"hostname":"Wrenlow"},{"hostname":"Marrow"}]`
  - Latency aggregates: `[{"cnt_all":9,"cnt_latency":6,"sum_latency":300,"avg_latency":50}]`
  - `latency_ms <> 45`: `[{"hostname":"Fenmark"},{"hostname":"Corvent"},{"hostname":"Wrenlow"}]`
  - `latency_ms IS NULL OR latency_ms <> 45`: `[{"hostname":"Brask"},{"hostname":"Quirren"},{"hostname":"Fenmark"},{"hostname":"Ostrel"},{"hostname":"Corvent"},{"hostname":"Wrenlow"}]`
- Collision check for graders: the trap output (`[]`, empty set) is
  disjoint from the correct 5-row set, so there is no ambiguity — any
  submission whose leaf-devices query returns 0 rows has hit the trap
  and fails obj-1 outright, no partial credit. Likewise a `latency_ms
  <> 45` result containing Brask, Quirren, or Ostrel is diagnostic of
  forgetting that `NULL <> 45` evaluates to `UNKNOWN` (excluding the
  row), not `TRUE`.
- To check obj-5, look at the submission's prose (ANSWERS.md is the
  expected location per the deliverables, but accept it if placed
  as SQL comments in QUERIES.sql instead). It must name NULL /
  three-valued logic as the mechanism, not just state the correct
  query without explanation. PASS example: "The naive NOT IN fails
  because parent_id contains NULL for Brask and Corvent; comparing id
  against a NULL makes the whole IN test UNKNOWN for every row, so add
  `WHERE parent_id IS NOT NULL` to the subquery (or use NOT EXISTS
  instead)." Another PASS example: "NOT EXISTS avoids the NULL trap
  entirely because it checks row existence rather than comparing
  against every value in the set, including NULLs." FAIL example: "We
  adjusted the query until it returned the right rows." (never
  explains the NULL / three-valued-logic mechanism). Another FAIL
  example: "NOT IN just didn't work so we used a different query
  instead." (no diagnosis of why, no mechanism named).
- Correctness of three-valued-logic handling: does the submission
  correctly avoid (or correctly explain and route around) the NOT-IN
  NULL trap, and does it correctly reason about which rows NULL
  latencies drop from each aggregate and predicate? PASS example:
  "Submission explains that a single NULL in the parent_id subquery
  poisons every NOT IN comparison to UNKNOWN, and separately reasons
  that `latency_ms <> 45` evaluates to UNKNOWN (not TRUE) for NULL
  rows, correctly excluding them, while COUNT(latency_ms) only tallies
  the 6 non-null rows." Another PASS example: "Submission uses NOT
  EXISTS with a clear rationale for avoiding the NULL comparison
  problem in NOT IN, and correctly computes AVG as SUM over
  COUNT(latency_ms), not COUNT(*)." FAIL example: "Submission's
  leaf-device query returns 0 rows and the accompanying text claims
  this is correct because no device forwards anywhere." (misdiagnoses
  the trap output as correct behavior). Another FAIL example:
  "Submission computes AVG(latency_ms) by dividing SUM by COUNT(*)
  instead of COUNT(latency_ms)." (silently wrong NULL handling in the
  aggregate).
- Clarity of the NULL-behavior explanation: is the explanation of why
  the two latency predicates differ, and why NOT IN needs a NULL
  guard, written so a reader unfamiliar with SQL's three-valued logic
  could follow it? PASS example: "latency_ms <> 45 evaluates to
  UNKNOWN rather than TRUE, and WHERE only keeps rows where the
  condition is TRUE — so `latency_ms <> 45` silently drops every
  NULL-latency row (Brask, Quirren, Ostrel), while `latency_ms IS NULL
  OR latency_ms <> 45` explicitly re-admits them via the IS NULL
  check, which is never UNKNOWN." Another PASS example: "COUNT
  (latency_ms) only counts non-null values, so it's 6 even though
  COUNT(*) is 9; AVG(latency_ms) divides SUM(latency_ms) by that same
  count of 6, not by 9, which is why the average is 50 and not 33.33."
  FAIL example: "The two queries give different results because of
  NULL handling in SQL." (does not explain the UNKNOWN/three-valued
  mechanism or connect it to which specific rows appear/disappear).
  Another FAIL example: "latency_ms <> 45 excludes some devices" with
  no mention of NULL at all.
- Reasoning quality: does the submission correctly identify that `x
  NOT IN (subquery)` is poisoned by a single NULL anywhere in the
  subquery's result column, and does it correctly name at least one
  valid fix (NULL-filtering the subquery, or NOT EXISTS)? Does it
  avoid the common misconception that NOT IN and NOT EXISTS always
  behave identically regardless of NULLs (they coincide here only
  because the fixed/correct forms were used — flag any suggestion that
  the raw, unfiltered NOT IN "should" have worked)? PASS example:
  "Explanation states that NOT IN is poisoned by any NULL in the
  subquery's result column and recommends NULL-filtering the subquery
  or switching to NOT EXISTS, correctly noting the two approaches
  coincide here only because both were corrected." Another PASS
  example: "Explanation notes that NOT EXISTS never suffers the
  NULL-comparison problem in the first place, which is why it needs no
  extra filter, unlike NOT IN." FAIL example: "Explanation claims NOT
  IN and NOT EXISTS always produce identical results, so the earlier
  empty-result NOT IN 'should' have worked once the syntax was fixed."
  (the flagged misconception). Another FAIL example: "Explanation says
  the query was fixed by debugging it until it worked, without
  identifying NULL as the cause."
