---
id: research-09c-sourdough-crust-matrix
category: research-synthesis
title: Triangulation matrix for sourdough crust-quality claims
deliverables:
  - crust-triangulation.md
---

## Task

Below are four fictional sources on a home-baking "crust quality" review
and five candidate claims (C1-C5). Build a triangulation matrix, decide
which claims are genuinely corroborated, and then write one synthesized
theme sentence.

Produce `crust-triangulation.md` with:

1. A **matrix** with rows C1-C5 and columns S1-S4, where each cell is
   exactly one of `asserts`, `silent`, or `contradicts`.
2. For each claim, a verdict of exactly `CORROBORATED` or
   `NOT-CORROBORATED`. A claim is CORROBORATED only if at least two
   **independent** sources assert it — check whether any asserting
   source explicitly says it is drawing on another source in this set
   before counting it as a separate vote.
3. An explicit note identifying any source that is not independent of
   another, and which claim's verdict that affects.
4. Exactly one **synthesized theme sentence** that draws only on
   claims you have marked CORROBORATED.

### Sources

#### S1 — Bakery's internal batch log

Our internal log of 300 test bakes in our kitchen found that loaves
given a cold overnight retard (proofed in the refrigerator overnight
rather than at room temperature) developed better crust crackle, as
scored by our tasting panel, than loaves proofed at room temperature
the same day. We also found that loaves that were deeply scored right
before baking had better oven spring regardless of which proofing
method was used, and noted fewer blown-out or torn crusts among
cold-retarded loaves compared to same-day loaves. Separately, we found
that loaves baked with steam injected during the first several minutes
of baking had better crust crackle than loaves baked without added
steam, and this held true across both cold-retarded and same-day
loaves.

#### S2 — Independent baking-science study

This study, based on our own original trials with a separate set of
home bakers across several kitchens, found that loaves given a cold
overnight retard developed better crust crackle than loaves proofed at
room temperature the same day, consistent with prior home-baking
guidance. We also found that deep scoring right before baking improved
oven spring more than proofing method alone did — in fact, scoring
depth was the single strongest predictor of oven spring in our trials.
Steam injected during the first several minutes of baking also
correlated with better crust crackle, regardless of proofing method,
in our data as well.

#### S3 — Baking magazine feature

Drawing on the S1 kitchen log of proofing-method outcomes, this feature
highlights that loaves given a cold overnight retard developed better
crust crackle than same-day loaves, and that cold-retarded loaves had
measurably fewer blown-out or torn crusts on average. The piece also
discusses steam injection as a factor worth watching, echoing points
raised in the same underlying log, though it does not present new data
of its own on this point.

#### S4 — Baking-school benchmarking report

Our benchmarking work with student bakers found that deep scoring
right before baking improved oven spring more than proofing method
alone — a pattern that showed up consistently across our cohorts. We
also found that switching to a baking-steel setup took measurably
longer preheat time than using a standard baking stone, a friction
point several instructors specifically flagged. Finally, steam
injected during the first several minutes of baking correlated with
better crust crackle in our cohort data regardless of proofing method.

### Candidate claims

- **C1**: Loaves given a cold overnight retard developed better crust
  crackle than loaves proofed at room temperature the same day.
- **C2**: Deep scoring right before baking improved oven spring more
  than proofing method alone.
- **C3**: Cold-retarded loaves had measurably fewer blown-out or torn
  crusts than same-day loaves.
- **C4**: Switching to a baking-steel setup took measurably longer
  preheat time than using a standard baking stone.
- **C5**: Steam injected during the first several minutes of baking
  correlated with better crust crackle regardless of proofing method.

## Deliverables

- `crust-triangulation.md`: the 5x4 matrix, the corroboration verdicts,
  the independence note, and one synthesized theme sentence.

## Constraints

- The matrix must have exactly 5 claim rows and 4 source columns, with
  every cell exactly one of `asserts`, `silent`, or `contradicts`.
- Every claim verdict must be exactly `CORROBORATED` or
  `NOT-CORROBORATED`.
- The independence note must name which source is not independent of
  which other, and which claim's verdict this affects.
- Exactly one synthesized theme sentence must appear, and it must not
  rely on any claim marked NOT-CORROBORATED.
