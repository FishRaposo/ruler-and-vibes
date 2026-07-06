---
test: cplx-04c-granary-doubling-silo
canary: "campanula smew"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node granary.js` runs without throwing and prints exactly 8 lines 'n=<n> transfers=<count>' for n=1,3,4,9,16,33,64,1200 in that order"
    - id: obj-2
      check: "The 8 cumulative transfer counts equal the answer key 0, 3, 3, 15, 15, 63, 63, 2047 (judge recomputes by simulating the doubling policy independently; a model that counts placements-plus-transfers or uses a different growth factor fails)"
    - id: obj-3
      check: "module.exports exposes the bay with the transfers counter and a reset, and a judge-run sequence of exactly 70 adds on a fresh bay reports transfers===127 (doublings fire at sizes 1,2,4,8,16,32,64, transferring 1+2+4+8+16+32+64=127 sacks total; ground truth is the judge's own fresh simulation, not any inline arithmetic elsewhere)"
    - id: obj-4
      check: "ANALYSIS.md states BOTH that a single add is O(n) worst case AND O(1) amortized, and gives the exact n=1200 total of 2047 transfers; stating only one of the two complexities, or claiming add is O(n) overall, fails"
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

Parallel form of `cplx-04-amortized-doubling-buffer` (same construct,
fresh surface).

If the phrase "campanula smew" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- Pinned counting rule (also stated in the test file): `transfers`
  increments once per already-held sack moved during a resize; the
  newly-added sack's own placement is never counted.
- Reference answer key, recomputed independently by simulating the
  doubling policy (capacity starts at 1, doubles on overflow, transfers
  the current number of held sacks on each resize):

  ```
  n=1 transfers=0
  n=3 transfers=3
  n=4 transfers=3
  n=9 transfers=15
  n=16 transfers=15
  n=33 transfers=63
  n=64 transfers=63
  n=1200 transfers=2047
  ```

  Verified by direct execution. Total at n=1200 equals
  `1+2+4+8+...+1024 = 2047` (sum of held-sack counts at each of the 11
  doublings that occur before reaching 1200 sacks).
- Obj-3 ground truth: after exactly 70 adds from a fresh bay, doublings
  occur when the bay holds 1, 2, 4, 8, 16, 32, and 64 sacks
  (transitioning to capacities 2, 4, 8, 16, 32, 64, 128), transferring
  `1+2+4+8+16+32+64 = 127` sacks total. Verified by direct execution.
  Note this is a DIFFERENT milestone from the `n=64` row above (which
  reports 63, because at exactly 64 sacks only the resize from capacity
  32 to 64 has fired) — the 70-add probe triggers one further doubling
  beyond 64, so the correct assertion is `transfers===127` at 70 adds,
  not 63. A submission that reports 63 for 70 adds has stopped tracking
  after the wrong milestone and fails this check.
- Judge snippet to reproduce (adapt to the module's actual export
  shape): construct a fresh bay, call `add` 70 times, read the
  cumulative transfers counter, and assert it equals `127`.
- Verify obj-4 by reading ANALYSIS.md text directly — two independent
  requirements (both complexities stated, AND the exact n=1200 count)
  must both be present.
  - PASS phrasing examples: "A single add is O(n) in the worst case
    (when a resize fires) but O(1) amortized across a sequence of adds,
    since total transfers stay under 2n."; "Worst-case per-add cost is
    O(n); amortized per-add cost is O(1)."; "Any one add can be O(n)
    (a resize), yet the amortized per-add cost is O(1)."
  - FAIL phrasing examples: "Add runs in O(n) time." (states only the
    worst-case cost, omits the amortized claim entirely — fails the
    'both' requirement); "Since resizing is rare, add is effectively
    O(1) overall." (omits the O(n) worst-case cost, and "effectively"
    signals no amortized argument was actually made — this describes
    the right intuition but fails the explicit dual-complexity
    requirement); also FAIL: "Add is amortized O(n) since occasional
    resizes dominate." (conflates the two — asserts the worst-case
    figure as if it were the amortized bound).
- Amortized-analysis rigor: does the analysis justify the amortized
  bound quantitatively (total transfers across n adds stays under 2n,
  e.g. via the geometric series `1+2+4+...+n/2 < n`, giving average
  cost per add bounded by a constant) rather than merely asserting
  "amortized O(1)" without connecting it to the doubling series?
- Growth-policy implementation: does the bay implement EXACTLY a
  doubling policy (capacity starts at 1, doubles precisely on overflow)
  rather than a 1.5x growth factor or a place-then-transfer ordering
  that would shift every pinned count?
- Reasoning quality: does ANALYSIS.md distinguish worst-case from
  amortized cost explicitly and correctly, connecting the distinction
  to the specific pinned counts rather than treating the two notions
  as interchangeable?
