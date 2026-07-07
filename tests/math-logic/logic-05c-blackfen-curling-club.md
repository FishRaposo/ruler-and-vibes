---
id: logic-05c-blackfen-curling-club
category: math-logic
title: Curling Club Entailment
deliverables:
  - ENTAILMENT.md
---

## Task

The Blackfen Curling Club's match-day rules govern five boolean facts
about club member Corin and the club's facilities:

- **K** = Corin is the Skip
- **V** = Corin is the Vice
- **P** = the Ice is pebbled
- **H** = the Hack is set
- **O** = the Clubhouse opens

The rules state six requirements, all of which hold simultaneously:

1. **R1**: If the Clubhouse opens, the Ice is pebbled.
2. **R2**: The Hack is set if and only if the Ice is pebbled.
3. **R3**: The Clubhouse opens or Corin is the Vice (or both).
4. **R4**: Corin is not both the Skip and the Vice.
5. **R5**: If Corin is the Vice, the Hack is not set.
6. **R6**: The Clubhouse opens.

Consider the six candidate statements below. For each, classify it as
exactly one of:

- **ENTAILED** — true in every assignment of K, V, P, H, O that
  satisfies all six rules.
- **CONSISTENT-BUT-NOT-ENTAILED** — true in at least one satisfying
  assignment and false in at least one other satisfying assignment.
- **CONTRADICTED** — false in every satisfying assignment.

- **E1**: The Ice is pebbled.
- **E2**: The Hack is set.
- **E3**: Corin is NOT the Vice.
- **E4**: Corin is the Skip.
- **E5**: Corin is the Vice.
- **E6**: The Hack is not set.

## Deliverables

- `ENTAILMENT.md` — must contain, in this order:
  - The exact count of distinct full assignments of K, V, P, H, O that
    satisfy all six rules simultaneously.
  - For each of E1 through E6: its classification (one of the three
    labels above, spelled out) plus a one-line justification.

## Constraints

- At most 400 words (whole file, `wc -w`).
- Classify all six candidates using only the three labels given; do not
  invent additional categories or hedge with "probably" / "likely".
