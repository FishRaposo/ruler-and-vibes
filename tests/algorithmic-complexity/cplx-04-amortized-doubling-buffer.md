---
id: cplx-04-amortized-doubling-buffer
category: algorithmic-complexity
title: Amortized, Not Worst Case
deliverables:
  - buffer.js
  - ANALYSIS.md
---

## Task

A fictional append-only buffer ("Quillhaven roster") is a dynamic
array with this exact growth policy:

- It starts with capacity 1.
- Whenever a `push` would exceed the current capacity, the buffer
  **doubles** its capacity (allocates new storage of size
  `2 * capacity`) and copies every currently-stored element into the
  new storage, before appending the new element.
- If a `push` does not exceed capacity, no resize/copy occurs — the
  new element is simply written.

This task probes the distinction between a single operation's
**worst-case** cost and a sequence of operations' **amortized** cost.

Instrument the buffer so it exposes a global `copies` counter with
this exact counting rule: **increment `copies` once per element
copied during a resize** (i.e., once per element moved from old
storage to new storage). Writing the newly-pushed element into its
slot is not itself a "copy" and must not increment the counter.

## Deliverables

- `buffer.js` — must:
  - Implement the buffer class/module with `push(x)` following the
    exact growth policy above (start capacity 1, double on overflow,
    copy only pre-existing elements on resize).
  - Export the buffer (constructor or factory), a way to read the
    cumulative `copies` count, and a `reset()` that returns the buffer
    to its initial empty state (capacity 1, zero elements, zero
    copies), via `module.exports`.
  - When run with `node buffer.js`, print the **cumulative** copy
    count after `n` pushes, for `n = 1, 2, 4, 5, 8, 16, 17, 1000`
    **in that order**, one line per value in the exact form
    `n=<n> copies=<count>` (each line reports the total copies so far
    after that many pushes from a fresh buffer — no header, no extra
    lines).
- `ANALYSIS.md` (max 300 words, whole file) — must:
  - State the exact total copy count for `n=1000`.
  - State **both** that a single `push` is O(n) in the **worst case**
    (the push that triggers a resize) **and** O(1) **amortized** across
    a sequence of pushes.
  - Justify the amortized bound: the total copies across `n` pushes is
    less than `2n`, so the average cost per push is bounded by a
    constant.

## Constraints

- Plain JavaScript, no dependencies, single file for `buffer.js`.
- `module.exports` must expose enough surface for a judge to construct
  a fresh buffer, call `push` a chosen number of times, and read the
  cumulative copy count directly (not only via the printed stdout
  lines) — e.g. `module.exports = { Buffer }` with `copies` readable
  as a property, or an equivalent factory-function shape.
- The growth factor must be exactly 2 (doubling) — not 1.5 or any
  other factor — since the pinned counts assume doubling.
