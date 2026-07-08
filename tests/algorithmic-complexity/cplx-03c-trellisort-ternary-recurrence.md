---
id: cplx-03c-trellisort-ternary-recurrence
category: algorithmic-complexity
title: Time the Trellisort, Prove the Class
deliverables:
  - recurrence.js
  - ANALYSIS.md
---

## Task

A fictional divide-and-conquer routine ("Trellisort") splits its input
into 7 subproblems of one-quarter the size and does linear work to
combine them. Its running time is described exactly by the recurrence:

```
T(n) = 7*T(n/4) + n     for n a power of 4, n > 1
T(1) = 1
```

This recurrence is defined only for `n` a power of 4, so it is
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
    `n = 1, 4, 16, 64, 256, 1024` **in that order** — no header, no extra
    lines.
- `ANALYSIS.md` (max 250 words, whole file) — must:
  - State the asymptotic class using the Master Theorem, i.e.
    Theta(n^log4(7)) (equivalently "Theta(n^1.404...)" or "n raised to
    log base 4 of 7").
  - Give a one-paragraph justification: identify `a=7`, `b=4`,
    `f(n)=n`, compare `f(n)` against `n^log_b(a)`, and state which
    Master Theorem case applies and why.
  - State the exact value of `T(1024)`.

## Constraints

- Plain JavaScript, no dependencies, single file for `recurrence.js`.
- Do not special-case the 6 pinned inputs (e.g. a lookup table) — the
  judge will call `T` on an unlisted power-of-3 input and check the
  result against a fresh recompute of the recurrence, not against a
  hardcoded map.
- Use exact integer arithmetic — every `T(n)` value in this recurrence
  is a whole number for the pinned and unlisted inputs used.
