---
id: audit-04c-orchard-blemish-screening
category: reasoning-audit
title: Bayesian Sorter-Screening Calculation Audit
deliverables:
  - AUDIT.md
---

## Task

This task is strictly an audit of a fictional statistical calculation.
It requires no agricultural, food-safety, or professional judgment —
only verification of arithmetic in a Bayesian probability computation.

A fictional packhouse's optical sorter line flags harvested stonefruit
for a suspected internal blemish called "Torvex blush." Two derivations
each compute the posterior probability that a fruit flagged positive by
the sorter truly has Torvex blush, given a base rate, sorter
sensitivity, and sorter specificity, using total probability in the
denominator:

```
P(D|+) = P(+|D) x P(D)  /  [ P(+|D) x P(D) + P(+|not-D) x P(not-D) ]
```

where `P(+|not-D) = 1 - specificity` and `P(not-D) = 1 - P(D)`. Every
step is labeled. Audit each derivation independently.

### Derivation A — "Torvex" screening in Batch Foxglenn

- **Step A1**: Base rate `P(D) = 0.025`, so `P(not-D) = 0.975`.
- **Step A2**: Sensitivity `P(+|D) = 0.85`.
- **Step A3**: Specificity `= 0.94`, so `P(+|not-D) = 1 - 0.94 = 0.06`.
- **Step A4**: Numerator: `P(+|D) x P(D) = 0.85 x 0.025 = 0.02125`.
- **Step A5**: Denominator: `P(+|D) x P(D) + P(+|not-D) = 0.02125 + 0.06
  = 0.08125`.
- **Step A6**: Posterior: `P(D|+) = 0.02125 / 0.08125 = 0.261538`, i.e.
  26.15%.
- **Step A7**: Conclusion: a fruit flagged positive has a 26.15% chance
  of true Torvex blush.

### Derivation B — "Torvex" screening in Batch Cindercrest

- **Step B1**: Base rate `P(D) = 0.06`, so `P(not-D) = 0.94`.
- **Step B2**: Sensitivity `P(+|D) = 0.82`.
- **Step B3**: Specificity `= 0.88`, so `P(+|not-D) = 1 - 0.88 = 0.12`.
- **Step B4**: Numerator: `P(+|D) x P(D) = 0.82 x 0.06 = 0.0492`.
- **Step B5**: Denominator: `P(+|D) x P(D) + P(+|not-D) x P(not-D) =
  0.0492 + (0.12 x 0.94) = 0.0492 + 0.1128 = 0.1620`.
- **Step B6**: Posterior: `P(D|+) = 0.0492 / 0.1620 = 0.303704`, i.e.
  30.37%.
- **Step B7**: Conclusion: a fruit flagged positive has approximately
  30.37% chance of true Torvex blush.

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
