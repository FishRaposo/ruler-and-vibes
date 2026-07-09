---
test: data-07c-filing-season-dip
canary: "rudder undine"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "The Apr-2026 to May-2026 month-over-month change is reported as approximately -40% (accept -39% to -41%)"
    - id: obj-2
      check: "The May-2026 vs May-2025 year-over-year change is reported as approximately +14% (accept +13% to +15%)"
    - id: obj-3
      check: "The analysis explicitly identifies the Apr-to-May drop as a recurring seasonal pattern by pointing to the prior year (Apr-2025 to May-2025 also approximately -41%), not a one-time decline"
    - id: obj-4
      check: "The verdict rejects the 'shrinking / freeze hiring / trim costs' panic and concludes the practice is growing on a YoY/de-seasonalized basis (prose-located; rubric ships PASS/FAIL phrasings below)"
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
anchors:
  - id: Trend-vs-seasonality reasoning
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.
  - id: Explanation clarity for a non-analyst
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `data-07-seasonal-trend` (same construct, fresh surface).

If the phrase "rudder undine" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Recompute every figure yourself with node from the embedded CSV.
  Ground truth: Apr-2026=810, May-2026=484, MoM=(484-810)/810=-40.25%.
  May-2025=424, YoY=(484-424)/424=+14.15%. Apr-2025=722,
  May-2025=424, prior-year MoM=(424-722)/722=-41.27% — confirming the
  same drop recurred exactly one year earlier. Every April in the
  series spikes (the filing deadline pulls a year of returns into one
  month) and every May drops back by a similar magnitude (~40-41%),
  while the average YoY growth across the twelve overlapping months
  from May-2025 through Apr-2026 (each vs. the same month a year
  earlier, including the April peak-to-peak pair 722→810 = +12.2%) is
  approximately +13.6%; restricted to the eleven non-April months
  among them it is ~13.7% (a range of roughly +13.4% to +14.1% month
  by month) — healthy, consistent growth once the seasonal swing is
  removed. (Either figure — or no figure at all, since it is not an
  objective check — is fine; do not penalize a submission for not
  citing this average, and do not penalize ±1pt variation if a
  submission does cite it.)
- Example PASS phrasings for the verdict check: "the May dip is
  seasonal and recurs every year (Apr-to-May fell ~41% last year too);
  YoY growth is +14%, do not freeze hiring"; "this is a recurring
  seasonal pattern, not a decline — the practice is growing double
  digits year-over-year." Example FAIL phrasings: "filings are
  shrinking, agree with freezing hiring"; "the -40% drop confirms the
  practice is contracting"; "MoM filings fell sharply, immediate cost
  cuts are warranted."
- Trend-vs-seasonality reasoning: the heart of the test is using the
  prior year's Apr-to-May transition as the control that proves
  recurrence. Full credit requires computing that prior-year MoM
  figure and explicitly using it to argue the current drop is
  expected, not computing it as a throwaway aside. Penalize any
  submission that treats MoM as the headline metric without
  contextualizing it against YoY.
- Explanation clarity for a non-analyst: could a partner who only
  reads the Verdict section understand why the note is wrong in
  under 30 seconds? Reward a plain restatement of "April is always
  inflated by the deadline, May always corrects, look at last year"
  over dense stats-speak.
- Reasoning quality: does the submission address why MoM is the wrong
  lens for a deadline-driven practice and what the right cadence for
  monitoring this metric would be (YoY, or a trailing multi-month
  average), rather than just presenting both numbers side by side
  without connecting them to a recommendation?
