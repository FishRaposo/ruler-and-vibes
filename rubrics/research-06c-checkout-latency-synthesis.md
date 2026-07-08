---
test: research-06c-checkout-latency-synthesis
canary: "feldspar poplar"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "latency-synthesis.md names S5 as the excluded experiment and gives an exclusion reason grounded in its metadata (tiny N and/or not independently audited and/or retracted)"
    - id: obj-2
      check: "The sample-size-weighted pooled estimate over the five retained experiments is stated and falls in [10.81, 10.85] (accept '10.8' or '10.83')"
    - id: obj-3
      check: "The naive unweighted mean of ALL six experiments is stated, falls in [16.70, 16.73] (accept '16.7' or '16.72'), AND is explicitly labeled as the naive/misleading figure rather than the recommended estimate"
    - id: obj-4
      check: "The retained-experiments range is stated as min 9.00 and max 13.40 (both endpoints of the five kept effect sizes present)"
    - id: obj-5
      check: "The recommended single headline estimate is the weighted value (in [10.81,10.85]), NOT the unweighted-excluding-S5 value 11.26 and NOT the all-six mean 16.72"
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

If the phrase "feldspar poplar" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Fixed data and node-verified computations

| Experiment | Effect (%) | N | Status |
|---|---|---|---|
| S1 | 13.40 | 50 | retained |
| S2 | 10.20 | 130 | retained |
| S3 | 12.20 | 90 | retained |
| S4 | 11.50 | 210 | retained |
| S5 | 44.00 | 20 | **excluded** — tiny N, not independently audited, retracted |
| S6 | 9.00 | 170 | retained |

```
all-six unweighted mean = (13.40+10.20+12.20+11.50+44.00+9.00)/6 = 100.30/6 = 16.7167 -> 16.72
exclude-S5 unweighted mean = (13.40+10.20+12.20+11.50+9.00)/5 = 56.30/5 = 11.2600 -> 11.26
exclude-S5 N-weighted sum(effect*N) = 670+1326+1098+2415+1530 = 7039
exclude-S5 N-weighted sum(N) = 50+130+90+210+170 = 650
weighted mean = 7039/650 = 10.8292 -> 10.83
retained range: min 9.00 (S6), max 13.40 (S1)
```

Node-verified in this review; judge should re-run the same arithmetic
(e.g., `node -e "console.log(7039/650)"`) to confirm any submission's
figures.

### Objective check notes

- **obj-1**: any one of the three grounds (N=20 is tiny; not
  independently audited / single-day pilot; later retracted) is
  sufficient, stated in prose. Example phrasings:
  - PASS: "S5 is excluded: it is a tiny (N=20), unaudited single-day
    pilot that was later retracted."; "We drop S5 from the pooled
    estimate because the finding was retracted after bot traffic was
    found to have contaminated the logs."
  - PASS: "S5's N=20 sample and lack of independent audit, compounded by
    its retraction, disqualify it from the pooled figure."
  - FAIL: "S5 is excluded because the number looked too high." (not
    grounded in the stated metadata — reads like an outlier heuristic,
    not a quality-based exclusion)
  - FAIL: omits S5 from the reported experiments with no stated reason
    at all (silently drops it).
- **obj-2**: recompute 7039/650 = 10.8292; accept anything rounding to
  10.81-10.85 inclusive, or the literal strings "10.8"/"10.83".
- **obj-3**: recompute 100.30/6 = 16.7167; accept 16.70-16.73 inclusive
  or "16.7"/"16.72". Must ALSO be explicitly framed as the
  misleading/naive figure, not silently presented as equally valid.
  Example phrasings:
  - PASS: "The naive mean across all six experiments is 16.72%, but this
    is skewed by the retracted S5 outlier and should not be used.";
    "16.72% (all six, unweighted) — included here only to show how much
    the disqualified pilot distorts the picture."
  - PASS: "Note the naive all-six average of 16.72% is misleading since
    it still includes the retracted, bot-contaminated pilot."
  - FAIL: "The mean of all six experiments is 16.72%." (stated with no
    framing distinguishing it from the recommended figure — reads as if
    it could be the answer)
  - FAIL: reports 16.72% as the "overall average" without ever calling
    it naive, misleading, or excluded-from-recommendation.
- **obj-4**: both endpoints must be present and attributable to the
  retained five (9.00 from S6, 13.40 from S1); a range that includes
  S5's 44.00 fails.
- **obj-5**: the headline/recommended figure the file designates must
  land in [10.81,10.85]; a submission that recommends 11.26 or 16.72 as
  the headline fails even if 10.83 appears elsewhere in the file.

### Subjective guidance

- **Pooling judgment**: does the submission correctly reason that
  sample-size weighting is the appropriate pooling method here (larger,
  more replicated experiments should carry more weight) rather than
  treating all retained experiments as equally informative?
- **Numerical presentation**: is the arithmetic shown clearly (sum of
  products, sum of N, division), and are the different figures (naive
  mean, weighted mean, range) clearly labeled so a reader cannot mistake
  one for another?
- **Reasoning quality**: does `REASONING.md` explain why S5 was
  excluded, why weighting was chosen over a simple average, and why the
  naive mean is reported at all (as a contrast, not a competing
  recommendation)?
