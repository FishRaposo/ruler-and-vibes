---
id: coding-01b-siding-blocks
category: coding
title: Coalescing occupied track sections
deliverables:
  - solution.js
---

## Task

Implement `coalesceBlocks(sections)` in plain JavaScript (Node-compatible).
Input: an array of `[from, to]` integer pairs naming occupied track
sections on a railway siding, indexed by sleeper number — possibly
unsorted, overlapping, adjacent (touching), inverted (`from > to`),
duplicated, or empty. Output: a NEW array of merged, non-overlapping
sections sorted ascending. Touching sections merge: `[6,10]` and
`[10,15]` become `[6,15]`. Normalize inverted pairs by swapping. Decide
and document how you treat entries that are not two-integer arrays.

## Deliverables

- `solution.js` — the function plus a self-test block that runs with
  `node solution.js` and prints one `PASS`/`FAIL` line per case for at
  least 6 distinct cases, which must include: empty input, a single
  section, adjacency, and an inverted pair.

## Constraints

- Single file, no dependencies, at most 120 lines.
