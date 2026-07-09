---
test: cplx-01-loop-triangular
canary: "cicada beetle"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "`node instrumented.js` runs without throwing and prints exactly 5 lines in the exact form 'n=<n> steps=<count>' for n=1,5,10,50,100 in that order"
    - id: obj-2
      check: "The 5 printed step counts equal the answer key 1, 15, 55, 1275, 5050 respectively (judge recomputes n(n+1)/2 independently; a model that instruments n^2 instead prints 1, 25, 100, 2500, 10000 and fails)"
    - id: obj-3
      check: "`module.exports.stepCost(20)` returns 210 via `node -e` (judge-chosen unlisted value; catches implementations that hardcode the 5 printed cases instead of computing generally)"
    - id: obj-4
      check: "ANALYSIS.md states the exact closed form n(n+1)/2 (or the algebraically equal n^2/2 + n/2) AND the asymptotic class Theta(n^2); naming only Theta(n^2) without the exact triangular formula fails this check"
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
anchors:
  - id: Analytical precision
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Instrumentation clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "cicada beetle" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Reference answer key, recomputed independently by running the
  pinned `stepCost(n)` (outer `i` from 1 to `n`, inner `j` from `i` to
  `n`, one increment per innermost-body execution):

  ```
  n=1 steps=1
  n=5 steps=15
  n=10 steps=55
  n=50 steps=1275
  n=100 steps=5050
  ```

  Closed form: `n(n+1)/2` (the triangular numbers). Verified by
  direct execution: `n(n+1)/2` for n=1,5,10,50,100 gives exactly
  1, 15, 55, 1275, 5050. Unlisted probe: `stepCost(20)` must return
  `210` (= 20*21/2).
- Collision check for graders: the naive-but-plausible wrong answer
  set that comes from assuming a full `n^2` grid (inner loop from 1 to
  `n` instead of from `i` to `n`) is `{1, 25, 100, 2500, 10000}` — this
  is disjoint from the correct set `{1, 15, 55, 1275, 5050}` at every
  pinned n except n=1 (both give 1, since the triangular and square
  numbers coincide there); use n=5 or later to discriminate, since a
  wrong implementation prints `25` there, not `15`.
- Verify obj-3 directly, e.g.:
  `node -e "console.log(require('./instrumented.js').stepCost(20))"`
  must print `210`. A model that hardcodes a lookup table for the 5
  pinned inputs and falls through to `n*n/2`-only or throws for other
  inputs fails this check.
- Verify obj-4 by reading ANALYSIS.md text directly — this is a prose
  check with two independent requirements (exact formula AND Theta
  class), both must be present.
  - PASS phrasing examples: "The exact step count is n(n+1)/2, which
    is Theta(n^2)."; "steps(n) = n²/2 + n/2 exactly, growth class
    Θ(n²)."
  - FAIL phrasing examples: "This is Θ(n²)." (no exact closed form
    given — only the asymptotic class); "The function does roughly n²
    work since it's a nested loop." (asymptotic claim only, no closed
    form, and "roughly" signals the model never derived the exact
    count); also FAIL: "steps(n) = n²" (states a closed form, but the
    wrong one — this is the naive trap value, not the triangular
    count, so it fails even though a formula is present).
- Analytical precision: does the model correctly identify that the
  inner loop starts at `i` (not 1), correctly derive the triangular
  sum, and correctly connect it to Theta(n^2)? Penalize an answer that
  gets the Theta class right "by luck" while stating the wrong exact
  formula, or vice versa.
- Instrumentation clarity: reward code that mirrors the pinned
  function's structure exactly (transparent one-to-one instrumentation
  of the given loops) over a rewritten/optimized version that happens
  to produce the same counts through a different, harder-to-audit
  mechanism.
- Reasoning quality: does the analysis explain the derivation
  mechanically (e.g. "for each i, the inner loop runs n-i+1 times;
  summing over i from 1 to n gives n(n+1)/2") rather than asserting
  the formula without connecting it to the loop bounds?
