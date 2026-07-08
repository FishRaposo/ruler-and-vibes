# REASONING.md — logic-02-wrenmarket-stalls

## Approach

I worked through the clues systematically, starting with fixed positions (clue 1: maps at stall 1, clue 5: crimson at stall 5) and building constraints from there. The banner triple from clue 7 was the key breakthrough.

## Key decisions

- The violet-amber-blue triple (clue 7) had to be positions (2,3,4) because position (3,4,5) conflicts with crimson at stall 5, and position (1,2,3) leaves no room for Dima's green banner.
- From the triple placement, all other assignments fell out deterministically.

## Trade-offs and limitations

- None — the puzzle has a unique solution as stated.

## Files read

- tests/math-logic/logic-02-wrenmarket-stalls.md
