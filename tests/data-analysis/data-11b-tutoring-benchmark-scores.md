---
id: data-11b-tutoring-benchmark-scores
category: data-analysis
title: Tutoring that only moved the numbers it was allowed to see
deliverables:
  - CRITIQUE.md
---

## Task

A reading coordinator at Cresswell Middle School ranked 10 students by
their fall benchmark reading score, gave twice-weekly tutoring to the
five lowest scorers, and is now presenting the results to the principal.

`benchmark.csv` (the spring column is blank for students who transferred
out of the district before the spring benchmark was administered):

```csv
student,fall,spring
S1,91,86
S2,87,82
S3,83,80
S4,78,76
S5,72,71
S6,54,64
S7,50,59
S8,46,54
S9,37,
S10,25,
```

The coordinator's write-up:

> "We tutored the bottom 5 readers (S6-S10). Afterward the bottom 5
> climbed from an average of 50 in the fall to 59 in the spring —
> tutoring clearly works. What really seals it: the top 5 readers
> (S1-S5), who got no tutoring, actually SLID from an average of 82.2
> down to 79. The strong readers we left alone coasted. Let's put every
> student in tutoring next year."

## Deliverables

- `CRITIQUE.md` (max 500 words) that:
  - Recomputes the averages the write-up cites and checks them against
    the data, showing your arithmetic — including which students are
    actually behind each number.
  - Names every distinct statistical problem with the write-up's
    reasoning (there is more than one), explaining the mechanism behind
    each, not just that "the numbers are misleading."
  - States a bottom-line verdict on whether this data supports "tutoring
    works," and what additional evidence would be needed to actually
    support that claim.

## Constraints

- At most 500 words total (`wc -w` on the whole file).
- Show the formula and the resulting number for every average you cite —
  no bare assertions.
