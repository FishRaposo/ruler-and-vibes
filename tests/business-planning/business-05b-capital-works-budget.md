---
id: business-05b-capital-works-budget
category: business-planning
title: Capital works selection under a fixed crew-month budget
deliverables:
  - roadmap.md
---

## Task

The Cindervale Public Works Department is planning its FY26 capital
works program. The department has a fixed field capacity of **24
crew-months** for the year — no additional crews can be hired or
contracted out. Six candidate projects are under consideration, each
with a stated public-benefit value (higher is better) and a crew-month
cost:

| Project | Benefit value | Crew-months |
|---|---|---|
| StormMain | 12 | 5 |
| Pumphouse | 96 | 7 |
| Wellfield | 18 | 6 |
| Greenway | 66 | 6 |
| Riverwalk | 48 | 5 |
| Skybridge | 30 | 4 |

Two constraints apply:

1. **StormMain is mandatory.** It must be built this year regardless of
   its benefit value, because it discharges an outstanding consent-order
   obligation.
2. **Pumphouse has a hard dependency on Wellfield.** Pumphouse cannot be
   commissioned unless Wellfield is also built in the same year
   (Pumphouse draws from a pressurized supply that only Wellfield
   provides).

Any other combination of projects may be funded or deferred freely,
subject only to the 24 crew-month budget.

## Deliverables
`roadmap.md` must:

- State the selected set of projects for the year.
- State the total benefit value and total crew-month cost of the
  selected set.
- Explain why each deferred project was left out (or explicitly note
  that a project was deferred purely for capacity reasons).
- Respect both constraints: StormMain must be included, and Pumphouse
  cannot appear without Wellfield.

## Constraints

- Total crew-months for the selected set must not exceed 24.
- At most 500 words (whole file, `wc -w`).
