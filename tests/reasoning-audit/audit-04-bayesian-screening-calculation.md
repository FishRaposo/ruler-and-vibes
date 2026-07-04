---
id: audit-04-bayesian-screening-calculation
category: reasoning-audit
title: Bayesian Screening Calculation Audit
deliverables:
  - AUDIT.md
---

## Task

This task is strictly an audit of a fictional statistical calculation.
It requires no diagnostic, medical, or professional judgment — only
verification of arithmetic in a Bayesian probability computation.

A fictional population is screened for an invented trait called
"Verdix status." Two derivations each compute the posterior probability
that a person flagged positive by the screening test truly has Verdix
status, given a base rate, test sensitivity, and test specificity,
using total probability in the denominator:

```
P(D|+) = P(+|D) x P(D)  /  [ P(+|D) x P(D) + P(+|not-D) x P(not-D) ]
```

where `P(+|not-D) = 1 - specificity` and `P(not-D) = 1 - P(D)`. Every
step is labeled. Audit each derivation independently.

### Derivation A — "Verdix" screening in Population Meridian

- **Step A1**: Base rate `P(D) = 0.02`, so `P(not-D) = 0.98`.
- **Step A2**: Sensitivity `P(+|D) = 0.90`.
- **Step A3**: Specificity `= 0.95`, so `P(+|not-D) = 1 - 0.95 = 0.05`.
- **Step A4**: Numerator: `P(+|D) x P(D) = 0.90 x 0.02 = 0.018`.
- **Step A5**: Denominator: `P(+|D) x P(D) + P(+|not-D) = 0.018 + 0.05
  = 0.068`.
- **Step A6**: Posterior: `P(D|+) = 0.018 / 0.068 = 0.264706`, i.e.
  26.47%.
- **Step A7**: Conclusion: a person flagged positive has a 26.47%
  chance of true Verdix status.

### Derivation B — "Verdix" screening in Population Kestrel

- **Step B1**: Base rate `P(D) = 0.04`, so `P(not-D) = 0.96`.
- **Step B2**: Sensitivity `P(+|D) = 0.85`.
- **Step B3**: Specificity `= 0.92`, so `P(+|not-D) = 1 - 0.92 = 0.08`.
- **Step B4**: Numerator: `P(+|D) x P(D) = 0.85 x 0.04 = 0.034`.
- **Step B5**: Denominator: `P(+|D) x P(D) + P(+|not-D) x P(not-D) =
  0.034 + (0.08 x 0.96) = 0.034 + 0.0768 = 0.1108`.
- **Step B6**: Posterior: `P(D|+) = 0.034 / 0.1108 = 0.306859`, i.e.
  30.69%.
- **Step B7**: Conclusion: a person flagged positive has approximately
  30.69% chance of true Verdix status.

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
