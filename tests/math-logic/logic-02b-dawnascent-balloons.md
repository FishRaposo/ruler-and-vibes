---
id: logic-02b-dawnascent-balloons
category: math-logic
title: Five Balloons at Dawn Ascent
deliverables:
  - SOLUTION.md
---

## Task

Five hot-air balloons are tethered in a row for the Dawn Ascent, numbered
1 (westmost) through 5 (eastmost). Each balloon has exactly one pilot,
carries exactly one cargo, and flies exactly one flag color. Every pilot,
cargo, and color below is used exactly once across the five balloons.

- Pilots: Fenna, Marlo, Odalie, Vesper, Yarrow
- Cargo: cocoa, figs, ginger, quilts, walnuts
- Flag colors: copper, indigo, ochre, scarlet, teal

Clues:

1. The figs balloon is at stall 1.
2. Yarrow's balloon is immediately west of the ginger balloon's stall.
3. Marlo carries ginger.
4. The cocoa balloon flies the indigo flag.
5. The scarlet flag is at stall 5.
6. Fenna's flag is teal.
7. The copper flag has the ochre flag immediately to its west and the
   indigo flag immediately to its east.
8. Vesper's balloon is somewhere to the east of the ochre-flag stall
   — at any distance, not necessarily immediately to its east.
9. The quilts balloon's stall is adjacent to the cocoa balloon's stall
   (immediately to its west or east).
10. Odalie's flag is scarlet.
11. Fenna's balloon is somewhere to the west of Yarrow's balloon.

**Bonus question**: which pilot's balloon sits strictly between the
walnuts balloon's stall and the cocoa balloon's stall?

## Deliverables

- `SOLUTION.md` — must contain, in this order:
  - A 5-row table with columns `Stall | Pilot | Cargo | Flag`,
    one row per stall, fully filled in.
  - The bonus answer, clearly labeled.
  - A numbered deduction chain showing the inference steps that lead
    to the unique solution, each step citing at least one clue number
    (e.g. "clue 7").

## Constraints

- At most 450 words (whole file, `wc -w`).
- The puzzle has exactly one solution consistent with all eleven
  clues; do not present multiple candidate solutions.
