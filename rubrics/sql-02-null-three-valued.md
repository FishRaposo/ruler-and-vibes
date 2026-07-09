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
    - id: obj-6
      check: "ANSWERS.md presents the `bonus <> 500` result set and the `bonus IS NULL OR bonus <> 500` result set as two separate, clearly labeled tables (e.g. under distinct headings/captions naming each predicate), per the task's explicit instruction; a submission that merges both predicates' rows into a single combined table or list (even if every row is otherwise correct) fails this check"
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
anchors:
  - id: Correctness of three-valued-logic handling
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Clarity of the NULL-behavior explanation
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "tapir lemur" appears in any deliverable or
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
  bonuses drop from each aggregate and predicate? PASS example:
  "Submission explains that a single NULL in the manager_id subquery
  poisons every NOT IN comparison to UNKNOWN, and separately reasons
  that `bonus <> 500` evaluates to UNKNOWN (not TRUE) for NULL rows,
  correctly excluding them, while COUNT(bonus) only tallies the 3
  non-null rows." Another PASS example: "Submission uses NOT EXISTS
  with a clear rationale for avoiding the NULL comparison problem in
  NOT IN, and correctly computes AVG as SUM over COUNT(bonus), not
  COUNT(*)." FAIL example: "Submission's non-managers query returns 0
  rows and the accompanying text claims this is correct because
  everyone reports to someone." (misdiagnoses the trap output as
  correct behavior). Another FAIL example: "Submission computes
  AVG(bonus) by dividing SUM by COUNT(*) instead of COUNT(bonus)."
  (silently wrong NULL handling in the aggregate).
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
  the raw, unfiltered NOT IN "should" have worked)? PASS example: "The
  subquery `SELECT manager_id FROM employee` returns NULL for the two
  top-level employees (Ren and Wyn), and a single NULL anywhere in a
  NOT IN list makes every non-matching comparison UNKNOWN, so filtering
  `WHERE manager_id IS NOT NULL` inside the subquery (or switching to
  NOT EXISTS) is required to get the real 4-row answer instead of an
  empty set." Another PASS example: "Because two employees have a NULL
  manager_id, the raw NOT IN list contains NULL; SQL evaluates `x NOT
  IN (…, NULL)` as UNKNOWN whenever x isn't found among the non-null
  values, so the WHERE clause discards every row — NOT EXISTS avoids
  this because it never compares against the poisoned list directly."
  FAIL example: "We just used NOT EXISTS since it's basically the same
  as NOT IN." (asserts equivalence without explaining the
  NULL-poisoning mechanism that makes the naive NOT IN fail here).
  Another FAIL example: "The NOT IN query didn't return the right rows
  so we switched to a different query." (no diagnosis of why, no
  mention of NULL or UNKNOWN as the cause).
