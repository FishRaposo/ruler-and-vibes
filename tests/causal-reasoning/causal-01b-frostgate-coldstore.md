---
id: causal-01b-frostgate-coldstore
category: causal-reasoning
title: Frostgate Cold-Store DAG — confounding, d-separation, and the backdoor
deliverables:
  - ANSWERS.md
  - verify.js
---

## Task

Frostgate Cold-Store is a fictional refrigerated warehouse with a fixed
causal structure, known completely and stated here as ground truth — no
observational fitting required. Five binary variables (each 0/1) sit on
the following directed edges: the Demand shift influences both whether
the Compressor engages and whether the Backup brine loop runs; the
Compressor and the Backup brine loop both influence whether the target
aisle reaches its Frozen setpoint; reaching the Frozen setpoint in turn
determines whether the spoilage Alarm stays silent.

```
Variables: D (Demand shift), C (Compressor), B (Backup brine loop),
           F (Frozen setpoint reached), A (Alarm silent)
Edges:     D -> C
           D -> B
           C -> F
           B -> F
           F -> A
```

The conditional probability tables (ground truth, not to be estimated):

```
P(D=1) = 0.4

P(C=1 | D=1) = 0.75
P(C=1 | D=0) = 0.05

P(B=1 | D=1) = 0.15
P(B=1 | D=0) = 0.70
```

(C and B are generated independently of each other once D is fixed — the
CPTs above are the complete generating process for D, C, and B.)

## Deliverables

- `ANSWERS.md` — answer each lettered question below, one short
  paragraph or a few lines each, with a one-line justification citing
  the specific path(s) in the DAG involved:
  - **(a)** Is there a variable that confounds the observed association
    between the Compressor (C) and the Backup brine loop (B)? Name it if
    so. Separately, are C and B marginally independent (i.e., with
    nothing held fixed)?
  - **(b)** Are C and B independent of each other once you condition on
    the Demand shift (D)? Name the graphical reason (which kind of path
    is being blocked, and how).
  - **(c)** Give the minimal set of variables you would need to hold
    fixed (adjust for) to identify the causal effect of the Compressor
    (C) on the Frozen setpoint (F). Name the specific non-causal path
    this adjustment blocks.
  - **(d)** Look at the path C -> F <- B. Classify F's role on that
    specific path (chain / fork / collider), and state what happens to
    the C-B association if you condition on F.
- `verify.js` — a standalone Node script (no dependencies) that encodes
  the CPTs above and computes, then prints, four numbers: P(C=1),
  P(B=1), the joint P(C=1 and B=1), and the product P(C=1)*P(B=1).
  Running `node verify.js` must print all four values.

## Constraints

- `ANSWERS.md` must address all four questions (a)-(d) as distinct,
  labeled sections — do not merge them into one narrative.
- `verify.js` must run standalone with `node verify.js`, no external
  packages, and must print all four numbers requested above with clear
  labels.
- Ground every answer in the stated DAG and CPTs; do not introduce
  additional variables or edges not listed above.
