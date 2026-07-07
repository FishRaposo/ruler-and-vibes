---
id: data-05c-subject-line-split
category: data-analysis
title: Subject-line verdict under a broken split
deliverables:
  - VERDICT.md
---

## Task

Quillstream, a newsletter platform, ran a subject-line experiment
configured as a 50/50 split between a control arm (`Plainline`, the
current plain subject-line style) and a treatment arm (`Teaser`, a
curiosity-gap subject line). Each subscriber was randomly assigned one
arm and received that week's issue. Below is the arm-level summary after
one send, followed by a channel-level breakdown and a memo from the
growth lead asking you to sign off. An "open" is a subscriber who opened
the email at least once.

`arms.csv`:

```csv
arm,sent,opens
Plainline,13000,1495
Teaser,11400,1425
```

`channel_breakdown.csv` (referral-acquired subscribers only, a subset of
the arms above):

```csv
arm,channel,sent,opens
Plainline,referral,4400,572
Teaser,referral,3600,576
```

The growth lead's memo:

> "Teaser opens at 12.5% vs Plainline's 11.5% — that's a z-score of 2.4,
> comfortably significant. And it's even stronger among referral
> subscribers, where Teaser beats Plainline by +3.0pts. Roll it out to
> everyone this week."

## Deliverables

- `VERDICT.md` (max 500 words) containing exactly these sections, in
  order:
  - `## Sanity check on the split` — the experiment was configured as
    a 50/50 random split. Check whether the observed send counts are
    consistent with that, showing your arithmetic.
  - `## Top-line result` — recompute the Plainline vs. Teaser open
    rates and the significance test the memo cites, showing your
    arithmetic.
  - `## Referral subgroup` — assess whether the referral breakdown is
    reliable evidence, and why or why not.
  - `## Verdict` — a plain roll-out / do-not-roll-out recommendation
    with the reasoning that drives it.

## Constraints

- At most 500 words total (`wc -w` on the whole file).
- Show the formula and the resulting number for every statistic you
  cite — no bare assertions of significance.
