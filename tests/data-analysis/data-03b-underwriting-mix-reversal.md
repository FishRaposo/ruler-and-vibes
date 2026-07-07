---
id: data-03b-underwriting-mix-reversal
category: data-analysis
title: Underwriting model rollout decision
deliverables:
  - ANALYSIS.md
---

## Task

Keystone Lending trialed two automated underwriting models, Argus and
Vantage, for four weeks. Each approved loan is later marked *current*
(still paying on schedule) or not; the metric of interest is the
non-default rate, the share of a model's approvals that stay current.
The application router mostly sent prime applicants to Vantage and
subprime applicants to Argus, but an intake bug misrouted roughly 10% of
each pool to the other model, which is why the log below has loans
recorded in all four model/band combinations. Below is the full approval
log.

```csv
model,band,week,approved,current
Argus,prime,1,25,23
Argus,prime,2,25,23
Argus,prime,3,25,23
Argus,prime,4,25,23
Argus,subprime,1,250,150
Argus,subprime,2,250,150
Argus,subprime,3,250,150
Argus,subprime,4,250,150
Vantage,prime,1,250,220
Vantage,prime,2,250,220
Vantage,prime,3,250,220
Vantage,prime,4,250,220
Vantage,subprime,1,25,13
Vantage,subprime,2,25,13
Vantage,subprime,3,25,13
Vantage,subprime,4,25,13
```

A quoted memo from the risk lead says: "Vantage keeps 84.7% of its
approvals current vs Argus's 62.9% — route 100% of new applications to
Vantage."

## Deliverables

- `ANALYSIS.md` (max 500 words) containing exactly these sections, in
  order:
  - `## Overall non-default rate` — total current-to-approved rate for
    each model, summed across both bands and all four weeks, with
    arithmetic shown.
  - `## Per-band rates` — non-default rate for each of the four
    model/band combinations, with arithmetic shown.
  - `## Projection` — the total expected current loans if each model
    underwrote a hypothetical balanced rollout of 1,200 prime approvals +
    1,200 subprime approvals, assuming each model's own per-band non-default
    rates (from the section above) hold at that scale. Show the
    arithmetic per band and the resulting total for each model.
  - `## Verdict` — state plainly whether you accept or reject the memo's
    recommendation, and why.

## Constraints

- At most 500 words total (`wc -w` on the whole file). Every rate and
  count in your analysis of the observed data must be derivable from the
  CSV; the Projection section applies those rates to the stated
  hypothetical 1,200 + 1,200 rollout volume.
- Do not round intermediate figures before the final projection step;
  show at least one decimal place for rates used in later arithmetic.
