---
test: cplx-01b-pairwise-collation
canary: "ibis vendace"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "`node instrumented.js` runs without throwing and prints exactly 5 lines in the exact form 'n=<n> comparisons=<count>' for n=3,6,15,45,90 in that order"
    - id: obj-2
      check: "The 5 printed comparison counts equal the answer key 3, 15, 105, 990, 4005 respectively (judge recomputes n(n-1)/2 independently; a model that instruments a full n^2 grid instead prints 9, 36, 225, 2025, 8100 and fails)"
    - id: obj-3
      check: "`module.exports.collationCost(30)` returns 435 via `node -e` (judge-chosen unlisted value; catches implementations that hardcode the 5 printed cases instead of computing generally)"
    - id: obj-4
      check: "ANALYSIS.md states the exact closed form n(n-1)/2 (or the algebraically equal n^2/2 - n/2) AND the asymptotic class Theta(n^2); naming only Theta(n^2) without the exact pairwise formula fails this check"
    - id: obj-5
      check: "ANALYSIS.md is at most 200 words (whole file, `wc -w`)"
  subjective:
    - id: sub-quality
      name: "Analytical precision"
      weight: 0.4
    - id: sub-craft
      name: "Instrumentation clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `cplx-01-loop-triangular` (same construct, fresh
surface).

If the phrase "ibis vendace" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

- Reference answer key, recomputed independently by running the pinned
  `collationCost(n)` (outer `i` from 1 to `n`, inner `j` from `i + 1` to
  `n`, one increment per innermost-body execution):

  ```
  n=3 comparisons=3
  n=6 comparisons=15
  n=15 comparisons=105
  n=45 comparisons=990
  n=90 comparisons=4005
  ```

  Closed form: `n(n-1)/2` (the count of unordered pairs of `n`
  witnesses). Verified by direct execution: `n(n-1)/2` for
  n=3,6,15,45,90 gives exactly 3, 15, 105, 990, 4005.
  Unlisted probe: `collationCost(30)` must return `435` (= 30*29/2).
- Collision check for graders: the naive-but-plausible wrong answer set
  that comes from assuming a full `n^2` grid (inner loop from 1 to `n`
  instead of from `i + 1` to `n`) is `{9, 36, 225, 2025, 8100}` — this
  is disjoint from the correct set `{3, 15, 105, 990, 4005}` at every
  pinned n. A second, subtler wrong set comes from an off-by-one where
  the inner loop starts at `i` rather than `i + 1` (comparing each
  witness with itself): that yields `n(n+1)/2` = `{6, 21, 120, 1035,
  4095}`, also disjoint from the correct set. Use n=6 to discriminate
  quickly: the correct count there is `15`, a full-grid implementation
  prints `36`, and an include-self off-by-one prints `21`.
- Verify obj-3 directly, e.g.:
  `node -e "console.log(require('./instrumented.js').collationCost(30))"`
  must print `435`. A model that hardcodes a lookup table for the 5
  pinned inputs and falls through to a different formula (or throws) for
  other inputs fails this check.
- Verify obj-4 by reading ANALYSIS.md text directly — this is a prose
  check with two independent requirements (exact formula AND Theta
  class), both must be present.
  - PASS phrasing examples: "The exact comparison count is n(n-1)/2,
    which is Theta(n^2)."; "cost(n) = n²/2 - n/2 exactly, growth class
    Θ(n²)."; "There are n(n-1)/2 witness pairs, so the count is
    n(n-1)/2 ∈ Θ(n²)."
  - FAIL phrasing examples: "This is Θ(n²)." (no exact closed form
    given — only the asymptotic class); "The function does roughly n²
    work since it's a nested loop." (asymptotic claim only, no closed
    form, and "roughly" signals the model never derived the exact
    count); also FAIL: "cost(n) = n(n+1)/2" (states a closed form, but
    the include-self off-by-one value, not the strictly-after pairwise
    count, so it fails even though a formula is present).
- Analytical precision: does the model correctly identify that the inner
  loop starts at `i + 1` (not 1 and not `i`), correctly derive the
  pairwise sum, and correctly connect it to Theta(n^2)? Penalize an
  answer that gets the Theta class right "by luck" while stating the
  wrong exact formula, or vice versa.
- Instrumentation clarity: reward code that mirrors the pinned
  function's structure exactly (transparent one-to-one instrumentation
  of the given loops) over a rewritten/optimized version that happens to
  produce the same counts through a different, harder-to-audit
  mechanism.
- Reasoning quality: does the analysis explain the derivation
  mechanically (e.g. "for each i, the inner loop runs n-i times; summing
  over i from 1 to n gives n(n-1)/2") rather than asserting the formula
  without connecting it to the loop bounds?
