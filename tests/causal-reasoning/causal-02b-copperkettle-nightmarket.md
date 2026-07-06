---
id: causal-02b-copperkettle-nightmarket
category: causal-reasoning
title: Copperkettle banner trap — a correlation manufactured by selection
deliverables:
  - selection.js
  - ANSWERS.md
---

## Task

The Copperkettle Night Market judges every food truck on two traits,
each recorded as a binary 0/1 flag:

- **Zest (Z)** — 1 if the truck's signature dish scores above the median
  on the spice panel, else 0.
- **Perch (P)** — 1 if the truck won the random draw for a prime pitch
  beside the main stage, else 0.

Both traits are generated independently in the full roster of trucks —
Z and P are, by construction, statistically and causally independent of
one another (population correlation = 0). Each trait equals 1 with
probability 0.4 and 0 with probability 0.6, and the two draws are made
separately, so the four combinations (Z,P) occur at their product
probabilities.

The market's banner rule is mechanical: a truck is **Featured (F=1)** on
the "Chef's Pick" banner if and only if Z + P is at least 1 — i.e.,
featured unless BOTH traits are 0. So (Z,P) = (1,1), (1,0), and (0,1)
are all featured; (0,0) is not.

A food blogger scraped the featured-banner lineup only (no data on the
trucks left off the banner), computed the correlation between Zest and
Perch among featured trucks, found it negative, and published: "Zestier
trucks pitch worse — Copperkettle's own banner shows the spicier a
truck's dish, the worse its stage-side placement, so bold cooking comes
at the cost of a good spot."

## Deliverables

- `selection.js` — a standalone Node script (no dependencies) that
  enumerates all four (Z,P) cells of the population joint distribution
  (each at its product probability from the marginals above), restricts
  to the featured subset (F=1), and computes and prints: P(F=1),
  E[Z | F=1], E[P | F=1], cov(Z,P | F=1), and corr(Z,P | F=1).
- `ANSWERS.md` — answer each lettered question:
  - **(a)** State the population (unconditional) correlation between Z
    and P, and explain why it takes that value.
  - **(b)** Report the exact correlation between Z and P conditional on
    F=1 (as a fraction or decimal), matching what `selection.js` prints.
  - **(c)** Name the general phenomenon responsible for the gap between
    (a) and (b), and use it to directly respond to the blogger's claim —
    is the reported negative association evidence of a causal or
    explanatory relationship between Zest and Perch?
  - **(d)** Would intervening to raise a specific truck's Perch change
    that truck's Zest? Answer directly and justify from the stated
    generating process.

## Constraints

- `selection.js` must run standalone with `node selection.js`, no
  external packages, and must print all five requested quantities with
  clear labels.
- `ANSWERS.md`'s numeric answer in (b) must match the script's printed
  output exactly (accept an exact fraction or a decimal to at least 4
  places).
- Do not introduce any variable, mechanism, or data source beyond the
  population generating process and banner rule stated above.
