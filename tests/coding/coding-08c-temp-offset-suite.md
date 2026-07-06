---
id: coding-08c-temp-offset-suite
category: coding
title: Test suite that kills every temperature-offset mutant
deliverables:
  - tests.js
---

## Task

Below is a correct reference function `offsets(readings)` that turns a
batch of raw temperature readings into signed offsets from the batch
mean, scaled by the batch spread: each reading `x` maps to
`(x - avg) / (hi - lo)`, where `avg` is the mean of the batch, `lo` the
smallest reading, and `hi` the largest. An empty array returns `[]`. If
every reading is identical (so `hi - lo` is 0, a flat batch), the
function returns an array of zeros the same length as the input.

```js
// reference.js (correct — do not modify, do not import; write your
// own test file that only assumes this contract)
function offsets(readings) {
  if (readings.length === 0) return [];
  const lo = Math.min(...readings);
  const hi = Math.max(...readings);
  if (lo === hi) return readings.map(() => 0);
  const avg = readings.reduce((s, x) => s + x, 0) / readings.length;
  return readings.map((x) => (x - avg) / (hi - lo));
}
```

Four buggy variants ("mutants") of this function exist, each with
exactly one change from the reference:

- **M1** — omits the flat-batch guard entirely (so when every reading
  is identical, the division `0/0` produces `NaN` instead of `0`).
- **M2** — divides by `hi` instead of the spread: computes
  `(x - avg) / hi` instead of `(x - avg) / (hi - lo)`.
- **M3** — returns `[0]` for empty input instead of `[]`.
- **M4** — subtracts `lo` instead of `avg` in the numerator: computes
  `(x - lo) / (hi - lo)` instead of `(x - avg) / (hi - lo)` (an
  origin/direction shift).

## Deliverables

- `tests.js` — a self-contained test file with its own minimal assert
  helper (no test-runner import — plain Node). It must NOT import,
  copy, or redefine any of the four mutants; it only needs to assume
  the `offsets` contract described above. When run with
  `node tests.js` against the correct reference, every printed line
  must say `PASS`. Your suite will separately be run against each of
  the four mutants (each spliced in as the implementation under test)
  and, for a good suite, at least one of your tests must print `FAIL`
  against each mutant.

## Constraints

- Plain JavaScript, no dependencies, single file, at most 120 lines.
- Do not hardcode knowledge of the mutants' internals beyond choosing
  good test INPUTS — your assertions should just check `offsets`'s
  documented contract on cases that happen to expose each mutant's
  behavior (flat-batch input, empty input, and readings that dip below
  zero are all worth thinking about).
