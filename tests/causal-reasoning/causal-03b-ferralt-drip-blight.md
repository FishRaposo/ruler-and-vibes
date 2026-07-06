---
id: causal-03b-ferralt-drip-blight
category: causal-reasoning
title: Intervening on the drip retrofit versus reading off the blight rate
deliverables:
  - intervene.js
  - ANSWERS.md
---

## Task

Ferralt Vale is a fictional vineyard region with three binary (0/1)
variables and the following known causal structure, given as ground
truth:

```
Variables: S (Subsoil), R (dRip retrofit), B (Blight)
Edges:     S -> R
           S -> B
           R -> B
```

Subsoil type affects both whether a block gets the drip retrofit and
whether that block develops the Blight directly; the drip Retrofit also
independently affects the Blight. The full conditional probability
tables (ground truth):

```
P(S=1) = 0.35

P(R=1 | S=1) = 0.85
P(R=1 | S=0) = 0.15

P(B=1 | R=1, S=1) = 0.90
P(B=1 | R=1, S=0) = 0.55
P(B=1 | R=0, S=1) = 0.30
P(B=1 | R=0, S=0) = 0.05
```

A regional agronomist wants to know "does the drip Retrofit cause the
Blight, and by how much?" They have two candidate quantities available:
the plain observational conditional P(B=1 | R=1) (just filter the blocks
to Retrofit=1 and look at the Blight rate), and the interventional
P(B=1 | do(R=1)) (imagine forcibly giving every block the drip retrofit,
overriding whatever its Subsoil would have produced, and then looking at
the Blight rate).

## Deliverables

- `intervene.js` — a standalone Node script (no dependencies) that
  computes and prints, to at least 4 decimal places: the observational
  P(B=1 | R=1), the interventional P(B=1 | do(R=1)), and their
  difference (observational minus interventional).
- `ANSWERS.md` — answer each lettered question:
  - **(a)** Compute the observational P(B=1 | R=1). Show the Bayes
    inversion you use to get P(S=1 | R=1) from the given CPTs, and use
    it to weight the two Blight rates.
  - **(b)** Compute the interventional P(B=1 | do(R=1)). State which
    distribution over S you sum over here, and why it's not the same
    distribution as in (a).
  - **(c)** State the numeric gap between (a) and (b), its sign, and
    explain in one or two sentences whether the observational quantity
    over- or under-states the true causal effect of the Retrofit on
    Blight, and why.
  - **(d)** Give the minimal adjustment set that lets you compute the
    causal effect of R on B from purely observational data (i.e.,
    without a do-operator formula), and explain in one sentence what it
    means, structurally, to intervene on R rather than condition on it.

## Constraints

- `intervene.js` must run standalone with `node intervene.js`, no
  external packages, and print both probabilities plus their difference
  with clear labels, each to at least 4 decimal places.
- `ANSWERS.md`'s two headline probabilities must match the script's
  printed output exactly (to 4 decimal places).
- Do not conflate the two quantities in (c) — the explanation must
  address the direction and mechanism of the gap, not just restate the
  numbers.
