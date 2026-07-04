---
id: coding-01c-waveform-highlights
category: coding
title: Waveform highlight coalescer
deliverables:
  - solution.js
---

## Task

Implement `coalesceHighlights(segments)` in plain JavaScript
(Node-compatible). A highlight is a closed integer interval
`[from, to]` marking a span of frames on an audio waveform. Input:
an array of such pairs — possibly unsorted, overlapping, touching
(sharing an endpoint), inverted (`from > to`), duplicated, or empty.
Output: a NEW array of merged, non-overlapping highlights sorted
ascending, without mutating the input. Touching highlights merge:
`[10,20]` and `[20,30]` become `[10,30]`. Normalize inverted pairs by
swapping. Decide and document how you treat entries that are not
two-integer arrays.

## Deliverables

- `solution.js` — the function plus a self-test block that runs with
  `node solution.js` and prints one `PASS`/`FAIL` line per case for at
  least 6 distinct cases, which must include: empty input, a single
  highlight, a touching pair, and an inverted pair.

## Constraints

- Single file, no dependencies, at most 120 lines.
