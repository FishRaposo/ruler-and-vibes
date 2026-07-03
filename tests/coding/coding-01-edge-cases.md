---
id: coding-01-edge-cases
category: coding
title: Robust function with edge cases
deliverables:
  - solution.js
---

## Task

Implement `mergeRanges(ranges)` in plain JavaScript (Node-compatible).
Input: an array of `[start, end]` integer pairs — possibly unsorted,
overlapping, adjacent, inverted (`start > end`), duplicated, or empty.
Output: a NEW array of merged, non-overlapping ranges sorted ascending.
Adjacent ranges merge: `[1,2]` and `[2,3]` become `[1,3]`. Normalize
inverted pairs by swapping. Decide and document how you treat entries
that are not two-integer arrays.

## Deliverables

- `solution.js` — the function plus a self-test block that runs with
  `node solution.js` and prints one `PASS`/`FAIL` line per case for at
  least 6 distinct cases, which must include: empty input, a single
  range, adjacency, and an inverted pair.

## Constraints

- Single file, no dependencies, at most 120 lines.
