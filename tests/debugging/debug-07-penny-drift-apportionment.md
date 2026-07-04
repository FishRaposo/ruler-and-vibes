---
id: debug-07-penny-drift-apportionment
category: debugging
title: Cents that do not add up
deliverables:
  - fixed.js
  - DRIFT.md
---

## Task

**Fernway Payroll**, a fictional payroll tool, splits an integer-cents
bonus pool across recipients proportional to integer weights. Here is
the file as currently shipped:

```js
// Fernway Payroll bonus apportionment
function allocate(poolCents, weights) {
  var total = weights.reduce(function (a, b) { return a + b; }, 0);
  return weights.map(function (w) {
    return Math.round(poolCents * w / total);
  });
}

module.exports = { allocate: allocate };
```

The contract: `allocate(poolCents, weights)` returns an array of
non-negative integer shares, one per weight, proportional to each
weight as closely as possible, and the shares must sum to EXACTLY
`poolCents` — every cent of the pool must be accounted for, no more, no
less.

A payroll audit found cases where the shares silently do not sum to
the pool (no crash, no exception — just a total that's off by a cent
or more). For example, `allocate(100000, [1,1,1])` currently returns
`[33333, 33333, 33333]`, which sums to 99999, one cent short of
100000.

Note that some inputs happen to sum correctly under the current
code — e.g. `allocate(100000, [1,2,4])` returns `[14286, 28571,
57143]`, which does sum to exactly 100000 — so spot-checking only
"nice" cases will not reveal the bug.

Diagnose why independent per-share rounding breaks the total, and fix
`allocate` so shares always sum exactly to `poolCents` while staying as
proportional to each weight as possible. If two or more fixes would
each conserve the total, prefer the one that also minimizes how far
any individual share drifts from its exact (non-integer) proportional
value, with ties broken by giving priority to the lowest index.

## Deliverables

- `fixed.js` — the corrected `allocate`, plus a self-test block
  runnable with `node fixed.js` printing a PASS/FAIL line per case,
  covering at least:
  1. `allocate(100000, [1,1,1])` → shares sum to exactly 100000
  2. `allocate(10000, [3,3,3])` → shares sum to exactly 10000
  3. `allocate(100003, [1,1,1])` → shares sum to exactly 100003
  4. `allocate(100000, [1,2,4])` → shares sum to exactly 100000 (the
     already-correct distractor case — must still pass)
  5. `allocate(100000, [1,1,1,1,1,1,1])` → shares sum to exactly 100000
- `DRIFT.md` — name the root cause (independent per-share `Math.round`
  does not conserve the total) and state the largest-remainder rule
  used to distribute leftover pennies.

## Constraints

- Plain JavaScript, no dependencies, `fixed.js` at most 80 lines.
- `allocate`'s exported name and argument order (`poolCents, weights`)
  must be unchanged.
- Every returned share must be a non-negative integer.
