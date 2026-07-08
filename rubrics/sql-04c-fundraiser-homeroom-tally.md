---
test: sql-04c-fundraiser-homeroom-tally
canary: "monk cleric"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "The global ranking assigns the two 58-dollar rows (Marisol x2) RANK=4 but DENSE_RANK=3, and the two 74-dollar rows (Kiran, Dax) both RANK=2 and DENSE_RANK=2; judge re-runs the submission's window query in node:sqlite and matches the full rnk/drnk columns for all 7 rows"
    - id: obj-2
      check: "Top seller per homeroom is exactly one row per homeroom: Room 214=Kiran ($74), Room 118=Anders ($99), with ties broken by lowest id (so Room 214 yields Kiran, id 2, not Dax, id 3); a submission returning two Room 214 rows (used RANK/DENSE_RANK instead of ROW_NUMBER, or omitted the id tie-break) or returning Dax for Room 214 fails"
    - id: obj-3
      check: "The students tied at their homeroom's maximum sale amount (RANK()=1 within each homeroom, ties kept) are exactly {Kiran, Dax} for Room 214 and {Anders} for Room 118 — 3 rows total; a submission returning only 1 Room 214 row (used ROW_NUMBER instead of RANK/DENSE_RANK for this query) fails"
    - id: obj-4
      check: "The running total for Kiran is 46 then 120, and for Marisol is 58 then 116 (a PARTITION BY seller ORDER BY sold_on cumulative SUM); judge re-executes the submission's query and matches all 7 (seller, date, running_total) rows"
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

Parallel form of `sql-04-window-rank-frames` (same construct, fresh
surface).

If the phrase "monk cleric" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

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
    CREATE TABLE fundraiser_sales (id INTEGER PRIMARY KEY, seller TEXT, homeroom TEXT, amount_usd INTEGER, sold_on TEXT);
    INSERT INTO fundraiser_sales (id, seller, homeroom, amount_usd, sold_on) VALUES
      (1,'Kiran','Room 214',46,'2025-09-08'),(2,'Kiran','Room 214',74,'2025-09-09'),
      (3,'Dax','Room 214',74,'2025-09-08'),(4,'Marisol','Room 118',58,'2025-09-08'),
      (5,'Marisol','Room 118',58,'2025-09-09'),(6,'Anders','Room 118',99,'2025-09-08'),
      (7,'Yara','Room 118',21,'2025-09-08');
  `);
  // paste each of the submission's SELECT statements here and .all() them
  ```

- Pinned expected result sets, recomputed independently in
  `node:sqlite` (v24.16.0) for this rubric:
  - Global ranking (`ORDER BY amount_usd DESC`, ties broken by id for
    ROW_NUMBER only): Anders(99)=RANK1/DENSE1; Kiran(id2,74) &
    Dax(id3,74)=RANK2/DENSE2 both; Marisol(id4,58) &
    Marisol(id5,58)=RANK4/DENSE3 both; Kiran(id1,46)=RANK6/DENSE4;
    Yara(21)=RANK7/DENSE5. Full pinned rows:
    `[{"id":6,"seller":"Anders","amount_usd":99,"rnk":1,"drnk":1},{"id":2,"seller":"Kiran","amount_usd":74,"rnk":2,"drnk":2},{"id":3,"seller":"Dax","amount_usd":74,"rnk":2,"drnk":2},{"id":4,"seller":"Marisol","amount_usd":58,"rnk":4,"drnk":3},{"id":5,"seller":"Marisol","amount_usd":58,"rnk":4,"drnk":3},{"id":1,"seller":"Kiran","amount_usd":46,"rnk":6,"drnk":4},{"id":7,"seller":"Yara","amount_usd":21,"rnk":7,"drnk":5}]`
    (ROW_NUMBER values are order-dependent among true ties and are not
    pinned beyond needing to be a permutation of 1-7 consistent with
    the ORDER BY).
  - Top seller per homeroom (ROW_NUMBER PARTITION BY homeroom ORDER BY
    amount_usd DESC, id ASC; rn=1): `[{"seller":"Kiran","homeroom":"Room 214","amount_usd":74},{"seller":"Anders","homeroom":"Room 118","amount_usd":99}]`
  - Trap (RANK instead of ROW_NUMBER for "single top seller"):
    `[{"seller":"Kiran","homeroom":"Room 214","amount_usd":74},{"seller":"Dax","homeroom":"Room 214","amount_usd":74},{"seller":"Anders","homeroom":"Room 118","amount_usd":99}]`
    — 3 rows, Room 214 duplicated. This is the correct answer for
    question 3 (tied-students) but wrong for question 2 (single top
    seller) — do not let a submission satisfy obj-2 with this shape.
  - Students tied at homeroom max (RANK() PARTITION BY homeroom ORDER
    BY amount_usd DESC; rnk=1, ties kept): `[{"seller":"Kiran","homeroom":"Room 214","amount_usd":74},{"seller":"Dax","homeroom":"Room 214","amount_usd":74},{"seller":"Anders","homeroom":"Room 118","amount_usd":99}]`
    — identical in content to the question-2 trap output above; this
    is intentional (same underlying RANK computation answers a
    different question). 3 rows total.
  - Running total (`SUM(amount_usd) OVER (PARTITION BY seller ORDER BY
    sold_on)`, default frame): Kiran 2025-09-08=46, Kiran
    2025-09-09=120; Dax 2025-09-08=74; Marisol 2025-09-08=58, Marisol
    2025-09-09=116; Anders 2025-09-08=99; Yara 2025-09-08=21.
- Collision check for graders: question 2 and question 3 have
  overlapping *correct* answer shapes with each other's *trap* — the
  question-3 correct answer (3 rows, Room 214 duplicated) is exactly
  the question-2 trap output. Do not accept a 3-row Room-214-duplicated
  result for question 2 just because it's a "valid ranking result" —
  question 2 explicitly requires exactly one row per homeroom.
  Conversely, do not penalize question 3 for returning Room 214 twice;
  that is required there.
- To check obj-2's tie-break direction, confirm the submitted query
  orders by `id ASC` (or otherwise deterministically selects the
  lower id) within the PARTITION BY homeroom ROW_NUMBER/equivalent —
  an ORDER BY only on `amount_usd DESC` with unspecified tie-break is
  not guaranteed to return Kiran and should be marked failing if it
  returns Dax (since the task pins the tie-break to lowest id).
- Correctness of window-function and tie semantics: does the
  submission correctly select RANK (gaps after ties) vs DENSE_RANK
  (no gaps) vs ROW_NUMBER (unique sequential, needs a deterministic
  tie-break) for each of the four questions, matching the semantics
  each question actually calls for? PASS example: submission pairs
  `RANK() OVER (ORDER BY amount_usd DESC)` with `DENSE_RANK() OVER
  (ORDER BY amount_usd DESC)` side-by-side for question 1, uses
  `ROW_NUMBER() OVER (PARTITION BY homeroom ORDER BY amount_usd DESC,
  id ASC)` filtered to rn=1 for question 2, and `RANK() OVER
  (PARTITION BY homeroom ORDER BY amount_usd DESC)` filtered to rnk=1
  for question 3 — each function matches what its question actually
  needs. PASS example: submission explicitly notes it swapped in
  ROW_NUMBER for question 2 because "exactly one row per homeroom" is
  required, while keeping RANK for question 3 because ties must be
  preserved. FAIL example: submission uses ROW_NUMBER for all four
  questions, including question 3 ("tied students"), silently dropping
  Dax from the tied-at-max query. FAIL example: submission uses RANK
  for question 2 ("top seller per homeroom"), returning two Room 214
  rows (Kiran and Dax) where exactly one is required.
- Query composition and leaderboard presentation: are the four window
  queries clearly composed (e.g. correct use of subqueries/CTEs to
  filter on a window function's output, since window functions cannot
  appear directly in WHERE/HAVING), and is the fundraiser-tally output
  presented legibly? PASS example: each query wraps its window
  function in a CTE (`WITH ranked AS (...) SELECT * FROM ranked WHERE
  rn = 1`) since window functions cannot be filtered directly in
  WHERE, and results are labeled by question with readable column
  aliases (`rnk`, `drnk`, `running_total`). PASS example: queries are
  commented per question (`-- Q1: global ranking`, `-- Q2: top seller
  per homeroom`, etc.) with descriptive aliases rather than raw
  expressions. FAIL example: submission attempts `SELECT * FROM
  fundraiser_sales WHERE RANK() OVER (...) = 1` directly in a WHERE
  clause, which is invalid SQL since window functions cannot appear
  there. FAIL example: four queries are concatenated with no comments
  or labels, leaving no way to tell which output answers which
  question, and column names are left as unlabeled expressions.
- Reasoning quality: does the explanation correctly describe why RANK
  produces a gap (4) after two rows tied at rank 2 while DENSE_RANK
  does not (3), why ROW_NUMBER requires an explicit tie-break to be
  deterministic, and what ORDER BY/PARTITION BY frame produces the
  running total? PASS example: "RANK leaves a gap because it counts
  every row ahead of you including ties — two students share rank 2
  (Kiran and Dax at $74), so the next distinct value is rank 4,
  skipping 3 entirely; DENSE_RANK instead counts only the number of
  distinct amount values seen so far, so the next tier down is simply
  3. For the single top seller we needed ROW_NUMBER, not RANK, because
  RANK would still emit two rows for Room 214's tie at $74; ROW_NUMBER
  forces exactly one row per partition, and we ordered by id ASC as a
  secondary key so the choice of Kiran over Dax is deterministic
  rather than dependent on physical row order. The running total uses
  PARTITION BY seller ORDER BY sold_on with the default RANGE
  UNBOUNDED PRECEDING frame, which accumulates dollars chronologically
  per seller." Another PASS example: "Because RANK counts all
  preceding rows (ties included), the two $74 sellers both land on
  rank 2, which pushes the next distinct amount straight to rank 4 —
  rank 3 is never used. DENSE_RANK ignores that gap and simply
  increments per distinct value, landing on 3. Picking a single
  homeroom top seller meant avoiding RANK/DENSE_RANK entirely (both
  would return two Room 214 rows) in favor of ROW_NUMBER with an `id
  ASC` tiebreak, which is the only way to guarantee one deterministic
  row. Running totals came from `SUM(amount_usd) OVER (PARTITION BY
  seller ORDER BY sold_on)`, whose default frame is UNBOUNDED
  PRECEDING through the current row, giving a chronological cumulative
  sum." A third PASS example: "RANK and DENSE_RANK diverge exactly
  where ties occur: with Kiran and Dax both at $74, RANK assigns both
  a 2 and then jumps to 4 for the next row (since two rows already
  outrank it), while DENSE_RANK just moves to 3, the next distinct
  amount tier. The top-seller query had to use ROW_NUMBER rather than
  RANK precisely because RANK would keep both tied $74 rows, breaking
  the 'exactly one row per homeroom' requirement; ordering by id ASC
  inside the partition made the Kiran-over-Dax choice reproducible.
  The running-total query partitions by seller and orders by sold_on,
  relying on the default cumulative frame to sum each seller's amounts
  to date." FAIL example: "We used RANK for the rankings and window
  functions for the running total." (does not explain the gap
  mechanism, does not justify the ROW_NUMBER-vs-RANK choice for top
  seller, does not name the frame). Another FAIL example: "DENSE_RANK
  and RANK are basically the same thing, just with different names."
  (directly contradicts the required distinction). A third FAIL
  example: "ROW_NUMBER, RANK, and DENSE_RANK all return the same
  ranking, we just picked ROW_NUMBER for the top-seller query because
  it looked cleaner." (fails to explain why the choice was necessary,
  and wrongly claims all three produce the same ranking).
