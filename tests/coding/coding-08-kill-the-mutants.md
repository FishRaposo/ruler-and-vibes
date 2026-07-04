---
id: coding-08-kill-the-mutants
category: coding
title: Test suite that kills every mutant
deliverables:
  - tests.js
---

## Task

Below is a correct reference function `normalize(arr)` that min-max
scales an array of numbers into the range `[0, 1]`: each element `x`
maps to `(x - min) / (max - min)`. An empty array returns `[]`. If
every element is equal (so `max - min` is 0), the function returns an
array of zeros the same length as the input.

```js
// reference.js (correct — do not modify, do not import; write your
// own test file that only assumes this contract)
function normalize(arr) {
  if (arr.length === 0) return [];
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  if (min === max) return arr.map(() => 0);
  return arr.map((x) => (x - min) / (max - min));
}
```

Four buggy variants ("mutants") of this function exist, each with
exactly one change from the reference:

- **M1** — omits the all-equal guard entirely (so when every element
  is equal, the division `0/0` produces `NaN` instead of `0`).
- **M2** — divides by `max` instead of the range: computes
  `(x - min) / max` instead of `(x - min) / (max - min)`.
- **M3** — returns `[0]` for empty input instead of `[]`.
- **M4** — subtracts `max` instead of `min` in the numerator: computes
  `(x - max) / (max - min)` instead of `(x - min) / (max - min)` (a
  sign/direction flip).

## Deliverables

- `tests.js` — a self-contained test file with its own minimal assert
  helper (no test-runner import — plain Node). It must NOT import,
  copy, or redefine any of the four mutants; it only needs to assume
  the `normalize` contract described above. When run with
  `node tests.js` against the correct reference, every printed line
  must say `PASS`. Your suite will separately be run against each of
  the four mutants (each spliced in as the implementation under test)
  and, for a good suite, at least one of your tests must print `FAIL`
  against each mutant.

## Constraints

- Plain JavaScript, no dependencies, single file, at most 120 lines.
- Do not hardcode knowledge of the mutants' internals beyond choosing
  good test INPUTS — your assertions should just check `normalize`'s
  documented contract on cases that happen to expose each mutant's
  behavior (all-equal input, empty input, and inputs with negative
  values are all worth thinking about).
