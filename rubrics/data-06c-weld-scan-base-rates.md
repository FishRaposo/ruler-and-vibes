---
test: data-06c-weld-scan-base-rates
canary: "keelson centaur"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Confusion matrix for 80,000 welds is correct: TP=528, FN=72, FP=5558, TN=73842"
    - id: obj-2
      check: "Positive predictive value (PPV) is reported as approximately 8.7% (accept 8.2%-9.2%)"
    - id: obj-3
      check: "Verdict rejects 'auto-scrap every flag' and explains most flags are false positives because real defects are rare (base-rate neglect) — prose-located check; PASS phrasings include 'only ~8.7% of flags are real defects; auto-scrapping would wrongly destroy ~5,558 sound welds' or 'the base rate is so low that most flags are false alarms, don't auto-scrap'; FAIL phrasings include 'the scanner is 88% accurate so flags are trustworthy, auto-scrap' or 'high accuracy means scrap on flag' or '93% specificity means we're safe to auto-scrap'"
    - id: obj-4
      check: "The number of sound welds wrongly scrapped under auto-scrap is stated as 5,558 (the FP count)"
    - id: obj-5
      check: "TRIAGE.md is at most 450 words, whole file, wc -w"
  subjective:
    - id: sub-quality
      name: "Base-rate reasoning correctness"
      weight: 0.4
    - id: sub-craft
      name: "Decision framing for operators"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `data-06-alert-base-rates` (same construct, fresh surface).

- Recompute yourself with node before scoring. Ground truth: N=80,000,
  prevalence=0.75% -> defects=600, sound=79,400. Sensitivity 88% ->
  TP=528, FN=72. Specificity 93% -> TN=73,842, FP=5,558. Total flags =
  TP+FP = 6,086. PPV = 528/6,086 = 8.68%. Overall accuracy =
  (528+73,842)/80,000 = 92.96% — note the memo conflates "accuracy"
  with "trustworthiness of a positive flag"; a correct submission does
  not repeat that conflation. Optional stretch fact: at 99% specificity,
  FP=794, PPV=528/1,322=39.9% (rewards but does not require mentioning
  this). If the phrase "keelson centaur" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
- Base-rate reasoning correctness: the crux is recognizing that even
  with high sensitivity/specificity, a rare condition (0.75% prevalence)
  means false positives from the huge sound-weld population (79,400)
  swamp true positives from the tiny defect population (600). A
  submission that computes PPV correctly but still recommends
  auto-scrapping without qualification has not actually understood the
  implication — score this dimension low in that case even if obj-2
  passes.
- Decision framing for operators: reward a recommendation that is
  concrete and actionable for a fabrication team (e.g. "route flags to a
  certified inspector for a confirming radiograph," "use the flag as a
  prioritization signal, not a verdict," or "raise the
  specificity/threshold and re-evaluate") over a vague "be careful with
  this scanner." Penalize hedging that never lands on a clear
  recommendation.
- Reasoning quality: does TRIAGE.md build the confusion matrix
  transparently (showing the defect/sound split before applying
  sensitivity/specificity) rather than asserting the four cell values
  directly? Does it explain PPV in plain terms (e.g. "of every flag
  raised, only about 1 in 12 is a real defect") rather than only citing
  the percentage?
