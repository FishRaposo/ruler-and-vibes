---
id: logic-08-toll-bridge
category: math-logic
title: Toll-Bridge Ledger Balance
deliverables:
  - LEDGER.md
---

## Task

A bridge charges three fixed per-crossing tolls, each a whole number of
coins: a cart toll `c`, a rider toll `r`, and a drover toll `d`. The
tollkeeper's ledger records three mixed convoys and their totals:

- Convoy 1: 3 carts + 2 riders + 1 drover paid **40 coins**.
- Convoy 2: 1 cart + 4 riders + 2 drovers paid **45 coins**.
- Convoy 3: 2 carts + 1 rider + 3 drovers paid **46 coins**.

Answer all three questions, showing your working:

- **Q1**: Solve for the individual tolls `c`, `r`, and `d`. State
  whether the system has a unique solution and why.
- **Q2**: What is the cost for a convoy of 5 carts + 3 riders + 2
  drovers?
- **Q3**: A travelling party carries 60 coins and must include at least
  one rider and at least one drover (paying those tolls once each).
  What is the largest number of carts it can additionally pay tolls for
  with the remaining coins, and how many coins (if any) remain
  unspent?

## Deliverables

- `LEDGER.md` — must contain, in this order:
  - Q1's answer (the three toll values) with the elimination or
    substitution working shown, plus a statement on uniqueness.
  - Q2's answer with the arithmetic shown.
  - Q3's answer (largest cart count and leftover coins) with the
    working shown.

## Constraints

- At most 400 words (whole file, `wc -w`).
- Q3 requires an integer answer for the number of carts — do not report
  a fractional or rounded-without-justification cart count.
