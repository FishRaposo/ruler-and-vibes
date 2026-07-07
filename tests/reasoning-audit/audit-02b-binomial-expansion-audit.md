---
id: audit-02b-binomial-expansion-audit
category: reasoning-audit
title: Binomial Expansion Standard-Form Audit
deliverables:
  - AUDIT.md
---

## Task

Two step-by-step algebraic derivations each start from a bracketed
quadratic equation, expand it, collect terms into standard form
`ax^2 + bx + c = 0`, and solve via the discriminant
`b^2 - 4ac` and quadratic formula `x = (-b +/- sqrt(disc)) / (2a)`.
Every step is labeled. Audit each derivation independently.

### Derivation A — starting equation `4(x - 3)^2 = 7x + 2`

- **Step A1**: Expand the square: `(x - 3)^2 = x^2 - 6x + 9`.
- **Step A2**: Multiply by 4: `4(x^2 - 6x + 9) = 4x^2 - 24x + 36`. So the
  equation is `4x^2 - 24x + 36 = 7x + 2`.
- **Step A3**: Move `7x + 2` to the left-hand side: `4x^2 - 24x - 7x +
  36 - 2 = 0`.
- **Step A4**: Collect the like x-terms: `-24x - 7x = -17x`. Collect the
  constants: `36 - 2 = 34`. Standard form: `4x^2 - 17x + 34 = 0`.
- **Step A5**: Compute the discriminant: `b^2 - 4ac = (-17)^2 - 4(4)(34)
  = 289 - 544 = -255`.
- **Step A6**: Conclusion: since the discriminant is negative, the
  equation `4(x - 3)^2 = 7x + 2` has no real roots.

### Derivation B — starting equation `2(x - 1)^2 = 5x - 2`

- **Step B1**: Expand the square: `(x - 1)^2 = x^2 - 2x + 1`.
- **Step B2**: Multiply by 2: `2(x^2 - 2x + 1) = 2x^2 - 4x + 2`. So the
  equation is `2x^2 - 4x + 2 = 5x - 2`.
- **Step B3**: Move `5x - 2` to the left-hand side: `2x^2 - 4x - 5x + 2
  + 2 = 0`.
- **Step B4**: Collect the like x-terms: `-4x - 5x = -9x`. Collect the
  constants: `2 + 2 = 4`. Standard form: `2x^2 - 9x + 4 = 0`.
- **Step B5**: Compute the discriminant: `b^2 - 4ac = (-9)^2 - 4(2)(4)
  = 81 - 32 = 49`.
- **Step B6**: Apply the quadratic formula: `x = (9 +/- sqrt(49)) / 4
  = (9 +/- 7) / 4`, giving `x = 16/4 = 4` or `x = 2/4 = 0.5`.
- **Step B7**: Conclusion: the roots are `x = 4` and `x = 0.5`.

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
