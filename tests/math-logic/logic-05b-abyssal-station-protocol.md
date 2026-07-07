---
id: logic-05b-abyssal-station-protocol
category: math-logic
title: Station Protocol Entailment
deliverables:
  - ENTAILMENT.md
---

## Task

The Abyssal Station's Standing Orders govern five boolean facts about
technician Torin's shift and the station's systems:

- **P** = Torin is a Pilot
- **R** = Torin is a Medic
- **T** = the Reactor is stable
- **H** = the Hatch seals
- **L** = the Lab operates

The Standing Orders state six clauses, all of which hold simultaneously:

1. **O1**: The Reactor is stable.
2. **O2**: If the Reactor is stable, the Hatch seals.
3. **O3**: The Hatch seals if and only if the Lab operates.
4. **O4**: If the Lab operates, Torin is not a Medic.
5. **O5**: The Reactor is stable or Torin is a Medic (or both).
6. **O6**: Torin is not both a Pilot and a Medic.

Consider the six candidate determinations below. For each, classify it
as exactly one of:

- **ENTAILED** — true in every assignment of P, R, T, H, L that
  satisfies all six clauses.
- **CONSISTENT-BUT-NOT-ENTAILED** — true in at least one satisfying
  assignment and false in at least one other satisfying assignment.
- **CONTRADICTED** — false in every satisfying assignment.

- **D1**: The Hatch seals.
- **D2**: The Lab operates.
- **D3**: Torin is NOT a Medic.
- **D4**: Torin is a Pilot.
- **D5**: Torin is a Medic.
- **D6**: The Lab does not operate.

## Deliverables

- `ENTAILMENT.md` — must contain, in this order:
  - The exact count of distinct full assignments of P, R, T, H, L that
    satisfy all six clauses simultaneously.
  - For each of D1 through D6: its classification (one of the three
    labels above, spelled out) plus a one-line justification.

## Constraints

- At most 400 words (whole file, `wc -w`).
- Classify all six candidates using only the three labels given; do not
  invent additional categories or hedge with "probably" / "likely".
