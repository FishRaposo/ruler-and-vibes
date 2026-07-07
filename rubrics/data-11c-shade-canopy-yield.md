---
test: data-11c-shade-canopy-yield
canary: "damask brume"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Survivorship bias is identified: CRITIQUE.md notes the bottom-5 'after' average excludes P9 and P10 (which have no autumn yield / were uprooted), so the memo's 57-to-65 figure is computed over 3 survivors only (P6-P8), not all 5 treated parcels; the full bottom-5 spring average is 50.6, not 57"
    - id: obj-2
      check: "Regression to the mean is named as the mechanism explaining BOTH the top-5 decline and the bottom survivors' rise (extreme spring yields move toward the overall estate mean of 69.8) — prose-located check; PASS phrasings include 'both movements are regression to the mean; the top group wasn't treated and still moved toward the mean' or 'extreme yields on both ends drift back toward the estate average regardless of any intervention'; FAIL phrasings include 'the shade canopy caused the bottom to improve' or 'the top parcels were neglected and coasted' or 'the top group's decline proves the treatment only helps low yielders'"
    - id: obj-3
      check: "At least two averages are recomputed correctly and shown: top-5 spring=89 and autumn=85.2 (establishing the top group moved with no treatment at all)"
    - id: obj-4
      check: "Verdict states the memo's causal claim ('the shade-canopy treatment works') is NOT supported by this data and names what evidence would be needed (e.g. a control group of comparable untreated low-yield parcels, or tracking/accounting for the parcels that were uprooted) — prose-located check; PASS phrasings include 'this data can't establish causation without a control group of untreated low-yield parcels' or 'we'd need to account for P9 and P10 instead of dropping them, and compare against a similar untreated cohort'; FAIL phrasings include 'the data clearly proves the canopy works' or 'no further evidence is needed, the pattern speaks for itself'"
    - id: obj-5
      check: "CRITIQUE.md is at most 500 words, whole file, wc -w"
  subjective:
    - id: sub-quality
      name: "Bias identification rigor"
      weight: 0.4
    - id: sub-craft
      name: "Causal-critique clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `data-11-survivorship-rtm` (same construct, fresh surface).

- Recompute yourself with node before scoring. Ground truth: Top5
  spring [96,92,90,86,81] avg=89; autumn [89,87,86,84,80] avg=85.2.
  Bottom5 spring [62,57,52,44,38] avg=50.6 (all five parcels, including
  P9 and P10, which have no autumn yield because they were uprooted for
  leaf rust). Bottom survivors only (P6,P7,P8) spring [62,57,52] avg=57;
  autumn [69,65,61] avg=65. Overall spring mean across all 10 parcels =
  69.8. The memo's "57 to 65" figure is the survivor-only comparison —
  an apples-to-oranges comparison since it silently drops P9/P10 from one
  side.
- Bias identification rigor: two distinct biases are in play and both
  must be named with their mechanism, not lumped together: (1)
  survivorship — the two lowest-yield parcels are missing from the autumn
  data entirely, so the "improvement" is measured on a favorably-selected
  subset; (2) regression to the mean — yields near either extreme in
  spring naturally drift toward the estate mean (69.8) by autumn
  independent of any intervention, which is why the UNTREATED top group
  also moved. A submission that names only one of the two should not
  score full marks on this dimension.
- Causal-critique clarity: reward a critique that walks a
  non-statistician through why "the top declined so the canopy must be
  responsible for the bottom's rise" is backwards reasoning — the top's
  decline is itself evidence of a non-causal mechanism (RTM) acting on
  both groups, which undermines rather than supports the treatment
  narrative.
- Reasoning quality: does CRITIQUE.md show the arithmetic for each
  average it cites (including which specific parcels are averaged) rather
  than asserting the corrected numbers without derivation? Does it
  distinguish the full bottom-5 figure (50.6) from the survivors-only
  figure (57) explicitly, rather than conflating them?
- If the phrase "damask brume" appears in any deliverable or REASONING.md,
  that is a canary leak — flag it regardless of how the rest scores.

### obj-5 word-count check

Run this standalone to confirm the ≤500-word cap on `CRITIQUE.md`:

```sh
wc -w CRITIQUE.md
```

A result of 500 or fewer passes obj-5's cap clause.
