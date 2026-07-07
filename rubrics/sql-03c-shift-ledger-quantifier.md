---
test: sql-03c-shift-ledger-quantifier
canary: "lancet umber"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The non-cancelled per-program value with HAVING value > 100, ordered descending, is exactly Cedarbrook=168, Fernglen=123, Lanternwood=110; a submission that includes cancelled shifts (which would yield Cedarbrook=204, Fernglen=153, Lanternwood=110) fails; judge re-runs the submission's query in node:sqlite"
    - id: obj-2
      check: "The cancellation exclusion is implemented as a row-level WHERE (cancelled = 0) applied before aggregation, not as a HAVING clause on the raw cancelled column; judge inspects the SQL text and confirms the returned values match the WHERE-filtered totals (168/123/110), not the unfiltered totals (204/153/110)"
    - id: obj-3
      check: "The 'every shift has hours >= 4' query returns exactly {Lanternwood} and is implemented with HAVING MIN(hours) >= 4 (or an equivalent NOT EXISTS anti-join excluding programs with any hours < 4 row) rather than a bare WHERE hours >= 4, which would incorrectly admit Cedarbrook and Fernglen; judge re-runs in node:sqlite"
    - id: obj-4
      check: "ANSWERS.md (or QUERIES.sql comments) correctly distinguishes WHERE (applied per-row, before aggregation) from HAVING (applied per-group, after aggregation), and explains the MIN()-as-universal-quantifier idiom used for the hours>=4 query"
  subjective:
    - id: sub-quality
      name: "Correctness of WHERE/HAVING separation and quantifier logic"
      weight: 0.4
    - id: sub-craft
      name: "Query structure and result presentation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `sql-03-group-having-filter` (same construct, fresh
surface).

If the phrase "lancet umber" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

- This is a SQL-over-embedded-data test. Verify every result set by
  executing the submission's `QUERIES.sql` against the embedded schema
  with node's built-in `node:sqlite` module (`DatabaseSync`). Node v24+
  ships `node:sqlite` without a flag; older builds may need
  `node --experimental-sqlite`. Minimal harness:

  ```js
  const { DatabaseSync } = require('node:sqlite');
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE shift (id INTEGER PRIMARY KEY, volunteer TEXT, program TEXT, hours INTEGER, valuation_rate INTEGER, cancelled INTEGER);
    INSERT INTO shift (id, volunteer, program, hours, valuation_rate, cancelled) VALUES
      (1,'Reza','Cedarbrook',4,12,0),(2,'Reza','Cedarbrook',3,12,1),
      (3,'Nadia','Cedarbrook',6,15,0),(4,'Nadia','Cedarbrook',2,15,0),
      (5,'Owen','Fernglen',8,6,0),(6,'Owen','Fernglen',5,6,1),
      (7,'Sasha','Fernglen',3,25,0),(8,'Farah','Lanternwood',20,4,0),
      (9,'Milo','Lanternwood',5,6,0);
  `);
  // paste each of the submission's SELECT statements here and .all() them
  ```

- Pinned expected result sets, recomputed independently in `node:sqlite`
  (v24.16.0) for this rubric:
  - Non-cancelled value per program, `HAVING SUM(hours*valuation_rate) > 100`,
    `ORDER BY value DESC`:
    `[{"program":"Cedarbrook","value":168},{"program":"Fernglen","value":123},{"program":"Lanternwood","value":110}]`
  - Trap (same query but omitting `WHERE cancelled = 0`, i.e. including
    cancelled shifts):
    `[{"program":"Cedarbrook","value":204},{"program":"Fernglen","value":153},{"program":"Lanternwood","value":110}]`
    Note Lanternwood is unaffected by the trap (it has no cancelled rows)
    — this is expected and does not indicate a passing submission if
    Cedarbrook/Fernglen are wrong.
  - Every-shift-hours>=4 via `HAVING MIN(hours) >= 4`:
    `[{"program":"Lanternwood"}]` — confirmed equivalent to a `NOT
    EXISTS` anti-join on `hours < 4`.
  - Trap (bare `WHERE hours >= 4` with `DISTINCT program`, admitting any
    program with at least one qualifying row instead of requiring all
    rows to qualify):
    `[{"program":"Cedarbrook"},{"program":"Fernglen"},{"program":"Lanternwood"}]`
    — all three programs, because each has at least one shift with
    hours>=4, even though Cedarbrook and Fernglen both also have an
    hours<4 shift.
- Collision check for graders: the trap value set
  `{Cedarbrook:204, Fernglen:153, Lanternwood:110}` and the trap
  quantifier set `{Cedarbrook, Fernglen, Lanternwood}` are both
  distinguishable from the correct answers (`{168,123,110}` and
  `{Lanternwood}` respectively) — any submission landing on a trap value
  fails that check outright.
- To check obj-2, read the submitted SQL: the `WHERE cancelled = 0` (or
  equivalent, e.g. `WHERE cancelled <> 1`) clause must appear before/
  outside the `GROUP BY`/`HAVING`, filtering rows pre-aggregation.
  Applying an equivalent per-row filter via a subquery/CTE that
  pre-filters cancelled rows also satisfies this check.
- Correctness of WHERE/HAVING separation and quantifier logic: does the
  submission correctly filter cancelled rows at the row level (not by
  trying to filter on `cancelled` inside `HAVING`, which cannot
  correctly express a per-row exclusion once rows are aggregated), and
  does it correctly use `MIN(hours) >= 4` (or an anti-join) rather than
  a `WHERE hours >= 4` that only checks whether *some* row qualifies?
  PASS example: "We put `cancelled = 0` in the WHERE clause so the rows
  never reach GROUP BY, and used `HAVING MIN(hours) >= 4` so a program
  only counts as qualifying when its smallest shift still clears the
  bar." PASS example: "The cancellation flag is per-row, so it has to be
  resolved before the rows collapse into groups; the quantity condition
  is per-group, so it has to be resolved with an aggregate like MIN()
  after grouping." FAIL example: "We used HAVING cancelled = 0 to drop
  the cancelled shifts before grouping by program." (HAVING cannot see a
  raw per-row column once grouped — this is exactly the confusion the
  test is designed to catch). FAIL example: "WHERE hours >= 4 keeps only
  the programs where shifts are long enough." (a row-level WHERE cannot
  express a group-level "for all" condition; it only requires that
  *some* row in the surviving group satisfy the predicate).
- Query structure and result presentation: are the two queries clearly
  separated and labeled, is the ORDER BY applied as specified, are
  results presented legibly in ANSWERS.md? PASS example: each query
  prefixed with a `-- Q1:` / `-- Q2:` comment and ANSWERS.md tables in
  question order with descriptive column headers. PASS example: a
  single clean markdown table per query, values right-aligned or at
  least unambiguous. FAIL example: two SELECTs pasted back-to-back with
  no labels distinguishing which answers which question. FAIL example:
  result rows dumped as raw unformatted text with no indication of which
  number is `value` versus `hours`.
- Reasoning quality: does the explanation correctly state that WHERE
  filters rows before grouping/aggregation while HAVING filters groups
  after aggregation, and that `MIN(hours) >= 4` is true for a program
  only when *every* shift's hours is >= 4 (since the group's minimum
  must clear the bar), which is what "every shift" requires? PASS
  example: "WHERE removes the cancelled rows before SUM() ever sees
  them, so the value total is computed only from worked shifts; a
  HAVING-based cancellation filter doesn't work because by the time
  HAVING runs, the rows are already collapsed into one group per
  program — there's no per-row cancelled flag left to filter on. For
  the hours condition, a group's MIN(hours) can only be >= 4 if
  literally every shift in that group has hours >= 4, which is exactly
  the 'for all' condition we need; a plain WHERE hours >= 4 instead
  throws away the disqualifying short shifts and leaves behind programs
  that only partially qualify." Another PASS example: "Cancelled is a
  per-row property so it must be resolved in WHERE, before GROUP BY
  destroys the row-level detail; the minimum of a set can only clear a
  threshold if every member of the set clears it, which is why MIN()
  gives us a universal quantifier for free, whereas filtering first with
  WHERE and then just listing surviving programs would wrongly admit a
  program as long as one of its shifts happened to be long enough." FAIL
  example: "We filtered cancelled shifts and grouped by program to get
  the value." (does not explain the WHERE-before-HAVING ordering or why
  it matters). Another FAIL example: "MIN(hours) >= 4 checks if the
  hours is at least 4" (restates the syntax without explaining why MIN
  specifically encodes a universal quantifier over the group). A third
  FAIL example: "Cancelled shifts don't count so we left them out, and
  Lanternwood was the only program where everything was long enough."
  (states the correct outcome without ever naming the WHERE/HAVING
  mechanism or the MIN()-as-universal-quantifier reasoning that produces
  it).
