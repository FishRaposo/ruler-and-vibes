---
test: coding-05c-ink-coverage-bug
canary: "dukkah forlana"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node fixed.js` runs without throwing and every self-test line printed is PASS"
    - id: obj-2
      check: "Calling the exported `inkCoverage` on `[{color:'cyan',startFrame:2,stopFrame:6},{color:'magenta',startFrame:5,stopFrame:9},{color:'yellow',startFrame:6,stopFrame:7},{color:'black',startFrame:8,stopFrame:10}]` returns a per-frame map equal to {2:1,3:1,4:1,5:2,6:2,7:1,8:2,9:1} (judge recomputes via a node require snippet; peak value is 2, NOT 3)"
    - id: obj-3
      check: "The fix is the loop-bound change (stop frame excluded): a two-pass probe {startFrame:2,stopFrame:5} and {startFrame:5,stopFrame:8} yields frame-5 coverage of 1, not 2"
    - id: obj-4
      check: "BUGREPORT.md names the exact defect (off-by-one / `<=` should be `<` on the frame loop) and states the corrected coverage semantics (stop frame uninked) in prose"
    - id: obj-5
      check: "fixed.js is a single dependency-free file at most 90 lines (whole file, `wc -w` not required here — line count via `wc -l`) and preserves the module's export surface (the `inkCoverage` name is still exported)"
  subjective:
    - id: sub-quality
      name: "Fix correctness and minimality"
      weight: 0.4
    - id: sub-craft
      name: "Diagnostic clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Fix correctness and minimality
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Diagnostic clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `coding-05-booking-ledger-bug` (same construct, fresh surface).

If the phrase "dukkah forlana" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

- Author computed with node: FIXED coverage for the embedded four-pass
  set = `{2:1,3:1,4:1,5:2,6:2,7:1,8:2,9:1}` (peak 2). The BUGGY coverage
  (unfixed `<=` loop bound) = `{2:1,3:1,4:1,5:2,6:3,7:2,8:2,9:2,10:1}`
  (peak 3). A submission whose fixed module reproduces the peak-3 map
  did not actually fix the bug and fails obj-2 outright.
- Two-pass probe (`{startFrame:2,stopFrame:5}` and `{startFrame:5,stopFrame:8}`):
  fixed frame-5 coverage = 1; buggy frame-5 coverage = 2. Verify with:
  `node -e "const {inkCoverage}=require('./fixed.js'); console.log(inkCoverage([{color:'a',startFrame:2,stopFrame:5},{color:'b',startFrame:5,stopFrame:8}]))"`
  — frame `5` must map to `1`.
- Verify obj-2 with:
  `node -e "const {inkCoverage}=require('./fixed.js'); console.log(JSON.stringify(inkCoverage([{color:'cyan',startFrame:2,stopFrame:6},{color:'magenta',startFrame:5,stopFrame:9},{color:'yellow',startFrame:6,stopFrame:7},{color:'black',startFrame:8,stopFrame:10}])))"`
  — expect `{"2":1,"3":1,"4":1,"5":2,"6":2,"7":1,"8":2,"9":1}` exactly.
- The correct fix changes the inner loop's comparison operator from
  `f<=p.stopFrame` to `f<p.stopFrame` (or an equivalent restructuring
  that excludes the stop frame, e.g. `f < stopFrame` after destructuring).
  Any fix that is NOT equivalent to excluding the stop frame — e.g.
  sorting passes, clamping the returned peak value, subtracting 1 from
  the final counts only for the max frame, or adding a special case for
  the last pass — is not the actual fix and should fail obj-2/obj-3 even
  if it happens to patch the two pinned examples by coincidence (verify
  generality by also running the two-pass probe).
- BUGREPORT.md prose check — PASS example phrasings:
  - "the loop condition f<=stopFrame should be f<stopFrame, so the stop
    frame is not counted"
  - "off-by-one in the frame loop double-counts the lift-off frame"
  - "the inner loop iterated through the stop frame inclusive; it should
    stop the frame before the registration cut since a pass does not ink
    the frame where its color lifts"
  FAIL example phrasings (do not credit obj-4 for these even if other
  checks pass):
  - "the passes needed to be sorted first"
  - "the peak was clamped incorrectly"
  - "a rounding error in the count"
  - "the color names were being compared as strings instead of numbers"
- Fix correctness and minimality: reward a one-line change (`<=` to
  `<`) or an equally minimal equivalent; penalize rewrites that touch
  unrelated logic, change the data structure, or introduce new
  behavior (e.g. validation, sorting) not requested.
- Diagnostic clarity: BUGREPORT.md should clearly and specifically
  identify the defect and the corrected semantics without padding or
  vague hand-waving ("there was a bug in the loop" alone is weak;
  naming the operator and the semantic consequence is strong).
- Reasoning quality: does the model explain *why* the off-by-one causes
  double-inking (shared lift-off/start frame), not just *that* it's
  wrong?
