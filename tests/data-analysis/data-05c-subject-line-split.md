---
id: data-05c-subject-line-split
category: data-analysis
title: Point-of-sale display verdict under a broken split
deliverables:
  - VERDICT.md
---

## Task

Northfield Goods, a retail chain, ran an in-store display experiment
configured as a 50/50 split between a control arm (`Endcap`, the
current point-of-sale display) and a treatment arm (`Spotlight`, a
redesigned display with a QR discount code). Each store visit was
randomly assigned one arm and shown that day's display. Below is the
arm-level summary after one week, followed by a loyalty-member
breakdown and a memo from the merchandising lead asking you to sign
off. A "scan" is a shopper who scanned the QR code at least once.

`arms.csv`:

```csv
arm,shown,scans
Endcap,13000,1495
Spotlight,11400,1425
```

`loyalty_breakdown.csv` (loyalty-member shoppers only, a subset of the
arms above):

```csv
arm,segment,shown,scans
Endcap,loyalty_member,4400,572
Spotlight,loyalty_member,3600,576
```

The merchandising lead's memo:

> "Spotlight scans at 12.5% vs Endcap's 11.5% — that's a z-score of 2.4,
> comfortably significant. And it's even stronger among loyalty
> members, where Spotlight beats Endcap by +3.0pts. Roll it out to
> every store this week."

## Deliverables

- `VERDICT.md` (max 500 words) containing exactly these sections, in
  order:
  - `## Sanity check on the split` — the experiment was configured as
    a 50/50 random split. Check whether the observed shown counts are
    consistent with that, showing your arithmetic.
  - `## Top-line result` — recompute the Endcap vs. Spotlight scan
    rates and the significance test the memo cites, showing your
    arithmetic.
  - `## Loyalty subgroup` — assess whether the loyalty-member breakdown
    is reliable evidence, and why or why not.
  - `## Verdict` — a plain roll-out / do-not-roll-out recommendation
    with the reasoning that drives it.

## Constraints

- At most 500 words total (`wc -w` on the whole file).
- Show the formula and the resulting number for every statistic you
  cite — no bare assertions of significance.
