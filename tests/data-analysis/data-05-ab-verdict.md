---
id: data-05-ab-verdict
category: data-analysis
title: A/B verdict under a broken split
deliverables:
  - VERDICT.md
---

## Task

A checkout-flow experiment was configured as a 50/50 split between a
control arm (the current checkout) and a treatment arm (a redesigned
one-page checkout). Below is the arm-level summary after two weeks,
followed by a device-level breakdown and a memo from the PM asking
you to sign off.

`arms.csv`:

```csv
arm,users,conversions
control,10500,840
treatment,9500,855
```

`device_breakdown.csv` (mobile users only, a subset of the arms above):

```csv
arm,device,users,conversions
control,mobile,3500,300
treatment,mobile,3200,360
```

The PM's memo:

> "Treatment converts at 9.0% vs control's 8.0% — that's a z-score of
> 2.5, comfortably significant. And it's even stronger on mobile,
> where treatment beats control by +2.7pts. Ship it this week."

## Deliverables

- `VERDICT.md` (max 500 words) containing exactly these sections, in
  order:
  - `## Sanity check on the split` — the experiment was configured as
    a 50/50 random split. Check whether the observed user counts are
    consistent with that, showing your arithmetic.
  - `## Top-line result` — recompute the control vs. treatment
    conversion rates and the significance test the PM cites, showing
    your arithmetic.
  - `## Mobile subgroup` — assess whether the mobile breakdown is
    reliable evidence, and why or why not.
  - `## Verdict` — a plain ship / do-not-ship recommendation with the
    reasoning that drives it.

## Constraints

- At most 500 words total (`wc -w` on the whole file).
- Show the formula and the resulting number for every statistic you
  cite — no bare assertions of significance.
