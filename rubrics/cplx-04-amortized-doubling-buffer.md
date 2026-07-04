---
test: cplx-04-amortized-doubling-buffer
canary: "primrose columbine"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node buffer.js` runs without throwing and prints exactly 8 lines 'n=<n> copies=<count>' for n=1,2,4,5,8,16,17,1000 in that order"
    - id: obj-2
      check: "The 8 cumulative copy counts equal the answer key 0, 1, 3, 7, 7, 15, 31, 1023 (judge recomputes by simulating the doubling policy independently; a model that counts writes-plus-copies or uses a different growth factor fails)"
    - id: obj-3
      check: "module.exports exposes the buffer with the copies counter and a reset, and a judge-run sequence of exactly 33 pushes on a fresh buffer reports copies===63 (doublings fire at sizes 1,2,4,8,16,32, copying 1+2+4+8+16+32=63 elements total; ground truth is the judge's own fresh simulation, not any inline arithmetic elsewhere)"
    - id: obj-4
      check: "ANALYSIS.md states BOTH that a single push is O(n) worst case AND O(1) amortized, and gives the exact n=1000 total of 1023 copies; stating only one of the two complexities, or claiming push is O(n) overall, fails"
    - id: obj-5
      check: "ANALYSIS.md is at most 300 words (whole file, `wc -w`)"
  subjective:
    - id: sub-quality
      name: "Amortized-analysis rigor"
      weight: 0.4
    - id: sub-craft
      name: "Growth-policy implementation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Codename for this test in judge chatter: primrose columbine.

- Pinned counting rule (also stated in the test file): `copies`
  increments once per pre-existing element moved during a resize; the
  newly-pushed element's own write is never counted.
- Reference answer key, recomputed independently by simulating the
  doubling policy (capacity starts at 1, doubles on overflow, copies
  current size elements on each resize):

  ```
  n=1 copies=0
  n=2 copies=1
  n=4 copies=3
  n=5 copies=7
  n=8 copies=7
  n=16 copies=15
  n=17 copies=31
  n=1000 copies=1023
  ```

  Verified by direct execution. Total at n=1000 equals
  `1+2+4+8+...+512 = 1023` (sum of capacities at each of the 10
  doublings that occur before reaching 1000 elements).
- Obj-3 ground truth: after exactly 33 pushes from a fresh buffer,
  doublings occur when the buffer holds 1, 2, 4, 8, 16, and 32
  elements (transitioning to capacities 2, 4, 8, 16, 32, 64), copying
  `1+2+4+8+16+32 = 63` elements total. Verified by direct execution.
  Note this is a DIFFERENT milestone from the `n=17` row above (which
  reports 31 copies) — 33 pushes triggers one further doubling beyond
  17, so the correct assertion is `copies===63` at 33 pushes, not 31.
  A submission that reports 31 for 33 pushes has stopped tracking
  after the wrong milestone and fails this check.
- Judge snippet to reproduce (adapt to the module's actual export
  shape): construct a fresh buffer, call `push` 33 times, read the
  cumulative copies counter, and assert it equals `63`.
- Verify obj-4 by reading ANALYSIS.md text directly — two independent
  requirements (both complexities stated, AND the exact n=1000 count)
  must both be present.
  - PASS phrasing examples: "A single push is O(n) in the worst case
    (when a resize fires) but O(1) amortized across a sequence of
    pushes, since total copies stay under 2n."; "Worst-case per-push
    cost is O(n); amortized per-push cost is O(1)."
  - FAIL phrasing examples: "Push runs in O(n) time." (states only the
    worst-case cost, omits the amortized claim entirely — fails the
    'both' requirement); "Since resizing is rare, push is effectively
    O(1) overall." (omits the O(n) worst-case cost, and "effectively"
    signals no amortized argument was actually made — this describes
    the right intuition but fails the explicit dual-complexity
    requirement); also FAIL: "Push is amortized O(n) since occasional
    resizes dominate." (conflates the two — asserts the worst-case
    figure as if it were the amortized bound).
- Amortized-analysis rigor: does the analysis justify the amortized
  bound quantitatively (total copies across n pushes stays under 2n,
  e.g. via the geometric series `1+2+4+...+n/2 < n`, giving average
  cost per push bounded by a constant) rather than merely asserting
  "amortized O(1)" without connecting it to the doubling series?
- Growth-policy implementation: does the buffer implement EXACTLY a
  doubling policy (capacity starts at 1, doubles precisely on
  overflow) rather than a 1.5x growth factor or a copy-then-write
  ordering that would shift every pinned count?
- Reasoning quality: does ANALYSIS.md distinguish worst-case from
  amortized cost explicitly and correctly, connecting the distinction
  to the specific pinned counts rather than treating the two notions
  as interchangeable?
