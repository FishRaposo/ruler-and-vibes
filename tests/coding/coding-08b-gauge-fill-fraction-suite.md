---
id: coding-08b-gauge-fill-fraction-suite
category: coding
title: Test suite that kills every gauge-rescale mutant
deliverables:
  - tests.js
---

## Task

Below is a correct reference function `stretch(readings)` that rescales
an array of raw tank-gauge readings into a fill fraction: the lowest
reading maps to `0.0`, the highest maps to `1.0`, and each reading `x`
in between maps to `(x - lo) / (hi - lo)`. An empty array returns `[]`.
If every reading is identical (so `hi - lo` is 0, a flat gauge), the
function returns an array of zeros the same length as the input.

```js
// reference.js (correct — do not modify, do not import; write your
// own test file that only assumes this contract)
function stretch(readings) {
  if (readings.length === 0) return [];
  const lo = Math.min(...readings);
  const hi = Math.max(...readings);
  if (lo === hi) return readings.map(() => 0);
  return readings.map((x) => (x - lo) / (hi - lo));
}
```

Four buggy variants ("mutants") of this function exist, each with
exactly one change from the reference:

- **M1** — omits the flat-gauge guard entirely (so when every reading
  is identical, the division `0/0` produces `NaN` instead of `0`).
- **M2** — divides by `hi` instead of the span: computes
  `(x - lo) / hi` instead of `(x - lo) / (hi - lo)`.
- **M3** — returns `[0]` for empty input instead of `[]`.
- **M4** — subtracts `hi` instead of `lo` in the numerator: computes
  `(x - hi) / (hi - lo)` instead of `(x - lo) / (hi - lo)` (a
  sign/direction flip).

## Deliverables

- `tests.js` — a self-contained test file with its own minimal assert
  helper (no test-runner import — plain Node). It must NOT import,
  copy, or redefine any of the four mutants; it only needs to assume
  the `stretch` contract described above. When run with
  `node tests.js` against the correct reference, every printed line
  must say `PASS`. Your suite will separately be run against each of
  the four mutants (each spliced in as the implementation under test)
  and, for a good suite, at least one of your tests must print `FAIL`
  against each mutant.

## Constraints

- Plain JavaScript, no dependencies, single file, at most 120 lines.
- Do not hardcode knowledge of the mutants' internals beyond choosing
  good test INPUTS — your assertions should just check `stretch`'s
  documented contract on cases that happen to expose each mutant's
  behavior (flat-gauge input, empty input, and readings that dip below
  zero are all worth thinking about).
