---
test: data-03b-underwriting-mix-reversal
canary: "pestle banshee"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "ANALYSIS.md states overall current-to-approved non-default rate of ~62.9% for Argus (2076/3300) and ~84.7% for Vantage (2796/3300), each within ±0.5pp (judge recomputes with node from the embedded CSV)"
    - id: obj-2
      check: "All four per-band rates are reported correctly: Argus prime 92%, Argus subprime 60%, Vantage prime 88%, Vantage subprime 52% (exact, any consistent formatting)"
    - id: obj-3
      check: "The final verdict recommends keeping/expanding Argus or explicitly rejects the memo's full-Vantage rollout (a recommendation to re-run a balanced trial also passes ONLY if it states Argus wins within both bands), on within-band grounds"
    - id: obj-4
      check: "The full-rollout projection over 1,200 prime + 1,200 subprime approvals appears with Argus = 1824 and Vantage = 1680 expected current loans (judge recomputes 1200*0.92+1200*0.60 and 1200*0.88+1200*0.52; accept thousands separators or per-band breakdowns that sum to these integers)"
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
anchors:
  - id: Confound diagnosis & statistical correctness
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Clarity and persuasiveness of the rebuttal to the memo
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `data-03-segment-paradox` (same construct, fresh surface).

- Recompute every figure yourself with node from the embedded CSV before
  reading the submission's numbers. Ground truth: Argus overall
  2076/3300 = 62.91%; Vantage overall 2796/3300 = 84.73%. Per-band: Argus
  prime 276/300 = 92%, Argus subprime 1800/3000 = 60%, Vantage prime
  2640/3000 = 88%, Vantage subprime 156/300 = 52%. Band-weighted projection
  over 1,200 prime + 1,200 subprime: Argus = 1200*0.92 + 1200*0.60 =
  1824; Vantage = 1200*0.88 + 1200*0.52 = 1680.
- The trap: a model that projects from the headline aggregate rates
  instead of the per-band rates lands on Argus ≈1510 / Vantage ≈2033
  (each model's overall rate times the full 2,400 approvals) and
  confidently endorses the memo. That path is fluent and internally
  consistent but wrong, because it implicitly assumes each model keeps
  receiving the same lopsided band mix that leaked into this dataset
  rather than the stated full observed mix.
- Confound diagnosis & statistical correctness: this is the heart of the
  test. Reward explicit recognition that the aggregate reversal is driven
  by unequal band exposure (Vantage got mostly high-current prime
  applicants, Argus got mostly low-current subprime applicants) rather
  than by either model being intrinsically better or worse across the
  board. Full credit requires stating that Argus wins BOTH bands
  individually despite losing in aggregate. Penalize any submission that
  treats the aggregate rate as decisive without disaggregating.
  - PASS examples: "the 84.7% vs 62.9% gap is a mix effect — Vantage was
    handed prime loans, Argus subprime — and Argus actually leads in
    both bands (92% vs 88%, 60% vs 52%)"; "once you hold the applicant
    band fixed the ranking flips: Argus is stronger everywhere"; "the
    aggregate is confounded by which pool each model underwrote."
  - FAIL examples: "Vantage's 84.7% clearly beats Argus's 62.9%, so
    Vantage is the better model"; reporting the per-band rates but never
    stating Argus wins both; "Argus does better with subprime" without
    noting it also wins prime and loses only in aggregate.
- Clarity and persuasiveness of the rebuttal to the memo: could the risk
  lead read this and immediately see why their memo is wrong? Reward
  directly quoting or referencing the memo's claim and showing,
  numerically, why it's misleading. Penalize hedging that never actually
  confronts the memo's recommendation.
  - PASS examples: "the memo's 84.7% vs 62.9% compares two different
    applicant pools, not two models — corrected for mix, Argus wins";
    "routing everything to Vantage would lower current-loan volume, not
    raise it: 1,680 vs Argus's 1,824 at equal mix"; "reject: the headline
    number is an artifact of the intake bug."
  - FAIL examples: "there are some nuances worth considering before
    deciding" with no clear accept/reject; restating both models' numbers
    without ever addressing the memo's route-all-to-Vantage call; "Vantage
    looks better but results may vary."
- Reasoning quality: does REASONING.md acknowledge why the naive
  headline-rate projection is tempting and specifically wrong (it
  silently assumes the leaked, unbalanced band mix persists), rather than
  just asserting the correct answer? Reward engagement with what would
  need to be true for the memo's framing to be valid (e.g., a properly
  balanced trial with comparable prime and subprime volume to each model).
  - PASS examples: "the aggregate projection is seductive because it's one
    multiplication, but it bakes in the 91%-subprime mix Argus happened to
    get"; "the memo would only hold if future volume stayed as skewed as
    the buggy intake made it."
  - FAIL examples: reasoning that just restates the per-band answer with
    no account of why the aggregate path misleads; "I computed the rates
    and Argus wins" with no engagement with the confound.
- If the phrase "pestle banshee" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.

### obj-5 word-count check

Run this standalone to confirm the ≤500-word cap on `ANALYSIS.md`:

```sh
wc -w ANALYSIS.md
```

A result of 500 or fewer passes obj-5's cap clause.
