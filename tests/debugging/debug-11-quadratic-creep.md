---
id: debug-11-quadratic-creep
category: debugging
title: Dedupe that grows too fast
deliverables:
  - fixed.js
  - PERF.md
---

## Task

**Cobblestone Analytics**, a fictional event-tracking pipeline, has a
`dedupe(arr, counter)` helper that removes duplicate values from an
array while preserving first-occurrence order. Here is the function
as currently shipped, instrumented with an explicit operation counter:

```js
// buggy dedupe: preserves first-occurrence order but tests membership
// by SCANNING the growing output array with an explicit inner loop.
function dedupe(arr, counter) {
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

module.exports = { dedupe: dedupe };
```

The output is correct — nobody disputes that. The complaint is that
the pipeline gets steadily slower as batch sizes grow, out of
proportion to how much data increases. Here is the embedded harness
used to measure it. **Do not alter this harness** — it is run
unmodified against your submission:

```js
// Embedded instrumented harness (must remain unmodified). Drives a
// dedupe implementation at n = 100, 200, 400, 800 on a worst-case
// input (each value has exactly one duplicate, n/2 uniques) and
// reports counter.n for each.
function makeInput(n) {
  var arr = [];
  for (var i = 0; i < n / 2; i++) arr.push(i);
  for (var i = 0; i < n / 2; i++) arr.push(i); // each value repeated once
  return arr;
}

function run(dedupeFn) {
  var results = [];
  [100, 200, 400, 800].forEach(function (n) {
    var input = makeInput(n);
    var counter = { n: 0 };
    var out = dedupeFn(input, counter);
    results.push({ n: n, ops: counter.n, outLen: out.length });
  });
  return results;
}

module.exports = { makeInput: makeInput, run: run };
```

Running this harness against the buggy `dedupe` above produces
`counter.n` values that quadruple every time `n` doubles. Your job:
rewrite `dedupe` so it produces the exact same output but its
operation count scales roughly linearly with `n` instead.

The counter contract is mandatory: **every membership decision** your
`dedupe` makes must increment `counter.n` by exactly one. You may not
satisfy the harness by hiding comparison work inside a native method
that the counter can't see — for instance, swapping the inner loop for
`out.includes(v)` or `out.indexOf(v)` is still a full scan under the
hood (still O(n^2)) and also dodges the counter entirely, which is
disqualifying on both counts. A legitimate fix performs one counted,
O(1)-amortized membership probe per element (e.g. via a `Set` or
equivalent hashed structure), not a scan of the growing output array.

## Deliverables

- `fixed.js` — a rewritten `dedupe(arr, counter)` that produces
  byte-identical output (same elements, same first-occurrence order)
  to the buggy version above, but whose `counter.n` grows roughly
  linearly with `n` when driven by the embedded harness, and performs
  membership testing via a hashed structure rather than scanning the
  output array or delegating to a native array-membership method.
- `PERF.md` — names the specific quadratic operation in the original
  code (the nested scan of the growing output array) and states the
  fixed complexity (O(n)) along with the data structure used to
  achieve it.

## Constraints

- Plain JavaScript, no dependencies.
- `fixed.js` at most 80 lines.
- `fixed.js` must export `dedupe` with the same `(arr, counter)`
  signature, and must not modify or depend on changes to the embedded
  harness shown above.
- No use of `Array.prototype.includes` or `Array.prototype.indexOf`
  (or equivalent linear scans) to test membership against the growing
  output.
