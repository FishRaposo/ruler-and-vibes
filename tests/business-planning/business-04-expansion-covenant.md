---
id: business-04-expansion-covenant
category: business-planning
title: Two-option expansion decision under a minimum-cash covenant
deliverables:
  - DECISION.md
  - cashflow.csv
  - REASONING.md
---

## Task

Bramblewick Provisions, a specialty-foods maker, has 90,000 in cash and a
stable baseline business generating +8,000/month net for the full
24-month horizon under consideration. A loan covenant forbids month-end
cash from falling below 25,000 at any point. The lender will not waive
the covenant, no additional financing is available, and each option's
payment schedule and month-1 start date are contractually fixed — neither
option's payments can be deferred or rescheduled.

Bramblewick is choosing between two mutually exclusive expansion options.

**Option A — second retail site:**
- Fit-out payments: 55,000 in month 1, and 15,000 in month 3.
- Net incremental cash flow: -9,000/month in months 1 through 6
  inclusive (concurrent with the fit-out payments), then +14,000/month
  from month 7 onward through month 24.

**Option B — wholesale line:**
- Equipment payment: 30,000 in month 1.
- Gross incremental contribution: +4,000/month in months 1 through 3,
  then +9,500/month from month 4 onward through month 24.
- The shared kitchen is at capacity, so Option B additionally requires a
  mandatory kitchen rental of 2,500/month for all 24 months. This rent
  is NOT included in the gross contribution figures above and must be
  applied separately every month.

All cash flows land at month-end alongside the baseline +8,000/month.

## Deliverables

- `cashflow.csv` — exact header `month,option_a_cash,option_b_cash`,
  followed by 24 data rows (months 1-24) of month-end cash for each
  option, as plain integers with no thousands separators.
- `DECISION.md` — at most 600 words. State whether each option ever
  breaches the 25,000 covenant floor and when, give the 24-month
  cumulative comparison between the options, and make one recommendation.
- `REASONING.md` — the month-by-month construction of both series.

## Constraints

- Every month must reflect the baseline, the option's scheduled payments,
  its incremental cash flow, and (for Option B) the mandatory rent.
- The recommendation must account for the covenant as a hard constraint,
  not merely a footnote.
