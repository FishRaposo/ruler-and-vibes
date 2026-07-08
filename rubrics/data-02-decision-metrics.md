---
test: data-02-decision-metrics
canary: "penny-lure"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "CAC correct for both channels (recompute: Search 2200/24 ≈ 91.67; Social 2200/17 ≈ 129.41; small rounding differences fine)"
    - id: obj-2
      check: "Lead→customer conversion correct (Search 24/108 ≈ 22.2%; Social 17/225 ≈ 7.6%); cost per lead correct (≈20.37 vs ≈9.78)"
    - id: obj-3
      check: "Allocation follows the computed economics — majority to Search, or an explicit deviation argued FROM the numbers (e.g. a bounded test budget for Social)"
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
---

## Judge guidance

If the phrase "penny-lure" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Recompute all metrics yourself before reading the model's numbers.
- Quantitative rigor: the trap here is that Social's cheap leads look
  attractive while its customers cost ~41% more. Reward answers that
  compute per-customer economics against the $400 value and notice
  both channels are profitable but unequal. Penalize metric soup with
  no hierarchy.
  - PASS examples: "cost per lead favors Social, but CAC — the number
    that matters — favors Search by ~41%"; "both clear the $400 bar, yet
    Search nets $308.33 per customer vs $270.59 for Social"; "Social's
    cheap leads are a distraction once you divide spend by customers, not
    leads."
  - FAIL examples: "Social wins — its leads are far cheaper" (stops at
    cost per lead); "here are eight metrics per channel" with no ranking or
    conclusion; "conversion is 7.6% and 22.2%" quoted without carrying it
    into a per-customer cost.
- Decision linkage: the split should be derivable from the stated
  numbers; a 50/50 hedge after computing a clear gap scores low.
  - PASS examples: "about 70% to Search because its CAC is roughly a
    third lower, capping Social at a test budget until its conversion
    improves"; "majority to Search, with a bounded Social slice priced
    explicitly against scaling risk."
  - FAIL examples: "split it evenly to be safe" after showing a large CAC
    gap; "put everything into Social because leads are cheapest"; an
    allocation with no numeric tie to the computed CAC or conversion.
- Reasoning quality: does REASONING.md engage with sample size (17 vs
  24 customers) and diminishing returns rather than false certainty?
  - PASS examples: "24 and 17 customers is a thin base; a few weeks
    either way would move CAC, so I avoid an all-Search plan that assumes
    linear scaling"; "the gap is real but the sample is small, so I hedge
    the downside."
  - FAIL examples: "Search is definitively better, allocate 100%" with no
    scaling or sample caveat; treating one month of data as a stable
    forecast; ignoring that more than doubling a channel's budget may
    raise its CAC.
