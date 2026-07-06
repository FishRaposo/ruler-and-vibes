---
id: cplx-04b-cylinder-cabinet-relocation
category: algorithmic-complexity
title: Relocations, Amortized Over a Sequence
deliverables:
  - cabinet.js
  - ANALYSIS.md
---

## Task

A fictional append-only store of phonograph wax cylinders (the
"Halvorsen cylinder cabinet") is a dynamic array with this exact
growth policy:

- It starts with capacity 1.
- Whenever a `store` operation would exceed the current capacity, the
  cabinet **doubles** its capacity (allocates a new cabinet of size
  `2 * capacity`) and re-shelves every currently-held cylinder into
  the new cabinet, before placing the new cylinder.
- If a `store` does not exceed capacity, no expansion/re-shelving
  occurs — the new cylinder is simply set into its slot.

This task probes the distinction between a single operation's
**worst-case** cost and a sequence of operations' **amortized** cost.

Instrument the cabinet so it exposes a running `moves` counter with
this exact counting rule: **increment `moves` once per cylinder
re-shelved during an expansion** (i.e., once per cylinder moved from
the old cabinet to the new cabinet). Setting the newly-stored cylinder
into its slot is not itself a "move" and must not increment the
counter.

## Deliverables

- `cabinet.js` — must:
  - Implement the cabinet class/module with `store(x)` following the
    exact growth policy above (start capacity 1, double on overflow,
    re-shelve only the already-held cylinders on expansion).
  - Export the cabinet (constructor or factory), a way to read the
    cumulative `moves` count, and a `reset()` that returns the cabinet
    to its initial empty state (capacity 1, zero cylinders, zero
    moves), via `module.exports`.
  - When run with `node cabinet.js`, print the **cumulative** move
    count after `n` store operations, for
    `n = 1, 2, 6, 7, 32, 33, 64, 2500` **in that order**, one line per
    value in the exact form `n=<n> moves=<count>` (each line reports
    the total moves so far after that many store operations from a
    fresh cabinet — no header, no extra lines).
- `ANALYSIS.md` (max 300 words, whole file) — must:
  - State the exact total move count for `n=2500`.
  - State **both** that a single `store` is O(n) in the **worst case**
    (the store that triggers an expansion) **and** O(1) **amortized**
    across a sequence of stores.
  - Justify the amortized bound: the total moves across `n` stores is
    less than `2n`, so the average cost per store is bounded by a
    constant.

## Constraints

- Plain JavaScript, no dependencies, single file for `cabinet.js`.
- `module.exports` must expose enough surface for a judge to construct
  a fresh cabinet, call `store` a chosen number of times, and read the
  cumulative move count directly (not only via the printed stdout
  lines) — e.g. `module.exports = { Cabinet }` with `moves` readable
  as a property, or an equivalent factory-function shape.
- The growth factor must be exactly 2 (doubling) — not 1.5 or any
  other factor — since the pinned counts assume doubling.
