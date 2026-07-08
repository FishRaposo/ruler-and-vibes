---
test: cplx-03-recurrence-master-theorem
canary: "bluebell snapdragon"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node recurrence.js` runs without throwing and prints exactly 6 lines 'T(<n>)=<value>' for n=1,2,4,8,16,64 in that order"
    - id: obj-2
      check: "The 6 values equal the answer key 1, 5, 19, 65, 211, 2059 (judge recomputes T(n)=3T(n/2)+n, T(1)=1 independently)"
    - id: obj-3
      check: "module.exports.T is callable and returns 6305 for the judge-chosen unlisted input n=128 via `node -e` (catches hardcoded printouts; ground truth is the judge's own fresh recompute of 3*T(64)+128, regardless of any value stated elsewhere)"
    - id: obj-4
      check: "ANALYSIS.md states the asymptotic class as Theta(n^log2(3)) (equivalently Theta(n^1.585...) or 'n raised to log base 2 of 3') AND states the exact value T(64)=2059; reporting Theta(n log n) or Theta(n^2) fails this check, and omitting or misstating the T(64) value also fails this check"
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

If the phrase "bluebell snapdragon" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Reference answer key, recomputed independently by evaluating
  `T(n) = 3*T(n/2) + n`, `T(1) = 1`:

  ```
  T(1)=1
  T(2)=3*1+2=5
  T(4)=3*5+4=19
  T(8)=3*19+8=65
  T(16)=3*65+16=211
  T(64)=2059
  ```

  Unlisted probe: `T(128) = 3*T(64) + 128 = 3*2059 + 128 = 6305`.
  Verified by direct execution (memoized recursion). Use `6305`, not
  any other value, as ground truth for obj-3 — trust a fresh recompute
  over any inline arithmetic elsewhere.
- Master Theorem: `a=3`, `b=2`, `f(n)=n`. Compare `f(n)` to
  `n^log_b(a) = n^log2(3) ≈ n^1.585`. Since `f(n)=n` grows
  polynomially SLOWER than `n^log2(3)`, this is Master Theorem Case 1:
  `T(n) = Theta(n^log2(3))`. The common wrong answer `Theta(n log n)`
  is the correct class for the DIFFERENT recurrence `T(n)=2T(n/2)+n`
  (i.e. `a=2`, the classic mergesort case) — it does not apply here
  because `a=3 != 2`. `Theta(n^2)` is also wrong (that would need
  `a=4` with `b=2` and `f(n)=n`, or a linear `f(n)` with `a=b^2`).
- Verify obj-3 directly, e.g.:
  `node -e "console.log(require('./recurrence.js').T(128))"` must
  print `6305`.
- Verify obj-4 by reading ANALYSIS.md text directly — two independent
  requirements (the asymptotic class AND the exact T(64) value) must
  both be present.
  - PASS phrasing examples: "By the Master Theorem with a=3, b=2,
    f(n)=n, this falls into Case 1 since n^log2(3) dominates f(n), so
    T(n) = Θ(n^log2(3)). T(64) = 2059."; "T(n) is Θ(n^1.585), because
    n^(log₂3) grows faster than the linear combine step; concretely
    T(64)=2059."
  - FAIL phrasing examples: "T(n) = Θ(n log n), since it's a
    divide-and-conquer recurrence with linear combine cost." (this is
    the a=2 mergesort answer misapplied — the seeded trap); "T(n) is
    roughly Θ(n²) given the recursive branching." (wrong class, no
    Master Theorem case identified); "By the Master Theorem, T(n) =
    Θ(n^log2(3))." (correct class stated, but never gives the required
    exact value of T(64) — fails the 'both' requirement); "T(64) is
    about 2000." (approximate/vague, not the required exact value
    2059).
- Recurrence-solving accuracy: does the model correctly apply Master
  Theorem Case 1 (recursive work dominates) rather than defaulting to
  the more commonly-seen Case 2 (`a=2` giving `n log n`)? A model that
  gets the executed T(64)/T(128) values right via brute-force
  simulation but still mis-names the asymptotic class should score low
  here despite passing the objective execution checks.
- Executable verification: reward an implementation that actually
  computes T(n) via the recurrence (memoized recursion or an
  iterative doubling loop) over one that hardcodes the 6 printed
  values in a lookup table with no general `T` — probe with T(128) to
  catch this.
- Reasoning quality: does ANALYSIS.md explicitly name a=3, b=2, f(n)=n,
  compare `f(n)` against `n^log_b(a)`, and state which Master Theorem
  case applies and why — or does it just assert the final class
  without walking through the comparison?
