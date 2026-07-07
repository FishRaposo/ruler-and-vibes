---
id: data-12c-clinic-intake-memo
category: data-analysis
title: First read on an unfamiliar clinic log
deliverables:
  - INSIGHTS.md
---

## Task

You've been handed an export from a single walk-in clinic's daily
intake records, with no question attached — just "take a look at this
and tell us what's in it."

`intake_days.csv`:

```csv
date,walk_ins,patients_seen,billed_amount,clinicians_on_shift,air_quality
2025-09-01,140,78,9360,3,good
2025-09-02,120,62,7440,3,moderate
2025-09-03,165,99,11880,4,good
2025-09-04,110,52,6240,2,poor
2025-09-05,180,112,13440,5,good
2025-09-06,205,131,15720,6,good
2025-09-07,220,142,17040,6,good
2025-09-08,135,70,8400,3,moderate
2025-09-09,118,55,6600,2,poor
2025-09-10,170,102,12240,4,good
2025-09-11,95,138,16560,2,moderate
2025-09-12,150,82,9840,3,good
2025-09-13,210,133,15960,6,good
2025-09-14,300,128,21120,3,good
2025-09-15,175,108,12960,4,moderate
2025-09-16,125,60,7200,2,poor
2025-09-17,185,116,13920,4,good
2025-09-18,200,129,15480,5,good
2025-09-19,145,79,9480,3,moderate
2025-09-20,160,94,11280,4,good
```

## Deliverables

- `INSIGHTS.md` (max 600 words), a memo to the clinic manager containing
  exactly these sections, in order:
  - `## Findings` — at least three distinct, quantitatively-grounded
    findings derived from this data (for example: the rate at which
    walk-ins are seen, amount billed per patient, any relationship
    between staffing levels and throughput). Show the arithmetic behind
    each finding.
  - `## What matters most` — rank your findings by operational
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
