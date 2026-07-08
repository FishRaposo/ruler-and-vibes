---
id: logic-02c-tarnhollow-balloons
category: math-logic
title: Five Balloons at Tarnhollow
deliverables:
  - SOLUTION.md
---

## Task

Five hot-air balloons are tethered in a line across the Tarnhollow
meadow, numbered 1 (westmost) through 5 (eastmost). Each balloon is
flown by exactly one pilot, carries exactly one cargo, and shows an
envelope of exactly one color. Every pilot, cargo, and color below is
used exactly once across the five balloons.

- Pilots: Garro, Juno, Ondo, Vesk, Yarl
- Cargo: rhubarb, ferns, pears, tinsel, saffron
- Envelope colors: dun, jade, heather, plum, citron

Clues:

1. The pears carrier is at balloon 1.
2. Vesk's balloon is immediately west of the ferns carrier's balloon.
3. Garro carries ferns.
4. The rhubarb carrier shows the heather envelope.
5. The dun envelope is at balloon 5.
6. Ondo's envelope is jade.
7. The citron envelope has the plum envelope immediately to its west and
   the heather envelope immediately to its east.
8. Juno's balloon is somewhere to the east of the plum-envelope balloon
   — at any distance, not necessarily immediately to its east.
9. The tinsel carrier's balloon is adjacent to the rhubarb carrier's
   balloon (immediately to its west or east).
10. Yarl's envelope is dun.
11. Ondo's balloon is somewhere to the west of Vesk's balloon.

**Bonus question**: which pilot's balloon sits strictly between the
saffron carrier's balloon and the rhubarb carrier's balloon?

## Deliverables

- `SOLUTION.md` — must contain, in this order:
  - A 5-row table with columns `Balloon | Pilot | Cargo | Color`,
    one row per balloon, fully filled in.
  - The bonus answer, clearly labeled.
  - A numbered deduction chain showing the inference steps that lead
    to the unique solution, each step citing at least one clue number
    (e.g. "clue 7").

## Constraints

- At most 450 words (whole file, `wc -w`).
- The puzzle has exactly one solution consistent with all eleven
  clues; do not present multiple candidate solutions.
