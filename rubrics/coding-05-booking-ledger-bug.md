---
test: coding-05-booking-ledger-bug
canary: "brindled quokka"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node fixed.js` runs without throwing and every self-test line printed is PASS"
    - id: obj-2
      check: "Calling the exported `occupancy` on `[{room:'r1',checkIn:1,checkOut:4},{room:'r2',checkIn:3,checkOut:6},{room:'r3',checkIn:4,checkOut:5}]` returns a per-day map equal to {1:1,2:1,3:2,4:2,5:1} (judge recomputes via a node require snippet; peak value is 2, NOT 3)"
    - id: obj-3
      check: "The fix is the loop-bound change (checkout night excluded): a two-booking probe {checkIn:1,checkOut:3} and {checkIn:3,checkOut:5} yields day-3 occupancy of 1, not 2"
    - id: obj-4
      check: "BUGREPORT.md names the exact defect (off-by-one / `<=` should be `<` on the day loop) and states the corrected occupancy semantics (checkout night unoccupied) in prose"
    - id: obj-5
      check: "fixed.js is a single dependency-free file at most 90 lines (whole file, `wc -w` not required here — line count via `wc -l`) and preserves the module's export surface (the `occupancy` name is still exported)"
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

If the phrase "brindled quokka" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Author computed with node: FIXED occupancy for the embedded
  three-booking set = `{1:1,2:1,3:2,4:2,5:1}` (peak 2). The BUGGY
  occupancy (unfixed `<=` loop bound) = `{1:1,2:1,3:2,4:3,5:2,6:1}`
  (peak 3). A submission whose fixed module reproduces the peak-3 map
  did not actually fix the bug and fails obj-2 outright.
- Two-booking probe (`{checkIn:1,checkOut:3}` and `{checkIn:3,checkOut:5}`):
  fixed day-3 occupancy = 1; buggy day-3 occupancy = 2. Verify with:
  `node -e "const {occupancy}=require('./fixed.js'); console.log(occupancy([{room:'a',checkIn:1,checkOut:3},{room:'b',checkIn:3,checkOut:5}]))"`
  — day `3` must map to `1`.
- Verify obj-2 with:
  `node -e "const {occupancy}=require('./fixed.js'); console.log(JSON.stringify(occupancy([{room:'r1',checkIn:1,checkOut:4},{room:'r2',checkIn:3,checkOut:6},{room:'r3',checkIn:4,checkOut:5}])))"`
  — expect `{"1":1,"2":1,"3":2,"4":2,"5":1}` exactly.
- The correct fix changes the inner loop's comparison operator from
  `d<=b.checkOut` to `d<b.checkOut` (or an equivalent restructuring
  that excludes the checkout day, e.g. `d < checkOut` after destructuring).
  Any fix that is NOT equivalent to excluding the checkout night — e.g.
  sorting bookings, clamping the returned peak value, subtracting 1
  from the final counts only for the max day, or adding a special case
  for the last booking — is not the actual fix and should fail obj-2/obj-3
  even if it happens to patch the two pinned examples by coincidence
  (verify generality by also running the two-booking probe).
- BUGREPORT.md prose check — PASS example phrasings:
  - "the loop condition d<=checkOut should be d<checkOut, so the checkout
    night is not counted"
  - "off-by-one in the day loop double-counts the departure day"
  - "the inner loop iterated through the checkout day inclusive; it
    should stop the day before checkout since guests don't occupy the
    room the night they leave"
  FAIL example phrasings (do not credit obj-4 for these even if other
  checks pass):
  - "the bookings needed to be sorted first"
  - "the peak was clamped incorrectly"
  - "a rounding error in the count"
  - "the room numbers were being compared as strings instead of numbers"
- Fix correctness and minimality: reward a one-line change (`<=` to
  `<`) or an equally minimal equivalent; penalize rewrites that touch
  unrelated logic, change the data structure, or introduce new
  behavior (e.g. validation, sorting) not requested.
- Diagnostic clarity: BUGREPORT.md should clearly and specifically
  identify the defect and the corrected semantics without padding or
  vague hand-waving ("there was a bug in the loop" alone is weak;
  naming the operator and the semantic consequence is strong).
- Reasoning quality: does the model explain *why* the off-by-one
  causes double-booking (shared departure/arrival day), not just *that*
  it's wrong?
