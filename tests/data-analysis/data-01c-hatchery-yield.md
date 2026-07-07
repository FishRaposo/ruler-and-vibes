---
id: data-01c-hatchery-yield
category: data-analysis
title: Totals, one anomaly, one data error
deliverables:
  - analysis.md
---

## Task

Below is a year of monthly release counts (juvenile fish returned to the
river) from a small freshwater hatchery's three breeding pools, as
exported from its logbook. The data contains issues. Analyze it.

```csv
pool,month,released
Alderpool,Jan,1240
Alderpool,Feb,1265
Alderpool,Mar,1290
Alderpool,Apr,1275
Alderpool,May,1320
Alderpool,Jun,1360
Alderpool,Jul,1395
Alderpool,Aug,1380
Alderpool,Sep,1420
Alderpool,Oct,1450
Alderpool,Nov,1485
Alderpool,Dec,1510
Reedmarsh,Jan,610
Reedmarsh,Feb,625
Reedmarsh,Mar,640
Reedmarsh,Apr,-655
Reedmarsh,May,660
Reedmarsh,Jun,675
Reedmarsh,Jul,690
Reedmarsh,Aug,670
Reedmarsh,Sep,705
Reedmarsh,Oct,720
Reedmarsh,Nov,735
Reedmarsh,Dec,750
Silthollow,Jan,820
Silthollow,Feb,835
Silthollow,Mar,850
Silthollow,Apr,845
Silthollow,May,865
Silthollow,Jun,880
Silthollow,Jul,900
Silthollow,Aug,915
Silthollow,Sep,6640
Silthollow,Oct,930
Silthollow,Nov,955
Silthollow,Dec,970
```

## Deliverables

- `analysis.md` with sections, in order:
  - `## Findings` — every data issue you detect, and for each: is it a
    recording error or a genuine hatchery event, and how you can tell
    the difference.
  - `## Totals` — annual total per pool, stating explicitly how you
    treated each flagged value; show the arithmetic.
  - `## Recommendation` — one short paragraph: what should the hatchery
    do about each finding.

## Constraints

- At most 500 words. Every number checkable from what is on the page.
- Do not silently "fix" values — state every adjustment.
