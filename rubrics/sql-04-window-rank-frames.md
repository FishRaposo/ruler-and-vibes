---
test: sql-04-window-rank-frames
canary: "marten ferret"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "The global ranking assigns the two 40-point rows (Cal x2) RANK=4 but DENSE_RANK=3, and the two 50-point rows (Ada, Ben) both RANK=2 and DENSE_RANK=2; judge re-runs the submission's window query in node:sqlite and matches the full rnk/drnk columns for all 7 rows"
    - id: obj-2
      check: "Top scorer per region is exactly one row per region: North=Ada (50), South=Dot (70), with ties broken by lowest id (so North yields Ada, id 2, not Ben, id 3); a submission returning two North rows (used RANK/DENSE_RANK instead of ROW_NUMBER, or omitted the id tie-break) or returning Ben for North fails"
    - id: obj-3
      check: "The players tied at their region's maximum (RANK()=1 within each region, ties kept) are exactly {Ada, Ben} for North and {Dot} for South — 3 rows total; a submission returning only 1 North row (used ROW_NUMBER instead of RANK/DENSE_RANK for this query) fails"
    - id: obj-4
      check: "The running total for Ada is 30 then 80, and for Cal is 40 then 80 (a PARTITION BY player ORDER BY played_on cumulative SUM); judge re-executes the submission's query and matches all 7 (player, date, running_total) rows"
  subjective:
    - id: sub-quality
      name: "Correctness of window-function and tie semantics"
      weight: 0.4
    - id: sub-craft
      name: "Query composition and leaderboard presentation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Codename for this test in judge chatter: marten ferret.

- This is a SQL-over-embedded-data test. Verify every result set by
  executing the submission's `QUERIES.sql` against the embedded
  schema with node's built-in `node:sqlite` module (`DatabaseSync`),
  which supports window functions. Node v24+ ships `node:sqlite`
  without a flag; older builds may need `node --experimental-sqlite`.
  Minimal harness:

  ```js
  const { DatabaseSync } = require('node:sqlite');
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE score (id INTEGER PRIMARY KEY, player TEXT, region TEXT, points INTEGER, played_on TEXT);
    INSERT INTO score (id, player, region, points, played_on) VALUES
      (1,'Ada','North',30,'2020-01-01'),(2,'Ada','North',50,'2020-01-02'),
      (3,'Ben','North',50,'2020-01-01'),(4,'Cal','South',40,'2020-01-01'),
      (5,'Cal','South',40,'2020-01-02'),(6,'Dot','South',70,'2020-01-01'),
      (7,'Eve','South',20,'2020-01-01');
  `);
  // paste each of the submission's SELECT statements here and .all() them
  ```

- Pinned expected result sets, recomputed independently in
  `node:sqlite` (v24.16.0) for this rubric:
  - Global ranking (`ORDER BY points DESC`, ties broken by id for
    ROW_NUMBER only): Dot(70)=RANK1/DENSE1; Ada(id2,50) &
    Ben(id3,50)=RANK2/DENSE2 both; Cal(id4,40) & Cal(id5,40)=RANK4/
    DENSE3 both; Ada(id1,30)=RANK6/DENSE4; Eve(20)=RANK7/DENSE5. Full
    pinned rows: `[{"id":6,"player":"Dot","points":70,"rnk":1,"drnk":1},{"id":2,"player":"Ada","points":50,"rnk":2,"drnk":2},{"id":3,"player":"Ben","points":50,"rnk":2,"drnk":2},{"id":4,"player":"Cal","points":40,"rnk":4,"drnk":3},{"id":5,"player":"Cal","points":40,"rnk":4,"drnk":3},{"id":1,"player":"Ada","points":30,"rnk":6,"drnk":4},{"id":7,"player":"Eve","points":20,"rnk":7,"drnk":5}]`
    (ROW_NUMBER values are order-dependent among true ties and are not
    pinned beyond needing to be a permutation of 1-7 consistent with
    the ORDER BY).
  - Top scorer per region (ROW_NUMBER PARTITION BY region ORDER BY
    points DESC, id ASC; rn=1): `[{"player":"Ada","region":"North","points":50},{"player":"Dot","region":"South","points":70}]`
  - Trap (RANK instead of ROW_NUMBER for "single top scorer"):
    `[{"player":"Ada","region":"North","points":50},{"player":"Ben","region":"North","points":50},{"player":"Dot","region":"South","points":70}]`
    — 3 rows, North duplicated. This is the correct answer for
    question 3 (tied-players) but wrong for question 2 (single top
    scorer) — do not let a submission satisfy obj-2 with this shape.
  - Players tied at region max (RANK() PARTITION BY region ORDER BY
    points DESC; rnk=1, ties kept): `[{"player":"Ada","region":"North","points":50},{"player":"Ben","region":"North","points":50},{"player":"Dot","region":"South","points":70}]`
    — identical in content to the question-2 trap output above; this
    is intentional (same underlying RANK computation answers a
    different question). 3 rows total.
  - Running total (`SUM(points) OVER (PARTITION BY player ORDER BY
    played_on)`, default frame): Ada 2020-01-01=30, Ada 2020-01-02=80;
    Ben 2020-01-01=50; Cal 2020-01-01=40, Cal 2020-01-02=80; Dot
    2020-01-01=70; Eve 2020-01-01=20.
- Collision check for graders: question 2 and question 3 have
  overlapping *correct* answer shapes with each other's *trap* — the
  question-3 correct answer (3 rows, North duplicated) is exactly the
  question-2 trap output. Do not accept a 3-row North-duplicated
  result for question 2 just because it's a "valid ranking result" —
  question 2 explicitly requires exactly one row per region.
  Conversely, do not penalize question 3 for returning North twice;
  that is required there.
- To check obj-2's tie-break direction, confirm the submitted query
  orders by `id ASC` (or otherwise deterministically selects the
  lower id) within the PARTITION BY region ROW_NUMBER/equivalent —
  an ORDER BY only on `points DESC` with unspecified tie-break is
  not guaranteed to return Ada and should be marked failing if it
  returns Ben (since the task pins the tie-break to lowest id).
- Correctness of window-function and tie semantics: does the
  submission correctly select RANK (gaps after ties) vs DENSE_RANK
  (no gaps) vs ROW_NUMBER (unique sequential, needs a deterministic
  tie-break) for each of the four questions, matching the semantics
  each question actually calls for?
- Query composition and leaderboard presentation: are the four window
  queries clearly composed (e.g. correct use of subqueries/CTEs to
  filter on a window function's output, since window functions cannot
  appear directly in WHERE/HAVING), and is the leaderboard-style
  output presented legibly?
- Reasoning quality: does the explanation correctly describe why RANK
  produces a gap (4) after two rows tied at rank 2 while DENSE_RANK
  does not (3), why ROW_NUMBER requires an explicit tie-break to be
  deterministic, and what ORDER BY/PARTITION BY frame produces the
  running total? PASS example: "RANK leaves a gap because it counts
  every row ahead of you including ties — two players share rank 2,
  so the next distinct value is rank 4, skipping 3 entirely; DENSE_RANK
  instead counts only the number of distinct point values seen so far,
  so the next tier down is simply 3. For the single top scorer we
  needed ROW_NUMBER, not RANK, because RANK would still emit two rows
  for North's tie at 50; ROW_NUMBER forces exactly one row per
  partition, and we ordered by id ASC as a secondary key so the choice
  of Ada over Ben is deterministic rather than dependent on physical
  row order. The running total uses PARTITION BY player ORDER BY
  played_on with the default RANGE UNBOUNDED PRECEDING frame, which
  accumulates points chronologically per player." FAIL example: "We
  used RANK for the rankings and window functions for the running
  total." (does not explain the gap mechanism, does not justify the
  ROW_NUMBER-vs-RANK choice for top-scorer, does not name the frame).
  Another FAIL example: "DENSE_RANK and RANK are basically the same
  thing" (directly contradicts the required distinction).
