---
id: business-04b-thornfield-linen-covenant
category: business-planning
title: Two-option expansion decision under a minimum-cash covenant
deliverables:
  - DECISION.md
  - cashflow.csv
---

## Task

Thornfield Linen Works, a commercial laundry serving hotels, holds
120,000 in cash and runs a stable baseline business generating
+6,000/month net for the full 30-month horizon under consideration. A
loan covenant forbids month-end cash from falling below 40,000 at any
point. The lender will not waive the covenant, no additional financing
is available, and each option's payment schedule and month-1 start date
are contractually fixed — neither option's payments can be deferred or
rescheduled.

Thornfield is choosing between two mutually exclusive expansion options.

**Option A — automated wash line at a second plant:**
- Installation payments: 68,000 in month 1, and 24,000 in month 4.
- Net incremental cash flow: -7,000/month in months 1 through 7
  inclusive (concurrent with the installation payments), then
  +15,000/month from month 8 onward through month 30.

**Option B — managed off-site laundering contract:**
- Onboarding payment: 34,000 in month 1.
- Gross incremental contribution: +5,000/month in months 1 through 4,
  then +11,500/month from month 5 onward through month 30.
- The contract runs on the vendor's routing platform, so Option B
  additionally requires a mandatory platform licence fee of 3,000/month
  for all 30 months. This fee is NOT included in the gross contribution
  figures above and must be applied separately every month.

All cash flows land at month-end alongside the baseline +6,000/month.

## Deliverables

- `cashflow.csv` — exact header `month,option_a_cash,option_b_cash`,
  followed by 30 data rows (months 1-30) of month-end cash for each
  option, as plain integers with no thousands separators.
- `DECISION.md` — at most 600 words. State whether each option ever
  breaches the 40,000 covenant floor and when, give the 30-month
  cumulative comparison between the options, and make one recommendation.

## Constraints

- Every month must reflect the baseline, the option's scheduled payments,
  its incremental cash flow, and (for Option B) the mandatory licence fee.
- The recommendation must account for the covenant as a hard constraint,
  not merely a footnote.
