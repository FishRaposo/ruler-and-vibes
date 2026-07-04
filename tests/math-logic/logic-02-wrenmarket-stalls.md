---
id: logic-02-wrenmarket-stalls
category: math-logic
title: Five Stalls at Wrenmarket
deliverables:
  - SOLUTION.md
---

## Task

Five stalls stand in a row at Wrenmarket, numbered 1 (leftmost) through
5 (rightmost). Each stall belongs to exactly one vendor, sells exactly
one good, and flies exactly one banner color. Every vendor, good, and
color below is used exactly once across the five stalls.

- Vendors: Ansa, Brix, Corvel, Dima, Ezel
- Goods: candles, honey, lanterns, maps, rope
- Banner colors: amber, blue, crimson, green, violet

Clues:

1. The map seller is at stall 1.
2. Ansa's stall is immediately left of the rope seller's stall.
3. Ezel sells rope.
4. The honey seller flies the blue banner.
5. The crimson banner is at stall 5.
6. Dima's banner is green.
7. The amber banner has the violet banner immediately to its left and
   the blue banner immediately to its right.
8. Brix's stall is somewhere to the right of the violet-banner stall
   — at any distance, not necessarily immediately to its right.
9. The lantern seller's stall is adjacent to the honey seller's stall
   (immediately to its left or right).
10. Corvel's banner is crimson.
11. Dima's stall is somewhere to the left of Ansa's stall.

**Bonus question**: which vendor's stall sits strictly between the
candle seller's stall and the honey seller's stall?

## Deliverables

- `SOLUTION.md` — must contain, in this order:
  - A 5-row table with columns `Stall | Vendor | Good | Banner`,
    one row per stall, fully filled in.
  - The bonus answer, clearly labeled.
  - A numbered deduction chain showing the inference steps that lead
    to the unique solution, each step citing at least one clue number
    (e.g. "clue 7").

## Constraints

- At most 450 words (whole file, `wc -w`).
- The puzzle has exactly one solution consistent with all eleven
  clues; do not present multiple candidate solutions.
