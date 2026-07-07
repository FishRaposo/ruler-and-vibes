---
id: debug-12b-chunk-bounds-fine-print
category: debugging
title: Two ways to misread the chunk contract
deliverables:
  - fixed.js
  - CONTRACT.md
---

## Task

**Tallowmere Archive**, a fictional ledger-export tool, depends on a
small, documented helper and a caller that uses it. The helper's
contract is correct and is not in question — read it carefully.

```js
// chunkBounds: documented contract.
//   Given a spec string "lo:hi", returns [lo, hi] with
//   HI EXCLUSIVE (the chunk does not include row `hi` itself).
//   On an invalid spec, returns null. It does NOT throw.
function chunkBounds(spec) {
  var m = /^(\d+):(\d+)$/.exec(spec);
  if (!m) return null;
  var lo = Number(m[1]);
  var hi = Number(m[2]);
  if (hi < lo) return null;
  return [lo, hi];
}

// caller: expands a chunk spec into an explicit array of row indices.
function gatherRows(spec) {
  try {
    var b = chunkBounds(spec);
    var out = [];
    for (var i = b[0]; i <= b[1]; i++) out.push(i);
    return out;
  } catch (e) {
    return "skip";
  }
}

module.exports = { chunkBounds: chunkBounds, gatherRows: gatherRows };
```

A bug report says: `gatherRows("4:9")` returns one element too many.
When you look closer, you should also check whether `gatherRows`'s
handling of invalid input is actually correct, or just accidentally
looks correct.

Fix `gatherRows` — and only `gatherRows` — so that it honors
`chunkBounds`'s documented contract fully. Do not change
`chunkBounds`; its behavior is correct as documented and is exercised
elsewhere in the codebase.

## Deliverables

- `fixed.js` — exports the unchanged `chunkBounds` and a corrected
  `gatherRows` that honors both the exclusive-hi contract and the
  null-on-invalid contract explicitly (no reliance on a caught
  exception for the invalid path).
- `CONTRACT.md` — names every way the original `gatherRows` misused
  `chunkBounds`'s contract, and explains why the invalid-input path
  looked like it worked even before it was fixed.

## Constraints

- Plain JavaScript, no dependencies.
- `fixed.js` at most 60 lines.
- `chunkBounds`'s body must be textually unchanged from the version
  shown above — fix `gatherRows` only.
- `fixed.js` must export `{ chunkBounds, gatherRows }`.
