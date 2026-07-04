---
id: data-11-survivorship-rtm
category: data-analysis
title: Coaching that only looked like it worked
deliverables:
  - CRITIQUE.md
---

## Task

A sales manager ranked 10 reps by their period-1 score, coached the
five lowest scorers, and is now presenting the results.

`scores.csv` (period-2 is blank for reps who left the company before
it was measured):

```csv
rep,period1,period2
R1,95,88
R2,90,85
R3,88,84
R4,85,83
R5,80,79
R6,60,68
R7,55,64
R8,50,61
R9,40,
R10,35,
```

The manager's memo:

> "We coached the bottom 5 reps (R6-R10). Afterward the bottom 5
> improved from an average of 55 to 64 — coaching clearly works. Even
> more telling: the top 5 reps (R1-R5), who got no coaching, actually
> DECLINED from an average of 87.6 to 83.8. The ones we left alone got
> complacent. Let's coach everyone next quarter."

## Deliverables

- `CRITIQUE.md` (max 500 words) that:
  - Recomputes the averages the memo cites and checks them against
    the data, showing your arithmetic — including which reps are
    actually behind each number.
  - Names every distinct statistical problem with the memo's
    reasoning (there is more than one), explaining the mechanism
    behind each, not just that "the numbers are misleading."
  - States a bottom-line verdict on whether this data supports "coaching
    works," and what additional evidence would be needed to actually
    support that claim.

## Constraints

- At most 500 words total (`wc -w` on the whole file).
- Show the formula and the resulting number for every average you
  cite — no bare assertions.
