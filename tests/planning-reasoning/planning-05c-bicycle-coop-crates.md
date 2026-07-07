---
id: planning-05c-bicycle-coop-crates
category: planning-reasoning
title: Bicycle co-op crate delivery plan
deliverables:
  - PLAN.md
---

## Task

A parts cart operates on a 5x5 grid of floor tiles in a community
bicycle-repair co-op, with coordinates `(x, y)` where both `x` and `y`
range from 0 to 4. The cart starts at the check-in counter, cell
`(0,0)`.

Two crates need moving:

- Crate **R** (wheel rims) sits at `(0,3)` and must reach the truing
  stand at `(4,3)`.
- Crate **T** (tire tubes) sits at `(3,0)` and must reach the assembly
  bench at `(3,4)`.

The cart can carry **at most one crate at a time**.

**Pinned action model** — the cart may only perform these primitive
actions, each costing 1:

- `move N` / `move S` / `move E` / `move W` — moves the cart one tile
  in that direction (N increases y, S decreases y, E increases x, W
  decreases x). Legal only if the destination tile is within the grid
  (both coordinates stay in the range 0..4).
- `load R` — legal only when the cart is on cell `(0,3)` (R's current
  location) AND the cart is not currently carrying anything. After
  this action the cart carries R.
- `load T` — legal only when the cart is on cell `(3,0)` (T's current
  location) AND the cart is not currently carrying anything. After
  this action the cart carries T.
- `unload R` — legal only when the cart is on cell `(4,3)` (R's
  destination) AND the cart is currently carrying R. After this
  action R is delivered and the cart carries nothing.
- `unload T` — legal only when the cart is on cell `(3,4)` (T's
  destination) AND the cart is currently carrying T. After this
  action T is delivered and the cart carries nothing.

The goal is reached when both R and T are delivered and the cart is
carrying nothing.

Produce an ordered action plan, drawn only from the actions above,
that starts at `(0,0)` empty-handed and reaches the goal. Your plan
should use as few actions as possible.

## Deliverables

- `PLAN.md` — a numbered, ordered list of actions (one per line, using
  exactly the action vocabulary above, e.g. `1. move N`, `2. load R`,
  ...), followed by a stated total action count.

## Constraints

- Use only the pinned action vocabulary above — no diagonal moves, no
  multi-cell moves, no carrying two crates at once.
- State the total number of actions in your plan explicitly at the end
  of `PLAN.md`.
