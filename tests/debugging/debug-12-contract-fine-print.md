---
id: debug-12-contract-fine-print
category: debugging
title: Two ways to misread the contract
deliverables:
  - fixed.js
  - CONTRACT.md
---

## Task

**Millhaven Scheduling**, a fictional shift-planning tool, depends on
a small, documented helper and a caller that uses it. The helper's
contract is correct and is not in question — read it carefully.

```js
// parseRange: documented contract.
//   Given a spec string "start-end", returns [start, end] with
//   END EXCLUSIVE (the range does not include `end` itself).
//   On an invalid spec, returns null. It does NOT throw.
function parseRange(spec) {
  var m = /^(\d+)-(\d+)$/.exec(spec);
  if (!m) return null;
  var start = Number(m[1]);
  var end = Number(m[2]);
  if (end < start) return null;
  return [start, end];
}

// caller: expands a range spec into an explicit array of integers.
function expand(spec) {
  try {
    var r = parseRange(spec);
    var out = [];
    for (var i = r[0]; i <= r[1]; i++) out.push(i);
    return out;
  } catch (e) {
    return "invalid";
  }
}

module.exports = { parseRange: parseRange, expand: expand };
```

A bug report says: `expand("2-5")` returns one element too many. When
you look closer, you should also check whether `expand`'s handling of
invalid input is actually correct, or just accidentally looks correct.

Fix `expand` — and only `expand` — so that it honors `parseRange`'s
documented contract fully. Do not change `parseRange`; its behavior is
correct as documented and is exercised elsewhere in the codebase.

## Deliverables

- `fixed.js` — exports the unchanged `parseRange` and a corrected
  `expand` that honors both the exclusive-end contract and the
  null-on-invalid contract explicitly (no reliance on a caught
  exception for the invalid path).
- `CONTRACT.md` — names every way the original `expand` misused
  `parseRange`'s contract, and explains why the invalid-input path
  looked like it worked even before it was fixed.

## Constraints

- Plain JavaScript, no dependencies.
- `fixed.js` at most 60 lines.
- `parseRange`'s body must be textually unchanged from the version
  shown above — fix `expand` only.
- `fixed.js` must export `{ parseRange, expand }`.
