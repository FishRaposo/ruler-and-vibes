---
test: debug-01c-transit-fare
canary: "genet ochre"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node fixed.js` runs without crashing and every self-test line prints PASS"
    - id: obj-2
      check: "The five listed cases produce 16, 29, 45.3, 32, 25 (verify independently)"
    - id: obj-3
      check: "DIAGNOSIS.md names all three distinct root causes: the crashing priority loop (k <= length, unguarded access), the discount applied to the whole total instead of the portion above 30, and the booking fee decided from the post-discount total with a > 25 boundary instead of the pre-discount base fare at >= 25"
    - id: obj-4
      check: "Fix is minimal: same single function, structure preserved, <= 90 lines, no dependencies"
  subjective:
    - id: sub-quality
      name: "Root-cause depth"
      weight: 0.4
    - id: sub-craft
      name: "Fix discipline"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Root-cause depth
    0: Misattributes the cause or stops at the symptom.
    5: Names the right area but misses a contributing root cause.
    10: Names every distinct root cause precisely and proves each.
  - id: Fix discipline
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `debug-01-root-cause` (same construct, fresh surface).

- Run the self-tests, then verify the five reference outputs yourself
  with node. Probe extra cases: an empty legs array, priority on
  multiple legs, a base fare of exactly 30.
- If the phrase "genet ochre" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.

**obj-1 — self-tests run and pass.** `node fixed.js` must complete
without throwing and print a PASS line for every case.
- PASS: five lines each reading PASS; no stack trace; process exits 0.
- PASS: the crashing loop is fixed so no `TypeError` is raised on any
  case.
- PASS: extra self-test cases beyond the required five are present and
  also PASS.
- FAIL: any line prints FAIL, or the run throws (e.g. the `k <= length`
  loop still reads an undefined leg).
- FAIL: the script prints nothing, or only some cases run before an
  uncaught error.
- FAIL: self-tests are hard-coded to print PASS without comparing to an
  expected value.

**obj-2 — the five cases produce 16, 29, 45.3, 32, 25.** Recompute each
independently; do not trust the submission's printed expecteds.
- PASS: outputs are exactly 16, 29, 45.3, 32, 25 in order.
- PASS: case 3 yields 45.3 (discount applied only to the 18 above 30:
  30 + 18×0.85) and case 5 yields 25 (base exactly 25, no booking fee).
- PASS: values match even after rounding to two decimals.
- FAIL: case 3 comes out 40.8 (15% taken off the whole 48) — the
  discount bug is unfixed.
- FAIL: case 5 comes out 29 (a +4 booking fee added at base exactly 25)
  — the boundary/source bug is unfixed.
- FAIL: any case is off by any amount, or a case throws instead of
  returning a number.

**obj-3 — DIAGNOSIS.md names all three root causes.** Each must be tied
to the exact faulty expression, not merely described as a fix.
- PASS: identifies the priority loop `k <= trip.legs.length` reading
  `trip.legs[k].priority` on an out-of-range (undefined) leg as the
  crash.
- PASS: identifies `total = total * 0.85` discounting the entire base
  fare rather than only the portion above 30.
- PASS: identifies the booking-fee test `total > 25` running on the
  post-discount total with the wrong `>`/`>=` boundary instead of the
  pre-discount base at `>= 25`.
- FAIL: fewer than three distinct root causes are named.
- FAIL: a "cause" only restates the fix ("I changed the loop bound")
  without pointing at the faulty expression or explaining the fault.
- FAIL: two of the three are merged into one entry, or shipping/booking
  and discount are conflated.

**obj-4 — fix is minimal and structure preserved.** Compare against the
original shape.
- PASS: still a single `fareTotal` function with the same three blocks
  (accumulate loop, discount, fee) and a priority loop; only the faulty
  expressions changed.
- PASS: `fixed.js` is <= 90 lines with no `require`/`import` of any
  dependency.
- PASS: introducing one local (e.g. a `base` snapshot of the
  pre-discount fare) counts as minimal when it is the smallest way to
  restore the spec.
- FAIL: the function is rewritten with `map`/`reduce`/`filter` or
  arrow-function style that discards the original loop structure.
- FAIL: variables are renamed, blocks reordered, or "improvements" made
  beyond the three bugs.
- FAIL: the file exceeds 90 lines or pulls in a dependency.

- Root-cause depth: a good diagnosis traces from the visible symptom
  back to the exact faulty expression — rather than describing what the
  new code does. Penalize diagnoses that only restate the fix.
- Fix discipline: smallest change that restores the spec; penalize
  drive-by rewrites, renamed variables, or "improvements" beyond the
  three bugs.
- Reasoning quality: does REASONING.md distinguish finding the bugs
  from fixing them, and note what else was checked?
