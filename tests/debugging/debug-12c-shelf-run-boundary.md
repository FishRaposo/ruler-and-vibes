---
id: debug-12c-shelf-run-boundary
category: debugging
title: Two ways to misread the shelf-run contract
deliverables:
  - fixed.js
  - CONTRACT.md
---

## Task

**Coldharbor Records**, a fictional physical-document depot, pulls
boxes off a shelf in numbered runs. Its retrieval tooling depends on a
small, documented helper and a caller that uses it. The helper's
contract is correct and is not in question — read it carefully.

```js
// parseRun: documented contract.
//   Given a spec string "lo-hi", returns [lo, hi] with
//   HI EXCLUSIVE (the run does not include box `hi` itself).
//   On an invalid spec, returns null. It does NOT throw.
function parseRun(spec) {
  var m = /^(\d+)-(\d+)$/.exec(spec);
  if (!m) return null;
  var lo = Number(m[1]);
  var hi = Number(m[2]);
  if (hi < lo) return null;
  return [lo, hi];
}

// caller: expands a run spec into an explicit array of box numbers.
function boxesOn(spec) {
  try {
    var r = parseRun(spec);
    var out = [];
    for (var i = r[0]; i <= r[1]; i++) out.push(i);
    return out;
  } catch (e) {
    return "invalid";
  }
}

module.exports = { parseRun: parseRun, boxesOn: boxesOn };
```

A bug report says: `boxesOn("3-8")` returns one box too many. When you
look closer, you should also check whether `boxesOn`'s handling of
invalid input is actually correct, or just accidentally looks correct.

Fix `boxesOn` — and only `boxesOn` — so that it honors `parseRun`'s
documented contract fully. Do not change `parseRun`; its behavior is
correct as documented and is exercised elsewhere in the codebase.

## Deliverables

- `fixed.js` — exports the unchanged `parseRun` and a corrected
  `boxesOn` that honors both the exclusive-end contract and the
  null-on-invalid contract explicitly (no reliance on a caught
  exception for the invalid path).
- `CONTRACT.md` — names every way the original `boxesOn` misused
  `parseRun`'s contract, and explains why the invalid-input path looked
  like it worked even before it was fixed.

## Constraints

- Plain JavaScript, no dependencies.
- `fixed.js` at most 60 lines.
- `parseRun`'s body must be textually unchanged from the version shown
  above — fix `boxesOn` only.
- `fixed.js` must export `{ parseRun, boxesOn }`.
