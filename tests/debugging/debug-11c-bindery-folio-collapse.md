---
id: debug-11c-bindery-folio-collapse
category: debugging
title: Folio collapse that slows down as batches grow
deliverables:
  - fixed.js
  - PERF.md
---

## Task

**Coppergate Bindery**, a fictional manuscript-restoration workshop, has a
`firstFolios(arr, counter)` helper that reduces a stream of incoming
shelf codes to the distinct list of codes, keeping each code at the
position where it was first seen. Here is the function as currently
shipped, instrumented with an explicit operation counter:

```js
// buggy firstFolios: keeps first-occurrence order but tests membership
// by SCANNING the growing output array with an explicit inner loop.
function firstFolios(arr, counter) {
  var out = [];
  for (var i = 0; i < arr.length; i++) {
    var v = arr[i];
    var found = false;
    for (var j = 0; j < out.length; j++) {
      counter.n++; // every membership decision is counted
      if (out[j] === v) { found = true; break; }
    }
    if (!found) out.push(v);
  }
  return out;
}

module.exports = { firstFolios: firstFolios };
```

The output is correct — nobody disputes that. The complaint is that
intake gets steadily slower as daily batches grow, out of proportion to
how much the shelf-code volume actually increases. Here is the embedded
harness used to measure it. **Do not alter this harness** — it is run
unmodified against your submission:

```js
// Embedded instrumented harness (must remain unmodified). Drives a
// firstFolios implementation at n = 60, 120, 240, 480 on a worst-case
// input (each code has exactly one duplicate, n/2 distinct codes) and
// reports counter.n for each.
function makeInput(n) {
  var arr = [];
  for (var i = 0; i < n / 2; i++) arr.push(i);
  for (var i = 0; i < n / 2; i++) arr.push(i); // each code repeated once
  return arr;
}

function run(firstFoliosFn) {
  var results = [];
  [60, 120, 240, 480].forEach(function (n) {
    var input = makeInput(n);
    var counter = { n: 0 };
    var out = firstFoliosFn(input, counter);
    results.push({ n: n, ops: counter.n, outLen: out.length });
  });
  return results;
}

module.exports = { makeInput: makeInput, run: run };
```

Running this harness against the buggy `firstFolios` above produces
`counter.n` values that quadruple every time `n` doubles. Your job:
rewrite `firstFolios` so it produces the exact same output but its
operation count scales roughly linearly with `n` instead.

The counter contract is mandatory: **every membership decision** your
`firstFolios` makes must increment `counter.n` by exactly one. You may
not satisfy the harness by hiding comparison work inside a native method
that the counter can't see — for instance, swapping the inner loop for
`out.includes(v)` or `out.indexOf(v)` is still a full scan under the
hood (still O(n^2)) and also dodges the counter entirely, which is
disqualifying on both counts. A legitimate fix performs one counted,
O(1)-amortized membership probe per element (e.g. via a `Set` or
equivalent hashed structure), not a scan of the growing output array.

## Deliverables

- `fixed.js` — a rewritten `firstFolios(arr, counter)` that produces
  byte-identical output (same codes, same first-occurrence order) to the
  buggy version above, but whose `counter.n` grows roughly linearly with
  `n` when driven by the embedded harness, and performs membership
  testing via a hashed structure rather than scanning the output array
  or delegating to a native array-membership method.
- `PERF.md` — names the specific quadratic operation in the original
  code (the nested scan of the growing output array) and states the
  fixed complexity (O(n)) along with the data structure used to
  achieve it.

## Constraints

- Plain JavaScript, no dependencies.
- `fixed.js` at most 80 lines.
- `fixed.js` must export `firstFolios` with the same `(arr, counter)`
  signature, and must not modify or depend on changes to the embedded
  harness shown above.
- No use of `Array.prototype.includes` or `Array.prototype.indexOf`
  (or equivalent linear scans) to test membership against the growing
  output.
