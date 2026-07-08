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
      check: "`node recurrence.js` runs without throwing and prints exactly 6 lines 'T(<n>)=<value>' for n=1,4,16,64,256,1024 in that order"
    - id: obj-2
      check: "The 6 values equal the answer key 1, 11, 93, 715, 5261, 37851 (judge recomputes T(n)=7T(n/4)+n, T(1)=1 independently)"
    - id: obj-3
      check: "module.exports.T is callable and returns 269053 for the judge-chosen unlisted input n=4096 via `node -e` (catches hardcoded printouts; ground truth is the judge's own fresh recompute of 7*T(1024)+4096, regardless of any value stated elsewhere)"
    - id: obj-4
      check: "ANALYSIS.md states the asymptotic class as Theta(n^log4(7)) (equivalently Theta(n^1.404...) or 'n raised to log base 4 of 7'); reporting Theta(n log n) or Theta(n) fails this check"
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
  `T(n) = 7*T(n/4) + n`, `T(1) = 1`:

  ```
  T(1)=1
  T(4)=7*1+4=11
  T(16)=7*11+16=93
  T(64)=7*93+64=715
  T(256)=7*715+256=5261
  T(1024)=37851
  ```

  Unlisted probe: `T(4096) = 7*T(1024) + 4096 = 7*37851 + 4096 = 269053`.
  Verified by direct execution (memoized recursion). Use `269053`, not
  any other value, as ground truth for obj-3 — trust a fresh recompute
  over any inline arithmetic elsewhere.
- Master Theorem: `a=7`, `b=4`, `f(n)=n`. Compare `f(n)` to
  `n^log_b(a) = n^log4(7) ≈ n^1.404`. Since `f(n)=n` grows
  polynomially SLOWER than `n^log4(7)`, this is Master Theorem Case 1:
  `T(n) = Theta(n^log4(7))`. The common wrong answer `Theta(n log n)`
  is the correct class for a BALANCED recurrence like `T(n)=2T(n/2)+n`
  or `T(n)=4T(n/4)+n` (i.e. `a=b`, the classic mergesort case) — it
  does not apply here because `a=7 != b=4`. `Theta(n)` is also wrong
  (that would need `a<b`, so the linear combine step dominates the
  leaves).
- Verify obj-3 directly, e.g.:
  `node -e "console.log(require('./recurrence.js').T(4096))"` must
  print `269053`.
- Verify obj-4 by reading ANALYSIS.md text directly.
  - PASS phrasing examples: "By the Master Theorem with a=7, b=4,
    f(n)=n, this falls into Case 1 since n^log4(7) dominates f(n), so
    T(n) = Θ(n^log4(7))."; "T(n) is Θ(n^1.404), because n^(log₄7)
    grows faster than the linear combine step."; "With a=7 subproblems
    of size n/4, log_4(7) ≈ 1.404 exceeds 1, so recursion cost wins:
    Θ(n^log4(7))."
  - FAIL phrasing examples: "T(n) = Θ(n log n), since it's a
    divide-and-conquer recurrence with linear combine cost." (this is
    the balanced a=b answer misapplied — the seeded trap); "T(n) is
    roughly Θ(n) since the combine work is linear at each level."
    (wrong class, no Master Theorem case identified); "T(n) = Θ(n log
    n) by the mergesort analogy." (mergesort reflex; a=b assumed).
- Recurrence-solving accuracy: does the model correctly apply Master
  Theorem Case 1 (recursive work dominates) rather than defaulting to
  the more commonly-seen balanced case (`a=b` giving `n log n`)? A
  model that gets the executed T(1024)/T(4096) values right via
  brute-force simulation but still mis-names the asymptotic class
  should score low here despite passing the objective execution checks.
- Executable verification: reward an implementation that actually
  computes T(n) via the recurrence (memoized recursion or an
  iterative quadrupling loop) over one that hardcodes the 6 printed
  values in a lookup table with no general `T` — probe with T(4096) to
  catch this.
- Reasoning quality: does ANALYSIS.md explicitly name a=7, b=4, f(n)=n,
  compare `f(n)` against `n^log_b(a)`, and state which Master Theorem
  case applies and why — or does it just assert the final class
  without walking through the comparison?
