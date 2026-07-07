---
id: debug-04c-emberkiln-roast-shrinkage
category: debugging
title: Wrong shrinkage on the second roast
deliverables:
  - roasting.js
---

## Task

**Emberkiln**, a fictional coffee-roasting console, has a shrinkage
module that estimates how many grams a green-coffee batch loses during
roasting. Here is the file as currently shipped:

```js
// Emberkiln roast shrinkage engine
var PROFILES = {
  house: { loss: 0.12 },
  dark:  { loss: 0.18 }
};

function getProfile(name, overrides) {
  return Object.assign(PROFILES[name], overrides || {});
}

function applyShrinkage(greenGrams, profile) {
  var f = profile.loss > 1 ? profile.loss / 100 : profile.loss;
  return greenGrams - Math.floor(greenGrams * f + 0.5);
}

module.exports = { PROFILES: PROFILES, getProfile: getProfile, applyShrinkage: applyShrinkage };
```

A bug report came in: **"`applyShrinkage` gives the wrong roasted
weight for the second roast in a session."** The report includes this
repro: call `getProfile('house', {loss: 0.30})` and apply it, then —
later in the same session — call `getProfile('house')` with no override
and apply it. The second call's roasted weight is wrong.

The following four cases currently pass in this exact order (run them
in this order to see it):

1. `applyShrinkage(5400, getProfile('house'))`
2. `applyShrinkage(7250, getProfile('dark'))`
3. `applyShrinkage(5400, getProfile('house', {loss: 20}))` — note this
   override uses the percent form (`20` meaning 20%, not `0.20`)
4. `applyShrinkage(7250, getProfile('dark', {loss: 0.18}))`

Do not assume the bug report correctly identifies which function is at
fault — verify that yourself before fixing anything. Fix the actual
root cause, keep the four cases above passing, and make the reported
sequence (an override call followed by a plain call) behave correctly.

## Deliverables

- `roasting.js` — the fixed module, still exporting `PROFILES`,
  `getProfile`, and `applyShrinkage`. `PROFILES` must remain a plain,
  shared, module-level object with the same shape and starting values
  shown above.

## Constraints

- Plain JavaScript, no dependencies, `roasting.js` at most 45 lines.
- `applyShrinkage`'s function body must remain exactly as shown above —
  fix the root cause elsewhere. Do not special-case or patch inside
  `applyShrinkage`.
- The fix must not leave `PROFILES` mutated by a prior override call:
  after any call to `getProfile(name, overrides)`, the shared
  `PROFILES[name]` must still reflect its original, un-overridden value
  for later callers who pass no override.
- The file must end with
  `module.exports = { PROFILES, getProfile, applyShrinkage }`; the
  judge's harness requires it.
