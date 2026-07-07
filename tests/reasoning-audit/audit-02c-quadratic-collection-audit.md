---
id: audit-02c-quadratic-collection-audit
category: reasoning-audit
title: Quadratic Term-Collection Derivation Audit
deliverables:
  - AUDIT.md
---

## Task

Two step-by-step algebraic derivations each start from a bracketed
quadratic equation, expand it, collect terms into standard form
`ax^2 + bx + c = 0`, and solve via the discriminant
`b^2 - 4ac` and quadratic formula `x = (-b +/- sqrt(disc)) / (2a)`.
Every step is labeled. Audit each derivation independently.

### Derivation P — starting equation `2(x - 3)^2 = 7x + 4`

- **Step P1**: Expand the square: `(x - 3)^2 = x^2 - 6x + 9`.
- **Step P2**: Multiply by 2: `2(x^2 - 6x + 9) = 2x^2 - 12x + 18`. So the
  equation is `2x^2 - 12x + 18 = 7x + 4`.
- **Step P3**: Move `7x + 4` to the left-hand side: `2x^2 - 12x - 7x +
  18 - 4 = 0`.
- **Step P4**: Collect the like x-terms: `-12x - 7x = -5x`. Collect the
  constants: `18 - 4 = 14`. Standard form: `2x^2 - 5x + 14 = 0`.
- **Step P5**: Compute the discriminant: `b^2 - 4ac = (-5)^2 - 4(2)(14)
  = 25 - 112 = -87`.
- **Step P6**: Conclusion: since the discriminant is negative, the
  equation `2(x - 3)^2 = 7x + 4` has no real roots.

### Derivation Q — starting equation `3(x + 1)^2 = 2x + 18`

- **Step Q1**: Expand the square: `(x + 1)^2 = x^2 + 2x + 1`.
- **Step Q2**: Multiply by 3: `3(x^2 + 2x + 1) = 3x^2 + 6x + 3`. So the
  equation is `3x^2 + 6x + 3 = 2x + 18`.
- **Step Q3**: Move `2x + 18` to the left-hand side: `3x^2 + 6x - 2x + 3
  - 18 = 0`.
- **Step Q4**: Collect the like x-terms: `6x - 2x = 4x`. Collect the
  constants: `3 - 18 = -15`. Standard form: `3x^2 + 4x - 15 = 0`.
- **Step Q5**: Compute the discriminant: `b^2 - 4ac = (4)^2 - 4(3)(-15)
  = 16 + 180 = 196`.
- **Step Q6**: Apply the quadratic formula: `x = (-4 +/- sqrt(196)) / 6
  = (-4 +/- 14) / 6`, giving `x = 10/6 = 5/3` or `x = -18/6 = -3`.
- **Step Q7**: Conclusion: the roots are `x = 5/3` and `x = -3`.

## Deliverables

- `AUDIT.md` containing, for **each** derivation (P and Q) in order:
  - A verdict: either "ERROR FOUND" or "NO ERROR FOUND".
  - If ERROR FOUND: the exact step label (e.g. "Step P4") of the
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
