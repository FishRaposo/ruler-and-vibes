---
id: debug-09-reproduce-then-fix
category: debugging
title: Author a failing test, then fix the bug
deliverables:
  - repro.js
  - fixed.js
  - FINDINGS.md
---

## Task

**Ridgemere Logistics**, a fictional shipping platform, has a helper
that merges overlapping and adjacent shipment-window intervals. Here
is the file as currently shipped:

```js
// Ridgemere shipment-window merger
function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  var sorted = intervals.slice().sort(function (a, b) { return a[0] - b[0]; });
  var out = [sorted[0].slice()];
  for (var i = 1; i < sorted.length; i++) {
    var cur = sorted[i];
    var last = out[out.length - 1];
    if (cur[0] < last[1]) {
      last[1] = Math.max(last[1], cur[1]);
    } else {
      out.push(cur.slice());
    }
  }
  return out;
}

module.exports = { mergeIntervals: mergeIntervals };
```

`mergeIntervals` is meant to merge any two closed integer intervals
that overlap OR merely touch at an endpoint — e.g. windows `[1,3]` and
`[3,5]` share the instant `3` and should merge into `[1,5]`. Nobody
has written a test for this function yet. Your job is to write one
before you fix anything.

Work in this order:

1. **First**, author `repro.js`: a minimal reproduction script that
   demonstrates the specific defect (touching intervals failing to
   merge) by running the buggy `mergeIntervals` shown above and
   asserting the correct merged result. `repro.js` must FAIL — throw,
   exit non-zero, or otherwise clearly signal failure — when run
   against the buggy function exactly as shown above. Document in a
   comment at the top of `repro.js` that it was run against the
   original code and observed to fail there.
2. **Then**, fix `mergeIntervals` in `fixed.js` so that `repro.js`
   passes against it, and so that the regression set below also
   passes.
3. Write `FINDINGS.md` naming the exact root cause.

Regression set that `fixed.js` must also satisfy (in addition to
`repro.js` passing):

- `mergeIntervals([[1,3],[3,5]])` -> `[[1,5]]`
- `mergeIntervals([[1,2],[5,6]])` -> `[[1,2],[5,6]]`
- `mergeIntervals([[1,5],[2,3]])` -> `[[1,5]]`
- `mergeIntervals([[1,3],[2,4],[6,8]])` -> `[[1,4],[6,8]]`

Be careful: the buggy function above already correctly merges
intervals that strictly overlap (like `[[1,5],[2,3]]`). A repro that
only exercises strict overlap will pass even against the buggy code —
that does not reproduce the reported defect. Your `repro.js` must
specifically exercise the touching-endpoint case and must genuinely
fail on the buggy code as shipped.

## Deliverables

- `repro.js` — a standalone Node script (no test framework
  dependency) that embeds or requires the buggy `mergeIntervals`
  exactly as shown above, asserts the correct merged output for the
  touching-endpoint case, and fails when run with `node repro.js`
  against that buggy code.
- `fixed.js` — the corrected module, still exporting
  `mergeIntervals`, against which both `repro.js` and the regression
  set above pass.
- `FINDINGS.md` — names the exact faulty comparison responsible for
  the defect and explains why it only manifests for touching (not
  strictly overlapping) intervals.

## Constraints

- Plain JavaScript, no dependencies.
- `repro.js` and `fixed.js` are each at most 70 lines.
- `fixed.js` must export `mergeIntervals` via
  `module.exports = { mergeIntervals }` (or equivalent), runnable
  standalone under `node`.
