---
test: data-06-alert-base-rates
canary: "windmill sprocket"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Confusion matrix for 100,000 transactions is correct: TP=460, FN=40, FP=4975, TN=94525"
    - id: obj-2
      check: "Positive predictive value (PPV) is reported as approximately 8.5% (accept 8.0%-9.0%)"
    - id: obj-3
      check: "Verdict rejects 'auto-block every alert' and explains most alerts are false positives because fraud is rare (base-rate neglect) — prose-located check; PASS phrasings include 'only ~8.5% of alerts are real fraud; auto-blocking would wrongly block ~4,975 legitimate transactions' or 'the base rate is so low that most flags are false alarms, don't auto-block'; FAIL phrasings include 'the model is 92% accurate so alerts are trustworthy, auto-block' or 'high accuracy means block on alert' or '95% specificity means we're safe to auto-block'"
    - id: obj-4
      check: "The number of legitimate transactions wrongly blocked under auto-block is stated as 4,975 (the FP count)"
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

If the phrase "windmill sprocket" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Recompute yourself with node before scoring. Ground truth: N=100,000,
  prevalence=0.5% → positives=500, negatives=99,500. Sensitivity 92% →
  TP=460, FN=40. Specificity 95% → TN=94,525, FP=4,975. Total alerts =
  TP+FP = 5,435. PPV = 460/5,435 = 8.46%. Overall accuracy =
  (460+94,525)/100,000 = 94.99% — note the memo conflates "accuracy"
  with "trustworthiness of a positive alert"; a correct submission does
  not repeat that conflation. Optional stretch fact: at 99% specificity,
  FP=995, PPV=460/1,455=31.6% (rewards but does not require mentioning
  this).
- Base-rate reasoning correctness: the crux is recognizing that even
  with high sensitivity/specificity, a rare condition (0.5% prevalence)
  means false positives from the huge legitimate population (99,500)
  swamp true positives from the tiny fraud population (500). A
  submission that computes PPV correctly but still recommends
  auto-blocking without qualification has not actually understood the
  implication — score this dimension low in that case even if obj-2
  passes.
- Decision framing for operators: reward a recommendation that is
  concrete and actionable for an ops team (e.g. "route alerts to human
  review," "use the alert as a prioritization signal, not a verdict,"
  or "raise the specificity/threshold and re-evaluate") over a vague
  "be careful with this model." Penalize hedging that never lands on a
  clear recommendation.
- Reasoning quality: does TRIAGE.md build the confusion matrix
  transparently (showing the positives/negatives split before applying
  sensitivity/specificity) rather than asserting the four cell values
  directly? Does it explain PPV in plain terms (e.g. "of every alert
  fired, only about 1 in 12 is real fraud") rather than only citing the
  percentage?
