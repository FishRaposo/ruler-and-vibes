---
test: cplx-02-linear-dedupe
canary: "marigold foxglove"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "Behavior parity: `node -e` requiring fast.js, firstRepeat([3,1,4,1,5]) === 1, firstRepeat([1,2,3,4]) === null, firstRepeat([7,7]) === 7, firstRepeat([]) === null (all four pass)"
    - id: obj-2
      check: "Linear cost: after reset(), running firstRepeat on the pinned 1000-element all-distinct array [0,1,...,999] yields getProbes() <= 5000 (a genuine O(n) solution reports on the order of 1000-3000 probes under the pinned counting rule; the O(n^2) baseline reports 499500 — the 5000 threshold cleanly separates)"
    - id: obj-3
      check: "The instrumentation contract is honored: `node fast.js` prints the probe count for the 1000-element input, and reset()/getProbes() are exported via module.exports alongside firstRepeat (judge confirms all three exist and reset() zeroes the counter before use)"
    - id: obj-4
      check: "ANALYSIS.md names the O(n) technique (a hash set / seen-map) AND states both the original O(n^2) and the new O(n) time complexity explicitly; stating only 'faster' without both big-O labels fails"
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

Codename for this test in judge chatter: marigold foxglove.

- Pinned counting rule (also stated in the test file): `probes`
  increments once per array read spent scanning for a match (the
  inner-loop comparison read in the naive version, or each
  `Set.has`/`Set.add` call in a hash-based version). The element that
  starts a given outer iteration is not itself a probe.
- Reference answer key, recomputed independently:
  - Naive O(n^2) baseline on `[0,1,...,999]` (all-distinct, so it
    never returns early): exactly `499500` probes (`n(n-1)/2` inner
    reads for n=1000). Verified by direct execution.
  - A correct Set-based O(n) solution on the same input: exactly
    `2000` probes under the pinned rule (one `has` + one `add` per
    element, 1000 elements, no early return since all distinct).
    Verified by direct execution. This gives roughly 250x headroom
    under the 5000 threshold, and the threshold sits comfortably
    below the naive baseline's 499500 — a clean discriminator whether
    an implementation counts slightly more or fewer operations per
    element than this reference.
  - Judge snippet to reproduce:
    `const m=require('./fast.js'); m.reset(); const a=[...Array(1000).keys()]; m.firstRepeat(a); console.log(m.getProbes());`
    then assert the printed value is `<= 5000`.
- Behavior vectors (verify independently via
  `node -e "console.log(require('./fast.js').firstRepeat([...]))"`):
  `[3,1,4,1,5]` => `1` (the first repeated value encountered, by value
  not index); `[1,2,3,4]` => `null`; `[7,7]` => `7`; `[]` => `null`.
- Verify obj-4 by reading ANALYSIS.md text directly.
  - PASS phrasing examples: "Using a Set to track seen values reduces
    this from O(n²) to O(n)."; "Original: O(n²) nested scan. New:
    O(n) via a hash-based seen-map."
  - FAIL phrasing examples: "This version is much faster than the
    original." (no big-O labels for either version); "Replaced the
    loop with a Set for O(n) performance." (states only the new
    complexity, never names the original O(n²) baseline it improves
    on — fails the "both" requirement).
- Cost-reduction correctness: does the probe count reflect a genuine
  algorithmic change (single pass, hash-based membership test) rather
  than a disguised quadratic algorithm (e.g. `arr.slice(0,i).includes(...)`,
  which is still O(n) per call and O(n^2) overall despite reading like
  a "trick")? Penalize any solution whose probe count would blow up
  past the threshold on a larger unlisted input even if it slips under
  5000 at n=1000.
- Instrumentation discipline: reward code where the counting rule is
  applied transparently at the exact points specified (each `has`/`add`
  call, or each comparison read) over a solution that counts at
  coarser or looser granularity to game the threshold.
- Reasoning quality: does the analysis explain WHY the hash-based
  approach is linear (O(1) expected-time membership check per element)
  rather than just asserting the label?
