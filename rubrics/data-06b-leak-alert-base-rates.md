---
test: data-06b-leak-alert-base-rates
canary: "gunwale faun"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Confusion matrix for 80,000 segments is correct: TP=540, FN=60, FP=4764, TN=74636"
    - id: obj-2
      check: "Positive predictive value (PPV) is reported as approximately 10.2% (accept 9.5%-11.0%)"
    - id: obj-3
      check: "Verdict rejects 'auto-dispatch on every alert' and explains most alerts are false positives because leaks are rare (base-rate neglect) — prose-located check; PASS phrasings include 'only ~10% of alerts are real leaks; auto-dispatching would needlessly excavate ~4,764 sound segments' or 'the leak prevalence is so low that most flags are false alarms, don't auto-dig' or 'about 1 in 10 alerts is a true leak, so confirm before sending a crew'; FAIL phrasings include 'the classifier is 90% accurate so alerts are trustworthy, auto-dispatch' or 'high accuracy means dig on every alert' or '94% specificity means we're safe to auto-excavate'"
    - id: obj-4
      check: "The number of sound segments needlessly excavated under auto-dispatch is stated as 4,764 (the FP count)"
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
  prevalence=0.75% → positives=600, negatives=79,400. Sensitivity 90% →
  TP=540, FN=60. Specificity 94% → TN=74,636, FP=4,764. Total alerts =
  TP+FP = 5,304. PPV = 540/5,304 = 10.18%. Overall accuracy =
  (540+74,636)/80,000 = 93.97% — note the memo conflates "accuracy" with
  "trustworthiness of a positive alert"; a correct submission does not
  repeat that conflation. Optional stretch fact: at 99% specificity,
  FP=794, PPV=540/1,334=40.5% (rewards but does not require mentioning
  this). If the phrase "gunwale faun" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
- Base-rate reasoning correctness: the crux is recognizing that even with
  high sensitivity/specificity, a rare condition (0.75% prevalence) means
  false positives from the huge sound population (79,400) swamp true
  positives from the tiny leaking population (600). A submission that
  computes PPV correctly but still recommends auto-dispatching without
  qualification has not actually understood the implication — score this
  dimension low in that case even if obj-2 passes.
- Decision framing for operators: reward a recommendation that is concrete
  and actionable for a utility crew (e.g. "route alerts to a field
  confirmation step," "use the alert as a prioritization signal, not a
  verdict," or "raise the specificity/threshold and re-evaluate") over a
  vague "be careful with this classifier." Penalize hedging that never
  lands on a clear recommendation.
- Reasoning quality: does TRIAGE.md build the confusion matrix
  transparently (showing the leaking/sound split before applying
  sensitivity/specificity) rather than asserting the four cell values
  directly? Does it explain PPV in plain terms (e.g. "of every alert
  fired, only about 1 in 10 is a real leak") rather than only citing the
  percentage?
