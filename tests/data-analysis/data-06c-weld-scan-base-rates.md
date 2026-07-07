---
id: data-06c-weld-scan-base-rates
category: data-analysis
title: Base rates behind a weld-scan flag
deliverables:
  - TRIAGE.md
---

## Task

A pressure-vessel fabrication shop runs an automated ultrasonic scanner
on every weld it produces. Below are the scanner's operating stats,
measured against a large certified reference set of welds, and a memo
from the line lead proposing a process change.

**Scanner stats:**

| Metric | Value |
|---|---|
| Weld volume | 80,000 welds |
| Defect prevalence | 0.75% of welds have a real cracking defect |
| Sensitivity (true positive rate) | 88% of actual defects are flagged |
| Specificity (true negative rate) | 93% of sound welds pass without a flag |

The line lead's memo:

> "The scanner is 88% accurate at catching defects and 93% accurate
> otherwise, so when it flags a weld we should treat it as cracked and
> auto-scrap the part immediately. No need to send these to a certified
> inspector — the accuracy numbers speak for themselves."

## Deliverables

- `TRIAGE.md` (max 450 words) containing exactly these sections, in
  order:
  - `## Confusion matrix` — build the full confusion matrix (true
    positives, false negatives, false positives, true negatives) for
    the stated 80,000-weld population, showing your arithmetic.
  - `## What a flag actually means` — compute the positive predictive
    value (the probability a weld is truly cracked given that it was
    flagged), showing your arithmetic.
  - `## Verdict` — evaluate the line lead's auto-scrap proposal and
    give a concrete recommendation, including how many sound welds would
    be wrongly scrapped under the proposal.

## Constraints

- At most 450 words total (`wc -w` on the whole file).
- Show the formula and the resulting number for every statistic you
  cite — no bare assertions.
