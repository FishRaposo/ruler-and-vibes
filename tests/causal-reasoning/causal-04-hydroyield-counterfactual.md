---
id: causal-04-hydroyield-counterfactual
category: causal-reasoning
title: Three-step counterfactual on a linear structural causal model
deliverables:
  - counterfactual.js
  - ANSWERS.md
---

## Task

HydroYield is a fictional agricultural model with three variables
related by the following structural equations, given as complete ground
truth:

```
Z := U_z
X := 2*Z + U_x
Y := 3*X - 1*Z + U_y
```

`U_z`, `U_x`, and `U_y` are independent exogenous noise terms, each with
mean zero, though their realized values differ per unit (per plot).

One specific, fully observed plot has: **Z = 4, X = 10, Y = 25**.

The question: for THIS SPECIFIC PLOT, what would Y have been if X had
been 6 instead of its observed value of 10 — holding fixed everything
else that makes this plot what it is (i.e., this plot's own particular
noise realizations), not resampling them?

Answering this requires the standard three-step counterfactual
procedure:

1. **Abduction** — using this plot's observed (Z, X, Y), solve backward
   through the structural equations for this plot's specific exogenous
   noise values (U_z, U_x, U_y).
2. **Action** — modify the model by replacing the equation for X with
   the fixed value X := 6 (severing X's dependence on Z and U_x for
   this step), while keeping every other equation and this plot's
   abducted noise values unchanged. Note that Z sits upstream of X in
   the causal order, so an intervention on X has no way to reach back
   and change Z.
3. **Prediction** — recompute Y forward through the (modified) model
   using this plot's abducted noises and the new X.

Separately, contrast this unit-level answer with the population-level
interventional mean E[Y | do(X=6)] — the average Y you'd get across the
whole population if you intervened to set X=6 for everyone (where each
unit's noises are freshly drawn from their zero-mean distributions
rather than fixed to this one plot's values).

## Deliverables

- `counterfactual.js` — a standalone Node script (no dependencies) that
  (1) computes and prints the three abducted noise values for this
  plot, and (2) computes and prints the counterfactual Y for this plot
  had X been 6.
- `ANSWERS.md` — walk through all three steps explicitly with their
  numbers:
  - State the abducted (U_z, U_x, U_y) for this plot.
  - State the action step: what X is fixed to, what happens to Z (and
    why), and which structural equation is overridden.
  - State the prediction: the resulting counterfactual Y.
  - **Discrimination question**: state the population interventional
    mean E[Y | do(X=6)] (using the fact that the noises are zero-mean),
    contrast it numerically with this plot's counterfactual Y, and
    explain in one or two sentences what accounts for the difference
    between the two.

## Constraints

- `counterfactual.js` must run standalone with `node counterfactual.js`,
  no external packages, and must print the three abducted noises and
  the final counterfactual Y with clear labels.
- `ANSWERS.md` must show all three steps as distinct, labeled parts, not
  collapsed into a single computation with no intermediate values
  shown.
- Do not recompute Z from the counterfactual X — Z's value for this
  plot is fixed by the abduction step and is not re-derived from any
  downstream variable.
