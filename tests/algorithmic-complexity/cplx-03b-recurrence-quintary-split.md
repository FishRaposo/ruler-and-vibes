---
id: cplx-03b-recurrence-quintary-split
category: algorithmic-complexity
title: Gladewright Partition — Solve and Prove the Recurrence
deliverables:
  - recurrence.js
  - ANALYSIS.md
---

## Task

A fictional divide-and-conquer routine ("Gladewright partition") splits its
input into 5 subproblems of one-third the size and does linear work to
combine them. Its running time is described exactly by the recurrence:

```
T(n) = 5*T(n/3) + n     for n a power of 3, n > 1
T(1) = 1
```

This recurrence is defined only for `n` a power of 3, so it is
well-defined at every input this test asks for.

Rather than accept an unverifiable algebraic claim, this task requires
an **executable** answer: implement `T(n)` so it computes the exact
integer value the recurrence defines, and separately determine the
asymptotic growth class using the Master Theorem.

## Deliverables

- `recurrence.js` — must:
  - Implement `T(n)` (recommended: memoized recursion or a
    bottom-up/iterative loop over powers of 3) that returns the exact
    integer value defined by the recurrence above.
  - Export it via `module.exports = { T }` so a judge can call
    `T(n)` directly for any power-of-3 input, including values not
    printed by the script.
  - When run with `node recurrence.js`, print **exactly 6 lines**, one
    per pinned input, in the exact form `T(<n>)=<value>`, for
    `n = 1, 3, 9, 27, 81, 729` **in that order** — no header, no extra
    lines.
- `ANALYSIS.md` (max 250 words, whole file) — must:
  - State the asymptotic class using the Master Theorem, i.e.
    Theta(n^log3(5)) (equivalently "Theta(n^1.465...)" or "n raised to
    log base 3 of 5").
  - Give a one-paragraph justification: identify `a=5`, `b=3`,
    `f(n)=n`, compare `f(n)` against `n^log_b(a)`, and state which
    Master Theorem case applies and why.
  - State the exact value of `T(729)`.

## Constraints

- Plain JavaScript, no dependencies, single file for `recurrence.js`.
- Do not special-case the 6 pinned inputs (e.g. a lookup table) — the
  judge will call `T` on an unlisted power-of-3 input and check the
  result against a fresh recompute of the recurrence, not against a
  hardcoded map.
- Use exact integer arithmetic — every `T(n)` value in this recurrence
  is a whole number for the pinned and unlisted inputs used.
