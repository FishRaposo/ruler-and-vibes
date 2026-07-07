---
id: logic-01c-dyehouse-ledger
category: math-logic
title: Fenwold Dyehouse Ledger
deliverables:
  - ANSWERS.md
---

## Task

The Fenwold dyehouse must dye 613 bolts of undyed cloth in a single
shared woad vat.

- The vat holds 24 slots total, but 3 slots are taken up by sampler
  swatches on every batch, leaving **at most 21 bolts per batch**.
- The dyehouse pays a **vat-hire fee of 38 coins per batch**, except
  every 6th batch (the 6th, 12th, 18th, and so on) is free of hire fee.
- **Mordant is billed separately at cost on every batch, including
  hire-free ones**: 2.5 liters per batch at 8 coins per liter.
- The dyehouse pays both the vat-hire fees and the mordant costs.

Answer the following, showing brief working for each:

- **Q1**: What is the minimum number of batches needed to dye all 613
  bolts?
- **Q2**: What is the total vat-hire fee paid across all batches
  (remembering every 6th batch waives the hire fee)?
- **Q3**: What is the total mordant cost across all batches, the grand
  total (hire fees + mordant), and the cost per bolt (grand total
  divided by 613 bolts, rounded to 2 decimal places)?
- **Q4**: Suppose, hypothetically, a swatch-free vat could hold the full
  24 bolts per batch instead of 21. How many batches would that take,
  and how many batches fewer is that compared to your Q1 answer?

All numbers needed are stated above; nothing external is required.

## Deliverables

- `ANSWERS.md` — each final answer on its own line formatted exactly
  `A1:`, `A2:`, `A3:`, `A4:`, plus brief working shown per question
  (arithmetic steps, not just the final numbers).

## Constraints

- At most 300 words (whole file, `wc -w`).
- Do not just state final numbers — show the arithmetic that produced
  them.
