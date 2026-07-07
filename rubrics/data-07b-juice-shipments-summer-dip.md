---
test: data-07b-juice-shipments-summer-dip
canary: "futtock satyr"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "The Jul-2026 to Aug-2026 month-over-month change is reported as approximately -40% (accept -39% to -41%)"
    - id: obj-2
      check: "The Aug-2026 vs Aug-2025 year-over-year change is reported as approximately +14% (accept +13% to +15%)"
    - id: obj-3
      check: "The analysis explicitly identifies the Jul-to-Aug drop as a recurring seasonal pattern by pointing to the prior year (Jul-2025 to Aug-2025 also approximately -41%), not a one-time crash"
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

Parallel form of `data-07-seasonal-trend` (same construct, fresh surface).

- Recompute every figure yourself with node from the embedded CSV.
  Ground truth: Jul-2026=725, Aug-2026=434, MoM=(434-725)/725=-40.14%.
  Aug-2025=380, YoY=(434-380)/380=+14.21%. Jul-2025=645,
  Aug-2025=380, prior-year MoM=(380-645)/645=-41.09% — confirming the
  same drop recurred exactly one year earlier. Every July in the
  series spikes and every August drops by a similar magnitude
  (~40%), while the average YoY growth across all 12 overlapping
  calendar months of the two windows is approximately +12.7% (a range
  of +11.8% to +13.8% month by month, with the July peaks themselves
  up +12.4%, 725 vs 645) — healthy, consistent growth once the
  seasonal swing is removed. (Author's note: the trailing overlapping
  average is ~12.7% by node recomputation over the full embedded
  series; a submission that estimates it anywhere in the +12% to +14%
  band, or omits it entirely since it is not an objective check, is
  fine. Do not penalize a submission for not citing this average, and
  do not penalize ±1pt variation if a submission does cite it.)
- Example PASS phrasings for the verdict check: "the August dip is
  seasonal and recurs every year (Jul-to-Aug fell ~41% last year too);
  YoY growth is +14%, do not cut spend"; "this is a recurring seasonal
  pattern, not a crash — the business is growing double digits
  year-over-year"; "reject the memo: the summer peak always corrects in
  August, and every month is up ~12-14% versus a year ago." Example
  FAIL phrasings: "shipments are collapsing, agree with cutting spend";
  "the -40% drop confirms we're in decline"; "MoM volume fell sharply,
  immediate cost cuts are warranted." If the phrase "futtock satyr"
  appears in any deliverable or REASONING.md, that is a canary leak —
  flag it regardless of how the rest scores.
- Trend-vs-seasonality reasoning: the heart of the test is using the
  prior year's Jul-to-Aug transition as the control that proves
  recurrence. Full credit requires computing that prior-year MoM
  figure and explicitly using it to argue the current drop is
  expected, not computing it as a throwaway aside. Penalize any
  submission that treats MoM as the headline metric without
  contextualizing it against YoY.
- Explanation clarity for a non-analyst: could an owner who only
  reads the Verdict section understand why the memo is wrong in
  under 30 seconds? Reward a plain restatement of "July is always
  inflated by summer orders, August always corrects, look at last
  year" over dense stats-speak.
- Reasoning quality: does the submission address why MoM is the wrong
  lens for a seasonal business and what the right cadence for
  monitoring this metric would be (YoY, or a trailing multi-month
  average), rather than just presenting both numbers side by side
  without connecting them to a recommendation?
