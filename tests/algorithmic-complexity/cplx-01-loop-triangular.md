---
id: cplx-01-loop-triangular
category: algorithmic-complexity
title: Count the Loops, Name the Growth
deliverables:
  - instrumented.js
  - ANALYSIS.md
---

## Task

A fictional job-scheduler codebase ("Fernwood Dispatch") has the
following function, which computes a scheduling cost metric by walking
a triangular region of a job-priority matrix:

```js
function stepCost(n) {
  let steps = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = i; j <= n; j++) {
      steps++;
    }
  }
  return steps;
}
```

Counting semantics are pinned exactly: count **one "step" per
execution of the innermost loop body** (the `steps++` line) — not per
comparison, not per outer-loop iteration, not per any other proxy.

Your job is NOT to change the function's behavior. Instrument it to
report its own exact operation count, and separately analyze its exact
growth as a closed-form function of `n` plus its asymptotic class.

## Deliverables

- `instrumented.js` — must:
  - Preserve `stepCost(n)` with identical behavior to the version
    above (same nested-loop structure, same bounds: outer `i` from 1
    to `n`, inner `j` from `i` to `n`).
  - Export it via `module.exports = { stepCost }` so a judge can
    `require()` the file and call `stepCost(n)` directly for any `n`,
    including values not printed by the script.
  - When run with `node instrumented.js`, print **exactly 5 lines**,
    one per pinned input, in the exact form `n=<n> steps=<count>`, for
    `n = 1, 5, 10, 50, 100` **in that order** — no header, no extra
    lines, no trailing commentary.
- `ANALYSIS.md` (max 200 words, whole file) — must state:
  - The exact closed-form step count as a function of `n` (not just
    the asymptotic class).
  - The asymptotic class in Theta notation.
  - A one-line derivation connecting the loop bounds to the formula.

## Constraints

- Plain JavaScript, no dependencies, single file for `instrumented.js`.
- Do not special-case the 5 pinned inputs (e.g. a lookup table) — the
  judge will call `stepCost` on an unlisted value and check the result
  against the real function, not against a hardcoded map.
