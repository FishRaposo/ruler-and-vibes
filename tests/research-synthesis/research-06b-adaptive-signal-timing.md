---
id: research-06b-adaptive-signal-timing
category: research-synthesis
title: Meta-synthesis of six traffic-signal effect estimates
deliverables:
  - meta-synthesis.md
---

## Task

Below are six fictional field deployments estimating the wait-time
reduction (%) that a new "adaptive signal timing" traffic-light
controller produces relative to the legacy fixed-timing controller, each
reporting an effect size, a sample size N, and quality metadata.

Produce `meta-synthesis.md` that:

1. **Excludes** any deployment that should be disqualified from the
   pooled estimate, stating the exclusion reason grounded in that
   deployment's own metadata.
2. Reports the **sample-size-weighted pooled estimate** (to 2 decimal
   places) over the retained deployments, showing the weighted-mean
   arithmetic.
3. Reports the **naive unweighted mean of all six deployments** (to 2
   decimal places) for comparison, explicitly labeling it as the
   naive/misleading figure rather than the recommended estimate.
4. Reports the **min-max range** of the retained deployments' effect
   sizes.
5. States a single **recommended headline estimate** — the figure a
   reader should actually use.

### Deployments

#### S1

Field deployment, independently audited, published in a regional
transportation-planning bulletin. Effect size: **+13.00%** wait-time
reduction. Sample size: **N=45** intersections. Randomized rollout,
blinded wait-time logging.

#### S2

Field deployment, independently audited, multi-season replication.
Effect size: **+8.00%** wait-time reduction. Sample size: **N=125**
intersections. Measured across three signal seasons on a single metro
network.

#### S3

Field deployment, independently audited, cross-city replication. Effect
size: **+12.50%** wait-time reduction. Sample size: **N=85**
intersections. Conducted in two cities with a shared measurement
protocol.

#### S4

Field deployment, independently audited, largest replication in this
set. Effect size: **+9.00%** wait-time reduction. Sample size: **N=215**
intersections. Multi-region rollout across four metro regions, the
largest and most broadly replicated deployment of the six.

#### S5

Small pilot deployment, **not independently audited**, single season.
Effect size: **+44.50%** wait-time reduction. Sample size: **N=17**
intersections. The vendor's own engineering team later flagged this
deployment as **retracted** following a sensor-calibration review; the
original technical memo remains online but the finding is no longer
considered valid by the team that issued it.

#### S6

Field deployment, independently audited, single site. Effect size:
**+7.80%** wait-time reduction. Sample size: **N=165** intersections.
Conducted over one signal season at a mid-size metro network.

## Deliverables

- `meta-synthesis.md`: the exclusion decision and reason, the
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
