---
id: debug-09b-abutting-plate-slots
category: debugging
title: Author a failing test, then fix the coalescer
deliverables:
  - repro.js
  - fixed.js
  - FINDINGS.md
---

## Task

**Cadwell Press**, a fictional print shop, has a helper that coalesces
reserved press-plate-slot blocks. Each block is a closed integer
interval `[start, end]` of plate slots that a job has reserved. Here is
the file as currently shipped:

```js
// Cadwell Press plate-slot coalescer
function coalesceRuns(blocks) {
  if (!blocks.length) return [];
  var sorted = blocks.slice().sort(function (a, b) { return a[0] - b[0]; });
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

module.exports = { coalesceRuns: coalesceRuns };
```

`coalesceRuns` is meant to coalesce any two blocks that overlap OR that
merely abut — one block ending at slot `s` and the next beginning at
that same slot `s` reserve one contiguous span. For example blocks
`[12,18]` and `[18,25]` both claim slot `18` and should coalesce into
`[12,25]`. Nobody has written a test for this function yet. Your job is
to write one before you fix anything.

Work in this order:

1. **First**, author `repro.js`: a minimal reproduction script that
   demonstrates the specific defect (abutting blocks failing to
   coalesce) by running the buggy `coalesceRuns` shown above and
   asserting the correct coalesced result. `repro.js` must FAIL — throw,
   exit non-zero, or otherwise clearly signal failure — when run against
   the buggy function exactly as shown above. Document in a comment at
   the top of `repro.js` that it was run against the original code and
   observed to fail there.
2. **Then**, fix `coalesceRuns` in `fixed.js` so that `repro.js` passes
   against it, and so that the regression set below also passes.
3. Write `FINDINGS.md` naming the exact root cause.

Regression set that `fixed.js` must also satisfy (in addition to
`repro.js` passing):

- `coalesceRuns([[12,18],[18,25]])` -> `[[12,25]]`
- `coalesceRuns([[4,7],[30,33]])` -> `[[4,7],[30,33]]`
- `coalesceRuns([[10,40],[15,22]])` -> `[[10,40]]`
- `coalesceRuns([[12,18],[16,21],[50,55]])` -> `[[12,21],[50,55]]`

Be careful: the buggy function above already correctly coalesces blocks
that strictly overlap (like `[[10,40],[15,22]]`). A repro that only
exercises strict overlap will pass even against the buggy code — that
does not reproduce the reported defect. Your `repro.js` must
specifically exercise the abutting-slot case and must genuinely fail on
the buggy code as shipped.

## Deliverables

- `repro.js` — a standalone Node script (no test framework dependency)
  that embeds or requires the buggy `coalesceRuns` exactly as shown
  above, asserts the correct coalesced output for the abutting-slot
  case, and fails when run with `node repro.js` against that buggy code.
- `fixed.js` — the corrected module, still exporting `coalesceRuns`,
  against which both `repro.js` and the regression set above pass.
- `FINDINGS.md` — names the exact faulty comparison responsible for the
  defect and explains why it only manifests for abutting (not strictly
  overlapping) blocks.

## Constraints

- Plain JavaScript, no dependencies.
- `repro.js` and `fixed.js` are each at most 70 lines.
- `fixed.js` must export `coalesceRuns` via
  `module.exports = { coalesceRuns }` (or equivalent), runnable
  standalone under `node`.
