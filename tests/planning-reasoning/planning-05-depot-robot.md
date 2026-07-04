---
id: planning-05-depot-robot
category: planning-reasoning
title: Depot robot delivery plan
deliverables:
  - PLAN.md
---

## Task

A delivery robot operates on a 4x4 grid of cells, with coordinates
`(x, y)` where both `x` and `y` range from 0 to 3. The robot starts at
cell `(0,0)`.

Two packages need delivering:

- Package **P** sits at `(0,2)` and must reach `(3,2)`.
- Package **Q** sits at `(2,0)` and must reach `(2,3)`.

The robot can carry **at most one package at a time**.

**Pinned action model** — the robot may only perform these primitive
actions, each costing 1:

- `move N` / `move S` / `move E` / `move W` — moves the robot one cell
  in that direction (N increases y, S decreases y, E increases x, W
  decreases x). Legal only if the destination cell is within the grid
  (both coordinates stay in the range 0..3).
- `pickup P` — legal only when the robot is on cell `(0,2)` (P's
  current location) AND the robot is not currently carrying anything.
  After this action the robot carries P.
- `pickup Q` — legal only when the robot is on cell `(2,0)` (Q's
  current location) AND the robot is not currently carrying anything.
  After this action the robot carries Q.
- `drop P` — legal only when the robot is on cell `(3,2)` (P's
  destination) AND the robot is currently carrying P. After this
  action P is delivered and the robot carries nothing.
- `drop Q` — legal only when the robot is on cell `(2,3)` (Q's
  destination) AND the robot is currently carrying Q. After this
  action Q is delivered and the robot carries nothing.

The goal is reached when both P and Q are delivered and the robot is
carrying nothing.

Produce an ordered action plan, drawn only from the actions above,
that starts at `(0,0)` empty-handed and reaches the goal. Your plan
should use as few actions as possible.

## Deliverables

- `PLAN.md` — a numbered, ordered list of actions (one per line, using
  exactly the action vocabulary above, e.g. `1. move N`, `2. pickup
  P`, ...), followed by a stated total action count.

## Constraints

- Use only the pinned action vocabulary above — no diagonal moves, no
  multi-cell moves, no carrying two packages at once.
- State the total number of actions in your plan explicitly at the end
  of `PLAN.md`.
