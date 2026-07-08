## Approach
Logical deduction puzzle solved by iterating through clues, eliminating possibilities, and filling in the grid step by step. Each clue was numbered and used to constrain positions.

## Key decisions
Started with clues that pin specific stalls (clues 1, 5, 10) then used relative-position clues (2, 3, 7, 11) to narrow down remaining assignments. Clue 7 (amber between violet and blue) was crucial for placing banner colors. Clue 11 (Dima left of Ansa) combined with clue 2 (Ansa left of rope seller = Ezel from clue 3) gave the ordering constraint Dima < Ansa < Ezel.

## Trade-offs and limitations
The deduction chain is compressed to fit the 450-word limit. Some intermediate elimination steps are folded into single lines.

## Files read
- tests/math-logic/logic-02-wrenmarket-stalls.md
