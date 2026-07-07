---
id: logic-09c-tray-pull-showdown
category: math-logic
title: Tray Pull Showdown
deliverables:
  - BAKEOFF.md
---

## Task

Two rival bakers are breaking down a cooling rack after a bake-off. The
rack holds a stack of trays, and the bakers alternate turns. On each
turn, a baker must remove exactly 1, 2, or 6 trays from the rack. The
baker who removes the **last** tray wins the tie-breaker for Best in
Show (normal play — there are no other win conditions and passing is
not allowed). Both bakers play optimally.

Answer all four questions, showing enough of your reasoning that the
verdicts are traceable:

- **Q1**: Starting from a rack holding **30** trays, does the first
  baker have a forced win? If so, name one valid winning first move
  (how many trays to remove).
- **Q2**: Starting from a rack holding **38** trays, who wins under
  optimal play?
- **Q3**: Starting from a rack holding **115** trays, who wins under
  optimal play?
- **Q4**: Across all starting rack sizes `N` from 1 to 56 inclusive,
  how many are losing positions for the first baker (i.e. the second
  baker has the forced win)?

## Deliverables

- `BAKEOFF.md` — must contain, in this order:
  - Q1's answer (win/lose verdict plus a valid winning move if a win).
  - Q2's answer (winner).
  - Q3's answer (winner).
  - Q4's answer (the count of losing starting rack sizes in 1..56),
    plus a statement of the losing-position pattern you found (or an
    explicit list of the losing values) that justifies the count.

## Constraints

- At most 450 words (whole file, `wc -w`).
- Do not assume a losing-position pattern from small cases without
  stating what that pattern is; a bare count with no supporting
  pattern or list is insufficient for Q4.
