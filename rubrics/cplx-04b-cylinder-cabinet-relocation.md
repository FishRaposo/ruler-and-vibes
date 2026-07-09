---
test: cplx-04b-cylinder-cabinet-relocation
canary: "delphinium wigeon"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node cabinet.js` runs without throwing and prints exactly 8 lines 'n=<n> moves=<count>' for n=1,2,6,7,32,33,64,2500 in that order"
    - id: obj-2
      check: "The 8 cumulative move counts equal the answer key 0, 1, 7, 7, 31, 63, 63, 4095 (judge recomputes by simulating the doubling policy independently; a model that counts placements-plus-moves or uses a different growth factor fails)"
    - id: obj-3
      check: "module.exports exposes the cabinet with the moves counter and a reset, and a judge-run sequence of exactly 100 store operations on a fresh cabinet reports moves===127 (expansions fire at sizes 1,2,4,8,16,32,64, re-shelving 1+2+4+8+16+32+64=127 cylinders total; ground truth is the judge's own fresh simulation, not any inline arithmetic elsewhere)"
    - id: obj-4
      check: "ANALYSIS.md states BOTH that a single store is O(n) worst case AND O(1) amortized, and gives the exact n=2500 total of 4095 moves; stating only one of the two complexities, or claiming store is O(n) overall, fails"
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
anchors:
  - id: Amortized-analysis rigor
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Growth-policy implementation
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `cplx-04-amortized-doubling-buffer` (same construct, fresh surface).

If the phrase "delphinium wigeon" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Pinned counting rule (also stated in the test file): `moves`
  increments once per already-held cylinder re-shelved during an
  expansion; the newly-stored cylinder's own placement is never
  counted.
- Reference answer key, recomputed independently by simulating the
  doubling policy (capacity starts at 1, doubles on overflow,
  re-shelves the current number of cylinders on each expansion):

  ```
  n=1 moves=0
  n=2 moves=1
  n=6 moves=7
  n=7 moves=7
  n=32 moves=31
  n=33 moves=63
  n=64 moves=63
  n=2500 moves=4095
  ```

  Verified by direct execution. Total at n=2500 equals
  `1+2+4+8+...+1024 = 2047` for the expansions up to the last one,
  and the cumulative count after all 2500 stores is 4095 (the sum of
  the twelve capacities re-shelved across the twelve expansions that
  occur before reaching 2500 cylinders).
- Obj-3 ground truth: after exactly 100 store operations from a fresh
  cabinet, expansions occur when the cabinet holds 1, 2, 4, 8, 16, 32,
  and 64 cylinders (transitioning to capacities 2, 4, 8, 16, 32, 64,
  128), re-shelving `1+2+4+8+16+32+64 = 127` cylinders total. Verified
  by direct execution. Note this is a DIFFERENT milestone from the
  `n=64` row above (which reports 63 moves) — 100 stores triggers one
  further expansion beyond 64, so the correct assertion is
  `moves===127` at 100 stores, not 63. A submission that reports 63
  for 100 stores has stopped tracking after the wrong milestone and
  fails this check.
- Judge snippet to reproduce (adapt to the module's actual export
  shape): construct a fresh cabinet, call `store` 100 times, read the
  cumulative moves counter, and assert it equals `127`.
- Verify obj-4 by reading ANALYSIS.md text directly — two independent
  requirements (both complexities stated, AND the exact n=2500 count)
  must both be present.
  - PASS phrasing examples: "A single store is O(n) in the worst case
    (when an expansion fires) but O(1) amortized across a sequence of
    stores, since total moves stay under 2n."; "Worst-case per-store
    cost is O(n); amortized per-store cost is O(1)."; "The expanding
    store is O(n); averaged over the whole run each store is O(1)
    amortized."
  - FAIL phrasing examples: "Store runs in O(n) time." (states only
    the worst-case cost, omits the amortized claim entirely — fails
    the 'both' requirement); "Since expansions are rare, store is
    effectively O(1) overall." (omits the O(n) worst-case cost, and
    "effectively" signals no amortized argument was actually made —
    this describes the right intuition but fails the explicit
    dual-complexity requirement); also FAIL: "Store is amortized O(n)
    since occasional expansions dominate." (conflates the two —
    asserts the worst-case figure as if it were the amortized bound).
- Amortized-analysis rigor: does the analysis justify the amortized
  bound quantitatively (total moves across n stores stays under 2n,
  e.g. via the geometric series `1+2+4+...+n/2 < n`, giving average
  cost per store bounded by a constant) rather than merely asserting
  "amortized O(1)" without connecting it to the doubling series?
- Growth-policy implementation: does the cabinet implement EXACTLY a
  doubling policy (capacity starts at 1, doubles precisely on
  overflow) rather than a 1.5x growth factor or a place-then-re-shelve
  ordering that would shift every pinned count?
- Reasoning quality: does ANALYSIS.md distinguish worst-case from
  amortized cost explicitly and correctly, connecting the distinction
  to the specific pinned counts rather than treating the two notions
  as interchangeable?
