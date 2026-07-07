---
id: data-05b-newsletter-subject-split
category: data-analysis
title: Newsletter subject-line verdict under a broken split
deliverables:
  - VERDICT.md
---

## Task

Pennwhistle, a newsletter publisher, ran a subject-line experiment
configured as a 50/50 split of one morning send between a control arm
(the current subject line) and a variant arm (a rewritten subject line).
Below is the arm-level summary, followed by a segment breakdown and a
memo from the growth lead asking you to sign off.

`sends.csv`:

```csv
arm,sends,opens
control,12550,2510
variant,11450,2440
```

`segment_breakdown.csv` (new subscribers only — those who joined in the
last 30 days, a subset of the arms above):

```csv
arm,segment,sends,opens
control,new_subscriber,4100,984
variant,new_subscriber,3800,1052
```

The growth lead's memo:

> "Variant opens at 21.3% vs control's 20.0% — that's a z-score of 2.5,
> comfortably significant. And it's even stronger among new subscribers,
> where variant beats control by +3.7pts. Roll it out to the full list
> this morning."

## Deliverables

- `VERDICT.md` (max 500 words) containing exactly these sections, in
  order:
  - `## Sanity check on the split` — the experiment was configured as a
    50/50 random split. Check whether the observed send counts are
    consistent with that, showing your arithmetic.
  - `## Top-line result` — recompute the control vs. variant open rates
    and the significance test the memo cites, showing your arithmetic.
  - `## New-subscriber segment` — assess whether the segment breakdown is
    reliable evidence, and why or why not.
  - `## Verdict` — a plain roll-out / do-not-roll-out recommendation with
    the reasoning that drives it.

## Constraints

- At most 500 words total (`wc -w` on the whole file).
- Show the formula and the resulting number for every statistic you
  cite — no bare assertions of significance.
