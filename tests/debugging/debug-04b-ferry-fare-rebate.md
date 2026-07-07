---
id: debug-04b-ferry-fare-rebate
category: debugging
title: Wrong rebate on the second fare
deliverables:
  - fares.js
---

## Task

**Saltmoor**, a fictional coastal ferry line, has a fare engine.
Here is the file as currently shipped:

```js
// Saltmoor ferry fare engine
var TARIFFS = {
  coastal: { share: 0.15 },
  express: { share: 0.25 }
};

function getTariff(route, overrides) {
  return Object.assign(TARIFFS[route], overrides || {});
}

function applyRebate(fareCents, tariff) {
  var s = tariff.share > 1 ? tariff.share / 100 : tariff.share;
  return fareCents - Math.floor(fareCents * s + 0.5);
}

module.exports = { TARIFFS: TARIFFS, getTariff: getTariff, applyRebate: applyRebate };
```

A bug report came in: **"`applyRebate` gives the wrong rebate for the
second fare in a session."** The report includes this repro: call
`getTariff('coastal', {share: 0.30})` and apply it, then — later in the
same session — call `getTariff('coastal')` with no override and apply
it. The second call's rebate is wrong.

The following four cases currently pass in this exact order (run them
in this order to see it):

1. `applyRebate(6400, getTariff('coastal'))`
2. `applyRebate(7777, getTariff('express'))`
3. `applyRebate(6400, getTariff('coastal', {share: 30}))` — note this
   override uses the percent form (`30` meaning 30%, not `0.30`)
4. `applyRebate(7777, getTariff('express', {share: 0.25}))`

Do not assume the bug report correctly identifies which function is at
fault — verify that yourself before fixing anything. Fix the actual
root cause, keep the four cases above passing, and make the reported
sequence (an override call followed by a plain call) behave correctly.

## Deliverables

- `fares.js` — the fixed module, still exporting `TARIFFS`, `getTariff`,
  and `applyRebate`. `TARIFFS` must remain a plain, shared,
  module-level object with the same shape and starting values shown
  above.
## Constraints

- Plain JavaScript, no dependencies, `fares.js` at most 45 lines.
- `applyRebate`'s function body must remain exactly as shown above —
  fix the root cause elsewhere. Do not special-case or patch inside
  `applyRebate`.
- The fix must not leave `TARIFFS` mutated by a prior override call:
  after any call to `getTariff(route, overrides)`, the shared
  `TARIFFS[route]` must still reflect its original, un-overridden value
  for later callers who pass no override.
- The file must end with
  `module.exports = { TARIFFS, getTariff, applyRebate }`; the judge's
  harness requires it.
