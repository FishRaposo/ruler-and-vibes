---
test: coding-05b-airtime-handover
canary: "zaatar siciliana"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node fixed.js` runs without throwing and every self-test line printed is PASS"
    - id: obj-2
      check: "Calling the exported `airtime` on `[{channel:'ch1',startSlot:2,endSlot:5},{channel:'ch2',startSlot:4,endSlot:7},{channel:'ch3',startSlot:5,endSlot:6}]` returns a per-slot map equal to {2:1,3:1,4:2,5:2,6:1} (judge recomputes via a node require snippet; peak value is 2, NOT 3)"
    - id: obj-3
      check: "The fix is the loop-bound change (handover slot excluded): a two-broadcast probe {startSlot:2,endSlot:4} and {startSlot:4,endSlot:6} yields slot-4 concurrency of 1, not 2"
    - id: obj-4
      check: "BUGREPORT.md names the exact defect (off-by-one / `<=` should be `<` on the slot loop) and states the corrected concurrency semantics (handover slot not on-air) in prose"
    - id: obj-5
      check: "fixed.js is a single dependency-free file at most 90 lines (whole file, `wc -w` not required here — line count via `wc -l`) and preserves the module's export surface (the `airtime` name is still exported)"
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
---

## Judge guidance

Parallel form of `coding-05-booking-ledger-bug` (same construct, fresh surface).

If the phrase "zaatar siciliana" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Author computed with node: FIXED airtime for the embedded
  three-broadcast set = `{2:1,3:1,4:2,5:2,6:1}` (peak 2). The BUGGY
  airtime (unfixed `<=` loop bound) = `{2:1,3:1,4:2,5:3,6:2,7:1}`
  (peak 3). A submission whose fixed module reproduces the peak-3 map
  did not actually fix the bug and fails obj-2 outright.
- Two-broadcast probe (`{startSlot:2,endSlot:4}` and `{startSlot:4,endSlot:6}`):
  fixed slot-4 concurrency = 1; buggy slot-4 concurrency = 2. Verify with:
  `node -e "const {airtime}=require('./fixed.js'); console.log(airtime([{channel:'a',startSlot:2,endSlot:4},{channel:'b',startSlot:4,endSlot:6}]))"`
  — slot `4` must map to `1`.
- Verify obj-2 with:
  `node -e "const {airtime}=require('./fixed.js'); console.log(JSON.stringify(airtime([{channel:'ch1',startSlot:2,endSlot:5},{channel:'ch2',startSlot:4,endSlot:7},{channel:'ch3',startSlot:5,endSlot:6}])))"`
  — expect `{"2":1,"3":1,"4":2,"5":2,"6":1}` exactly.
- The correct fix changes the inner loop's comparison operator from
  `s<=b.endSlot` to `s<b.endSlot` (or an equivalent restructuring
  that excludes the end slot, e.g. `s < endSlot` after destructuring).
  Any fix that is NOT equivalent to excluding the handover slot — e.g.
  sorting broadcasts, clamping the returned peak value, subtracting 1
  from the final counts only for the max slot, or adding a special case
  for the last broadcast — is not the actual fix and should fail obj-2/obj-3
  even if it happens to patch the two pinned examples by coincidence
  (verify generality by also running the two-broadcast probe).
- BUGREPORT.md prose check — PASS example phrasings:
  - "the loop condition s<=endSlot should be s<endSlot, so the handover
    slot is not counted"
  - "off-by-one in the slot loop double-counts the handover slot"
  - "the inner loop iterated through the end slot inclusive; it
    should stop the slot before end since a channel is off air the slot
    the next programme takes over"
  FAIL example phrasings (do not credit obj-4 for these even if other
  checks pass):
  - "the broadcasts needed to be sorted first"
  - "the peak was clamped incorrectly"
  - "a rounding error in the count"
  - "the channel names were being compared as strings instead of numbers"
- Fix correctness and minimality: reward a one-line change (`<=` to
  `<`) or an equally minimal equivalent; penalize rewrites that touch
  unrelated logic, change the data structure, or introduce new
  behavior (e.g. validation, sorting) not requested.
- Diagnostic clarity: BUGREPORT.md should clearly and specifically
  identify the defect and the corrected semantics without padding or
  vague hand-waving ("there was a bug in the loop" alone is weak;
  naming the operator and the semantic consequence is strong).
- Reasoning quality: does the model explain *why* the off-by-one
  causes double-counting (shared handover/start slot), not just *that*
  it's wrong?
