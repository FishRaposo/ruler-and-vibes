---
id: data-01b-compost-yield
category: data-analysis
title: Compost yields, one anomaly, one data error
deliverables:
  - analysis.md
---

## Task

Below is a year of monthly finished-compost output, in cubic metres, for
three community composting sites, as exported from the programme's
tracking sheet. The data contains issues. Analyze it.

```csv
site,month,cubic_metres
Fenhollow,Jan,42
Fenhollow,Feb,44
Fenhollow,Mar,46
Fenhollow,Apr,45
Fenhollow,May,48
Fenhollow,Jun,50
Fenhollow,Jul,52
Fenhollow,Aug,51
Fenhollow,Sep,54
Fenhollow,Oct,56
Fenhollow,Nov,58
Fenhollow,Dec,60
Adderbury,Jan,31
Adderbury,Feb,33
Adderbury,Mar,-34
Adderbury,Apr,35
Adderbury,May,32
Adderbury,Jun,36
Adderbury,Jul,38
Adderbury,Aug,35
Adderbury,Sep,39
Adderbury,Oct,40
Adderbury,Nov,41
Adderbury,Dec,43
Wickley,Jan,63
Wickley,Feb,66
Wickley,Mar,68
Wickley,Apr,65
Wickley,May,70
Wickley,Jun,72
Wickley,Jul,74
Wickley,Aug,510
Wickley,Sep,76
Wickley,Oct,78
Wickley,Nov,80
Wickley,Dec,82
```

## Deliverables

- `analysis.md` with sections, in order:
  - `## Findings` — every data issue you detect, and for each: is it a
    recording error or a genuine operational anomaly, and how you can
    tell the difference.
  - `## Totals` — annual total per site, stating explicitly how you
    treated each flagged value; show the arithmetic.
  - `## Recommendation` — one short paragraph: what should the programme
    do about each finding.

## Constraints

- At most 500 words. Every number checkable from what is on the page.
- Do not silently "fix" values — state every adjustment.
