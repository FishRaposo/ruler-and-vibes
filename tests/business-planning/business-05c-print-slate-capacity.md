---
id: business-05c-print-slate-capacity
category: business-planning
title: Print slate selection under a fixed factory capacity
deliverables:
  - roadmap.md
---

## Task

Gildmere Games is planning next season's print slate. The factory has a
fixed capacity of **24 press-days** for the season — none can be added or
outsourced. Six candidate titles are under consideration, each with a
projected margin score (higher is better) and a press-day cost:

| Title | Margin | Press-days |
|---|---|---|
| Meadowloom | 12 | 5 |
| Emberfall | 96 | 7 |
| Copperline | 18 | 6 |
| Latchkey | 66 | 6 |
| Wraithwood | 48 | 5 |
| Saltmarsh | 30 | 4 |

Two constraints apply:

1. **Meadowloom is mandatory.** It must print this season regardless of
   its margin, because a licensing deal with Harrowgate obligates a
   printing.
2. **Emberfall has a hard dependency on Copperline.** Emberfall is an
   expansion and cannot ship unless Copperline, its base game, also
   prints in the same season (the expansion is unusable without the base
   game's components).

Any other combination of titles may be printed or dropped freely, subject
only to the 24 press-day capacity.

## Deliverable

`roadmap.md` must:

- State the selected set of titles for the season.
- State the total margin and total press-day cost of the selected set.
- Explain why each dropped title was left out (or explicitly note that a
  title was dropped purely for capacity reasons).
- Respect both constraints: Meadowloom must be included, and Emberfall
  cannot appear without Copperline.

## Constraints

- Total press-days for the selected set must not exceed 24.
- At most 500 words (whole file, `wc -w`).
