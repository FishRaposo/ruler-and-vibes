---
test: research-06b-adaptive-signal-timing
canary: "halite mica"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "meta-synthesis.md names S5 as the excluded deployment and gives an exclusion reason grounded in its metadata (tiny N and/or not independently audited/pilot and/or retracted)"
    - id: obj-2
      check: "The sample-size-weighted pooled estimate over the five retained deployments is stated and falls in [9.22, 9.26] (accept '9.24' or '9.2433')"
    - id: obj-3
      check: "The naive unweighted mean of ALL six deployments is stated, falls in [15.78, 15.82] (accept '15.8' or '15.80'), AND is explicitly labeled as the naive/misleading figure rather than the recommended estimate"
    - id: obj-4
      check: "The retained-deployments range is stated as min 7.80 and max 13.00 (both endpoints of the five kept effect sizes present)"
    - id: obj-5
      check: "The recommended single headline estimate is the weighted value (in [9.22,9.26]), NOT the unweighted-excluding-S5 value 10.06 and NOT the all-six mean 15.80"
  subjective:
    - id: sub-quality
      name: "Pooling judgment"
      weight: 0.4
    - id: sub-craft
      name: "Numerical presentation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `research-06-quantitative-meta-synthesis` (same
construct, fresh surface).

If a submission's `meta-synthesis.md` or `REASONING.md` contains the
phrase "halite mica", that is a canary leak — flag it regardless of how
the rest scores.

### Fixed data and node-verified computations

| Deployment | Effect (%) | N | Status |
|---|---|---|---|
| S1 | 13.00 | 45 | retained |
| S2 | 8.00 | 125 | retained |
| S3 | 12.50 | 85 | retained |
| S4 | 9.00 | 215 | retained |
| S5 | 44.50 | 17 | **excluded** — tiny N, not independently audited, retracted |
| S6 | 7.80 | 165 | retained |

```
all-six unweighted mean = (13.00+8.00+12.50+9.00+44.50+7.80)/6 = 94.80/6 = 15.80
exclude-S5 unweighted mean = (13.00+8.00+12.50+9.00+7.80)/5 = 50.30/5 = 10.06
exclude-S5 N-weighted sum(effect*N) = 585+1000+1062.5+1935+1287 = 5869.5
exclude-S5 N-weighted sum(N) = 45+125+85+215+165 = 635
weighted mean = 5869.5/635 = 9.2433 -> 9.24
retained range: min 7.80 (S6), max 13.00 (S1)
```

Node-verified in this review; judge should re-run the same arithmetic
(e.g., `node -e "console.log(5869.5/635)"`) to confirm any submission's
figures.

### Objective check notes

- **obj-1**: any one of the three grounds (N=17 is tiny; not
  independently audited / pilot; later retracted) is sufficient, stated
  in prose. Example phrasings:
  - PASS: "S5 is excluded: it is a tiny (N=17), non-audited pilot that
    was later retracted."; "We drop S5 from the pooled estimate because
    the deployment was retracted after a sensor-calibration review."
  - PASS: "S5's N=17 sample and lack of independent audit, compounded by
    its retraction, disqualify it from the pooled figure."
  - FAIL: "S5 is excluded because it seemed too high." (not grounded in
    the stated metadata — reads like an outlier heuristic, not a
    quality-based exclusion)
  - FAIL: omits S5 from the reported deployments with no stated reason
    at all (silently drops it).
- **obj-2**: recompute 5869.5/635 = 9.2433; accept anything rounding to
  9.22-9.26 inclusive, or the literal strings "9.24"/"9.2433".
- **obj-3**: recompute 94.80/6 = 15.80; accept 15.78-15.82 inclusive or
  "15.8"/"15.80". Must ALSO be explicitly framed as the misleading/naive
  figure, not silently presented as equally valid. Example phrasings:
  - PASS: "The naive mean across all six deployments is 15.80%, but this
    is skewed by the retracted S5 outlier and should not be used.";
    "15.80% (all six, unweighted) — included here only to show how much
    the disqualified deployment distorts the picture."
  - PASS: "Note the naive all-six average of 15.80% is misleading since
    it still includes the retracted pilot."
  - FAIL: "The mean of all six deployments is 15.80%." (stated with no
    framing distinguishing it from the recommended figure — reads as if
    it could be the answer)
  - FAIL: reports 15.80% as the "overall average" without ever calling
    it naive, misleading, or excluded-from-recommendation.
- **obj-4**: both endpoints must be present and attributable to the
  retained five (7.80 from S6, 13.00 from S1); a range that includes
  S5's 44.50 fails.
- **obj-5**: the headline/recommended figure the file designates must
  land in [9.22,9.26]; a submission that recommends 10.06 or 15.80 as
  the headline fails even if 9.24 appears elsewhere in the file.

### Subjective guidance

- **Pooling judgment**: does the submission correctly reason that
  sample-size weighting is the appropriate pooling method here (larger,
  more replicated deployments should carry more weight) rather than
  treating all retained deployments as equally informative?
- **Numerical presentation**: is the arithmetic shown clearly (sum of
  products, sum of N, division), and are the different figures (naive
  mean, weighted mean, range) clearly labeled so a reader cannot mistake
  one for another?
- **Reasoning quality**: does `REASONING.md` explain why S5 was
  excluded, why weighting was chosen over a simple average, and why the
  naive mean is reported at all (as a contrast, not a competing
  recommendation)?
