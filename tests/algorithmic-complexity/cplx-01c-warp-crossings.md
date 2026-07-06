---
id: cplx-01c-warp-crossings
category: algorithmic-complexity
title: Tally the Crossings, Name the Growth
deliverables:
  - instrumented.js
  - ANALYSIS.md
---

## Task

A fictional textile-mill codebase ("Loomvale Weaving") has the
following function, which computes a warp-crossing tally by walking a
triangular region of a thread-registration grid:

```js
function crossings(n) {
  let tally = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= i; j++) {
      tally++;
    }
  }
  return tally;
}
```

Counting semantics are pinned exactly: count **one "crossing" per
execution of the innermost loop body** (the `tally++` line) — not per
comparison, not per outer-loop iteration, not per any other proxy.

Your job is NOT to change the function's behavior. Instrument it to
report its own exact operation count, and separately analyze its exact
growth as a closed-form function of `n` plus its asymptotic class.

## Deliverables

- `instrumented.js` — must:
  - Preserve `crossings(n)` with identical behavior to the version
    above (same nested-loop structure, same bounds: outer `i` from 1
    to `n`, inner `j` from 1 to `i`).
  - Export it via `module.exports = { crossings }` so a judge can
    `require()` the file and call `crossings(n)` directly for any `n`,
    including values not printed by the script.
  - When run with `node instrumented.js`, print **exactly 5 lines**,
    one per pinned input, in the exact form `n=<n> tally=<count>`, for
    `n = 2, 4, 12, 40, 80` **in that order** — no header, no extra
    lines, no trailing commentary.
- `ANALYSIS.md` (max 200 words, whole file) — must state:
  - The exact closed-form crossing count as a function of `n` (not
    just the asymptotic class).
  - The asymptotic class in Theta notation.
  - A one-line derivation connecting the loop bounds to the formula.

## Constraints

- Plain JavaScript, no dependencies, single file for `instrumented.js`.
- Do not special-case the 5 pinned inputs (e.g. a lookup table) — the
  judge will call `crossings` on an unlisted value and check the result
  against the real function, not against a hardcoded map.
