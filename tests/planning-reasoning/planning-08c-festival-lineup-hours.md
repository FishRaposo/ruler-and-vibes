---
id: planning-08c-festival-lineup-hours
category: planning-reasoning
title: Festival lineup under a fixed stage-time budget
deliverables:
  - LINEUP.md
---

## Task

A festival organizer must choose which acts to book onto the single
main stage from six candidates. Each act's set is **all-or-nothing**
— no partial sets, no repeats. The total available stage time is
exactly **18 hours**.

| Act              | Set length (hours) | Draw score (audience points) |
|-------------------|---------------------|-------------------------------|
| Vela Ridge        | 11                  | 23                            |
| Coral Static      | 4                   | 17                            |
| Nighthawk Parade  | 5                   | 26                            |
| Glass Anchor      | 6                   | 10                            |
| Paper Foxes       | 7                   | 11                            |
| Ember Thistle     | 9                   | 14                            |

Select the subset of acts that **maximizes total draw score** without
the total set length exceeding 18 hours.

## Deliverables

- `LINEUP.md` — must report:
  - The chosen set of acts.
  - The chosen set's total set length and total draw score.
  - An argument that no feasible subset achieves a higher draw score,
    including an explicit comparison against at least one named
    greedy heuristic result (e.g. picking by draw-per-hour ratio, or
    picking by raw draw score) showing your chosen set beats it.

## Constraints

- Every act is binary: either fully booked onto the stage or not
  selected at all.
- The total set length of your chosen lineup must not exceed 18
  hours.
