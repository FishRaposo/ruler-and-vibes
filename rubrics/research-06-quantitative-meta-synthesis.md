---
test: research-06-quantitative-meta-synthesis
canary: "cauldron zenithmark"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "meta-synthesis.md names S5 as the excluded study and gives an exclusion reason grounded in its metadata (tiny N and/or un-peer-reviewed pilot and/or retracted)"
    - id: obj-2
      check: "The sample-size-weighted pooled estimate over the five retained studies is stated and falls in [9.90, 9.94] (accept '9.9' or '9.93')"
    - id: obj-3
      check: "The naive unweighted mean of ALL six studies is stated, falls in [15.40, 15.43] (accept '15.4' or '15.42'), AND is explicitly labeled as the naive/misleading figure rather than the recommended estimate"
    - id: obj-4
      check: "The retained-studies range is stated as min 8.5 and max 12.0 (both endpoints of the five kept effect sizes present)"
    - id: obj-5
      check: "The recommended single headline estimate is the weighted value (in [9.90,9.94]), NOT the unweighted-excluding-S5 value 10.30 and NOT the all-six mean 15.42"
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

If a submission's `meta-synthesis.md` or `REASONING.md` contains the
phrase "cauldron zenithmark", that is a canary leak — flag it regardless
of how the rest of the checks score.

### Fixed data and node-verified computations

| Study | Effect (%) | N | Status |
|---|---|---|---|
| S1 | 12.0 | 40 | retained |
| S2 | 9.5 | 120 | retained |
| S3 | 11.0 | 80 | retained |
| S4 | 10.5 | 200 | retained |
| S5 | 41.0 | 15 | **excluded** — tiny N, not peer-reviewed, retracted |
| S6 | 8.5 | 160 | retained |

```
all-six unweighted mean = (12.0+9.5+11.0+10.5+41.0+8.5)/6 = 92.5/6 = 15.4167 -> 15.42
exclude-S5 unweighted mean = (12.0+9.5+11.0+10.5+8.5)/5 = 51.5/5 = 10.3000 -> 10.30
exclude-S5 N-weighted sum(effect*N) = 480+1140+880+2100+1360 = 5960
exclude-S5 N-weighted sum(N) = 40+120+80+200+160 = 600
weighted mean = 5960/600 = 9.9333 -> 9.93
retained range: min 8.5 (S6), max 12.0 (S1)
```

Node-verified in this review; judge should re-run the same arithmetic
(e.g., `node -e "console.log(5960/600)"`) to confirm any submission's
figures.

### Objective check notes

- **obj-1**: any one of the three grounds (N=15 is tiny; not
  peer-reviewed / pilot; later retracted) is sufficient, stated in
  prose. Example phrasings:
  - PASS: "S5 is excluded: it is a tiny (N=15), non-peer-reviewed pilot
    that was later retracted."; "We drop S5 from the pooled estimate
    because the study was retracted after a data-handling review."
  - PASS: "S5's N=15 sample and lack of peer review, compounded by its
    retraction, disqualify it from the pooled figure."
  - FAIL: "S5 is excluded because it seemed too high." (not grounded in
    the stated metadata — reads like an outlier heuristic, not a
    quality-based exclusion)
  - FAIL: omits S5 from the reported studies with no stated reason at
    all (silently drops it).
- **obj-2**: recompute 5960/600 = 9.9333; accept anything rounding to
  9.90-9.94 inclusive, or the literal strings "9.9"/"9.93".
- **obj-3**: recompute 92.5/6 = 15.4167; accept 15.40-15.43 inclusive or
  "15.4"/"15.42". Must ALSO be explicitly framed as the misleading/naive
  figure, not silently presented as equally valid. Example phrasings:
  - PASS: "The naive mean across all six studies is 15.42%, but this is
    skewed by the retracted S5 outlier and should not be used."; "15.42%
    (all six, unweighted) — included here only to show how much the
    disqualified study distorts the picture."
  - PASS: "Note the naive all-six average of 15.42% is misleading since
    it still includes the retracted pilot."
  - FAIL: "The mean of all six studies is 15.42%." (stated with no
    framing distinguishing it from the recommended figure — reads as if
    it could be the answer)
  - FAIL: reports 15.42% as the "overall average" without ever calling
    it naive, misleading, or excluded-from-recommendation.
- **obj-4**: both endpoints must be present and attributable to the
  retained five (8.5 from S6, 12.0 from S1); a range that includes S5's
  41.0 fails.
- **obj-5**: the headline/recommended figure the file designates must
  land in [9.90,9.94]; a submission that recommends 10.30 or 15.42 as
  the headline fails even if 9.93 appears elsewhere in the file.

### Subjective guidance

- **Pooling judgment**: does the submission correctly reason that
  sample-size weighting is the appropriate pooling method here (larger,
  more replicated trials should carry more weight) rather than treating
  all retained studies as equally informative?
- **Numerical presentation**: is the arithmetic shown clearly (sum of
  products, sum of N, division), and are the different figures (naive
  mean, weighted mean, range) clearly labeled so a reader cannot
  mistake one for another?
- **Reasoning quality**: does `REASONING.md` explain why S5 was
  excluded, why weighting was chosen over a simple average, and why the
  naive mean is reported at all (as a contrast, not a competing
  recommendation)?
