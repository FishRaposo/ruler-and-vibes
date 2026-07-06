---
id: cplx-04c-granary-doubling-silo
category: algorithmic-complexity
title: Averaged Over the Sequence
deliverables:
  - granary.js
  - ANALYSIS.md
---

## Task

A fictional grain-storage module ("Ashgrove granary") models a silo bay
as a dynamic array of sacks with this exact growth policy:

- The bay starts with capacity 1.
- Whenever an `add` would exceed the current capacity, the bay
  **doubles** its capacity (allocates new storage of size
  `2 * capacity`) and transfers every currently-held sack into the new
  storage, before placing the new sack.
- If an `add` does not exceed capacity, no resize/transfer occurs — the
  new sack is simply placed in the next free slot.

This task probes the distinction between a single operation's
**worst-case** cost and a sequence of operations' **amortized** cost.

Instrument the bay so it exposes a cumulative `transfers` counter with
this exact counting rule: **increment `transfers` once per sack moved
during a resize** (i.e., once per sack carried from old storage to new
storage). Placing the newly-added sack into its slot is not itself a
"transfer" and must not increment the counter.

## Deliverables

- `granary.js` — must:
  - Implement the silo-bay class/module with `add(sack)` following the
    exact growth policy above (start capacity 1, double on overflow,
    transfer only the already-held sacks on resize).
  - Export the bay (constructor or factory), a way to read the
    cumulative `transfers` count, and a `reset()` that returns the bay
    to its initial empty state (capacity 1, zero sacks, zero
    transfers), via `module.exports`.
  - When run with `node granary.js`, print the **cumulative** transfer
    count after `n` adds, for `n = 1, 3, 4, 9, 16, 33, 64, 1200`
    **in that order**, one line per value in the exact form
    `n=<n> transfers=<count>` (each line reports the total transfers so
    far after that many adds from a fresh bay — no header, no extra
    lines).
- `ANALYSIS.md` (max 300 words, whole file) — must:
  - State the exact total transfer count for `n=1200`.
  - State **both** that a single `add` is O(n) in the **worst case**
    (the add that triggers a resize) **and** O(1) **amortized** across
    a sequence of adds.
  - Justify the amortized bound: the total transfers across `n` adds is
    less than `2n`, so the average cost per add is bounded by a
    constant.

## Constraints

- Plain JavaScript, no dependencies, single file for `granary.js`.
- `module.exports` must expose enough surface for a judge to construct
  a fresh bay, call `add` a chosen number of times, and read the
  cumulative transfer count directly (not only via the printed stdout
  lines) — e.g. `module.exports = { SiloBay }` with `transfers`
  readable as a property, or an equivalent factory-function shape.
- The growth factor must be exactly 2 (doubling) — not 1.5 or any
  other factor — since the pinned counts assume doubling.
