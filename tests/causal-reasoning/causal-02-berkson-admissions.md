---
id: causal-02-berkson-admissions
category: causal-reasoning
title: Berkson's admissions trap — a correlation manufactured by selection
deliverables:
  - collider.js
  - ANSWERS.md
---

## Task

The Meridian Fellowship evaluates every candidate on two traits, each
scored as a binary 0/1 flag:

- **Aptitude (T)** — 1 if the candidate scores above the median on the
  aptitude exam, else 0.
- **Fortune (L)** — 1 if the candidate drew a favorable interview
  timeslot lottery, else 0.

Both traits are generated as independent fair coin flips in the full
applicant population — T and L are, by construction, statistically and
causally independent of one another (population correlation = 0), and
each of the four combinations (T,L) occurs with equal probability 0.25.

Meridian's admissions rule is mechanical: a candidate is **Admitted
(A=1)** if and only if T + L is at least 1 — i.e., admitted unless BOTH
traits are 0. So (T,L) = (1,1), (1,0), and (0,1) are all admitted;
(0,0) is not.

A journalist obtained the admitted-cohort roster only (no data on
rejected candidates), computed the correlation between Aptitude and
Fortune among admits, found it negative, and published: "Lucky fellows
are less apt — Meridian's own numbers show high-Fortune admits score
lower on Aptitude, meaning fellowship luck comes at the expense of
merit."

## Deliverables

- `collider.js` — a standalone Node script (no dependencies) that
  enumerates all four (T,L) cells of the population joint distribution
  (each at probability 0.25), restricts to the admitted subset (A=1),
  and computes and prints: P(A=1), E[T | A=1], E[L | A=1],
  cov(T,L | A=1), and corr(T,L | A=1).
- `ANSWERS.md` — answer each lettered question:
  - **(a)** State the population (unconditional) correlation between T
    and L, and explain why it takes that value.
  - **(b)** Report the exact correlation between T and L conditional on
    A=1 (as a fraction or decimal), matching what `collider.js` prints.
  - **(c)** Name the general phenomenon responsible for the gap between
    (a) and (b), and use it to directly respond to the journalist's
    claim — is the reported negative association evidence of a causal
    or explanatory relationship between Fortune and Aptitude?
  - **(d)** Would intervening to raise a specific candidate's Fortune
    change that candidate's Aptitude? Answer directly and justify from
    the stated generating process.

## Constraints

- `collider.js` must run standalone with `node collider.js`, no
  external packages, and must print all five requested quantities with
  clear labels.
- `ANSWERS.md`'s numeric answer in (b) must match the script's printed
  output exactly (accept an exact fraction or a decimal to at least 4
  places).
- Do not introduce any variable, mechanism, or data source beyond the
  population generating process and admissions rule stated above.
