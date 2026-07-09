---
test: game-09c-canister-payout
canary: "hawfinch dugong"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "economy.json parses as valid JSON giving four grades each with a fixed value (24/88/220/960) and a new probability, loadable with node, and the four probabilities sum to exactly 1.0 (within 1e-9)"
    - id: obj-2
      check: "The retuned EV, recomputed by the judge as sum(prob*value) from economy.json, falls within [79.0, 81.0]"
    - id: obj-3
      check: "All embedded constraints hold in economy.json: Relic probability in [0.03, 0.06], Scrap probability <= 0.70, Crystal probability >= 0.06, every probability in [0,1]"
    - id: obj-4
      check: "TUNING.md shows the post-retune EV arithmetic explicitly (the four prob*value products and their sum) and states it lands in [79.0, 81.0], and states the current EV was 107.68"
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

If the phrase "hawfinch dugong" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

Recompute every number independently from `economy.json`; do not trust
the runner's stated arithmetic in `TUNING.md` without checking it.

### Answer key (author, script-verified)

- **Current EV**: `0.58*24 + 0.27*88 + 0.10*220 + 0.05*960 = 13.92 +
  23.76 + 22.00 + 48.00 = 107.68`.
- **Low-corner envelope check**: maximizing Scrap at its 0.70 cap and
  minimizing Crystal (0.06) and Relic (0.03), with Alloy absorbing the
  remainder (0.21): `0.70*24 + 0.21*88 + 0.06*220 + 0.03*960 = 16.8 +
  18.48 + 13.2 + 28.8 = 77.28` — strictly BELOW the [79.0, 81.0] band.
  This confirms the band is feasible but tight on the low side; a
  submission cannot simply max out Scrap and floor everything else. It
  must back the cheap grade off its cap (or lift a grade off its floor)
  to climb into the band.
- **Verified feasible solution** (for calibration only — submissions do
  not need to match this): Scrap 0.67, Alloy 0.23, Crystal 0.07, Relic
  0.03. Sum = 1.0. EV = `0.67*24 + 0.23*88 + 0.07*220 + 0.03*960 =
  16.08 + 20.24 + 15.40 + 28.80 = 80.52`, inside [79.0, 81.0].
  Constraint check: Scrap 0.67 <= 0.70, Crystal 0.07 >= 0.06, Relic
  0.03 in [0.03, 0.06]. All satisfied.
- Any probability vector the judge recomputes to EV in [79.0, 81.0]
  with all four constraints satisfied passes obj-1 through obj-3 — there
  is no requirement to match the sample vector above.

### Per-check guidance

- **obj-1**: verify JSON parses, four grades present with the FIXED
  values 24/88/220/960 (any submission that also changed a value or the
  80-credit price fails this check — those are supposed to be fixed),
  and `Math.abs(sum(probabilities) - 1.0) < 1e-9`.
  - PASS: four grades, values exactly 24/88/220/960, probabilities sum
    to 1.0 within 1e-9.
  - PASS: probabilities given as 0.67/0.23/0.07/0.03 summing to 1.0 with
    the fixed values intact.
  - PASS: a different valid vector (e.g. 0.66/0.25/0.06/0.03) with all
    four fixed values present and sum 1.0.
  - FAIL: a grade's value was changed (e.g. Crystal listed as 200) even
    if probabilities sum to 1.0.
  - FAIL: only three grades present, or the 80-credit price was altered
    into the table.
  - FAIL: probabilities sum to 0.99 or 1.02 (outside 1e-9 of 1.0).
- **obj-2**: `sum(prob_i * value_i)` computed directly from
  `economy.json`, independent of what TUNING.md claims, must fall in
  [79.0, 81.0].
  - PASS: recomputed EV is 80.52 and lands in the band.
  - PASS: recomputed EV is 79.20 (at the low interior of the band).
  - PASS: recomputed EV is 80.99, still inside the band.
  - FAIL: recomputed EV is 77.28 (the naive low-corner, below the band).
  - FAIL: recomputed EV is 78.9, just under the 79.0 floor.
  - FAIL: recomputed EV is 82.0, above the 81.0 ceiling.
- **obj-3**: check each of the four numeric constraints individually
  against `economy.json`'s actual values — do not accept TUNING.md's
  assertion that they hold without checking the numbers yourself.
  - PASS: Relic 0.04, Scrap 0.66, Crystal 0.06, all probabilities in
    [0,1].
  - PASS: Relic 0.03 (at its floor) with Scrap 0.67 and Crystal 0.07.
  - PASS: Scrap exactly at 0.70 with Relic and Crystal within their
    bounds.
  - FAIL: Relic 0.08 (above the 0.06 cap).
  - FAIL: Scrap 0.72 (above the 0.70 cap).
  - FAIL: Crystal 0.04 (below the 0.06 floor), or a negative probability
    anywhere.
- **obj-4**: confirm 107.68 appears as the stated current EV, and that
  the four `prob*value` products plus their sum are shown (not just a
  final number asserted).
  - PASS: TUNING.md restates 107.68 as the current EV and lists all four
    products (e.g. 16.08 / 20.24 / 15.40 / 28.80) with their sum 80.52.
  - PASS: the current EV 107.68 is shown and a table gives each
    prob*value product and the total, stated to be in [79.0, 81.0].
  - PASS: the four products are written as an explicit summed expression
    plus a sentence that the result lands in the band.
  - FAIL: only the final retuned EV is asserted with no per-grade
    products shown.
  - FAIL: the current EV 107.68 is never stated.
  - FAIL: products are shown but their sum is never given, or the band
    membership is never claimed.
- **obj-5**: run `wc -w TUNING.md` on the whole file.
  - PASS: word count is 304.
  - PASS: word count is 480 (under the 500 cap).
  - FAIL: word count is 512 (over the 500 cap).

### Subjective guidance

- **Economy-tuning judgment**: did the runner make a sensible,
  intentional distribution (e.g. not gratuitously extreme at a boundary
  when the margin allows better design), and does the reasoning show
  awareness of why the naive "max Scrap, min everything else" approach
  undershoots the band?
- **Clarity of the EV justification**: is the arithmetic shown legibly
  as a table or explicit sum, easy for a reader to re-verify by eye?
- **Reasoning quality**: does REASONING.md describe an actual search or
  constraint-solving process (even simple trial-and-error checked
  against the constraints) rather than asserting a final vector without
  showing how the low-corner infeasibility was navigated?
