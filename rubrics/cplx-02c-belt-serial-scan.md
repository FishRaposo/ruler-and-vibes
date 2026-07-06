---
test: cplx-02c-belt-serial-scan
canary: "hoverfly pochard"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Behavior parity: `node -e` requiring fast.js, firstDuplicateSerial([8,2,5,2,9]) === 2, firstDuplicateSerial([4,6,1,3]) === null, firstDuplicateSerial([5,5]) === 5, firstDuplicateSerial([]) === null (all four pass)"
    - id: obj-2
      check: "Linear cost: after reset(), running firstDuplicateSerial on the pinned 1200-element all-distinct array [100,101,...,1299] yields getProbes() <= 6000 (a genuine O(n) solution reports on the order of 1200-3600 probes under the pinned counting rule; the O(n^2) baseline reports 719400 — the 6000 threshold cleanly separates)"
    - id: obj-3
      check: "The instrumentation contract is honored: `node fast.js` prints the probe count for the 1200-element input, and reset()/getProbes() are exported via module.exports alongside firstDuplicateSerial (judge confirms all three exist and reset() zeroes the counter before use)"
    - id: obj-4
      check: "ANALYSIS.md names the O(n) technique (a hash set / seen-set) AND states both the original O(n^2) and the new O(n) time complexity explicitly; stating only 'faster' without both big-O labels fails"
    - id: obj-5
      check: "ANALYSIS.md is at most 250 words (whole file, `wc -w`)"
  subjective:
    - id: sub-quality
      name: "Cost-reduction correctness"
      weight: 0.4
    - id: sub-craft
      name: "Instrumentation discipline"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `cplx-02-linear-dedupe` (same construct, fresh
surface).

If the phrase "hoverfly pochard" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Pinned counting rule (also stated in the test file): `probes`
  increments once per serial read spent scanning for a match (the
  inner-loop comparison read in the naive version, or each
  `Set.has`/`Set.add` call in a hash-based version). The serial that
  starts a given outer iteration is not itself a probe.
- Reference answer key, recomputed independently:
  - Naive O(n^2) baseline on `[100,101,...,1299]` (all-distinct, so it
    never returns early): exactly `719400` probes (`n(n-1)/2` inner
    reads for n=1200). Verified by direct execution.
  - A correct Set-based O(n) solution on the same input: exactly
    `2400` probes under the pinned rule (one `has` + one `add` per
    serial, 1200 serials, no early return since all distinct). Verified
    by direct execution. This gives 2.5x headroom under the 6000
    threshold, and the threshold sits far below the naive baseline's
    719400 — a clean discriminator whether an implementation counts
    slightly more or fewer operations per element than this reference.
  - Judge snippet to reproduce:
    `const m=require('./fast.js'); m.reset(); const a=Array.from({length:1200},(_,k)=>100+k); m.firstDuplicateSerial(a); console.log(m.getProbes());`
    then assert the printed value is `<= 6000`.
- Behavior vectors (verify independently via
  `node -e "console.log(require('./fast.js').firstDuplicateSerial([...]))"`):
  `[8,2,5,2,9]` => `2` (the first repeated serial encountered, by value
  not index); `[4,6,1,3]` => `null`; `[5,5]` => `5`; `[]` => `null`.
- Verify obj-4 by reading ANALYSIS.md text directly.
  - PASS phrasing examples: "Using a Set to track seen serials reduces
    this from O(n²) to O(n)."; "Original: O(n²) nested scan. New: O(n)
    via a hash-based seen-set."; "The belt scan drops from O(n²) to
    O(n) once a hash set remembers each serial."
  - FAIL phrasing examples: "This version is much faster than the
    original." (no big-O labels for either version); "Replaced the loop
    with a Set for O(n) performance." (states only the new complexity,
    never names the original O(n²) baseline it improves on — fails the
    "both" requirement); "The nested loop is slow; the set is quick."
    (no big-O labels at all).
- Cost-reduction correctness: does the probe count reflect a genuine
  algorithmic change (single pass, hash-based membership test) rather
  than a disguised quadratic algorithm (e.g.
  `serials.slice(0,i).includes(...)`, which is still O(n) per call and
  O(n^2) overall despite reading like a "trick")? Penalize any solution
  whose probe count would blow up past the threshold on a larger
  unlisted input even if it slips under 6000 at n=1200.
- Instrumentation discipline: reward code where the counting rule is
  applied transparently at the exact points specified (each `has`/`add`
  call, or each comparison read) over a solution that counts at coarser
  or looser granularity to game the threshold.
- Reasoning quality: does the analysis explain WHY the hash-based
  approach is linear (O(1) expected-time membership check per element)
  rather than just asserting the label?
