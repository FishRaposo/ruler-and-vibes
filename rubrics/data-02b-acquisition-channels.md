---
test: data-02b-acquisition-channels
canary: "coati mauveine"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "CAC (cost per paid subscriber) correct for both channels (recompute: Podcast 2700/29 ≈ 93.10; Influencer 2700/21 ≈ 128.57; small rounding differences fine)"
    - id: obj-2
      check: "Signup→subscriber conversion correct (Podcast 29/110 ≈ 26.4%; Influencer 21/300 = 7.0%); cost per signup correct (≈24.55 vs 9.00)"
    - id: obj-3
      check: "Allocation follows the computed economics — majority to Podcast, or an explicit deviation argued FROM the numbers (e.g. a bounded test budget for Influencer)"
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
  totals are: Podcast spend $2,700, 110 signups, 29 subscribers; Influencer
  spend $2,700, 300 signups, 21 subscribers.
- Quantitative rigor: the trap here is the cheap-signup lure — Influencer's
  signups cost roughly a third of Podcast's ($9.00 vs $24.55), which looks
  attractive, while Influencer's paid subscribers cost about 38% more
  ($128.57 vs $93.10) because its conversion is far worse (7.0% vs 26.4%).
  Reward answers that compute per-subscriber economics against the $180 value
  and notice that both channels are profitable but unequal. Penalize metric
  soup with no hierarchy.
  - PASS examples: "cost per signup favors Influencer, but CAC — the number
    that matters — favors Podcast by ~38%"; "both clear the $180 bar, yet
    Podcast nets $86.90 per subscriber vs $51.43 for Influencer"; "Influencer's
    cheap signups are a distraction once you divide spend by subscribers, not
    signups."
  - FAIL examples: "Influencer wins — its signups are far cheaper" (stops at
    cost per signup); "here are eight metrics per channel" with no ranking or
    conclusion; "conversion is 7.0% and 26.4%" quoted without carrying it into
    a per-subscriber cost.
- Decision linkage: the split should be derivable from the stated numbers; a
  50/50 hedge after computing a clear gap scores low.
  - PASS examples: "about 72% to Podcast because its CAC is roughly a third
    lower, capping Influencer at a test budget until its conversion improves";
    "majority to Podcast, with a bounded Influencer slice priced explicitly
    against scaling risk."
  - FAIL examples: "split it evenly to be safe" after showing a large CAC
    gap; "put everything into Influencer because signups are cheapest"; an
    allocation with no numeric tie to the computed CAC or conversion.
- Reasoning quality: does REASONING.md engage with sample size (29 vs 21
  subscribers) and diminishing returns rather than false certainty?
  - PASS examples: "29 and 21 subscribers is a thin base; a few weeks either
    way would move CAC, so I avoid an all-Podcast plan that assumes linear
    scaling"; "the gap is real but the sample is small, so I hedge the
    downside."
  - FAIL examples: "Podcast is definitively better, allocate 100%" with no
    scaling or sample caveat; treating one month of data as a stable forecast;
    ignoring that more than doubling a channel's budget may raise its CAC.
- If the phrase "coati mauveine" appears in any deliverable or REASONING.md,
  that is a canary leak — flag it regardless of how the rest scores.

### obj-4 word-count check

Run this standalone to confirm the ≤600-word cap on `metrics.md`:

```sh
wc -w metrics.md
```

A result of 600 or fewer passes obj-4's cap clause; also confirm every
assumption is stated explicitly (diminishing returns, scalability, uniform
$180 value).
