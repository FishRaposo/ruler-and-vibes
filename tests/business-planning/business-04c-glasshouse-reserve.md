---
id: business-04c-glasshouse-reserve
category: business-planning
title: Two-option expansion decision under a reserve covenant
deliverables:
  - DECISION.md
  - cashflow.csv
---

## Task

Cressbourne Greens, a rooftop hydroponic farm, holds 150,000 in cash and
runs a stable baseline business generating +7,000/month net for the full
24-month horizon under consideration. A grant reserve covenant forbids
month-end cash from falling below 50,000 at any point. The grantor will
not waive the covenant, no additional financing is available, and each
option's payment schedule and month-1 start date are contractually fixed
— neither option's payments can be deferred or rescheduled.

Cressbourne is choosing between two mutually exclusive expansion options.

**Option A — glasshouse expansion bay:**
- Fit-out payments: 76,000 in month 1, and 26,000 in month 3.
- Net incremental cash flow: -8,000/month in months 1 through 6
  inclusive (concurrent with the fit-out payments), then +17,250/month
  from month 7 onward through month 24.

**Option B — restaurant subscription line:**
- Equipment payment: 42,000 in month 1.
- Gross incremental contribution: +6,000/month in months 1 through 3,
  then +12,500/month from month 4 onward through month 24.
- The line runs on rented grow benches, so Option B additionally requires
  a mandatory nutrient-and-water service fee of 3,500/month for all 24
  months. This fee is NOT included in the gross contribution figures
  above and must be applied separately every month.

All cash flows land at month-end alongside the baseline +7,000/month.

## Deliverables

- `cashflow.csv` — exact header `month,option_a_cash,option_b_cash`,
  followed by 24 data rows (months 1-24) of month-end cash for each
  option, as plain integers with no thousands separators.
- `DECISION.md` — at most 600 words. State whether each option ever
  breaches the 50,000 covenant floor and when, give the 24-month
  cumulative comparison between the options, and make one recommendation.

## Constraints

- Every month must reflect the baseline, the option's scheduled payments,
  its incremental cash flow, and (for Option B) the mandatory service fee.
- The recommendation must account for the covenant as a hard constraint,
  not merely a footnote.
