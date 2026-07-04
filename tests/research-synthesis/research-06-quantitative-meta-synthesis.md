---
id: research-06-quantitative-meta-synthesis
category: research-synthesis
title: Meta-synthesis of six numeric effect estimates
deliverables:
  - meta-synthesis.md
---

## Task

Below are six fictional studies estimating the yield increase (%) that a
"lumen-primed" seed coating produces relative to untreated seed, each
reporting an effect size, a sample size N, and quality metadata.

Produce `meta-synthesis.md` that:

1. **Excludes** any study that should be disqualified from the pooled
   estimate, stating the exclusion reason grounded in that study's own
   metadata.
2. Reports the **sample-size-weighted pooled estimate** (to 2 decimal
   places) over the retained studies, showing the weighted-mean
   arithmetic.
3. Reports the **naive unweighted mean of all six studies** (to 2
   decimal places) for comparison, explicitly labeling it as the
   naive/misleading figure rather than the recommended estimate.
4. Reports the **min-max range** of the retained studies' effect sizes.
5. States a single **recommended headline estimate** — the figure a
   reader should actually use.

### Studies

#### S1

Field trial, peer-reviewed, published in a regional agronomy journal.
Effect size: **+12.0%** yield increase. Sample size: **N=40** plots.
Randomized, blinded scoring at harvest.

#### S2

Field trial, peer-reviewed, multi-season replication. Effect size:
**+9.5%** yield increase. Sample size: **N=120** plots. Conducted across
three growing seasons at a single research station.

#### S3

Field trial, peer-reviewed, cross-site replication. Effect size:
**+11.0%** yield increase. Sample size: **N=80** plots. Conducted at two
sites with shared protocol.

#### S4

Field trial, peer-reviewed, largest replication in this set. Effect
size: **+10.5%** yield increase. Sample size: **N=200** plots. Multi-site
trial across four growing regions, the largest and most broadly
replicated study of the six.

#### S5

Small pilot study, **not peer-reviewed**, single season. Effect size:
**+41.0%** yield increase. Sample size: **N=15** plots. The lead
researcher's institution later flagged this study as **retracted**
following a data-handling review; the original preprint remains online
but the finding is no longer considered valid by the institution that
hosted it.

#### S6

Field trial, peer-reviewed, single site. Effect size: **+8.5%** yield
increase. Sample size: **N=160** plots. Conducted over one growing
season at a commercial test farm.

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
