---
id: logic-08b-grainmill-tally
category: math-logic
title: Grain Mill Weighing-Fee Tally
deliverables:
  - TALLY.md
---

## Task

Cobbleford Mill charges three fixed per-sack weighing fees, each a whole
number of groats: a wheat fee `w`, a barley fee `b`, and an oat fee `o`.
The miller's tally records three mixed loads and their totals:

- Load 1: 2 wheat sacks + 3 barley sacks + 1 oat sack weighed for **39
  groats**.
- Load 2: 1 wheat sack + 1 barley sack + 4 oat sacks weighed for **56
  groats**.
- Load 3: 4 wheat sacks + 2 barley sacks + 2 oat sacks weighed for **62
  groats**.

Answer all three questions, showing your working:

- **Q1**: Solve for the individual fees `w`, `b`, and `o`. State whether
  the system has a unique solution and why.
- **Q2**: What is the fee for a load of 4 wheat sacks + 6 barley sacks +
  3 oat sacks?
- **Q3**: A farmer carries 94 groats and must include at least one
  barley sack and one oat sack (paying those fees once each). What is
  the largest number of wheat sacks it can additionally pay fees for
  with the remaining groats, and how many groats (if any) remain
  unspent?

## Deliverables

- `TALLY.md` — must contain, in this order:
  - Q1's answer (the three fee values) with the elimination or
    substitution working shown, plus a statement on uniqueness.
  - Q2's answer with the arithmetic shown.
  - Q3's answer (largest wheat-sack count and leftover groats) with the
    working shown.

## Constraints

- At most 400 words (whole file, `wc -w`).
- Q3 requires an integer answer for the number of wheat sacks — do not
  report a fractional or rounded-without-justification sack count.
