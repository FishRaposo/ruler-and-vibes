---
id: data-03c-reminder-rollout
category: data-analysis
title: Appointment-reminder rollout decision
deliverables:
  - ANALYSIS.md
---

## Task

Riverbend Health, an outpatient clinic, tested two appointment-reminder
methods, Envoy and Herald, for four weeks. The scheduler predominantly
assigned returning patients to Herald and first-visit patients to Envoy,
but a routing bug misdirected roughly 10% of each patient cohort to the
other method, which is why the data below has appointments recorded in
all four method/cohort combinations. A "kept" appointment is one the
patient attended. Below is the full appointment log.

```csv
method,cohort,week,scheduled,kept
Envoy,returning,1,20,17
Envoy,returning,2,20,17
Envoy,returning,3,20,17
Envoy,returning,4,20,17
Envoy,first_visit,1,200,80
Envoy,first_visit,2,200,80
Envoy,first_visit,3,200,80
Envoy,first_visit,4,200,80
Herald,returning,1,200,150
Herald,returning,2,200,150
Herald,returning,3,200,150
Herald,returning,4,200,150
Herald,first_visit,1,20,6
Herald,first_visit,2,20,6
Herald,first_visit,3,20,6
Herald,first_visit,4,20,6
```

A quoted memo from the scheduling lead says: "Herald keeps 70.9% of
appointments vs Envoy's 44.1% — switch every patient to Herald reminders."

## Deliverables

- `ANALYSIS.md` (max 500 words) containing exactly these sections, in
  order:
  - `## Overall kept-rate` — total scheduled-to-kept rate for each
    method, summed across both cohorts and all four weeks, with
    arithmetic shown.
  - `## Per-cohort rates` — kept-rate for each of the four method/cohort
    combinations, with arithmetic shown.
  - `## Projection` — the total expected kept appointments if each method
    were applied to the full observed mix of 880 returning slots + 880
    first-visit slots, assuming each method's own per-cohort kept-rates
    (from the section above) hold at that scale. Show the arithmetic per
    cohort and the resulting total for each method.
  - `## Verdict` — state plainly whether you accept or reject the memo's
    recommendation, and why.

## Constraints

- At most 500 words total (`wc -w` on the whole file). Every number must
  be derivable from the CSV on this page.
- Do not round intermediate figures before the final projection step;
  show at least one decimal place for rates used in later arithmetic.
