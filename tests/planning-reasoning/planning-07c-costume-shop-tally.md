---
id: planning-07c-costume-shop-tally
category: planning-reasoning
title: Repertory costume shop tally replay
deliverables:
  - COSTUME-FINAL.md
---

## Task

A repertory theater's costume shop keeps stock of five reusable piece
types. The opening inventory is:

| Piece | Opening count |
|-------|---------------|
| CAPE  | 35            |
| BOOT  | 18            |
| WIG   | 85            |
| MASK  | 6             |
| SASH  | 9             |

**Pinned operation semantics:**

- `TAILOR piece n` — increases the piece's count by `n` (newly made or
  repaired pieces added to stock).
- `AUDIT piece n` — **overwrites** the piece's count to exactly `n`
  (this is not an addition; whatever the count was before is
  discarded — it represents a physical recount).
- `ISSUE piece n` — subtracts `n` from the piece's count (checked out
  to a production). If `n` is greater than the current count, the
  count is floored at 0 AND the step is recorded as an **underflow**,
  with `shortfall = n - available` (the available count at the moment
  of the operation, before this step runs). If `n` is less than or
  equal to the current count, this is a normal, valid issue — it is
  never flagged, even if it drains the piece to exactly 0.

Below is the numbered log of 30 operations, applied in order:

1. TAILOR CAPE 14
2. TAILOR BOOT 7
3. ISSUE WIG 30
4. TAILOR MASK 20
5. TAILOR SASH 16
6. ISSUE CAPE 9
7. TAILOR WIG 40
8. AUDIT BOOT 11
9. ISSUE MASK 26
10. TAILOR CAPE 10
11. ISSUE SASH 5
12. ISSUE BOOT 24
13. TAILOR MASK 8
14. TAILOR WIG 0
15. AUDIT SASH 18
16. ISSUE CAPE 17
17. TAILOR BOOT 5
18. ISSUE WIG 90
19. TAILOR MASK 11
20. ISSUE SASH 9
21. TAILOR CAPE 19
22. AUDIT WIG 26
23. ISSUE MASK 24
24. TAILOR BOOT 0
25. TAILOR MASK 35
26. ISSUE SASH 0
27. TAILOR SASH 9
28. ISSUE CAPE 0
29. TAILOR BOOT 0
30. TAILOR WIG 0

Replay all 30 operations in order under the pinned semantics and
report the final state.

## Deliverables

- `COSTUME-FINAL.md` — must report:
  - The final count of every piece (CAPE, BOOT, WIG, MASK, SASH).
  - The grand total of all pieces across all five types.
  - The exact list of underflow events, each with piece, requested
    amount, available amount at that step, and shortfall.

## Constraints

- Apply the pinned semantics exactly — `AUDIT` overwrites, it does not
  add to the existing count.
- Do not flag an `ISSUE` as an underflow unless the requested amount
  strictly exceeds the available count at that step.
