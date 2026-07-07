---
id: audit-04b-foundry-flaw-inspection
category: reasoning-audit
title: Bayesian Inspection Calculation Audit
deliverables:
  - AUDIT.md
---

## Task

This task is strictly an audit of a fictional statistical calculation.
It requires no diagnostic, medical, or professional judgment — only
verification of arithmetic in a Bayesian probability computation.

A fictional foundry's ultrasonic inspection line flags cast turbine
housings for a suspected internal casting flaw called an "Ossvein
fracture." Two derivations each compute the posterior probability that
a housing flagged positive by the ultrasonic scan truly has an Ossvein
fracture, given a base rate, scanner sensitivity, and scanner
specificity, using total probability in the denominator:

```
P(D|+) = P(+|D) x P(D)  /  [ P(+|D) x P(D) + P(+|not-D) x P(not-D) ]
```

where `P(+|not-D) = 1 - specificity` and `P(not-D) = 1 - P(D)`. Every
step is labeled. Audit each derivation independently.

### Derivation A — "Ossvein" inspection at Halstrom Casting

- **Step A1**: Base rate `P(D) = 0.015`, so `P(not-D) = 0.985`.
- **Step A2**: Sensitivity `P(+|D) = 0.93`.
- **Step A3**: Specificity `= 0.97`, so `P(+|not-D) = 1 - 0.97 = 0.03`.
- **Step A4**: Numerator: `P(+|D) x P(D) = 0.93 x 0.015 = 0.01395`.
- **Step A5**: Denominator: `P(+|D) x P(D) + P(+|not-D) = 0.01395 + 0.03
  = 0.04395`.
- **Step A6**: Posterior: `P(D|+) = 0.01395 / 0.04395 = 0.317406`, i.e.
  31.74%.
- **Step A7**: Conclusion: a housing flagged positive has a 31.74%
  chance of a true Ossvein fracture.

### Derivation B — "Ossvein" inspection at Varnholt Forge

- **Step B1**: Base rate `P(D) = 0.05`, so `P(not-D) = 0.95`.
- **Step B2**: Sensitivity `P(+|D) = 0.80`.
- **Step B3**: Specificity `= 0.90`, so `P(+|not-D) = 1 - 0.90 = 0.10`.
- **Step B4**: Numerator: `P(+|D) x P(D) = 0.80 x 0.05 = 0.04`.
- **Step B5**: Denominator: `P(+|D) x P(D) + P(+|not-D) x P(not-D) =
  0.04 + (0.10 x 0.95) = 0.04 + 0.095 = 0.135`.
- **Step B6**: Posterior: `P(D|+) = 0.04 / 0.135 = 0.296296`, i.e.
  29.63%.
- **Step B7**: Conclusion: a housing flagged positive has approximately
  29.63% chance of a true Ossvein fracture.

## Deliverables

- `AUDIT.md` containing, for **each** derivation (A and B) in order:
  - A verdict: either "ERROR FOUND" or "NO ERROR FOUND".
  - If ERROR FOUND: the exact step label (e.g. "Step A5") of the
    **first** step at which the derivation goes wrong, a one-sentence
    explanation of the specific error, and the corrected posterior
    probability to at least two decimal places (as a percentage).
  - If NO ERROR FOUND: a one-line confirmation restating the
    derivation's stated total-probability (denominator) value and
    posterior, confirming both are correct.
  - The full recomputation (numerator, denominator, ratio) supporting
    the corrected posterior.

## Constraints

- Exactly one of the two derivations contains a planted error; the
  other is fully correct. Do not flag both, and do not flag neither.
- The flagged step must be the **first** point of divergence, not a
  later step that correctly carries an earlier error forward.
- Do not eyeball the two posteriors as "close enough" — recompute the
  denominator explicitly for both derivations before rendering a
  verdict.
