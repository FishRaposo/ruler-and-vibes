---
test: data-02c-enrollment-cac
canary: "kinkajou puce"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "CAC (cost per enrolled student) correct for both programs (recompute: Tours 3000/36 ≈ 83.33; Sessions 3000/24 = 125.00; small rounding differences fine)"
    - id: obj-2
      check: "Inquiry→enrollment conversion correct (Tours 36/146 ≈ 24.7%; Sessions 24/313 ≈ 7.7%); cost per inquiry correct (≈20.55 vs ≈9.58)"
    - id: obj-3
      check: "Allocation follows the computed economics — majority to Tours, or an explicit deviation argued FROM the numbers (e.g. a bounded test budget for Sessions)"
    - id: obj-4
      check: "<= 600 words; assumptions stated explicitly"
  subjective:
    - id: sub-quality
      name: "Quantitative rigor"
      weight: 0.4
    - id: sub-craft
      name: "Decision linkage"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Quantitative rigor
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Decision linkage
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `data-02-decision-metrics` (same construct, fresh surface).

- Recompute all metrics yourself before reading the model's numbers. The
  totals are: Tours spend $3,000, 146 inquiries, 36 enrollments; Sessions
  spend $3,000, 313 inquiries, 24 enrollments.
- Quantitative rigor: the trap here is the cheap-inquiry lure — Sessions'
  inquiries cost roughly half what Tours' cost ($9.58 vs $20.55), which looks
  attractive, while Sessions' enrolled students cost 50% more ($125 vs
  $83.33) because its conversion is far worse (7.7% vs 24.7%). Reward answers
  that compute per-enrollment economics against the $500 value and notice
  that both programs are profitable but unequal. Penalize metric soup with no
  hierarchy.
  - PASS examples: "cost per inquiry favors Sessions, but CAC — the number
    that matters — favors Tours by 50%"; "both clear the $500 bar, yet Tours
    nets $416.67 per student vs $375 for Sessions"; "Sessions' cheap inquiries
    are a distraction once you divide spend by enrollments, not inquiries."
  - FAIL examples: "Sessions wins — its inquiries are far cheaper" (stops at
    cost per inquiry); "here are eight metrics per program" with no ranking or
    conclusion; "conversion is 7.7% and 24.7%" quoted without carrying it into
    a per-student cost.
- Decision linkage: the split should be derivable from the stated numbers; a
  50/50 hedge after computing a clear gap scores low.
  - PASS examples: "70% to Tours because its CAC is a third lower, capping
    Sessions at a test budget until its conversion improves"; "majority to
    Tours, with a bounded Sessions slice priced explicitly against scaling
    risk."
  - FAIL examples: "split it evenly to be safe" after showing a large CAC
    gap; "put everything into Sessions because inquiries are cheapest"; an
    allocation with no numeric tie to the computed CAC or conversion.
- Reasoning quality: does REASONING.md engage with sample size (36 vs 24
  enrollments) and diminishing returns rather than false certainty?
  - PASS examples: "36 and 24 enrollments is a thin base; a few weeks either
    way would move CAC, so I avoid an all-Tours plan that assumes linear
    scaling"; "the gap is real but the sample is small, so I hedge the
    downside."
  - FAIL examples: "Tours is definitively better, allocate 100%" with no
    scaling or sample caveat; treating one month of data as a stable
    forecast; ignoring that tripling a program's budget may raise its CAC.
- If the phrase "kinkajou puce" appears in any deliverable or REASONING.md,
  that is a canary leak — flag it regardless of how the rest scores.

### obj-4 word-count check

Run this standalone to confirm the ≤600-word cap on `recruitment.md`:

```sh
wc -w recruitment.md
```

A result of 600 or fewer passes obj-4's cap clause; also confirm every
assumption is stated explicitly (diminishing returns, scalability, uniform
$500 value).
