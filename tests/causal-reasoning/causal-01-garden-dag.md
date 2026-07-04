---
id: causal-01-garden-dag
category: causal-reasoning
title: Garden DAG — confounding, d-separation, and the backdoor
deliverables:
  - ANSWERS.md
  - verify.js
---

## Task

GreenTile Garden is a fictional plot with a fixed causal structure, known
completely and stated here as ground truth — no observational fitting
required. Three binary variables (each 0/1) sit on the following directed
edges: Season influences both Rain and Sprinkler-use; Rain and
Sprinkler-use both influence whether a particular garden path gets Wet;
the Wet path in turn determines whether the path is Slippery.

```
Variables: S (Season), R (Rain), K (Sprinkler), W (Wet path), P (Slippery)
Edges:     S -> R
           S -> K
           R -> W
           K -> W
           W -> P
```

The conditional probability tables (ground truth, not to be estimated):

```
P(S=1) = 0.5

P(R=1 | S=1) = 0.8
P(R=1 | S=0) = 0.1

P(K=1 | S=1) = 0.1
P(K=1 | S=0) = 0.7
```

(R and K are generated independently of each other once S is fixed — the
CPTs above are the complete generating process for S, R, and K.)

## Deliverables

- `ANSWERS.md` — answer each lettered question below, one short
  paragraph or a few lines each, with a one-line justification citing
  the specific path(s) in the DAG involved:
  - **(a)** Is there a variable that confounds the observed association
    between Rain (R) and Sprinkler-use (K)? Name it if so. Separately,
    are R and K marginally independent (i.e., with nothing held fixed)?
  - **(b)** Are R and K independent of each other once you condition on
    Season (S)? Name the graphical reason (which kind of path is being
    blocked, and how).
  - **(c)** Give the minimal set of variables you would need to hold
    fixed (adjust for) to identify the causal effect of Rain (R) on Wet
    path (W). Name the specific non-causal path this adjustment blocks.
  - **(d)** Look at the path R -> W <- K. Classify W's role on that
    specific path (chain / fork / collider), and state what happens to
    the R-K association if you condition on W.
- `verify.js` — a standalone Node script (no dependencies) that encodes
  the CPTs above and computes, then prints, four numbers: P(R=1),
  P(K=1), the joint P(R=1 and K=1), and the product P(R=1)*P(K=1).
  Running `node verify.js` must print all four values.

## Constraints

- `ANSWERS.md` must address all four questions (a)-(d) as distinct,
  labeled sections — do not merge them into one narrative.
- `verify.js` must run standalone with `node verify.js`, no external
  packages, and must print all four numbers requested above with clear
  labels.
- Ground every answer in the stated DAG and CPTs; do not introduce
  additional variables or edges not listed above.
