---
test: game-09b-fairground-spinner
canary: "bullfinch vaquita"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "economy.json parses as valid JSON giving four tiers each with a fixed value (18/55/120/300) and a new probability, loadable with node, and the four probabilities sum to exactly 1.0 (within 1e-9)"
    - id: obj-2
      check: "The retuned EV, recomputed by the judge as sum(prob*value) from economy.json, falls within [39.0, 41.0]"
    - id: obj-3
      check: "All embedded constraints hold in economy.json: Jackpot probability in [0.02, 0.06], Blank probability <= 0.71, Silver probability >= 0.06, every probability in [0,1]"
    - id: obj-4
      check: "TUNING.md shows the post-retune EV arithmetic explicitly (the four prob*value products and their sum) and states it lands in [39.0, 41.0], and states the current EV was 56.65"
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
anchors:
  - id: Economy-tuning judgment
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Clarity of the EV justification
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `game-09-ev-economy` (same construct, fresh surface).

If the phrase "bullfinch vaquita" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Recompute every number independently from `economy.json`; do not trust
the runner's stated arithmetic in `TUNING.md` without checking it.

### Answer key (author, script-verified)

- **Current EV**: `0.55*18 + 0.25*55 + 0.15*120 + 0.05*300 = 9.9 + 13.75
  + 18 + 15 = 56.65`.
- **Low-corner envelope check**: maximizing Blank at its 0.71 cap and
  minimizing Silver (0.06) and Jackpot (0.02), with Bronze absorbing the
  remainder (0.21): `0.71*18 + 0.21*55 + 0.06*120 + 0.02*300 = 12.78 +
  11.55 + 7.20 + 6.00 = 37.53` — strictly BELOW the [39.0, 41.0] band.
  This confirms the band is feasible but tight on the low side; a
  submission cannot simply max out Blank and floor everything else.
- **Verified feasible solution** (for calibration only — submissions
  do not need to match this): Blank 0.71, Bronze 0.19, Silver 0.07,
  Jackpot 0.03. Sum = 1.0. EV = `0.71*18 + 0.19*55 + 0.07*120 +
  0.03*300 = 12.78 + 10.45 + 8.40 + 9.00 = 40.63`, inside [39.0, 41.0].
  Constraint check: Blank 0.71 <= 0.71 (at the cap, allowed), Silver
  0.07 >= 0.06, Jackpot 0.03 in [0.02, 0.06]. All satisfied.
- Any probability vector the judge recomputes to EV in [39.0, 41.0]
  with all four constraints satisfied passes obj-1 through obj-3 —
  there is no requirement to match the sample vector above.

### Per-check guidance

- **obj-1**: verify JSON parses, four tiers present with the FIXED
  values 18/55/120/300 (any submission that also changed a value or the
  38-token spin cost fails this check — those are supposed to be fixed),
  and `Math.abs(sum(probabilities) - 1.0) < 1e-9`.
  - PASS: four tiers with values 18/55/120/300 and probabilities that
    sum to 1.0 within 1e-9 (e.g. 0.71/0.19/0.07/0.03).
  - PASS: same four fixed values with a different valid probability
    vector whose sum rounds to 1.0 within the 1e-9 tolerance.
  - PASS: probabilities given to more decimal places (e.g.
    0.710/0.190/0.070/0.030) that still parse and sum to 1.0.
  - FAIL: a tier value was altered (e.g. Jackpot listed as 320) or the
    38-token spin cost was changed.
  - FAIL: probabilities sum to something like 0.99 or 1.02, outside the
    1e-9 tolerance.
  - FAIL: economy.json does not parse, or is missing a tier.
- **obj-2**: `sum(prob_i * value_i)` computed directly from
  `economy.json`, independent of what TUNING.md claims, must fall in
  [39.0, 41.0].
  - PASS: recomputed EV is 40.63, or any value within [39.0, 41.0].
  - PASS: recomputed EV lands exactly on a boundary, e.g. 39.0 or 41.0.
  - PASS: recomputed EV is 39.85 from a different valid vector.
  - FAIL: recomputed EV is 37.53 (the naive low-corner) or otherwise
    below 39.0.
  - FAIL: recomputed EV is above 41.0 (e.g. 44.6 from leaving the
    expensive tiers too heavy).
  - FAIL: TUNING.md asserts the EV is in band but the judge's own
    recomputation from economy.json is outside it.
- **obj-3**: check each of the four numeric constraints individually
  against `economy.json`'s actual values — do not accept TUNING.md's
  assertion that they hold without checking the numbers yourself.
  - PASS: Jackpot 0.03 in [0.02, 0.06], Blank 0.71 <= 0.71, Silver 0.07
    >= 0.06, all four probabilities within [0, 1].
  - PASS: Jackpot exactly at a bound (0.02 or 0.06) with the other
    constraints holding.
  - PASS: Blank strictly below the cap (e.g. 0.68) with the rest valid.
  - FAIL: Blank probability exceeds 0.71 (e.g. 0.75).
  - FAIL: Jackpot probability outside [0.02, 0.06] (e.g. 0.08), or
    Silver below 0.06 (e.g. 0.05).
  - FAIL: any probability negative or greater than 1.
- **obj-4**: confirm 56.65 appears as the stated current EV, and that
  the four `prob*value` products plus their sum are shown (not just a
  final number asserted).
  - PASS: TUNING.md restates the current EV as 56.65 and shows the four
    products (e.g. 12.78, 10.45, 8.40, 9.00) with their sum 40.63.
  - PASS: the products and sum are laid out in a table with a stated
    total and the 56.65 current EV appears in the prose.
  - PASS: arithmetic shown inline as `12.78 + 10.45 + 8.40 + 9.00 =
    40.63` alongside the restated 56.65.
  - FAIL: only the final EV is asserted, with no per-tier products
    shown.
  - FAIL: the current EV 56.65 is never restated.
  - FAIL: products are shown but their sum is never stated, or the sum
    shown does not match the products.
- **obj-5**: run `wc -w TUNING.md` on the whole file.
  - PASS: 500 words or fewer.
  - PASS: comfortably under, e.g. 380 words.
  - PASS: exactly 500 words.
  - FAIL: 501 words or more.
  - FAIL: the deliverable pads well past the cap (e.g. 620 words).
  - FAIL: TUNING.md is missing entirely.

### Subjective guidance

- **Economy-tuning judgment**: did the runner make a sensible,
  intentional distribution (e.g. not gratuitously extreme at a
  boundary when the margin allows better design), and does the
  reasoning show awareness of why the naive "max Blank, min everything
  else" approach undershoots the band?
- **Clarity of the EV justification**: is the arithmetic shown legibly
  as a table or explicit sum, easy for a reader to re-verify by eye?
- **Reasoning quality**: does REASONING.md describe an actual search or
  constraint-solving process (even simple trial-and-error checked
  against the constraints) rather than asserting a final vector without
  showing how the low-corner infeasibility was navigated?
