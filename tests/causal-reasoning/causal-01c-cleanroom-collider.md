---
id: causal-01c-cleanroom-collider
category: causal-reasoning
title: Cleanroom DAG — confounding, d-separation, and the backdoor
deliverables:
  - ANSWERS.md
  - verify.js
---

## Task

Brackwell Wafer Cleanroom is a fictional fabrication bay with a fixed
causal structure, known completely and stated here as ground truth — no
observational fitting required. Five binary variables (each 0/1) sit on
the following directed edges: which Shift is running influences both
whether the bay runs Humid and whether a Ventilation boost is engaged;
Humidity and the Ventilation boost both influence whether a surface
Defect appears on the wafer; the Defect in turn determines whether the
lot is Quarantined.

```
Variables: N (Night shift), H (Humid bay), V (Ventilation boost),
           D (surface Defect), Q (lot Quarantined)
Edges:     N -> H
           N -> V
           H -> D
           V -> D
           D -> Q
```

The conditional probability tables (ground truth, not to be estimated):

```
P(N=1) = 0.4

P(H=1 | N=1) = 0.75
P(H=1 | N=0) = 0.15

P(V=1 | N=1) = 0.05
P(V=1 | N=0) = 0.80
```

(H and V are generated independently of each other once N is fixed — the
CPTs above are the complete generating process for N, H, and V.)

## Deliverables

- `ANSWERS.md` — answer each lettered question below, one short
  paragraph or a few lines each, with a one-line justification citing
  the specific path(s) in the DAG involved:
  - **(a)** Is there a variable that confounds the observed association
    between Humidity (H) and Ventilation-boost (V)? Name it if so.
    Separately, are H and V marginally independent (i.e., with nothing
    held fixed)?
  - **(b)** Are H and V independent of each other once you condition on
    Shift (N)? Name the graphical reason (which kind of path is being
    blocked, and how).
  - **(c)** Give the minimal set of variables you would need to hold
    fixed (adjust for) to identify the causal effect of Humidity (H) on
    surface Defect (D). Name the specific non-causal path this
    adjustment blocks.
  - **(d)** Look at the path H -> D <- V. Classify D's role on that
    specific path (chain / fork / collider), and state what happens to
    the H-V association if you condition on D.
- `verify.js` — a standalone Node script (no dependencies) that encodes
  the CPTs above and computes, then prints, four numbers: P(H=1),
  P(V=1), the joint P(H=1 and V=1), and the product P(H=1)*P(V=1).
  Running `node verify.js` must print all four values.

## Constraints

- `ANSWERS.md` must address all four questions (a)-(d) as distinct,
  labeled sections — do not merge them into one narrative.
- `verify.js` must run standalone with `node verify.js`, no external
  packages, and must print all four numbers requested above with clear
  labels.
- Ground every answer in the stated DAG and CPTs; do not introduce
  additional variables or edges not listed above.
