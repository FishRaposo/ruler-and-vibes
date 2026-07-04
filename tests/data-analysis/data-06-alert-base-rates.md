---
id: data-06-alert-base-rates
category: data-analysis
title: Base rates behind a fraud alert
deliverables:
  - TRIAGE.md
---

## Task

A payments team runs a fraud-detection model on every transaction.
Below are its operating stats, measured against a large labeled
holdout set, and a memo from the ops lead proposing a policy change.

**Model stats:**

| Metric | Value |
|---|---|
| Transaction volume | 100,000 transactions |
| Fraud prevalence | 0.5% of transactions are actually fraud |
| Sensitivity (true positive rate) | 92% of actual fraud is flagged |
| Specificity (true negative rate) | 95% of legitimate transactions pass without a flag |

The ops lead's memo:

> "The model is 92% accurate at catching fraud and 95% accurate
> otherwise, so when it fires an alert we should treat it as fraud
> and auto-block the transaction immediately. No need to route these
> to a human — the accuracy numbers speak for themselves."

## Deliverables

- `TRIAGE.md` (max 450 words) containing exactly these sections, in
  order:
  - `## Confusion matrix` — build the full confusion matrix (true
    positives, false negatives, false positives, true negatives) for
    the stated 100,000-transaction population, showing your
    arithmetic.
  - `## What an alert actually means` — compute the positive
    predictive value (the probability a transaction is truly fraud
    given that it was flagged), showing your arithmetic.
  - `## Verdict` — evaluate the ops lead's auto-block proposal and
    give a concrete recommendation, including how many legitimate
    transactions would be wrongly blocked under the proposal.

## Constraints

- At most 450 words total (`wc -w` on the whole file).
- Show the formula and the resulting number for every statistic you
  cite — no bare assertions.
