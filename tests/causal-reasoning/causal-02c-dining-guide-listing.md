---
id: causal-02c-dining-guide-listing
category: causal-reasoning
title: Dining-guide listing trap — a correlation manufactured by selection
deliverables:
  - selection.js
  - ANSWERS.md
---

## Task

The Sillcott Table is a city dining guide that scores every eatery in
town on two traits, each recorded as a binary 0/1 flag:

- **Pedigree (P)** — 1 if the head chef trained at a starred kitchen,
  else 0.
- **Ambience (M)** — 1 if the dining room won a regional design award,
  else 0.

In the full population of eateries the two traits are drawn as
independent biased coins: each is 1 with probability 0.3 and 0 with
probability 0.7, drawn separately for Pedigree and for Ambience. By
construction P and M are statistically and causally independent of one
another (population correlation = 0). The four combinations therefore
occur at unequal population rates — (P,M) = (0,0) with probability 0.49,
(0,1) and (1,0) with probability 0.21 each, and (1,1) with probability
0.09.

The guide's listing rule is mechanical: an eatery is **Listed (S=1)** if
and only if P + M is at least 1 — i.e., listed unless BOTH traits are 0.
So (P,M) = (1,1), (1,0), and (0,1) are all listed; (0,0) is left out.

A critic pulled the published guide's roster only (no data on the
eateries that were left out), computed the correlation between Pedigree
and Ambience among the listed eateries, found it negative, and wrote:
"The prettiest rooms hide the weakest kitchens — the guide's own listings
show award-winning dining rooms come paired with chefs of lesser
pedigree, so a beautiful room is a warning sign about the cooking."

## Deliverables

- `selection.js` — a standalone Node script (no dependencies) that
  enumerates all four (P,M) cells of the population joint distribution
  (at population weights 0.49, 0.21, 0.21, 0.09), restricts to the listed
  subset (S=1), and computes and prints: P(S=1), E[P | S=1], E[M | S=1],
  cov(P,M | S=1), and corr(P,M | S=1).
- `ANSWERS.md` — answer each lettered question:
  - **(a)** State the population (unconditional) correlation between P
    and M, and explain why it takes that value.
  - **(b)** Report the exact correlation between P and M conditional on
    S=1 (as a fraction or decimal), matching what `selection.js` prints.
  - **(c)** Name the general phenomenon responsible for the gap between
    (a) and (b), and use it to directly respond to the critic's claim —
    is the reported negative association evidence of a causal or
    explanatory relationship between Ambience and Pedigree?
  - **(d)** Would intervening to improve a specific eatery's Ambience
    change that eatery's Pedigree? Answer directly and justify from the
    stated generating process.

## Constraints

- `selection.js` must run standalone with `node selection.js`, no
  external packages, and must print all five requested quantities with
  clear labels.
- `ANSWERS.md`'s numeric answer in (b) must match the script's printed
  output exactly (accept an exact fraction or a decimal to at least 4
  places).
- Do not introduce any variable, mechanism, or data source beyond the
  population generating process and listing rule stated above.
