---
id: causal-03c-kilnford-quench-do
category: causal-reasoning
title: Do-operator versus conditioning — the confounded quench-crack estimate
deliverables:
  - intervene.js
  - ANSWERS.md
---

## Task

Kilnford is a fictional metal-casting foundry whose finished parts are
described by three binary (0/1) variables with the following known
causal structure, given as ground truth:

```
Variables: M (Melt-grade), Q (Quench-treatment), C (Crack)
Edges:     M -> Q
           M -> C
           Q -> C
```

Melt-grade (M=1 means a premium-alloy melt, M=0 a standard melt) affects
both whether operators apply the optional Quench-treatment and whether
the finished part develops a Crack directly; the Quench-treatment also
independently affects Cracking. The full conditional probability tables
(ground truth):

```
P(M=1) = 0.35

P(Q=1 | M=1) = 0.85
P(Q=1 | M=0) = 0.25

P(C=1 | Q=1, M=1) = 0.85
P(C=1 | Q=1, M=0) = 0.45
P(C=1 | Q=0, M=1) = 0.30
P(C=1 | Q=0, M=0) = 0.05
```

A process engineer wants to know "does the Quench-treatment cause
Cracking, and by how much?" They have two candidate quantities
available: the plain observational conditional P(C=1 | Q=1) (just filter
the parts to Quench=1 and look at the Crack rate), and the
interventional P(C=1 | do(Q=1)) (imagine forcibly applying the
Quench-treatment to every part, overriding whatever Melt-grade would
have dictated, and then looking at the Crack rate).

## Deliverables

- `intervene.js` — a standalone Node script (no dependencies) that
  computes and prints, to at least 4 decimal places: the observational
  P(C=1 | Q=1), the interventional P(C=1 | do(Q=1)), and their
  difference (observational minus interventional).
- `ANSWERS.md` — answer each lettered question:
  - **(a)** Compute the observational P(C=1 | Q=1). Show the Bayes
    inversion you use to get P(M=1 | Q=1) from the given CPTs, and use
    it to weight the two Crack rates.
  - **(b)** Compute the interventional P(C=1 | do(Q=1)). State which
    distribution over M you sum over here, and why it's not the same
    distribution as in (a).
  - **(c)** State the numeric gap between (a) and (b), its sign, and
    explain in one or two sentences whether the observational quantity
    over- or under-states the true causal effect of Quench-treatment on
    Cracking, and why.
  - **(d)** Give the minimal adjustment set that lets you compute the
    causal effect of Q on C from purely observational data (i.e.,
    without a do-operator formula), and explain in one sentence what it
    means, structurally, to intervene on Q rather than condition on it.

## Constraints

- `intervene.js` must run standalone with `node intervene.js`, no
  external packages, and print both probabilities plus their difference
  with clear labels, each to at least 4 decimal places.
- `ANSWERS.md`'s two headline probabilities must match the script's
  printed output exactly (to 4 decimal places).
- Do not conflate the two quantities in (c) — the explanation must
  address the direction and mechanism of the gap, not just restate the
  numbers.
