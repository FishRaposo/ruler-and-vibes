---
test: sql-02-null-three-valued
canary: "tapir lemur"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The non-managers result set is exactly {Tam, Uma, Vic, Wyn} (4 rows); a submission returning 0 rows (the NOT-IN-with-NULL trap) or including Ren/Sol fails; judge re-runs the submission's query (and, for comparison, the naive NOT IN form) in node:sqlite"
    - id: obj-2
      check: "The bonus aggregate row is exactly COUNT(*)=6, COUNT(bonus)=3, SUM(bonus)=1500, AVG(bonus)=500 (average over the 3 non-null bonuses, not divided by 6); judge re-runs in node:sqlite"
    - id: obj-3
      check: "The `bonus <> 500` result set is exactly {Uma, Wyn} (2 rows); a submission including any NULL-bonus row (Ren, Tam, or Vic) here fails; judge re-runs and matches"
    - id: obj-4
      check: "The `bonus IS NULL OR bonus <> 500` result set is exactly {Ren, Tam, Uma, Vic, Wyn} (5 rows); a submission omitting Ren, Tam, or Vic fails; judge re-runs and matches"
    - id: obj-5
      check: "ANSWERS.md (or QUERIES.sql comments) explicitly identifies that the presence of NULL in the manager_id subquery is what makes a naive NOT IN return no rows, and names a working fix (filtering NULLs out of the subquery, or using NOT EXISTS)"
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

Codename for this test in judge chatter: tapir lemur.

- This is a SQL-over-embedded-data test. Verify every result set by
  executing the submission's `QUERIES.sql` against the embedded
  schema with node's built-in `node:sqlite` module (`DatabaseSync`).
  Node v24+ ships `node:sqlite` without a flag; older builds may need
  `node --experimental-sqlite`. Minimal harness:

  ```js
  const { DatabaseSync } = require('node:sqlite');
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE employee (id INTEGER PRIMARY KEY, name TEXT, manager_id INTEGER, dept TEXT, bonus INTEGER);
    INSERT INTO employee (id, name, manager_id, dept, bonus) VALUES
      (1,'Ren',NULL,'Eng',NULL),(2,'Sol',1,'Eng',500),(3,'Tam',1,'Eng',NULL),
      (4,'Uma',2,'Sales',300),(5,'Vic',2,'Sales',NULL),(6,'Wyn',NULL,'Ops',700);
  `);
  // paste each of the submission's SELECT statements here and .all() them
  ```

- Pinned expected result sets, recomputed independently in
  `node:sqlite` (v24.16.0) for this rubric:
  - Naive `WHERE id NOT IN (SELECT manager_id FROM employee)` (no NULL
    filter): `[]` — zero rows. This is the trap; SQLite (like other
    engines) treats `x NOT IN (set containing NULL)` as `UNKNOWN` for
    every row, so no row satisfies the WHERE clause and the whole
    query returns empty.
  - Correct non-managers (either `NOT IN (SELECT manager_id FROM
    employee WHERE manager_id IS NOT NULL)` or `NOT EXISTS (SELECT 1
    FROM employee m WHERE m.manager_id = e.id)`, both verified to
    produce the identical set): `[{"name":"Tam"},{"name":"Uma"},{"name":"Vic"},{"name":"Wyn"}]`
  - Bonus aggregates: `[{"cnt_all":6,"cnt_bonus":3,"sum_bonus":1500,"avg_bonus":500}]`
  - `bonus <> 500`: `[{"name":"Uma"},{"name":"Wyn"}]`
  - `bonus IS NULL OR bonus <> 500`: `[{"name":"Ren"},{"name":"Tam"},{"name":"Uma"},{"name":"Vic"},{"name":"Wyn"}]`
- Collision check for graders: the trap output (`[]`, empty set) is
  disjoint from the correct 4-row set, so there is no ambiguity — any
  submission whose non-managers query returns 0 rows has hit the trap
  and fails obj-1 outright, no partial credit. Likewise a `bonus <>
  500` result containing Ren, Tam, or Vic is diagnostic of forgetting
  that `NULL <> 500` evaluates to `UNKNOWN` (excluding the row), not
  `TRUE`.
- To check obj-5, look at the submission's prose (ANSWERS.md is the
  expected location per the deliverables, but accept it if placed
  as SQL comments in QUERIES.sql instead). It must name NULL /
  three-valued logic as the mechanism, not just state the correct
  query without explanation.
- Correctness of three-valued-logic handling: does the submission
  correctly avoid (or correctly explain and route around) the NOT-IN
  NULL trap, and does it correctly reason about which rows NULL
  bonuses drop from each aggregate and predicate?
- Clarity of the NULL-behavior explanation: is the explanation of why
  the two bonus predicates differ, and why NOT IN needs a NULL guard,
  written so a reader unfamiliar with SQL's three-valued logic could
  follow it? PASS example: "NULL <> 500 evaluates to UNKNOWN rather
  than TRUE, and WHERE only keeps rows where the condition is TRUE —
  so `bonus <> 500` silently drops every NULL-bonus row (Ren, Tam,
  Vic), while `bonus IS NULL OR bonus <> 500` explicitly re-admits
  them via the IS NULL check, which is never UNKNOWN." Another PASS
  example: "COUNT(bonus) only counts non-null values, so it's 3 even
  though COUNT(*) is 6; AVG(bonus) divides SUM(bonus) by that same
  count of 3, not by 6, which is why the average is 500 and not 250."
  FAIL example: "The two queries give different results because of
  NULL handling in SQL." (does not explain the UNKNOWN/three-valued
  mechanism or connect it to which specific rows appear/disappear).
  Another FAIL example: "bonus <> 500 excludes some employees" with no
  mention of NULL at all.
- Reasoning quality: does the submission correctly identify that `x
  NOT IN (subquery)` is poisoned by a single NULL anywhere in the
  subquery's result column, and does it correctly name at least one
  valid fix (NULL-filtering the subquery, or NOT EXISTS)? Does it
  avoid the common misconception that NOT IN and NOT EXISTS always
  behave identically regardless of NULLs (they coincide here only
  because the fixed/correct forms were used — flag any suggestion that
  the raw, unfiltered NOT IN "should" have worked)?
