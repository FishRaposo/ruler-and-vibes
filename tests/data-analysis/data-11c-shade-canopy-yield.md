---
id: data-11c-shade-canopy-yield
category: data-analysis
title: Shade-canopy treatment that only looked like it worked
deliverables:
  - CRITIQUE.md
---

## Task

An agronomist at the Ladera Verde coffee estate ranked 10 parcels by
their spring cherry yield, applied a new shade-canopy treatment to the
five lowest-yielding parcels, and is now presenting the results.

`yields.csv` (autumn is blank for parcels that were uprooted for leaf
rust before the autumn harvest could be measured):

```csv
parcel,spring,autumn
P1,96,89
P2,92,87
P3,90,86
P4,86,84
P5,81,80
P6,62,69
P7,57,65
P8,52,61
P9,44,
P10,38,
```

The agronomist's memo:

> "We treated the bottom 5 parcels (P6-P10). Afterward the bottom 5
> improved from an average spring yield of 57 to an autumn yield of 65 —
> the shade canopy clearly works. Even more telling: the top 5 parcels
> (P1-P5), which got no treatment, actually DECLINED from an average of
> 89 to 85.2. The ones we left alone got neglected. Let's roll the
> canopy out to every parcel next season."

## Deliverables

- `CRITIQUE.md` (max 500 words) that:
  - Recomputes the averages the memo cites and checks them against
    the data, showing your arithmetic — including which parcels are
    actually behind each number.
  - Names every distinct statistical problem with the memo's
    reasoning (there is more than one), explaining the mechanism
    behind each, not just that "the numbers are misleading."
  - States a bottom-line verdict on whether this data supports "the
    shade-canopy treatment works," and what additional evidence would be
    needed to actually support that claim.

## Constraints

- At most 500 words total (`wc -w` on the whole file).
- Show the formula and the resulting number for every average you
  cite — no bare assertions.
