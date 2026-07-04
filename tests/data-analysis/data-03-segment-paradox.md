---
id: data-03-segment-paradox
category: data-analysis
title: Onboarding A/B rollout decision
deliverables:
  - ANALYSIS.md
---

## Task

A note-taking app ran two onboarding flows, Alpha and Beta, for four
weeks. The signup router predominantly sent organic-blog visitors to
Beta and paid-landing visitors to Alpha, but a misconfiguration leaked
roughly 10% of each traffic source to the other variant, which is why
the data below has trials recorded in all four variant/segment
combinations. Below is the full trial log.

```csv
variant,segment,week,trials,conversions
Alpha,organic,1,25,22
Alpha,organic,2,25,23
Alpha,organic,3,25,22
Alpha,organic,4,25,23
Alpha,paid,1,250,75
Alpha,paid,2,250,75
Alpha,paid,3,250,75
Alpha,paid,4,250,75
Beta,organic,1,250,200
Beta,organic,2,250,200
Beta,organic,3,250,200
Beta,organic,4,250,200
Beta,paid,1,25,5
Beta,paid,2,25,5
Beta,paid,3,25,5
Beta,paid,4,25,5
```

A quoted memo from the growth lead says: "Beta converts at 74.5% vs
Alpha's 35.5% — roll Beta out to 100% of new signups."

## Deliverables

- `ANALYSIS.md` (max 500 words) containing exactly these sections, in
  order:
  - `## Overall conversion` — total trial-to-paid conversion rate for
    each variant, summed across both segments and all four weeks, with
    arithmetic shown.
  - `## Per-segment rates` — conversion rate for each of the four
    variant/segment combinations, with arithmetic shown.
  - `## Projection` — the total expected conversions if each variant
    were rolled out to the full observed mix of 1,100 organic trials +
    1,100 paid trials, assuming each variant's own per-segment
    conversion rates (from the section above) hold at that scale. Show
    the arithmetic per segment and the resulting total for each
    variant.
  - `## Verdict` — state plainly whether you accept or reject the
    memo's recommendation, and why.

## Constraints

- At most 500 words total (`wc -w` on the whole file). Every number
  must be derivable from the CSV on this page.
- Do not round intermediate figures before the final projection step;
  show at least one decimal place for rates used in later arithmetic.
