---
id: causal-03-genemark-do-operator
category: causal-reasoning
title: Do-operator versus conditioning — the confounded habit-disease estimate
deliverables:
  - intervene.js
  - ANSWERS.md
---

## Task

Genemark is a fictional research population with three binary (0/1)
variables and the following known causal structure, given as ground
truth:

```
Variables: G (Genotype), H (Habit), D (Disease)
Edges:     G -> H
           G -> D
           H -> D
```

Genotype affects both whether someone has the Habit and whether they
develop the Disease directly; the Habit also independently affects the
Disease. The full conditional probability tables (ground truth):

```
P(G=1) = 0.3

P(H=1 | G=1) = 0.8
P(H=1 | G=0) = 0.2

P(D=1 | H=1, G=1) = 0.9
P(D=1 | H=1, G=0) = 0.5
P(D=1 | H=0, G=1) = 0.4
P(D=1 | H=0, G=0) = 0.1
```

A policy analyst wants to know "does the Habit cause the Disease, and
by how much?" They have two candidate quantities available: the plain
observational conditional P(D=1 | H=1) (just filter the population to
Habit=1 and look at the Disease rate), and the interventional
P(D=1 | do(H=1)) (imagine forcibly setting every individual's Habit to
1, overriding whatever their Genotype would have produced, and then
looking at the Disease rate).

## Deliverables

- `intervene.js` — a standalone Node script (no dependencies) that
  computes and prints, to at least 4 decimal places: the observational
  P(D=1 | H=1), the interventional P(D=1 | do(H=1)), and their
  difference (observational minus interventional).
- `ANSWERS.md` — answer each lettered question:
  - **(a)** Compute the observational P(D=1 | H=1). Show the Bayes
    inversion you use to get P(G=1 | H=1) from the given CPTs, and use
    it to weight the two Disease rates.
  - **(b)** Compute the interventional P(D=1 | do(H=1)). State which
    distribution over G you sum over here, and why it's not the same
    distribution as in (a).
  - **(c)** State the numeric gap between (a) and (b), its sign, and
    explain in one or two sentences whether the observational quantity
    over- or under-states the true causal effect of Habit on Disease,
    and why.
  - **(d)** Give the minimal adjustment set that lets you compute the
    causal effect of H on D from purely observational data (i.e., without
    a do-operator formula), and explain in one sentence what it means,
    structurally, to intervene on H rather than condition on it.

## Constraints

- `intervene.js` must run standalone with `node intervene.js`, no
  external packages, and print both probabilities plus their difference
  with clear labels, each to at least 4 decimal places.
- `ANSWERS.md`'s two headline probabilities must match the script's
  printed output exactly (to 4 decimal places).
- Do not conflate the two quantities in (c) — the explanation must
  address the direction and mechanism of the gap, not just restate the
  numbers.
