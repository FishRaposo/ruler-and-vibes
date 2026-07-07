---
id: logic-01b-cablecar-flour-ledger
category: math-logic
title: Brackmoor Cable-Car Flour Ledger
deliverables:
  - ANSWERS.md
---

## Task

The Brackmoor mill must haul 469 identical sacks of flour up to its
hilltop store using a single aerial cable-car cabin.

- The cabin is rated for 40 sacks total, but 4 ballast blocks must ride
  in the cabin on every run, leaving **at most 36 sacks per run**.
- The line charges a **traction fee of 65 coins per run**, except every
  6th run (the 6th, 12th, 18th, and so on) is free of traction fee.
- **Power is metered separately at cost on every run, including
  traction-free ones**: 4 kWh per run at 8 coins per kWh.
- The mill pays both the traction fees and the power costs.

Answer the following, showing brief working for each:

- **Q1**: What is the minimum number of runs needed to haul all 469
  sacks?
- **Q2**: What is the total traction fee paid across all runs
  (remembering every 6th run waives the traction fee)?
- **Q3**: What is the total power cost across all runs, the grand total
  (traction fees + power), and the cost per sack (grand total divided by
  469 sacks, rounded to 2 decimal places)?
- **Q4**: Suppose, hypothetically, a ballast-free cabin could carry the
  full 40 sacks per run instead of 36. How many runs would that take,
  and how many runs fewer is that compared to your Q1 answer?

All numbers needed are stated above; nothing external is required.

## Deliverables

- `ANSWERS.md` — each final answer on its own line formatted exactly
  `A1:`, `A2:`, `A3:`, `A4:`, plus brief working shown per question
  (arithmetic steps, not just the final numbers).

## Constraints

- At most 300 words (whole file, `wc -w`).
- Do not just state final numbers — show the arithmetic that produced
  them.
