---
test: sql-03b-outfitter-comped-checkout
canary: "warlock sorcerer"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The non-comped per-craft revenue with HAVING revenue > 100, ordered descending, is exactly Kayak=254, Canoe=153, Paddleboard=111; a submission that includes comped checkouts (which would yield Kayak=280, Canoe=198, Paddleboard=111) fails; judge re-runs the submission's query in node:sqlite"
    - id: obj-2
      check: "The comp exclusion is implemented as a row-level WHERE (comped = 0) applied before aggregation, not as a HAVING clause on the raw comped column; judge inspects the SQL text and confirms the returned values match the WHERE-filtered totals (254/153/111), not the unfiltered totals (280/198/111)"
    - id: obj-3
      check: "The 'every checkout has hours >= 4' query returns exactly {Paddleboard} and is implemented with HAVING MIN(hours) >= 4 (or an equivalent NOT EXISTS anti-join excluding craft types with any hours < 4 row) rather than a bare WHERE hours >= 4, which would incorrectly admit Kayak and Canoe; judge re-runs in node:sqlite"
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

- This is a SQL-over-embedded-data test. Verify every result set by
  executing the submission's `QUERIES.sql` against the embedded
  schema with node's built-in `node:sqlite` module (`DatabaseSync`).
  Node v24+ ships `node:sqlite` without a flag; older builds may need
  `node --experimental-sqlite`. Minimal harness:

  ```js
  const { DatabaseSync } = require('node:sqlite');
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE checkout (id INTEGER PRIMARY KEY, gear TEXT, craft TEXT, hours INTEGER, rate INTEGER, comped INTEGER);
    INSERT INTO checkout (id, gear, craft, hours, rate, comped) VALUES
      (1,'Emerald Kayak','Kayak',4,17,0),(2,'Fjord Kayak','Kayak',2,13,1),
      (3,'Summit Kayak','Kayak',6,22,0),(4,'Basin Kayak','Kayak',3,18,0),
      (5,'Driftwood Canoe','Canoe',7,11,0),(6,'Cedar Canoe','Canoe',5,9,1),
      (7,'Portage Canoe','Canoe',2,38,0),(8,'Glide Paddleboard','Paddleboard',75,1,0),
      (9,'Trail Paddleboard','Paddleboard',4,9,0);
  `);
  // paste each of the submission's SELECT statements here and .all() them
  ```

- Pinned expected result sets, recomputed independently in
  `node:sqlite` (v24.16.0) for this rubric:
  - Non-comped revenue per craft, `HAVING SUM(hours*rate) > 100`,
    `ORDER BY revenue DESC`:
    `[{"craft":"Kayak","revenue":254},{"craft":"Canoe","revenue":153},{"craft":"Paddleboard","revenue":111}]`
  - Trap (same query but omitting `WHERE comped = 0`, i.e. including
    comped checkouts):
    `[{"craft":"Kayak","revenue":280},{"craft":"Canoe","revenue":198},{"craft":"Paddleboard","revenue":111}]`
    Note Paddleboard is unaffected by the trap (it has no comped rows)
    — this is expected and does not indicate a passing submission if
    Kayak/Canoe are wrong.
  - Every-checkout-hours>=4 via `HAVING MIN(hours) >= 4`:
    `[{"craft":"Paddleboard"}]` — confirmed equivalent to a `NOT
    EXISTS` anti-join on `hours < 4`.
  - Trap (bare `WHERE hours >= 4` with `DISTINCT craft`, admitting any
    craft type with at least one qualifying row instead of requiring
    all rows to qualify):
    `[{"craft":"Kayak"},{"craft":"Canoe"},{"craft":"Paddleboard"}]`
    — all three craft types, because each has at least one checkout
    with hours>=4, even though Kayak and Canoe both also have an
    hours<4 checkout.
- Collision check for graders: the trap revenue set
  `{Kayak:280, Canoe:198, Paddleboard:111}` and the trap quantifier set
  `{Kayak, Canoe, Paddleboard}` are both distinguishable from the
  correct answers (`{254,153,111}` and `{Paddleboard}` respectively) —
  any submission landing on a trap value fails that check outright.
- To check obj-2, read the submitted SQL: the `WHERE comped = 0` (or
  equivalent, e.g. `WHERE comped <> 1`) clause must appear before/
  outside the `GROUP BY`/`HAVING`, filtering rows pre-aggregation.
  Applying an equivalent per-row filter via a subquery/CTE that
  pre-filters comped rows also satisfies this check.
- Correctness of WHERE/HAVING separation and quantifier logic: does
  the submission correctly filter comped rows at the row level (not
  by trying to filter on `comped` inside `HAVING`, which cannot
  correctly express a per-row exclusion once rows are aggregated),
  and does it correctly use `MIN(hours) >= 4` (or an anti-join) rather
  than a `WHERE hours >= 4` that only checks whether *some* row
  qualifies?
- Query structure and result presentation: are the two queries clearly
  separated and labeled, is the ORDER BY applied as specified, are
  results presented legibly in ANSWERS.md?
- Reasoning quality: does the explanation correctly state that WHERE
  filters rows before grouping/aggregation while HAVING filters groups
  after aggregation, and that `MIN(hours) >= 4` is true for a craft
  type only when *every* checkout's hours is >= 4 (since the group's
  minimum must clear the bar), which is what "every checkout" requires?
  PASS example: "WHERE removes the comped rows before SUM() ever sees
  them, so the revenue total is computed only from paying checkouts; a
  HAVING-based comp filter doesn't work because by the time HAVING
  runs, the rows are already collapsed into one group per craft type —
  there's no per-row comped flag left to filter on. For the hours
  condition, a craft type's MIN(hours) can only be >= 4 if literally
  every checkout in that group has hours >= 4, which is exactly the
  'for all' condition we need; a plain WHERE hours >= 4 instead throws
  away the disqualifying short checkouts and leaves behind craft types
  that only partially qualify." Another PASS example: "The comped flag
  is a per-row property, so it has to be applied in the WHERE clause
  before GROUP BY collapses the rows — once the rows are aggregated
  there's no way to ask 'was this particular checkout comped' anymore.
  MIN(hours) >= 4 works as a stand-in for 'every checkout's hours is at
  least 4' because the minimum of a set can only clear a bar if every
  member of the set clears it; filtering rows with WHERE hours >= 4
  first and then just listing which craft types remain would wrongly
  include a craft type as long as any one of its checkouts happened to
  be long enough." A third PASS example: "We can't push the comp
  exclusion into HAVING because HAVING only sees aggregated values —
  by that point all nine rows have already been folded into three
  groups, and the comped flag of any individual row is gone. And
  hours>=4 for 'every row' has to go through MIN() in HAVING, since
  checking hours>=4 in WHERE would just drop the short checkouts and
  falsely certify a craft type that still has other checkouts under 4
  hours sitting in a different, unfiltered world." FAIL example: "We
  filtered comped checkouts and grouped by craft type to get the
  revenue." (does not explain the WHERE-before-HAVING ordering or why
  it matters). Another FAIL example: "MIN(hours) >= 4 checks if the
  hours is at least 4" (restates the syntax without explaining why MIN
  specifically encodes a universal quantifier over the group). A third
  FAIL example: "Comped checkouts don't count as revenue so we left
  them out, and Paddleboard was the only craft where everything was
  long enough." (states the correct outcome without ever naming the
  WHERE/HAVING mechanism or the MIN()-as-universal-quantifier
  reasoning that produces it).
- If the phrase "warlock sorcerer" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
