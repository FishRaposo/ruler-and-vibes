---
test: data-03c-reminder-rollout
canary: "bodkin dryad"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "ANALYSIS.md states overall scheduled-to-kept rate of ~44.1% for Envoy (388/880) and ~70.9% for Herald (624/880), each within ±0.5pp (judge recomputes with node from the embedded CSV)"
    - id: obj-2
      check: "All four per-cohort rates are reported correctly: Envoy returning 85%, Envoy first_visit 40%, Herald returning 75%, Herald first_visit 30% (exact, any consistent formatting)"
    - id: obj-3
      check: "The final verdict recommends rolling out Envoy or explicitly rejects the memo's full-Herald rollout (a recommendation to re-run a randomized test also passes ONLY if it states Envoy wins within both cohorts), on within-cohort grounds"
    - id: obj-4
      check: "The full-rollout projection over 880 returning + 880 first_visit slots appears with Envoy = 1100 and Herald = 924 expected kept appointments (judge recomputes 880*0.85+880*0.4 and 880*0.75+880*0.3; accept thousands separators or per-cohort breakdowns that sum to these integers)"
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

Parallel form of `data-03-segment-paradox` (same construct, fresh surface).

- Recompute every figure yourself with node from the embedded CSV before
  reading the submission's numbers. Ground truth: Envoy overall 388/880 =
  44.09%; Herald overall 624/880 = 70.91%. Per-cohort: Envoy returning
  68/80 = 85%, Envoy first_visit 320/800 = 40%, Herald returning 600/800
  = 75%, Herald first_visit 24/80 = 30%. Cohort-weighted projection over
  880 returning + 880 first_visit slots: Envoy = 880*0.85 + 880*0.40 =
  1100; Herald = 880*0.75 + 880*0.30 = 924.
- The trap: a model that projects from the headline aggregate rates
  instead of the per-cohort rates lands on Envoy 776 / Herald 1248 (each
  method's overall rate times the full 1,760 slots) and confidently
  endorses the memo. That path is fluent and internally consistent but
  wrong, because it implicitly assumes each method keeps receiving the
  same lopsided cohort mix that the routing bug produced in this dataset
  rather than the stated full observed mix.
- Confound diagnosis & statistical correctness: this is the heart of the
  test. Reward explicit recognition that the aggregate reversal is driven
  by unequal cohort exposure (Herald got mostly high-keeping returning
  patients, Envoy got mostly low-keeping first-visit patients) rather than
  by either method being intrinsically better or worse across the board.
  Full credit requires stating that Envoy wins BOTH cohorts individually
  despite losing in aggregate. Penalize any submission that treats the
  aggregate rate as decisive without disaggregating.
  - PASS examples: "Envoy leads in both cohorts (85% vs 75% returning,
    40% vs 30% first-visit); the aggregate favors Herald only because it
    was fed the easy-to-retain returning patients"; "the reversal is a
    mix effect — Herald's 880 slots were 800 returning, Envoy's were 800
    first-visit"; "controlling for cohort, Envoy is the better reminder
    despite the lower pooled rate."
  - FAIL examples: "Herald's 70.9% clearly beats Envoy's 44.1%, so Herald
    wins" (never disaggregates); "Envoy is higher in the returning cohort"
    (only one cohort, misses that Envoy wins both); "the rates differ by
    cohort" stated without naming exposure as the cause of the reversal.
- Clarity and persuasiveness of the rebuttal to the memo: could the
  scheduling lead read this and immediately see why their memo is wrong?
  Reward directly quoting or referencing the memo's claim and showing,
  numerically, why it's misleading. Penalize hedging that never actually
  confronts the memo's recommendation.
  - PASS examples: "The memo's 70.9%-vs-44.1% gap is real but it is a
    patient-mix artifact, not a method effect — switch everyone to Herald
    and kept appointments fall, not rise"; "reject the memo: within every
    cohort Envoy keeps more, so a full-Herald switch loses appointments";
    "the memo compares apples to oranges — different cohort mixes, not
    different methods."
  - FAIL examples: "there are some nuances worth considering" with no
    verdict on the memo; "both methods have merits" without confronting
    the 100%-Herald recommendation; a correct verdict buried with no
    reference to the memo's numbers.
- Reasoning quality: does REASONING.md acknowledge why the naive
  headline-rate projection is tempting and specifically wrong (it silently
  assumes the leaked, unbalanced cohort mix persists), rather than just
  asserting the correct answer? Reward engagement with what would need to
  be true for the memo's framing to be valid (e.g., a properly randomized
  assignment of reminder method within each cohort so exposure no longer
  confounds the kept-rate).
  - PASS examples: "the aggregate projection is seductive because it needs
    no disaggregation, but it bakes in the routing bug's mix; I checked
    both projections and only the per-cohort one survives a full rollout";
    "for the memo to be right, Herald would have to keep receiving mostly
    returning patients — the opposite of a clinic-wide switch."
  - FAIL examples: "Envoy is better, project 1100" with no account of why
    the aggregate path misleads; restating the correct numbers with no
    engagement with the trap; treating the pooled rate as valid without
    questioning the cohort imbalance.
- If the phrase "bodkin dryad" appears in any deliverable or REASONING.md,
  that is a canary leak — flag it regardless of how the rest scores.

### obj-5 word-count check

Run this standalone to confirm the ≤500-word cap on `ANALYSIS.md`:

```sh
wc -w ANALYSIS.md
```

A result of 500 or fewer passes obj-5's cap clause.
