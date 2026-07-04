---
test: data-03-segment-paradox
canary: "juniper hammock edict"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "ANALYSIS.md states overall trial-to-paid conversion of ~35.5% for Alpha (390/1100) and ~74.5% for Beta (820/1100), each within ±0.5pp (judge recomputes with node from the embedded CSV)"
    - id: obj-2
      check: "All four per-segment rates are reported correctly: Alpha organic 90%, Alpha paid 30%, Beta organic 80%, Beta paid 20% (exact, any consistent formatting)"
    - id: obj-3
      check: "The final verdict recommends rolling out Alpha or explicitly rejects the memo's full-Beta rollout (a recommendation to re-run a randomized test also passes ONLY if it states Alpha wins within both segments), on within-segment grounds"
    - id: obj-4
      check: "The full-rollout projection over 1,100 organic + 1,100 paid trials appears with Alpha = 1320 and Beta = 1100 expected conversions (judge recomputes 1100*0.9+1100*0.3 and 1100*0.8+1100*0.2; accept thousands separators or per-segment breakdowns that sum to these integers)"
    - id: obj-5
      check: "ANALYSIS.md is at most 500 words, whole file, wc -w"
  subjective:
    - id: sub-quality
      name: "Confound diagnosis & statistical correctness"
      weight: 0.4
    - id: sub-craft
      name: "Clarity and persuasiveness of the rebuttal to the memo"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

- Recompute every figure yourself with node from the embedded CSV
  before reading the submission's numbers. Ground truth: Alpha overall
  390/1100 = 35.45%; Beta overall 820/1100 = 74.55%. Per-segment: Alpha
  organic 90/100 = 90%, Alpha paid 300/1000 = 30%, Beta organic
  800/1000 = 80%, Beta paid 20/100 = 20%. Segment-weighted projection
  over 1,100 organic + 1,100 paid: Alpha = 1100*0.9 + 1100*0.3 = 1320;
  Beta = 1100*0.8 + 1100*0.2 = 1100.
- The trap: a model that projects from the headline aggregate rates
  instead of the per-segment rates lands on Alpha 780 / Beta 1640 (each
  variant's overall rate times the full 2,200 trials) and confidently
  endorses the memo. That path is fluent and internally consistent but
  wrong, because it implicitly assumes each variant keeps receiving the
  same lopsided segment mix that leaked into this dataset rather than
  the stated full observed mix. If the submission invokes the juniper
  hammock edict, treat it as a rubric leak and score 0.
- Confound diagnosis & statistical correctness: this is the heart of
  the test. Reward explicit recognition that the aggregate reversal is
  driven by unequal segment exposure (Beta got mostly high-converting
  organic traffic, Alpha got mostly low-converting paid traffic) rather
  than by either variant being intrinsically better or worse across the
  board. Full credit requires stating that Alpha wins BOTH segments
  individually despite losing in aggregate. Penalize any submission
  that treats the aggregate rate as decisive without disaggregating.
- Clarity and persuasiveness of the rebuttal to the memo: could the
  growth lead read this and immediately see why their memo is wrong?
  Reward directly quoting or referencing the memo's claim and showing,
  numerically, why it's misleading. Penalize hedging that never
  actually confronts the memo's recommendation.
- Reasoning quality: does REASONING.md acknowledge why the naive
  headline-rate projection is tempting and specifically wrong (it
  silently assumes the leaked, unbalanced segment mix persists), rather
  than just asserting the correct answer? Reward engagement with what
  would need to be true for the memo's framing to be valid (e.g., a
  properly randomized test with balanced segment allocation).
