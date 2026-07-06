---
id: causal-04b-sappledon-boil-counterfactual
category: causal-reasoning
title: Three-step counterfactual on a linear sugarhouse structural model
deliverables:
  - counterfactual.js
  - ANSWERS.md
---

## Task

Sappledon Sugarworks is a fictional maple-syrup model with three
variables related by the following structural equations, given as
complete ground truth:

```
D := U_d
B := 3*D + U_b
S := 2*B + 1*D + U_s
```

Here `D` is the firebox draft index, `B` is the boil intensity, and `S`
is the syrup density gain. `U_d`, `U_b`, and `U_s` are independent
exogenous noise terms, each with mean zero, though their realized values
differ per unit (per boil batch).

One specific, fully observed batch has: **D = 6, B = 19, S = 43**.

The question: for THIS SPECIFIC BATCH, what would S have been if B had
been 13 instead of its observed value of 19 — holding fixed everything
else that makes this batch what it is (i.e., this batch's own particular
noise realizations), not resampling them?

Answering this requires the standard three-step counterfactual
procedure:

1. **Abduction** — using this batch's observed (D, B, S), solve backward
   through the structural equations for this batch's specific exogenous
   noise values (U_d, U_b, U_s).
2. **Action** — modify the model by replacing the equation for B with
   the fixed value B := 13 (severing B's dependence on D and U_b for
   this step), while keeping every other equation and this batch's
   abducted noise values unchanged. Note that D sits upstream of B in
   the causal order, so an intervention on B has no way to reach back
   and change D.
3. **Prediction** — recompute S forward through the (modified) model
   using this batch's abducted noises and the new B.

Separately, contrast this unit-level answer with the population-level
interventional mean E[S | do(B=13)] — the average S you'd get across the
whole population if you intervened to set B=13 for every batch (where
each batch's noises are freshly drawn from their zero-mean distributions
rather than fixed to this one batch's values).

## Deliverables

- `counterfactual.js` — a standalone Node script (no dependencies) that
  (1) computes and prints the three abducted noise values for this
  batch, and (2) computes and prints the counterfactual S for this batch
  had B been 13.
- `ANSWERS.md` — walk through all three steps explicitly with their
  numbers:
  - State the abducted (U_d, U_b, U_s) for this batch.
  - State the action step: what B is fixed to, what happens to D (and
    why), and which structural equation is overridden.
  - State the prediction: the resulting counterfactual S.
  - **Discrimination question**: state the population interventional
    mean E[S | do(B=13)] (using the fact that the noises are zero-mean),
    contrast it numerically with this batch's counterfactual S, and
    explain in one or two sentences what accounts for the difference
    between the two.

## Constraints

- `counterfactual.js` must run standalone with `node counterfactual.js`,
  no external packages, and must print the three abducted noises and the
  final counterfactual S with clear labels.
- `ANSWERS.md` must show all three steps as distinct, labeled parts, not
  collapsed into a single computation with no intermediate values shown.
- Do not recompute D from the counterfactual B — D's value for this
  batch is fixed by the abduction step and is not re-derived from any
  downstream variable.
