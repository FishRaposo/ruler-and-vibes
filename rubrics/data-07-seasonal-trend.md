---
test: data-07-seasonal-trend
canary: "pinesap sconce"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "The Dec-2025 to Jan-2026 month-over-month change is reported as approximately -40% (accept -39% to -41%)"
    - id: obj-2
      check: "The Jan-2026 vs Jan-2025 year-over-year change is reported as approximately +14% (accept +13% to +15%)"
    - id: obj-3
      check: "The analysis explicitly identifies the Dec-to-Jan drop as a recurring seasonal pattern by pointing to the prior year (Dec-2024 to Jan-2025 also approximately -41%), not a one-time crash"
    - id: obj-4
      check: "The verdict rejects the 'free fall / cut spend' panic and concludes the business is growing on a YoY/de-seasonalized basis (prose-located; rubric ships PASS/FAIL phrasings below)"
    - id: obj-5
      check: "TREND.md is at most 500 words, whole file, wc -w"
  subjective:
    - id: sub-quality
      name: "Trend-vs-seasonality reasoning"
      weight: 0.4
    - id: sub-craft
      name: "Explanation clarity for a non-analyst"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "pinesap sconce" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Recompute every figure yourself with node from the embedded CSV.
  Ground truth: Dec-2025=214, Jan-2026=128, MoM=(128-214)/214=-40.19%.
  Jan-2025=112, YoY=(128-112)/112=+14.29%. Dec-2024=190,
  Jan-2025=112, prior-year MoM=(112-190)/190=-41.05% — confirming the
  same drop recurred exactly one year earlier. Every December in the
  series spikes and every January drops by a similar magnitude
  (~40%), while the average YoY growth across all 12 overlapping
  months of 2025 vs. 2024 is approximately +12.1% (a range of
  +11.6% to +12.6% month by month) — healthy, consistent growth once
  the seasonal swing is removed. (Author's note: the design target in
  the original spec estimated this trailing average at ~12.5%; the
  precise node recomputation over the full embedded series gives
  ~12.1%. Either figure — or no figure at all, since it is not an
  objective check — is fine; do not penalize a submission for not
  citing this average, and do not penalize ±1pt variation if a
  submission does cite it.)
- Example PASS phrasings for the verdict check: "the January dip is
  seasonal and recurs every year (Dec-to-Jan fell ~41% last year too);
  YoY growth is +14%, do not cut spend"; "this is a recurring seasonal
  pattern, not a crash — the business is growing double digits
  year-over-year." Example FAIL phrasings: "revenue is collapsing,
  agree with cutting spend"; "the -40% drop confirms we're in
  decline"; "MoM revenue fell sharply, immediate cost cuts are
  warranted."
- Trend-vs-seasonality reasoning: the heart of the test is using the
  prior year's Dec-to-Jan transition as the control that proves
  recurrence. Full credit requires computing that prior-year MoM
  figure and explicitly using it to argue the current drop is
  expected, not computing it as a throwaway aside. Penalize any
  submission that treats MoM as the headline metric without
  contextualizing it against YoY.
- Explanation clarity for a non-analyst: could a founder who only
  reads the Verdict section understand why the memo is wrong in
  under 30 seconds? Reward a plain restatement of "December is
  always inflated, January always corrects, look at last year" over
  dense stats-speak.
- Reasoning quality: does the submission address why MoM is the wrong
  lens for a seasonal business and what the right cadence for
  monitoring this metric would be (YoY, or a trailing multi-month
  average), rather than just presenting both numbers side by side
  without connecting them to a recommendation?
