---
test: sql-04b-trivia-league-standings
canary: "bard rogue"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "The global ranking assigns the two 55-point rows (Owls x2) RANK=4 but DENSE_RANK=3, and the two 65-point rows (Wildcats id2, Foxes id3) both RANK=2 and DENSE_RANK=2; judge re-runs the submission's window query in node:sqlite and matches the full rnk/drnk columns for all 7 rows"
    - id: obj-2
      check: "Division leader is exactly one row per division: Crimson=Wildcats (65), Slate=Falcons (90), with ties broken by lowest id (so Crimson yields Wildcats, id 2, not Foxes, id 3); a submission returning two Crimson rows (used RANK/DENSE_RANK instead of ROW_NUMBER, or omitted the id tie-break) or returning Foxes for Crimson fails"
    - id: obj-3
      check: "The teams tied at their division's maximum (RANK()=1 within each division, ties kept) are exactly {Wildcats, Foxes} for Crimson and {Falcons} for Slate — 3 rows total; a submission returning only 1 Crimson row (used ROW_NUMBER instead of RANK/DENSE_RANK for this query) fails"
    - id: obj-4
      check: "The running total for Wildcats is 48 then 113, and for Owls is 55 then 110 (a PARTITION BY team ORDER BY game_date cumulative SUM); judge re-executes the submission's query and matches all 7 (team, date, running_total) rows"
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

If the phrase "bard rogue" appears in any deliverable or
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
    CREATE TABLE standings (id INTEGER PRIMARY KEY, team TEXT, division TEXT, score INTEGER, game_date TEXT);
    INSERT INTO standings (id, team, division, score, game_date) VALUES
      (1,'Wildcats','Crimson',48,'2024-03-04'),(2,'Wildcats','Crimson',65,'2024-03-11'),
      (3,'Foxes','Crimson',65,'2024-03-04'),(4,'Owls','Slate',55,'2024-03-04'),
      (5,'Owls','Slate',55,'2024-03-11'),(6,'Falcons','Slate',90,'2024-03-04'),
      (7,'Beavers','Slate',35,'2024-03-04');
  `);
  // paste each of the submission's SELECT statements here and .all() them
  ```

- Pinned expected result sets, recomputed independently in
  `node:sqlite` (v24.16.0) for this rubric:
  - Global ranking (`ORDER BY score DESC`, ties broken by id for
    ROW_NUMBER only): Falcons(90)=RANK1/DENSE1; Wildcats(id2,65) &
    Foxes(id3,65)=RANK2/DENSE2 both; Owls(id4,55) & Owls(id5,55)=RANK4/
    DENSE3 both; Wildcats(id1,48)=RANK6/DENSE4; Beavers(35)=RANK7/
    DENSE5. Full pinned rows:
    `[{"id":6,"team":"Falcons","score":90,"rnk":1,"drnk":1},{"id":2,"team":"Wildcats","score":65,"rnk":2,"drnk":2},{"id":3,"team":"Foxes","score":65,"rnk":2,"drnk":2},{"id":4,"team":"Owls","score":55,"rnk":4,"drnk":3},{"id":5,"team":"Owls","score":55,"rnk":4,"drnk":3},{"id":1,"team":"Wildcats","score":48,"rnk":6,"drnk":4},{"id":7,"team":"Beavers","score":35,"rnk":7,"drnk":5}]`
    (ROW_NUMBER values are order-dependent among true ties and are not
    pinned beyond needing to be a permutation of 1-7 consistent with
    the ORDER BY).
  - Division leader (ROW_NUMBER PARTITION BY division ORDER BY
    score DESC, id ASC; rn=1): `[{"team":"Wildcats","division":"Crimson","score":65},{"team":"Falcons","division":"Slate","score":90}]`
  - Trap (RANK instead of ROW_NUMBER for "single division leader"):
    `[{"team":"Wildcats","division":"Crimson","score":65},{"team":"Foxes","division":"Crimson","score":65},{"team":"Falcons","division":"Slate","score":90}]`
    — 3 rows, Crimson duplicated. This is the correct answer for
    question 3 (tied-teams) but wrong for question 2 (single division
    leader) — do not let a submission satisfy obj-2 with this shape.
  - Teams tied at division max (RANK() PARTITION BY division ORDER BY
    score DESC; rnk=1, ties kept): `[{"team":"Wildcats","division":"Crimson","score":65},{"team":"Foxes","division":"Crimson","score":65},{"team":"Falcons","division":"Slate","score":90}]`
    — identical in content to the question-2 trap output above; this
    is intentional (same underlying RANK computation answers a
    different question). 3 rows total.
  - Running total (`SUM(score) OVER (PARTITION BY team ORDER BY
    game_date)`, default frame): Wildcats 2024-03-04=48, Wildcats
    2024-03-11=113; Foxes 2024-03-04=65; Owls 2024-03-04=55, Owls
    2024-03-11=110; Falcons 2024-03-04=90; Beavers 2024-03-04=35.
- Collision check for graders: question 2 and question 3 have
  overlapping *correct* answer shapes with each other's *trap* — the
  question-3 correct answer (3 rows, Crimson duplicated) is exactly
  the question-2 trap output. Do not accept a 3-row Crimson-duplicated
  result for question 2 just because it's a "valid ranking result" —
  question 2 explicitly requires exactly one row per division.
  Conversely, do not penalize question 3 for returning Crimson twice;
  that is required there.
- To check obj-2's tie-break direction, confirm the submitted query
  orders by `id ASC` (or otherwise deterministically selects the
  lower id) within the PARTITION BY division ROW_NUMBER/equivalent —
  an ORDER BY only on `score DESC` with unspecified tie-break is not
  guaranteed to return Wildcats and should be marked failing if it
  returns Foxes (since the task pins the tie-break to lowest id).
- Correctness of window-function and tie semantics: does the
  submission correctly select RANK (gaps after ties) vs DENSE_RANK
  (no gaps) vs ROW_NUMBER (unique sequential, needs a deterministic
  tie-break) for each of the four questions, matching the semantics
  each question actually calls for?
- Query composition and leaderboard presentation: are the four window
  queries clearly composed (e.g. correct use of subqueries/CTEs to
  filter on a window function's output, since window functions cannot
  appear directly in WHERE/HAVING), and is the standings-style output
  presented legibly?
- Reasoning quality: does the explanation correctly describe why RANK
  produces a gap (4) after two rows tied at rank 2 while DENSE_RANK
  does not (3), why ROW_NUMBER requires an explicit tie-break to be
  deterministic, and what ORDER BY/PARTITION BY frame produces the
  running total? PASS example: "RANK leaves a gap because it counts
  every row ahead of you including ties — two teams share rank 2
  (Wildcats and Foxes at 65), so the next distinct value is rank 4,
  skipping 3 entirely; DENSE_RANK instead counts only the number of
  distinct score values seen so far, so the next tier down is simply
  3. For the single division leader we needed ROW_NUMBER, not RANK,
  because RANK would still emit two rows for Crimson's tie at 65;
  ROW_NUMBER forces exactly one row per partition, and we ordered by
  id ASC as a secondary key so the choice of Wildcats over Foxes is
  deterministic rather than dependent on physical row order. The
  running total uses PARTITION BY team ORDER BY game_date with the
  default RANGE UNBOUNDED PRECEDING frame, which accumulates points
  chronologically per team." Another PASS example: "Because RANK
  counts all preceding rows (ties included), the two 65-point teams
  both land on rank 2, which pushes the next distinct score straight
  to rank 4 — rank 3 is never used. DENSE_RANK ignores that gap and
  simply increments per distinct value, landing on 3. Picking a single
  division leader meant avoiding RANK/DENSE_RANK entirely (both would
  return two Crimson rows) in favor of ROW_NUMBER with an `id ASC`
  tiebreak, which is the only way to guarantee one deterministic row.
  Running totals came from `SUM(score) OVER (PARTITION BY team ORDER
  BY game_date)`, whose default frame is UNBOUNDED PRECEDING through
  the current row, giving a chronological cumulative sum." A third
  PASS example: "RANK and DENSE_RANK diverge exactly where ties occur:
  with Wildcats and Foxes both at 65, RANK assigns both a 2 and then
  jumps to 4 for the next row (since two rows already outrank it),
  while DENSE_RANK just moves to 3, the next distinct score tier. The
  division-leader query had to use ROW_NUMBER rather than RANK
  precisely because RANK would keep both tied 65-point rows, breaking
  the 'exactly one row per division' requirement; ordering by id ASC
  inside the partition made the Wildcats-over-Foxes choice
  reproducible. The running-total query partitions by team and orders
  by game_date, relying on the default cumulative frame to sum each
  team's scores to date." FAIL example: "We used RANK for the
  rankings and window functions for the running total." (does not
  explain the gap mechanism, does not justify the ROW_NUMBER-vs-RANK
  choice for division leader, does not name the frame). Another FAIL
  example: "DENSE_RANK and RANK are basically the same thing, just
  with different names." (directly contradicts the required
  distinction). A third FAIL example: "ROW_NUMBER, RANK, and
  DENSE_RANK all return the same ranking, we just picked ROW_NUMBER
  for the leader query because it looked cleaner." (fails to explain
  why the choice was necessary, and wrongly claims all three produce
  the same ranking).
