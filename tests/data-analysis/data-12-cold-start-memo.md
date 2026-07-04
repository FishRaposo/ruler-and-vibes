---
id: data-12-cold-start-memo
category: data-analysis
title: First read on an unfamiliar dataset
deliverables:
  - INSIGHTS.md
---

## Task

You've been handed a export from a single retail store's daily
records, with no question attached — just "take a look at this and
tell us what's in it."

`store_days.csv`:

```csv
date,foot_traffic,transactions,revenue,staff_on_shift,weather
2025-06-01,210,84,1680,3,sunny
2025-06-02,185,70,1400,3,sunny
2025-06-03,230,98,1960,4,cloudy
2025-06-04,175,61,1220,2,rain
2025-06-05,255,112,2240,4,sunny
2025-06-06,290,128,2560,5,sunny
2025-06-07,330,145,2900,5,sunny
2025-06-08,205,78,1560,3,cloudy
2025-06-09,188,64,1280,2,rain
2025-06-10,240,106,2120,4,sunny
2025-06-11,150,210,4200,2,cloudy
2025-06-12,225,90,1800,3,sunny
2025-06-13,315,139,2780,5,sunny
2025-06-14,480,130,4550,3,sunny
2025-06-15,265,116,2320,4,cloudy
2025-06-16,195,66,1320,2,rain
2025-06-17,275,121,2420,4,sunny
2025-06-18,305,134,2680,5,sunny
2025-06-19,220,88,1760,3,cloudy
2025-06-20,238,102,2040,4,sunny
```

## Deliverables

- `INSIGHTS.md` (max 600 words), a memo to the store owner containing
  exactly these sections, in order:
  - `## Findings` — at least three distinct, quantitatively-grounded
    findings derived from this data (for example: conversion rate
    patterns, revenue per transaction, any relationship between
    staffing levels and performance). Show the arithmetic behind each
    finding.
  - `## What matters most` — rank your findings by business
    importance and say why the top one deserves attention first.
  - `## What this data cannot tell us` — name at least one thing this
    dataset cannot establish (e.g. causation, or something not
    captured by these columns), and explain why.

## Constraints

- At most 600 words total (`wc -w` on the whole file).
- Treat every row on its own merits — if a row looks internally
  inconsistent, say so rather than computing through it silently.
- Show the formula and the resulting number for every statistic you
  cite — no bare assertions.
