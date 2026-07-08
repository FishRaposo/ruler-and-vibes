---
id: logic-04b-sevenfold-troupes
category: math-logic
title: Sevenfold Troupes
deliverables:
  - PROOF.md
---

## Task

A puppetry festival features exactly 7 marionette troupes, numbered 1
through 7. Any two troupes may stage a **coproduction** together at most
once during the festival (so a coproduction is an unordered pair of
distinct troupes, and no pair coproduces twice).

Answer all four parts below.

- **Part A**: What is the maximum possible number of coproductions in
  the festival? Show the count.
- **Part B**: Prove in prose that it is **impossible** for every one of
  the 7 troupes to take part in exactly 3 coproductions during the
  festival.
- **Part C**: Exhibit an explicit festival programme (a specific list of
  coproductions) in which every troupe takes part in **exactly 2
  coproductions**. Format the list as one coproduction per line, in the
  exact form `i-j` where `i` and `j` are troupe numbers from 1 to 7 and
  `i < j` (e.g. `1-2`). List only coproduction lines in this section —
  no other text on those lines.
- **Part D**: Prove that in any festival where every troupe takes part
  in at least one coproduction, **two troupes must take part in the same
  number of coproductions**.

## Deliverables

- `PROOF.md` (at most 600 words) — containing all four parts, clearly
  labeled `## Part A`, `## Part B`, `## Part C`, `## Part D`, with Part
  C's coproduction list in the exact `i-j` one-per-line format specified
  above.

## Constraints

- At most 600 words (whole file, `wc -w`).
- Part C requires an actual exhibited programme, not just an assertion
  that one exists. Any valid festival where every troupe takes part in
  exactly 2 coproductions is accepted — it does not need to follow any
  particular construction.
- Parts B and D must be prose proofs, not just assertions of the
  conclusion.
