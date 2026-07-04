---
test: sql-03-group-having-filter
canary: "ocelot caribou"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "The non-refunded per-category revenue with HAVING revenue > 60, ordered descending, is exactly Hardware=170, Media=150, Swag=106; a submission that includes refunded lines (which would yield Hardware=190, Media=170) fails; judge re-runs the submission's query in node:sqlite"
    - id: obj-2
      check: "The refund exclusion is implemented as a row-level WHERE (refunded = 0) applied before aggregation, not as a HAVING clause on the raw refunded column; judge inspects the SQL text and confirms the returned values match the WHERE-filtered totals (170/150/106), not the unfiltered totals (190/170/106)"
    - id: obj-3
      check: "The 'every line item has qty >= 3' query returns exactly {Swag} and is implemented with HAVING MIN(qty) >= 3 (or an equivalent NOT EXISTS anti-join excluding categories with any qty < 3 row) rather than a bare WHERE qty >= 3, which would incorrectly admit Hardware and Media; judge re-runs in node:sqlite"
    - id: obj-4
      check: "ANSWERS.md (or QUERIES.sql comments) correctly distinguishes WHERE (applied per-row, before aggregation) from HAVING (applied per-group, after aggregation), and explains the MIN()-as-universal-quantifier idiom used for the qty>=3 query"
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

Codename for this test in judge chatter: ocelot caribou.

- This is a SQL-over-embedded-data test. Verify every result set by
  executing the submission's `QUERIES.sql` against the embedded
  schema with node's built-in `node:sqlite` module (`DatabaseSync`).
  Node v24+ ships `node:sqlite` without a flag; older builds may need
  `node --experimental-sqlite`. Minimal harness:

  ```js
  const { DatabaseSync } = require('node:sqlite');
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE sale (id INTEGER PRIMARY KEY, product TEXT, category TEXT, qty INTEGER, unit_price INTEGER, refunded INTEGER);
    INSERT INTO sale (id, product, category, qty, unit_price, refunded) VALUES
      (1,'Widget','Hardware',3,10,0),(2,'Widget','Hardware',2,10,1),
      (3,'Gadget','Hardware',5,20,0),(4,'Gadget','Hardware',2,20,0),
      (5,'Manual','Media',10,5,0),(6,'Manual','Media',4,5,1),
      (7,'Course','Media',2,50,0),(8,'Sticker','Swag',100,1,0),(9,'Pin','Swag',3,2,0);
  `);
  // paste each of the submission's SELECT statements here and .all() them
  ```

- Pinned expected result sets, recomputed independently in
  `node:sqlite` (v24.16.0) for this rubric:
  - Non-refunded revenue per category, `HAVING SUM(qty*unit_price) > 60`,
    `ORDER BY revenue DESC`:
    `[{"category":"Hardware","revenue":170},{"category":"Media","revenue":150},{"category":"Swag","revenue":106}]`
  - Trap (same query but omitting `WHERE refunded = 0`, i.e. including
    refunded lines):
    `[{"category":"Hardware","revenue":190},{"category":"Media","revenue":170},{"category":"Swag","revenue":106}]`
    Note Swag is unaffected by the trap (it has no refunded rows) —
    this is expected and does not indicate a passing submission if
    Hardware/Media are wrong.
  - Every-line-qty>=3 via `HAVING MIN(qty) >= 3`: `[{"category":"Swag"}]`
    — confirmed equivalent to a `NOT EXISTS` anti-join on `qty < 3`.
  - Trap (bare `WHERE qty >= 3` with `DISTINCT category`, admitting any
    category with at least one qualifying row instead of requiring
    all rows to qualify): `[{"category":"Hardware"},{"category":"Media"},{"category":"Swag"}]`
    — all three categories, because each has at least one line with
    qty>=3, even though Hardware and Media both also have a qty<3 line.
- Collision check for graders: the trap revenue set
  `{Hardware:190, Media:170, Swag:106}` and the trap quantifier set
  `{Hardware, Media, Swag}` are both distinguishable from the correct
  answers (`{170,150,106}` and `{Swag}` respectively) — any submission
  landing on a trap value fails that check outright.
- To check obj-2, read the submitted SQL: the `WHERE refunded = 0` (or
  equivalent, e.g. `WHERE refunded <> 1`) clause must appear before/
  outside the `GROUP BY`/`HAVING`, filtering rows pre-aggregation.
  Applying an equivalent per-row filter via a subquery/CTE that pre-
  filters refunded rows also satisfies this check.
- Correctness of WHERE/HAVING separation and quantifier logic: does
  the submission correctly filter refunded rows at the row level
  (not by trying to filter on `refunded` inside `HAVING`, which
  cannot correctly express a per-row exclusion once rows are
  aggregated), and does it correctly use `MIN(qty) >= 3` (or an anti-
  join) rather than a `WHERE qty >= 3` that only checks whether *some*
  row qualifies?
- Query structure and result presentation: are the two queries clearly
  separated and labeled, is the ORDER BY applied as specified, are
  results presented legibly in ANSWERS.md?
- Reasoning quality: does the explanation correctly state that WHERE
  filters rows before grouping/aggregation while HAVING filters groups
  after aggregation, and that `MIN(qty) >= 3` is true for a group only
  when *every* row's qty is >= 3 (since the group's minimum must clear
  the bar), which is what "every line item" requires? PASS example:
  "WHERE removes the refunded rows before SUM() ever sees them, so the
  revenue total is computed only from valid sales; a HAVING-based
  refund filter doesn't work because by the time HAVING runs, the rows
  are already collapsed into one group per category — there's no
  per-row refunded flag left to filter on. For the qty condition, a
  group's MIN(qty) can only be >= 3 if literally every row in that
  group has qty >= 3, which is exactly the 'for all' condition we
  need; a plain WHERE qty >= 3 instead throws away the disqualifying
  low-qty rows and leaves behind categories that only partially
  qualify." FAIL example: "We filtered refunded orders and grouped by
  category to get the revenue." (does not explain the WHERE-before-
  HAVING ordering or why it matters). Another FAIL example: "MIN(qty)
  >= 3 checks if the quantity is at least 3" (restates the syntax
  without explaining why MIN specifically encodes a universal
  quantifier over the group).
