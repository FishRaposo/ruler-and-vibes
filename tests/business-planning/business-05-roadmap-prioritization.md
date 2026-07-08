---
id: business-05-roadmap-prioritization
category: business-planning
title: Roadmap prioritization under a fixed engineering budget
deliverables:
  - roadmap.md
---

## Task

Wrenfield Analytics is planning next quarter's engineering roadmap. The
team has a fixed capacity of **20 engineer-weeks** for the quarter — no
more can be hired or borrowed. Six candidate features are under
consideration, each with a stated ROI-value score (higher is better) and
an engineering-week cost:

| Feature | ROI value | Engineer-weeks |
|---|---|---|
| Compliance | 10 | 4 |
| Payments | 80 | 6 |
| AuthRevamp | 15 | 5 |
| Referrals | 55 | 5 |
| BulkExport | 40 | 4 |
| DarkMode | 24 | 3 |

Two constraints apply:

1. **Compliance is mandatory.** It must ship this quarter regardless of
   its ROI value, because it closes an open regulatory finding.
2. **Payments has a hard dependency on AuthRevamp.** Payments cannot ship
   unless AuthRevamp also ships in the same quarter (Payments writes to a
   session model that only AuthRevamp introduces).

Any other combination of features may be shipped or skipped freely,
subject only to the 20 engineer-week budget.

## Deliverables
`roadmap.md` must:

- State the selected set of features for the quarter.
- State the total ROI value and total engineering-week cost of the
  selected set.
- Explain why each cut feature was left out (or explicitly note that a
  feature was skipped purely for capacity reasons).
- Respect both constraints: Compliance must be included, and Payments
  cannot appear without AuthRevamp.

## Constraints

- Total engineer-weeks for the selected set must not exceed 20.
- At most 500 words (whole file, `wc -w`).
