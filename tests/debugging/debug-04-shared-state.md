---
id: debug-04-shared-state
category: debugging
title: Wrong discount on the second booking
deliverables:
  - pricing.js
  - REASONING.md
---

## Task

**Trailfern**, a fictional booking platform, has a pricing module.
Here is the file as currently shipped:

```js
// Trailfern booking platform pricing engine
var RULES = {
  standard: { rate: 0.10 },
  premium: { rate: 0.20 }
};

function getRules(tier, overrides) {
  return Object.assign(RULES[tier], overrides || {});
}

function applyDiscount(subtotalCents, rules) {
  var r = rules.rate > 1 ? rules.rate / 100 : rules.rate;
  return subtotalCents - Math.floor(subtotalCents * r + 0.5);
}

module.exports = { RULES: RULES, getRules: getRules, applyDiscount: applyDiscount };
```

A bug report came in: **"`applyDiscount` gives the wrong discount for
the second booking in a session."** The report includes this repro:
call `getRules('standard', {rate: 0.25})` and apply it, then — later
in the same session — call `getRules('standard')` with no override and
apply it. The second call's discount is wrong.

The following four cases currently pass in this exact order (run them
in this order to see it):

1. `applyDiscount(8000, getRules('standard'))`
2. `applyDiscount(9999, getRules('premium'))`
3. `applyDiscount(8000, getRules('standard', {rate: 25}))` — note this
   override uses the percent form (`25` meaning 25%, not `0.25`)
4. `applyDiscount(9999, getRules('premium', {rate: 0.20}))`

Do not assume the bug report correctly identifies which function is at
fault — verify that yourself before fixing anything. Fix the actual
root cause, keep the four cases above passing, and make the reported
sequence (an override call followed by a plain call) behave correctly.

## Deliverables

- `pricing.js` — the fixed module, still exporting `RULES`, `getRules`,
  and `applyDiscount`. `RULES` must remain a plain, shared,
  module-level object with the same shape and starting values shown
  above.
- `REASONING.md` — explain (a) what you found actually causes the
  cross-call leak, reproducing the order-dependence from the bug
  report, and (b) whether `applyDiscount` was really at fault, with
  your reasoning.

## Constraints

- Plain JavaScript, no dependencies, `pricing.js` at most 45 lines.
- `applyDiscount`'s function body must remain exactly as shown above —
  fix the root cause elsewhere. Do not special-case or patch inside
  `applyDiscount`.
- The fix must not leave `RULES` mutated by a prior override call: after
  any call to `getRules(tier, overrides)`, the shared `RULES[tier]`
  must still reflect its original, un-overridden value for later
  callers who pass no override.
- The file must end with
  `module.exports = { RULES, getRules, applyDiscount }`; the judge's
  harness requires it.
- `REASONING.md`, at most 250 words (whole file, `wc -w`).
