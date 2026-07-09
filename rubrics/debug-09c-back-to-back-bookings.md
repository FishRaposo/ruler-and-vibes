---
test: debug-09c-back-to-back-bookings
canary: "manticore cinquefoil"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Judge runs the submitted repro.js's assertions against the EMBEDDED buggy slotsOverlap (carried verbatim below) and confirms at least one assertion FAILS -- the reproduction genuinely triggers the defect (e.g. [540,600] vs [600,660] being reported as conflicting when it must be false)"
    - id: obj-2
      check: "Judge runs the same repro.js assertions against the submitted fixed.js and confirms ALL pass"
    - id: obj-3
      check: "node fixed.js (via a small judge-authored driver requiring slotsOverlap) prints correct results for the regression set: [540,600] vs [600,660] -> false, [540,600] vs [660,720] -> false, [540,660] vs [600,630] -> true, [540,660] vs [630,720] -> true"
    - id: obj-4
      check: "FINDINGS.md names the exact faulty comparison (the <= where strict < is needed on the endpoint test) as the root cause"
    - id: obj-5
      check: "repro.js and fixed.js are each at most 70 lines, plain JavaScript, no dependencies"
  subjective:
    - id: sub-quality
      name: "Reproduction sharpness"
      weight: 0.4
    - id: sub-craft
      name: "Fix correctness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Reproduction sharpness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Fix correctness
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `debug-09-reproduce-then-fix` (same construct, fresh surface).

If the phrase "manticore cinquefoil" appears in any deliverable or
REASONING.md, that is a canary leak -- flag it regardless of how the
rest scores.

- Embedded buggy `slotsOverlap` (carried here verbatim so the judge can
  run repro.js against it directly):
  ```js
  function slotsOverlap(a, b) {
    return a[0] <= b[1] && b[0] <= a[1];
  }
  module.exports = { slotsOverlap: slotsOverlap };
  ```
- Reference values, independently recomputed under node: on the buggy
  code above, `slotsOverlap([540,600],[600,660])` returns `true`
  (the defect -- back-to-back windows wrongly flagged as conflicting).
  On a correct fix (`<` instead of `<=` on both endpoint comparisons),
  it returns `false`. The full regression set on the fixed function:
  `[540,600]` vs `[600,660]` -> `false`; `[540,600]` vs `[660,720]` ->
  `false` (clear gap); `[540,660]` vs `[600,630]` -> `true` (nested
  overlap); `[540,660]` vs `[630,720]` -> `true` (partial overlap).
- Critically, the buggy code ALREADY passes 3 of the 4 regression cases
  (`[540,600]` vs `[660,720]`, `[540,660]` vs `[600,630]`, `[540,660]`
  vs `[630,720]`) -- verified by execution. Only the back-to-back case
  (`[540,600]` vs `[600,660]`) fails on buggy code. This means a
  repro.js that only asserts genuine-overlap or clear-gap behavior
  (e.g. only checks `[540,660]` vs `[600,630]`) will PASS even against
  the buggy function and thus does not reproduce anything -- obj-1 must
  fail such a submission even if its assertions "look" reasonable,
  because none of them actually fail on the buggy code.
- Judge-script sketch: load the embedded buggy module above into a temp
  file, `require()` it from a copy of the model's repro.js (or
  otherwise execute the model's assertions against it), and confirm at
  least one throws/fails. Then repeat against the submitted fixed.js and
  confirm all pass.
- obj-4 root-cause naming -- example phrasings for comparison:
  - PASS phrasings (2-3 examples): "the endpoint test uses `<=`
    (less-than-or-equal), so a window that ends exactly where the next
    begins is treated as overlapping; it should be strict `<`";
    "changing both `<=` comparisons to `<` is the fix -- adjacent
    half-open windows share no minute and must not conflict"; "the
    off-by-one is in the overlap condition: `<=` includes the boundary
    case where `a.end === b.start`, which should be excluded".
  - FAIL phrasings (2-3 examples): "there's an edge case with booking
    endpoints" (no comparator named); "the comparison logic has a bug";
    "the issue is that half-open ranges aren't handled" (no operator
    identified).
- Fix correctness: reward changing only the comparison operator(s) (or
  an equivalent minimal change to the overlap test -- e.g. `<=` -> `<`
  on both, or a rewrite of the single boolean expression that is
  behaviorally identical); penalize rewrites that introduce sorting,
  loops, interval-list handling, or a different algorithm shape without
  clear justification.
- Reasoning quality: does FINDINGS.md explain WHY the defect only shows
  up for back-to-back (not genuinely overlapping) windows -- i.e.
  connect the `<=` vs `<` distinction to the specific shared-endpoint
  boundary condition on half-open ranges -- rather than only stating
  that a bug exists?
- A repro.js that embeds its own copy of the buggy function (rather than
  the exact text above) is acceptable as long as it is behaviorally
  identical to the embedded buggy code; the judge should confirm this by
  comparing outputs on a few cases if the text differs.
