---
id: audit-02-quadratic-rearrangement-derivation
category: reasoning-audit
title: Quadratic Rearrangement Derivation Audit
deliverables:
  - AUDIT.md
---

## Task

Two step-by-step algebraic derivations each start from a bracketed
quadratic equation, expand it, collect terms into standard form
`ax^2 + bx + c = 0`, and solve via the discriminant
`b^2 - 4ac` and quadratic formula `x = (-b +/- sqrt(disc)) / (2a)`.
Every step is labeled. Audit each derivation independently.

### Derivation A — starting equation `3(x - 2)^2 = 5x + 1`

- **Step A1**: Expand the square: `(x - 2)^2 = x^2 - 4x + 4`.
- **Step A2**: Multiply by 3: `3(x^2 - 4x + 4) = 3x^2 - 12x + 12`. So the
  equation is `3x^2 - 12x + 12 = 5x + 1`.
- **Step A3**: Move `5x + 1` to the left-hand side: `3x^2 - 12x - 5x +
  12 - 1 = 0`.
- **Step A4**: Collect the like x-terms: `-12x - 5x = -7x`. Collect the
  constants: `12 - 1 = 11`. Standard form: `3x^2 - 7x + 11 = 0`.
- **Step A5**: Compute the discriminant: `b^2 - 4ac = (-7)^2 - 4(3)(11)
  = 49 - 132 = -83`.
- **Step A6**: Conclusion: since the discriminant is negative, the
  equation `3(x - 2)^2 = 5x + 1` has no real roots.

### Derivation B — starting equation `2(x + 1)^2 = 3x + 8`

- **Step B1**: Expand the square: `(x + 1)^2 = x^2 + 2x + 1`.
- **Step B2**: Multiply by 2: `2(x^2 + 2x + 1) = 2x^2 + 4x + 2`. So the
  equation is `2x^2 + 4x + 2 = 3x + 8`.
- **Step B3**: Move `3x + 8` to the left-hand side: `2x^2 + 4x - 3x + 2
  - 8 = 0`.
- **Step B4**: Collect the like x-terms: `4x - 3x = x`. Collect the
  constants: `2 - 8 = -6`. Standard form: `2x^2 + x - 6 = 0`.
- **Step B5**: Compute the discriminant: `b^2 - 4ac = (1)^2 - 4(2)(-6)
  = 1 + 48 = 49`.
- **Step B6**: Apply the quadratic formula: `x = (-1 +/- sqrt(49)) / 4
  = (-1 +/- 7) / 4`, giving `x = 6/4 = 1.5` or `x = -8/4 = -2`.
- **Step B7**: Conclusion: the roots are `x = 1.5` and `x = -2`.

## Deliverables

- `AUDIT.md` containing, for **each** derivation (A and B) in order:
  - A verdict: either "ERROR FOUND" or "NO ERROR FOUND".
  - If ERROR FOUND: the exact step label (e.g. "Step A4") of the
    **first** step at which the derivation goes wrong, a one-sentence
    explanation of the specific algebraic mistake, the corrected
    standard-form coefficients, and the corrected roots (or a correct
    statement about the nature of the roots) to at least 2 decimal
    places where the roots are irrational.
  - If NO ERROR FOUND: a one-line confirmation restating the
    derivation's final roots and that the derivation is correct.
  - The re-expansion/recombination arithmetic supporting the corrected
    result.

## Constraints

- Exactly one of the two derivations contains a planted error; the
  other is fully correct. Do not flag both, and do not flag neither.
- The flagged step must be the **first** point of divergence, not a
  later step that correctly carries an earlier error forward.
- A derivation reaching a clean-looking conclusion (e.g. "no real
  roots") is not by itself evidence of correctness — verify by
  re-expanding.
