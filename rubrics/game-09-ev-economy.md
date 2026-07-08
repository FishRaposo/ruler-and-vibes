---
test: game-09-ev-economy
canary: "sorrel ferry"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "economy.json parses as valid JSON giving four tiers each with a fixed value (20/60/150/600) and a new probability, loadable with node, and the four probabilities sum to exactly 1.0 (within 1e-9)"
    - id: obj-2
      check: "The retuned EV, recomputed by the judge as sum(prob*value) from economy.json, falls within [49.0, 51.0]"
    - id: obj-3
      check: "All embedded constraints hold in economy.json: Legend probability in [0.02, 0.05], Common probability <= 0.70, Epic probability >= 0.05, every probability in [0,1]"
    - id: obj-4
      check: "TUNING.md shows the post-retune EV arithmetic explicitly (the four prob*value products and their sum) and states it lands in [49.0, 51.0], and states the current EV was 80.5"
    - id: obj-5
      check: "TUNING.md is at most 500 words (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Economy-tuning judgment"
      weight: 0.4
    - id: sub-craft
      name: "Clarity of the EV justification"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "sorrel ferry" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Recompute every number independently from `economy.json`; do not trust
the runner's stated arithmetic in `TUNING.md` without checking it.

### Answer key (author, script-verified)

- **Current EV**: `0.50*20 + 0.30*60 + 0.15*150 + 0.05*600 = 10 + 18 +
  22.5 + 30 = 80.5`.
- **Low-corner envelope check**: maximizing Common at its 0.70 cap and
  minimizing Epic (0.05) and Legend (0.02), with Rare absorbing the
  remainder (0.23): `0.70*20 + 0.23*60 + 0.05*150 + 0.02*600 = 14 +
  13.8 + 7.5 + 12 = 47.30` — strictly BELOW the [49.0, 51.0] band.
  This confirms the band is feasible but tight on the low side; a
  submission cannot simply max out Common and floor everything else.
- **Verified feasible solution** (for calibration only — submissions
  do not need to match this): Common 0.70, Rare 0.22, Epic 0.055,
  Legend 0.025. Sum = 1.0. EV = `0.70*20 + 0.22*60 + 0.055*150 +
  0.025*600 = 14 + 13.2 + 8.25 + 15.0 = 50.45`, inside [49.0, 51.0].
  Constraint check: Common 0.70 <= 0.70 (at the cap, allowed), Epic
  0.055 >= 0.05, Legend 0.025 in [0.02, 0.05]. All satisfied.
- Any probability vector the judge recomputes to EV in [49.0, 51.0]
  with all four constraints satisfied passes obj-1 through obj-3 —
  there is no requirement to match the sample vector above.

### Per-check guidance

- **obj-1**: verify JSON parses, four tiers present with the FIXED
  values 20/60/150/600 (any submission that also changed a value or
  the 50-gold cost fails this check — those are supposed to be fixed),
  and `Math.abs(sum(probabilities) - 1.0) < 1e-9`.
- **obj-2**: `sum(prob_i * value_i)` computed directly from
  `economy.json`, independent of what TUNING.md claims, must fall in
  [49.0, 51.0].
- **obj-3**: check each of the four numeric constraints individually
  against `economy.json`'s actual values — do not accept TUNING.md's
  assertion that they hold without checking the numbers yourself.
- **obj-4**: confirm 80.5 appears as the stated current EV, and that
  the four `prob*value` products plus their sum are shown (not just a
  final number asserted).
  - PASS: TUNING.md restates the current EV as 80.5 and shows the four
    products (e.g. 14, 13.2, 8.25, 15.0) with their sum 50.45.
  - PASS: the products and sum are laid out in a table with a stated
    total and the 80.5 current EV appears in the prose.
  - PASS: arithmetic shown inline as `14 + 13.2 + 8.25 + 15.0 = 50.45`
    alongside the restated 80.5.
  - FAIL: only the final EV is asserted, with no per-tier products
    shown.
  - FAIL: the current EV 80.5 is never restated.
  - FAIL: products are shown but their sum is never stated, or the sum
    shown does not match the products.
- **obj-5**: run `wc -w TUNING.md` on the whole file.

### Subjective guidance

- **Economy-tuning judgment**: did the runner make a sensible,
  intentional distribution (e.g. not gratuitously extreme at a
  boundary when the margin allows better design), and does the
  reasoning show awareness of why the naive "max Common, min
  everything else" approach undershoots the band?
- **Clarity of the EV justification**: is the arithmetic shown legibly
  as a table or explicit sum, easy for a reader to re-verify by eye?
- **Reasoning quality**: does REASONING.md describe an actual search or
  constraint-solving process (even simple trial-and-error checked
  against the constraints) rather than asserting a final vector without
  showing how the low-corner infeasibility was navigated?
