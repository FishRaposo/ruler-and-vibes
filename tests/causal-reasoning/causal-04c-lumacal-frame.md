---
id: causal-04c-lumacal-frame
category: causal-reasoning
title: Three-step counterfactual on a linear photometric calibration model
deliverables:
  - counterfactual.js
  - ANSWERS.md
---

## Task

LumaCal is a fictional photometric calibration model used by a telescope
survey. For any single exposure frame it relates three variables through
the following structural equations, given as complete ground truth:

```
S := U_s
G := 3*S + U_g
B := 2*G - 2*S + U_b
```

`S` is the sky-background level, `G` is the gain-stage signal, and `B` is
the final calibrated brightness. `U_s`, `U_g`, and `U_b` are independent
exogenous noise terms, each with mean zero, though their realized values
differ from frame to frame.

One specific, fully observed frame has: **S = 3, G = 14, B = 23**.

The question: for THIS SPECIFIC FRAME, what would B have been if G had
been 11 instead of its observed value of 14 — holding fixed everything
else that makes this frame what it is (i.e., this frame's own particular
noise realizations), not resampling them?

Answering this requires the standard three-step counterfactual
procedure:

1. **Abduction** — using this frame's observed (S, G, B), solve backward
   through the structural equations for this frame's specific exogenous
   noise values (U_s, U_g, U_b).
2. **Action** — modify the model by replacing the equation for G with the
   fixed value G := 11 (severing G's dependence on S and U_g for this
   step), while keeping every other equation and this frame's abducted
   noise values unchanged. Note that S sits upstream of G in the causal
   order, so an intervention on G has no way to reach back and change S.
3. **Prediction** — recompute B forward through the (modified) model
   using this frame's abducted noises and the new G.

Separately, contrast this frame-level answer with the population-level
interventional mean E[B | do(G=11)] — the average B you'd get across the
whole population of frames if you intervened to set G=11 for every frame
(where each frame's noises are freshly drawn from their zero-mean
distributions rather than fixed to this one frame's values).

## Deliverables

- `counterfactual.js` — a standalone Node script (no dependencies) that
  (1) computes and prints the three abducted noise values for this frame,
  and (2) computes and prints the counterfactual B for this frame had G
  been 11.
- `ANSWERS.md` — walk through all three steps explicitly with their
  numbers:
  - State the abducted (U_s, U_g, U_b) for this frame.
  - State the action step: what G is fixed to, what happens to S (and
    why), and which structural equation is overridden.
  - State the prediction: the resulting counterfactual B.
  - **Discrimination question**: state the population interventional mean
    E[B | do(G=11)] (using the fact that the noises are zero-mean),
    contrast it numerically with this frame's counterfactual B, and
    explain in one or two sentences what accounts for the difference
    between the two.

## Constraints

- `counterfactual.js` must run standalone with `node counterfactual.js`,
  no external packages, and must print the three abducted noises and the
  final counterfactual B with clear labels.
- `ANSWERS.md` must show all three steps as distinct, labeled parts, not
  collapsed into a single computation with no intermediate values shown.
- Do not recompute S from the counterfactual G — S's value for this frame
  is fixed by the abduction step and is not re-derived from any
  downstream variable.
