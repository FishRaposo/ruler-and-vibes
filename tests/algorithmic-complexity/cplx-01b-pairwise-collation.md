---
id: cplx-01b-pairwise-collation
category: algorithmic-complexity
title: Collate the Witnesses, Name the Growth
deliverables:
  - instrumented.js
  - ANALYSIS.md
---

## Task

A fictional manuscript-collation tool ("Brindlewick Codex Lab") has the
following function, which estimates collation effort by comparing each
manuscript witness against the witnesses recorded after it in the
catalogue:

```js
function collationCost(n) {
  let comparisons = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = i + 1; j <= n; j++) {
      comparisons++;
    }
  }
  return comparisons;
}
```

Counting semantics are pinned exactly: count **one "comparison" per
execution of the innermost loop body** (the `comparisons++` line) — not
per comparison test in a loop header, not per outer-loop iteration, not
per any other proxy.

Your job is NOT to change the function's behavior. Instrument it to
report its own exact operation count, and separately analyze its exact
growth as a closed-form function of `n` plus its asymptotic class.

## Deliverables

- `instrumented.js` — must:
  - Preserve `collationCost(n)` with identical behavior to the version
    above (same nested-loop structure, same bounds: outer `i` from 1 to
    `n`, inner `j` from `i + 1` to `n`).
  - Export it via `module.exports = { collationCost }` so a judge can
    `require()` the file and call `collationCost(n)` directly for any
    `n`, including values not printed by the script.
  - When run with `node instrumented.js`, print **exactly 5 lines**, one
    per pinned input, in the exact form `n=<n> comparisons=<count>`, for
    `n = 3, 6, 15, 45, 90` **in that order** — no header, no extra
    lines, no trailing commentary.
- `ANALYSIS.md` (max 200 words, whole file) — must state:
  - The exact closed-form comparison count as a function of `n` (not
    just the asymptotic class).
  - The asymptotic class in Theta notation.
  - A one-line derivation connecting the loop bounds to the formula.

## Constraints

- Plain JavaScript, no dependencies, single file for `instrumented.js`.
- Do not special-case the 5 pinned inputs (e.g. a lookup table) — the
  judge will call `collationCost` on an unlisted value and check the
  result against the real function, not against a hardcoded map.
