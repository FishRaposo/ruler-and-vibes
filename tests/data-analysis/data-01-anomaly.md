---
id: data-01-anomaly
category: data-analysis
title: Totals, one anomaly, one data error
deliverables:
  - analysis.md
---

## Task

Below is a year of monthly sales by region, as exported from a small
company's spreadsheet. The data contains issues. Analyze it.

```csv
region,month,sales
North,Jan,980
North,Feb,1010
North,Mar,1040
North,Apr,1020
North,May,1080
North,Jun,1100
North,Jul,1150
North,Aug,1130
North,Sep,1170
North,Oct,1200
North,Nov,1230
North,Dec,1260
South,Jan,790
South,Feb,810
South,Mar,-820
South,Apr,830
South,May,805
South,Jun,840
South,Jul,860
South,Aug,835
South,Sep,870
South,Oct,890
South,Nov,905
South,Dec,915
East,Jan,590
East,Feb,605
East,Mar,615
East,Apr,600
East,May,625
East,Jun,640
East,Jul,655
East,Aug,4890
East,Sep,660
East,Oct,675
East,Nov,690
East,Dec,700
```

## Deliverables

- `analysis.md` with sections, in order:
  - `## Findings` — every data issue you detect, and for each: is it a
    recording error or a genuine business anomaly, and how you can
    tell the difference.
  - `## Totals` — annual total per region, stating explicitly how you
    treated each flagged value; show the arithmetic.
  - `## Recommendation` — one short paragraph: what should the company
    do about each finding.

## Constraints

- At most 500 words. Every number checkable from what is on the page.
- Do not silently "fix" values — state every adjustment.
