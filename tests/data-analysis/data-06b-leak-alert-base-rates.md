---
id: data-06b-leak-alert-base-rates
category: data-analysis
title: Base rates behind a leak alert
deliverables:
  - TRIAGE.md
---

## Task

A municipal water utility runs an acoustic leak-detection classifier on
every pipe segment in its distribution network. Below are its operating
stats, measured against a large labeled survey of segments whose true
condition was later confirmed by excavation, and a memo from the network
supervisor proposing a policy change.

**Classifier stats:**

| Metric | Value |
|---|---|
| Segments surveyed | 80,000 pipe segments |
| Leak prevalence | 0.75% of segments are actually leaking |
| Sensitivity (true positive rate) | 90% of actually leaking segments are flagged |
| Specificity (true negative rate) | 94% of sound segments pass without a flag |

The supervisor's memo:

> "The classifier is 90% accurate at catching leaks and 94% accurate
> otherwise, so when it flags a segment we should auto-dispatch an
> excavation crew and dig it up immediately. No need to route these to a
> field confirmation step — the accuracy numbers speak for themselves."

## Deliverables

- `TRIAGE.md` (max 450 words) containing exactly these sections, in
  order:
  - `## Confusion matrix` — build the full confusion matrix (true
    positives, false negatives, false positives, true negatives) for
    the stated 80,000-segment population, showing your arithmetic.
  - `## What an alert actually means` — compute the positive predictive
    value (the probability a segment is truly leaking given that it was
    flagged), showing your arithmetic.
  - `## Verdict` — evaluate the supervisor's auto-dispatch proposal and
    give a concrete recommendation, including how many sound segments
    would be needlessly excavated under the proposal.

## Constraints

- At most 450 words total (`wc -w` on the whole file).
- Show the formula and the resulting number for every statistic you
  cite — no bare assertions.
