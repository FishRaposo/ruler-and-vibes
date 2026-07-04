---
id: logic-05-guild-charter
category: math-logic
title: Guild Charter Entailment
deliverables:
  - ENTAILMENT.md
---

## Task

The Wardens' Guild charter governs five boolean facts about the town of
Ansa's affairs:

- **A** = Ansa is a Warden
- **B** = Ansa is a Scribe
- **S** = the Seal is issued
- **F** = the Forge runs
- **M** = the Market opens

The charter states six premises, all of which hold simultaneously:

1. **P1**: If the Forge runs, the Seal is issued.
2. **P2**: The Market opens if and only if the Seal is issued.
3. **P3**: The Forge runs or Ansa is a Scribe (or both).
4. **P4**: Ansa is not both a Warden and a Scribe.
5. **P5**: If Ansa is a Scribe, the Market does not open.
6. **P6**: The Forge runs.

Consider the six candidate conclusions below. For each, classify it as
exactly one of:

- **ENTAILED** — true in every assignment of A, B, S, F, M that
  satisfies all six premises.
- **CONSISTENT-BUT-NOT-ENTAILED** — true in at least one satisfying
  assignment and false in at least one other satisfying assignment.
- **CONTRADICTED** — false in every satisfying assignment.

- **C1**: The Seal is issued.
- **C2**: The Market opens.
- **C3**: Ansa is NOT a Scribe.
- **C4**: Ansa is a Warden.
- **C5**: Ansa is a Scribe.
- **C6**: The Market does not open.

## Deliverables

- `ENTAILMENT.md` — must contain, in this order:
  - The exact count of distinct full assignments of A, B, S, F, M that
    satisfy all six premises simultaneously.
  - For each of C1 through C6: its classification (one of the three
    labels above, spelled out) plus a one-line justification.

## Constraints

- At most 400 words (whole file, `wc -w`).
- Classify all six candidates using only the three labels given; do not
  invent additional categories or hedge with "probably" / "likely".
