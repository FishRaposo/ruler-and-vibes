---
id: debug-09c-back-to-back-bookings
category: debugging
title: Author a failing test, then fix the conflict checker
deliverables:
  - repro.js
  - fixed.js
  - FINDINGS.md
---

## Task

**Larkmoor Studios**, a fictional coworking space, has a helper that
decides whether two room-booking windows conflict. Each window is a
`[start, end)` pair of minute-of-day integers: a booking occupies its
start minute up to but not including its end minute (half-open). Two
back-to-back bookings — one ending exactly when the next begins — do
NOT conflict, because they never occupy the same minute. Here is the
file as currently shipped:

```js
// Larkmoor Studios booking-conflict checker
function slotsOverlap(a, b) {
  return a[0] <= b[1] && b[0] <= a[1];
}

module.exports = { slotsOverlap: slotsOverlap };
```

`slotsOverlap(a, b)` is meant to return `true` only when the two
half-open windows share at least one minute — e.g. `[540,660]` and
`[600,630]` genuinely overlap and must return `true`, while a window
ending at minute `600` and another starting at minute `600` are merely
adjacent and must return `false`. Nobody has written a test for this
function yet. Your job is to write one before you fix anything.

Work in this order:

1. **First**, author `repro.js`: a minimal reproduction script that
   demonstrates the specific defect (back-to-back windows being
   reported as conflicting) by running the buggy `slotsOverlap` shown
   above and asserting the correct result. `repro.js` must FAIL —
   throw, exit non-zero, or otherwise clearly signal failure — when run
   against the buggy function exactly as shown above. Document in a
   comment at the top of `repro.js` that it was run against the
   original code and observed to fail there.
2. **Then**, fix `slotsOverlap` in `fixed.js` so that `repro.js` passes
   against it, and so that the regression set below also passes.
3. Write `FINDINGS.md` naming the exact root cause.

Regression set that `fixed.js` must also satisfy (in addition to
`repro.js` passing):

- `slotsOverlap([540,600],[600,660])` -> `false`
- `slotsOverlap([540,600],[660,720])` -> `false`
- `slotsOverlap([540,660],[600,630])` -> `true`
- `slotsOverlap([540,660],[630,720])` -> `true`

Be careful: the buggy function above already correctly reports genuine
overlaps (like `[540,660]` vs `[600,630]`) as conflicts and correctly
reports windows with a clear gap (like `[540,600]` vs `[660,720]`) as
non-conflicting. A repro that only exercises those cases will pass even
against the buggy code — that does not reproduce the reported defect.
Your `repro.js` must specifically exercise the back-to-back
(shared-endpoint) case and must genuinely fail on the buggy code as
shipped.

## Deliverables

- `repro.js` — a standalone Node script (no test framework dependency)
  that embeds or requires the buggy `slotsOverlap` exactly as shown
  above, asserts the correct result for the back-to-back case, and
  fails when run with `node repro.js` against that buggy code.
- `fixed.js` — the corrected module, still exporting `slotsOverlap`,
  against which both `repro.js` and the regression set above pass.
- `FINDINGS.md` — names the exact faulty comparison responsible for the
  defect and explains why it only manifests for back-to-back (not
  genuinely overlapping) windows.

## Constraints

- Plain JavaScript, no dependencies.
- `repro.js` and `fixed.js` are each at most 70 lines.
- `fixed.js` must export `slotsOverlap` via
  `module.exports = { slotsOverlap }` (or equivalent), runnable
  standalone under `node`.
