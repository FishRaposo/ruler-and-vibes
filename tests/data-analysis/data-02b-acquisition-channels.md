---
id: data-02b-acquisition-channels
category: data-analysis
title: Acquisition channels and a budget call
deliverables:
  - metrics.md
---

## Task

A plant-care mobile app ran two paid acquisition channels for four weeks.
Each free-trial signup is a lead; a lead becomes a customer when it
converts to a paid annual subscription, worth $180 (one-time lifetime
value, no renewal assumed). Next month's acquisition budget is $8,000.
Decide the allocation.

```csv
channel,week,spend,signups,subscribers
Podcast,1,600,26,7
Podcast,2,600,24,7
Podcast,3,750,31,8
Podcast,4,750,29,7
Influencer,1,600,64,5
Influencer,2,600,71,5
Influencer,3,750,86,5
Influencer,4,750,79,6
```

`signups` are free-trial starts; `subscribers` are those who converted to
a paid annual plan.

## Deliverables

- `metrics.md` with, in order:
  - A computed comparison: per channel, total spend, cost per signup,
    signup→subscriber conversion rate, and cost per paid subscriber —
    arithmetic shown.
  - An allocation of the $8,000 with a rationale that follows from the
    numbers you computed.
  - A risks-and-assumptions section (what could make this allocation
    wrong).

## Constraints

- At most 600 words. State every assumption explicitly (e.g. about
  diminishing returns or scalability of either channel).
