---
id: logic-09b-lighthouse-flask-duel
category: math-logic
title: Lighthouse Flask Duel
deliverables:
  - WATCH.md
---

## Task

Two lighthouse keepers share a shelf of oil flasks and alternate turns
restocking their lanterns. On each turn, a keeper must take exactly 2, 3,
or 4 flasks from the shelf. The keeper who takes the **last** flask wins
the night's watch bonus (normal play — there are no other win conditions
and passing is not allowed). Both keepers play optimally.

Answer all four questions, showing enough of your reasoning that the
verdicts are traceable:

- **Q1**: Starting from a shelf of **27** flasks, does the first keeper
  have a forced win? If so, name one valid winning first move (how many
  flasks to take).
- **Q2**: Starting from a shelf of **25** flasks, who wins under optimal
  play?
- **Q3**: Starting from a shelf of **97** flasks, who wins under optimal
  play?
- **Q4**: Across all starting shelf sizes `N` from 1 to 44 inclusive, how
  many are losing positions for the first keeper (i.e. the second keeper
  has the forced win)?

## Deliverables

- `WATCH.md` — must contain, in this order:
  - Q1's answer (win/lose verdict plus a valid winning move if a win).
  - Q2's answer (winner).
  - Q3's answer (winner).
  - Q4's answer (the count of losing starting shelf sizes in 1..44), plus
    a statement of the losing-position pattern you found (or an explicit
    list of the losing values) that justifies the count.

## Constraints

- At most 450 words (whole file, `wc -w`).
- Do not assume a losing-position pattern from small cases without
  stating what that pattern is; a bare count with no supporting pattern
  or list is insufficient for Q4.
