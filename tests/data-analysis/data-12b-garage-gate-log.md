---
id: data-12b-garage-gate-log
category: data-analysis
title: First read on a parking-garage gate log
deliverables:
  - INSIGHTS.md
---

## Task

The operator of the Dernby Wharf municipal parking garage has handed you
a dump from the garage's daily gate system, with no question attached —
just "have a look at this and tell us what's in it."

`gate_log.csv`:

```csv
date,cars_entered,tickets_paid,revenue,attendants_on_duty,weather
2025-09-01,320,154,1848,2,clear
2025-09-02,295,130,1560,2,clear
2025-09-03,340,180,2160,3,overcast
2025-09-04,270,108,1296,1,rain
2025-09-05,385,216,2592,3,clear
2025-09-06,430,258,3096,4,clear
2025-09-07,470,291,3492,4,clear
2025-09-08,310,146,1752,2,overcast
2025-09-09,280,112,1344,1,rain
2025-09-10,355,195,2340,3,clear
2025-09-11,230,300,3600,1,overcast
2025-09-12,335,168,2016,2,clear
2025-09-13,450,279,3348,4,clear
2025-09-14,690,234,6084,2,clear
2025-09-15,375,206,2472,3,overcast
2025-09-16,290,116,1392,1,rain
2025-09-17,405,235,2820,3,clear
2025-09-18,445,276,3312,4,clear
2025-09-19,330,158,1896,2,overcast
2025-09-20,360,194,2328,3,clear
```

## Deliverables

- `INSIGHTS.md` (max 600 words), a memo to the garage operator
  containing exactly these sections, in order:
  - `## Findings` — at least three distinct, quantitatively-grounded
    findings derived from this data (for example: payment-rate patterns,
    revenue per paid ticket, any relationship between attendant staffing
    and performance). Show the arithmetic behind each finding.
  - `## What matters most` — rank your findings by business importance
    and say why the top one deserves attention first.
  - `## What this data cannot tell us` — name at least one thing this
    dataset cannot establish (e.g. causation, or something not captured
    by these columns), and explain why.

## Constraints

- At most 600 words total (`wc -w` on the whole file).
- Treat every row on its own merits — if a row looks internally
  inconsistent, say so rather than computing through it silently.
- Show the formula and the resulting number for every statistic you
  cite — no bare assertions.
