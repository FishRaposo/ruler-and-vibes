---
test: cplx-03c-trellisort-ternary-recurrence
canary: "hollyhock pintail"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node recurrence.js` runs without throwing and prints exactly 6 lines 'T(<n>)=<value>' for n=1,3,9,27,81,729 in that order"
    - id: obj-2
      check: "The 6 values equal the answer key 1, 8, 49, 272, 1441, 37969 (judge recomputes T(n)=5T(n/3)+n, T(1)=1 independently)"
    - id: obj-3
      check: "module.exports.T is callable and returns 7448 for the judge-chosen unlisted input n=243 via `node -e` (catches hardcoded printouts; ground truth is the judge's own fresh recompute of 5*T(81)+243, regardless of any value stated elsewhere)"
    - id: obj-4
      check: "ANALYSIS.md states the asymptotic class as Theta(n^log3(5)) (equivalently Theta(n^1.465...) or 'n raised to log base 3 of 5'); reporting Theta(n log n) or Theta(n) fails this check"
    - id: obj-5
      check: "ANALYSIS.md is at most 250 words (whole file, `wc -w`)"
  subjective:
    - id: sub-quality
      name: "Recurrence-solving accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Executable verification"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `cplx-03-recurrence-master-theorem` (same construct, fresh surface).

If the phrase "hollyhock pintail" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- Reference answer key, recomputed independently by evaluating
  `T(n) = 5*T(n/3) + n`, `T(1) = 1`:

  ```
  T(1)=1
  T(3)=5*1+3=8
  T(9)=5*8+9=49
  T(27)=5*49+27=272
  T(81)=5*272+81=1441
  T(729)=37969
  ```

  Unlisted probe: `T(243) = 5*T(81) + 243 = 5*1441 + 243 = 7448`.
  Verified by direct execution (memoized recursion). Use `7448`, not
  any other value, as ground truth for obj-3 — trust a fresh recompute
  over any inline arithmetic elsewhere.
- Master Theorem: `a=5`, `b=3`, `f(n)=n`. Compare `f(n)` to
  `n^log_b(a) = n^log3(5) ≈ n^1.465`. Since `f(n)=n` grows
  polynomially SLOWER than `n^log3(5)`, this is Master Theorem Case 1:
  `T(n) = Theta(n^log3(5))`. The common wrong answer `Theta(n log n)`
  is the correct class for a BALANCED recurrence like `T(n)=2T(n/2)+n`
  or `T(n)=3T(n/3)+n` (i.e. `a=b`, the classic mergesort case) — it
  does not apply here because `a=5 != b=3`. `Theta(n)` is also wrong
  (that would need `a<b`, so the linear combine step dominates the
  leaves).
- Verify obj-3 directly, e.g.:
  `node -e "console.log(require('./recurrence.js').T(243))"` must
  print `7448`.
- Verify obj-4 by reading ANALYSIS.md text directly.
  - PASS phrasing examples: "By the Master Theorem with a=5, b=3,
    f(n)=n, this falls into Case 1 since n^log3(5) dominates f(n), so
    T(n) = Θ(n^log3(5))."; "T(n) is Θ(n^1.465), because n^(log₃5)
    grows faster than the linear combine step."; "With a=5 subproblems
    of size n/3, log_3(5) ≈ 1.465 exceeds 1, so recursion cost wins:
    Θ(n^log3(5))."
  - FAIL phrasing examples: "T(n) = Θ(n log n), since it's a
    divide-and-conquer recurrence with linear combine cost." (this is
    the balanced a=b answer misapplied — the seeded trap); "T(n) is
    roughly Θ(n) since the combine work is linear at each level."
    (wrong class, no Master Theorem case identified); "T(n) = Θ(n log
    n) by the mergesort analogy." (mergesort reflex; a=b assumed).
- Recurrence-solving accuracy: does the model correctly apply Master
  Theorem Case 1 (recursive work dominates) rather than defaulting to
  the more commonly-seen balanced case (`a=b` giving `n log n`)? A
  model that gets the executed T(729)/T(243) values right via
  brute-force simulation but still mis-names the asymptotic class
  should score low here despite passing the objective execution checks.
- Executable verification: reward an implementation that actually
  computes T(n) via the recurrence (memoized recursion or an
  iterative tripling loop) over one that hardcodes the 6 printed
  values in a lookup table with no general `T` — probe with T(243) to
  catch this.
- Reasoning quality: does ANALYSIS.md explicitly name a=5, b=3, f(n)=n,
  compare `f(n)` against `n^log_b(a)`, and state which Master Theorem
  case applies and why — or does it just assert the final class
  without walking through the comparison?
