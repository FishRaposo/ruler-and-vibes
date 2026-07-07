---
id: planning-05b-archive-cart
category: planning-reasoning
title: Archive cart retrieval plan
deliverables:
  - PLAN.md
---

## Task

A retrieval cart operates on a 5x4 grid of shelving bays in a library
archive, with coordinates `(x, y)` where `x` ranges from 0 to 4 and `y`
ranges from 0 to 3. The cart starts at bay `(1,3)`.

Two requested crates need retrieving:

- The **periodicals crate** sits at `(3,2)` and must reach `(1,0)`.
- The **manuscripts crate** sits at `(2,1)` and must reach `(4,3)`.

The cart can carry **at most one crate at a time**.

**Pinned action model** — the cart may only perform these primitive
actions, each costing 1:

- `move N` / `move S` / `move E` / `move W` — moves the cart one bay in
  that direction (N increases y, S decreases y, E increases x, W
  decreases x). Legal only if the destination bay is within the grid
  (x stays in 0..4, y stays in 0..3).
- `load periodicals` — legal only when the cart is on bay `(3,2)` (the
  periodicals crate's current location) AND the cart is not currently
  carrying anything. After this action the cart carries the
  periodicals crate.
- `load manuscripts` — legal only when the cart is on bay `(2,1)` (the
  manuscripts crate's current location) AND the cart is not currently
  carrying anything. After this action the cart carries the
  manuscripts crate.
- `unload periodicals` — legal only when the cart is on bay `(1,0)`
  (the periodicals crate's destination) AND the cart is currently
  carrying the periodicals crate. After this action the periodicals
  crate is delivered and the cart carries nothing.
- `unload manuscripts` — legal only when the cart is on bay `(4,3)`
  (the manuscripts crate's destination) AND the cart is currently
  carrying the manuscripts crate. After this action the manuscripts
  crate is delivered and the cart carries nothing.

The goal is reached when both crates are delivered and the cart is
carrying nothing.

Produce an ordered action plan, drawn only from the actions above,
that starts at `(1,3)` empty-handed and reaches the goal. Your plan
should use as few actions as possible.

## Deliverables

- `PLAN.md` — a numbered, ordered list of actions (one per line, using
  exactly the action vocabulary above, e.g. `1. move N`, `2. load
  periodicals`, ...), followed by a stated total action count.

## Constraints

- Use only the pinned action vocabulary above — no diagonal moves, no
  multi-cell moves, no carrying two crates at once.
- State the total number of actions in your plan explicitly at the end
  of `PLAN.md`.
