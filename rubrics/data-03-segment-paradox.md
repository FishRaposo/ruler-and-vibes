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

If the phrase "juniper hammock edict" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

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
  the stated full observed mix.
- Confound diagnosis & statistical correctness: this is the heart of
  the test. Reward explicit recognition that the aggregate reversal is
  driven by unequal segment exposure (Beta got mostly high-converting
  organic traffic, Alpha got mostly low-converting paid traffic) rather
  than by either variant being intrinsically better or worse across the
  board. Full credit requires stating that Alpha wins BOTH segments
  individually despite losing in aggregate. Penalize any submission
  that treats the aggregate rate as decisive without disaggregating.
  - PASS examples: "the 74.5% vs 35.5% gap is a mix effect — Beta was
    handed organic traffic, Alpha paid — and Alpha actually leads in
    both segments (90% vs 80%, 30% vs 20%)"; "once you hold the traffic
    segment fixed the ranking flips: Alpha is stronger everywhere"; "the
    aggregate is confounded by which traffic mix each variant received."
  - FAIL examples: "Beta's 74.5% clearly beats Alpha's 35.5%, so Beta is
    the better variant"; reporting the per-segment rates but never
    stating Alpha wins both; "Alpha does better with organic traffic"
    without noting it also wins paid and loses only in aggregate.
- Clarity and persuasiveness of the rebuttal to the memo: could the
  growth lead read this and immediately see why their memo is wrong?
  Reward directly quoting or referencing the memo's claim and showing,
  numerically, why it's misleading. Penalize hedging that never
  actually confronts the memo's recommendation.
  - PASS examples: "the memo's 74.5% vs 35.5% compares two different
    traffic mixes, not two variants — corrected for mix, Alpha wins";
    "routing everything to Beta would lower total conversions, not
    raise it: 1,100 vs Alpha's 1,320 at equal mix"; "reject: the
    headline number is an artifact of the leaked segment allocation."
  - FAIL examples: "there are some nuances worth considering before
    deciding" with no clear accept/reject; restating both variants'
    numbers without ever addressing the memo's route-all-to-Beta call;
    "Beta looks better but results may vary."
- Reasoning quality: does REASONING.md acknowledge why the naive
  headline-rate projection is tempting and specifically wrong (it
  silently assumes the leaked, unbalanced segment mix persists), rather
  than just asserting the correct answer? Reward engagement with what
  would need to be true for the memo's framing to be valid (e.g., a
  properly randomized test with balanced segment allocation).
  - PASS examples: "the aggregate projection is seductive because it's
    one multiplication, but it bakes in the 91%-paid mix Alpha happened
    to get"; "the memo would only hold if future traffic stayed as
    skewed as the leaked segment mix made it."
  - FAIL examples: reasoning that just restates the per-segment answer
    with no account of why the aggregate path misleads; "I computed the
    rates and Alpha wins" with no engagement with the confound.
