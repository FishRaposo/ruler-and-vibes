---
id: logic-09-relay-wager
category: math-logic
title: Relay Wager
deliverables:
  - WAGER.md
---

## Task

Two players share a pile of tokens and alternate turns. On each turn, a
player must remove exactly 1, 3, or 4 tokens from the pile. The player
who removes the **last** token wins (normal play — there are no other
win conditions and passing is not allowed). Both players play
optimally.

Answer all four questions, showing enough of your reasoning that the
verdicts are traceable:

- **Q1**: Starting from a pile of **17** tokens, does the first player
  have a forced win? If so, name one valid winning first move (how many
  tokens to remove).
- **Q2**: Starting from a pile of **23** tokens, who wins under optimal
  play?
- **Q3**: Starting from a pile of **100** tokens, who wins under
  optimal play?
- **Q4**: Across all starting pile sizes `N` from 1 to 49 inclusive, how
  many are losing positions for the first player (i.e. the second
  player has the forced win)?

## Deliverables

- `WAGER.md` — must contain, in this order:
  - Q1's answer (win/lose verdict plus a valid winning move if a win).
  - Q2's answer (winner).
  - Q3's answer (winner).
  - Q4's answer (the count of losing starting piles in 1..49), plus a
    statement of the losing-position pattern you found (or an explicit
    list of the losing values) that justifies the count.

## Constraints

- At most 450 words (whole file, `wc -w`).
- Do not assume a losing-position pattern from small cases without
  stating what that pattern is; a bare count with no supporting pattern
  or list is insufficient for Q4.
