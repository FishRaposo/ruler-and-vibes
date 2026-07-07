---
id: research-06c-checkout-latency-synthesis
category: research-synthesis
title: Meta-synthesis of six checkout-latency effect estimates
deliverables:
  - latency-synthesis.md
---

## Task

Below are six fictional internal experiments estimating the percentage
reduction in average checkout-page load time that a "predictive-prefetch"
caching feature produces relative to the unmodified checkout flow, each
reporting an effect size, a sample size N (in thousands of measured
checkout sessions), and quality metadata.

Produce `latency-synthesis.md` that:

1. **Excludes** any experiment that should be disqualified from the
   pooled estimate, stating the exclusion reason grounded in that
   experiment's own metadata.
2. Reports the **sample-size-weighted pooled estimate** (to 2 decimal
   places) over the retained experiments, showing the weighted-mean
   arithmetic.
3. Reports the **naive unweighted mean of all six experiments** (to 2
   decimal places) for comparison, explicitly labeling it as the
   naive/misleading figure rather than the recommended estimate.
4. Reports the **min-max range** of the retained experiments' effect
   sizes.
5. States a single **recommended headline estimate** — the figure a
   reader should actually use.

### Experiments

#### S1

Production A/B test, audited by the performance engineering review
board, randomized session assignment. Effect size: **+13.40%** reduction
in average checkout-page load time. Sample size: **N=50** (thousand
sessions).

#### S2

Production A/B test, audited, multi-week replication. Effect size:
**+10.20%** reduction. Sample size: **N=130** (thousand sessions).
Conducted across three successive release trains on the same checkout
flow.

#### S3

Production A/B test, audited, cross-region replication. Effect size:
**+12.20%** reduction. Sample size: **N=90** (thousand sessions).
Conducted at two data centers with a shared deployment configuration.

#### S4

Production A/B test, audited, largest replication in this set. Effect
size: **+11.50%** reduction. Sample size: **N=210** (thousand sessions).
Deployed across four geographic edge regions, the largest and most
broadly replicated experiment of the six.

#### S5

Small internal pilot, **not independently audited**, single day of
traffic. Effect size: **+44.00%** reduction. Sample size: **N=20**
(thousand sessions). The platform reliability team later flagged this
study as **retracted** following a root-cause review that found bot
traffic had contaminated the session logs; the original internal memo
remains circulated but the finding is no longer considered valid by the
team that ran it.

#### S6

Production A/B test, audited, single data center. Effect size: **+9.00%**
reduction. Sample size: **N=170** (thousand sessions). Conducted over one
release cycle at the primary data center.

## Deliverables

- `latency-synthesis.md`: the exclusion decision and reason, the
  sample-size-weighted pooled estimate with shown arithmetic, the naive
  unweighted all-six mean (explicitly labeled as such), the retained
  min-max range, and the recommended headline estimate.

## Constraints

- All numeric figures must be stated to 2 decimal places.
- The weighted-mean arithmetic must be shown (the sum-of-products and
  the sum-of-N, or equivalent working), not just the final figure.
- The recommended headline estimate must be a single figure, clearly
  marked as the recommendation (not left ambiguous among the several
  numbers reported).
