---
id: debug-07b-seat-drift-apportionment
category: debugging
title: Seats that do not add up
deliverables:
  - fixed.js
  - DRIFT.md
---

## Task

**Loomwright Standards Council**, a fictional standards body, splits a
fixed integer number of committee seats across its member guilds
proportional to integer membership weights. Here is the file as
currently shipped:

```js
// Loomwright Standards Council seat apportionment
function allocate(seatPool, weights) {
  var total = weights.reduce(function (a, b) { return a + b; }, 0);
  return weights.map(function (w) {
    return Math.round(seatPool * w / total);
  });
}

module.exports = { allocate: allocate };
```

The contract: `allocate(seatPool, weights)` returns an array of
non-negative integer shares, one per weight, proportional to each
weight as closely as possible, and the shares must sum to EXACTLY
`seatPool` — every seat must be handed out, no more, no less.

A council review found sittings where the shares silently do not sum
to the pool (no crash, no exception — just a total that's off by a
seat or more). For example, `allocate(31000, [1,1,1])` currently
returns `[10333, 10333, 10333]`, which sums to 30999, one seat short
of 31000.

Note that some inputs happen to sum correctly under the current
code — e.g. `allocate(31000, [1,2,4])` returns `[4429, 8857, 17714]`,
which does sum to exactly 31000 — so spot-checking only "nice" cases
will not reveal the bug.

Diagnose why independent per-share rounding breaks the total, and fix
`allocate` so shares always sum exactly to `seatPool` while staying as
proportional to each weight as possible. If two or more fixes would
each conserve the total, prefer the one that also minimizes how far
any individual share drifts from its exact (non-integer) proportional
value, with ties broken by giving priority to the lowest index.

## Deliverables

- `fixed.js` — the corrected `allocate`, plus a self-test block
  runnable with `node fixed.js` printing a PASS/FAIL line per case,
  covering at least:
  1. `allocate(31000, [1,1,1])` → shares sum to exactly 31000
  2. `allocate(12500, [3,3,3])` → shares sum to exactly 12500
  3. `allocate(31201, [1,1,1])` → shares sum to exactly 31201
  4. `allocate(31000, [1,2,4])` → shares sum to exactly 31000 (the
     already-correct distractor case — must still pass)
  5. `allocate(31000, [1,1,1,1,1,1,1])` → shares sum to exactly 31000
- `DRIFT.md` — name the root cause (independent per-share `Math.round`
  does not conserve the total) and state the rule you used to
  distribute the leftover seats so the shares sum exactly (including
  how ties are broken).

## Constraints

- Plain JavaScript, no dependencies, `fixed.js` at most 80 lines.
- `allocate`'s exported name and argument order (`seatPool, weights`)
  must be unchanged.
- Every returned share must be a non-negative integer.
