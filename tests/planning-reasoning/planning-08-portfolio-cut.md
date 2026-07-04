---
id: planning-08-portfolio-cut
category: planning-reasoning
title: Portfolio cut under a fixed budget
deliverables:
  - SELECTION.md
---

## Task

A team must choose which initiatives to fund out of six candidates.
Each initiative is **all-or-nothing** — no partial funding, no
repeats. The total available budget is exactly **14
engineering-weeks**.

| Initiative | Cost (eng-weeks) | Projected value (impact points) |
|------------|-------------------|----------------------------------|
| P1         | 3                 | 13                                |
| P2         | 3                 | 7                                  |
| P3         | 8                 | 17                                 |
| P4         | 8                 | 5                                  |
| P5         | 5                 | 15                                 |
| P6         | 4                 | 8                                  |

Select the subset of initiatives that **maximizes total value**
without the total cost exceeding 14 engineering-weeks.

## Deliverables

- `SELECTION.md` — must report:
  - The chosen set of initiatives.
  - The chosen set's total cost and total value.
  - An argument that no feasible subset achieves a higher value,
    including an explicit comparison against at least one named greedy
    heuristic result (e.g. picking by value-to-cost ratio, or picking
    by raw value) showing your chosen set beats it.

## Constraints

- Every initiative is binary: either fully funded or not selected at
  all.
- The total cost of your chosen set must not exceed 14
  engineering-weeks.
