---
id: logic-08c-print-shop-invoice
category: math-logic
title: Print Shop Invoice Reconciliation
deliverables:
  - INVOICE.md
---

## Task

A print shop charges three fixed per-unit prices, each a whole number of
credits: a poster price `p`, a banner price `b`, and a flyer price `f`.
The shop's invoice log records three mixed print jobs and their totals:

- Job 1: 4 posters + 3 banners + 2 flyers cost **56 credits**.
- Job 2: 2 posters + 5 banners + 1 flyer cost **49 credits**.
- Job 3: 1 poster + 2 banners + 4 flyers cost **32 credits**.

Answer all three questions, showing your working:

- **Q1**: Solve for the individual prices `p`, `b`, and `f`. State
  whether the system has a unique solution and why.
- **Q2**: What is the cost for a job of 6 posters + 4 banners + 5
  flyers?
- **Q3**: A customer has a budget of 80 credits and must include at
  least one banner print and at least one flyer print (paying those
  prices once each). What is the largest number of posters it can
  additionally pay for with the remaining credits, and how many
  credits (if any) remain unspent?

## Deliverables

- `INVOICE.md` — must contain, in this order:
  - Q1's answer (the three per-unit prices) with the elimination or
    substitution working shown, plus a statement on uniqueness.
  - Q2's answer with the arithmetic shown.
  - Q3's answer (largest poster count and leftover credits) with the
    working shown.

## Constraints

- At most 400 words (whole file, `wc -w`).
- Q3 requires an integer answer for the number of posters — do not
  report a fractional or rounded-without-justification poster count.
