---
id: debug-07c-dimmer-budget-leveling
category: debugging
title: Dimmer steps that do not add up
deliverables:
  - fixed.js
  - LEVELING.md
---

## Task

**Wickmoor Lighting Desk**, a fictional theatrical lighting controller,
splits an integer intensity budget (a whole number of dimmer steps)
across stage fixtures proportional to integer cue weights. Here is the
file as currently shipped:

```js
// Wickmoor Lighting Desk — intensity budget apportionment
function split(budgetSteps, weights) {
  var total = weights.reduce(function (a, b) { return a + b; }, 0);
  return weights.map(function (w) {
    return Math.round(budgetSteps * w / total);
  });
}

module.exports = { split: split };
```

The contract: `split(budgetSteps, weights)` returns an array of
non-negative integer shares, one per weight, proportional to each
weight as closely as possible, and the shares must sum to EXACTLY
`budgetSteps` — every dimmer step in the budget must be assigned, no
more, no less.

A cue-sheet review found cases where the shares silently do not sum to
the budget (no crash, no exception — just a total that is off by a step
or more). For example, `split(70000, [1,1,1])` currently returns
`[23333, 23333, 23333]`, which sums to 69999, one step short of 70000.

Note that some inputs happen to sum correctly under the current code —
e.g. `split(84000, [1,2,5])` returns `[10500, 21000, 52500]`, which
does sum to exactly 84000 — so spot-checking only "clean" cases will
not reveal the bug.

Diagnose why independent per-share rounding breaks the total, and fix
`split` so shares always sum exactly to `budgetSteps` while staying as
proportional to each weight as possible. If two or more fixes would
each conserve the total, prefer the one that also minimizes how far any
individual share drifts from its exact (non-integer) proportional
value, with ties broken by giving priority to the lowest index.

## Deliverables

- `fixed.js` — the corrected `split`, plus a self-test block runnable
  with `node fixed.js` printing a PASS/FAIL line per case, covering at
  least:
  1. `split(70000, [1,1,1])` → shares sum to exactly 70000
  2. `split(25000, [4,4,4])` → shares sum to exactly 25000
  3. `split(45001, [1,1,1])` → shares sum to exactly 45001
  4. `split(84000, [1,2,5])` → shares sum to exactly 84000 (the
     already-correct distractor case — must still pass)
  5. `split(93000, [1,1,1,1,1,1,1])` → shares sum to exactly 93000
- `LEVELING.md` — name the root cause (independent per-share
  `Math.round` does not conserve the total) and state the rule you used
  to distribute the leftover dimmer steps so the shares sum exactly
  (including how ties are broken).

## Constraints

- Plain JavaScript, no dependencies, `fixed.js` at most 80 lines.
- `split`'s exported name and argument order (`budgetSteps, weights`)
  must be unchanged.
- Every returned share must be a non-negative integer.
