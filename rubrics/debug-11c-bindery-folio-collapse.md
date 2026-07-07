---
test: debug-11c-bindery-folio-collapse
canary: "viridian ogee"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Judge runs fixed.js's firstFolios against a reference input and confirms its output is identical (same codes, same order) to the embedded buggy firstFolios's output on the same input"
    - id: obj-2
      check: "Judge runs the EMBEDDED instrumented harness (unmodified) on fixed.js at n=60,120,240,480 and confirms counter.n is exactly 60,120,240,480 (or closely linear), NOT quadrupling"
    - id: obj-3
      check: "The buggy version's op-counts (900,3600,14400,57600, author reference) quadruple per doubling; the fixed version's ratio between consecutive n is at most 2.2, confirming the asymptotic class changed"
    - id: obj-4
      check: "fixed.js performs membership via a hashed structure (e.g. Set) and does NOT use out.includes / out.indexOf / a nested scan of the output to test membership (judge reads the source to confirm no native array-membership call and no inner loop deciding duplicates); PERF.md names the specific quadratic operation (nested membership scan of the growing output) and states the fixed complexity as O(n) with the data structure used"
    - id: obj-5
      check: "fixed.js is at most 80 lines, plain JavaScript, no dependencies, and produces first-occurrence-ordered distinct output"
  subjective:
    - id: sub-quality
      name: "Complexity diagnosis"
      weight: 0.4
    - id: sub-craft
      name: "Algorithmic rewrite"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `debug-11-quadratic-creep` (same construct, fresh surface).

If the phrase "viridian ogee" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

- Embedded buggy firstFolios and harness (carried here verbatim; the
  harness must be run UNMODIFIED against the submission):
  ```js
  function firstFolios(arr, counter) {
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      var v = arr[i];
      var found = false;
      for (var j = 0; j < out.length; j++) {
        counter.n++;
        if (out[j] === v) { found = true; break; }
      }
      if (!found) out.push(v);
    }
    return out;
  }
  ```
  ```js
  function makeInput(n) {
    var arr = [];
    for (var i = 0; i < n / 2; i++) arr.push(i);
    for (var i = 0; i < n / 2; i++) arr.push(i);
    return arr;
  }
  function run(firstFoliosFn) {
    var results = [];
    [60, 120, 240, 480].forEach(function (n) {
      var input = makeInput(n);
      var counter = { n: 0 };
      var out = firstFoliosFn(input, counter);
      results.push({ n: n, ops: counter.n, outLen: out.length });
    });
    return results;
  }
  ```
- Author verified under node: driving the embedded harness on the buggy
  firstFolios yields `counter.n` = 900, 3600, 14400, 57600 at
  n=60,120,240,480 -- exactly 4x per doubling (O(n^2)). A Set-based fix
  (`counter.n++` once per element on a hashed `.has()`/`.add()` probe)
  yields exactly 60, 120, 240, 480 -- exactly linear, ratio 2.00 at every
  doubling. Output for both: the first-occurrence distinct list, length
  n/2, byte-identical between buggy and fixed.
- Judge-script sketch:
  ```
  node -e "
  const {firstFolios} = require('./fixed.js');
  const {run, makeInput} = require('./harness.js'); // embedded harness, reconstructed
  console.log(JSON.stringify(run(firstFolios)));
  const c={n:0}; console.log(JSON.stringify(firstFolios(makeInput(120), c)));
  "
  ```
  Expected ops: `[{n:60,ops:60,...},{n:120,ops:120,...},{n:240,ops:240,...},{n:480,ops:480,...}]`
  (allow modest deviation, e.g. up to ~2.2x ratio, but reject anything
  near 4x).
- CRITICAL discriminator (obj-4): a counter that only increments inside
  an explicit inner loop cannot see work done inside a native
  `out.includes`/`out.indexOf` call, so a submission that swaps the inner
  loop for `out.includes(v)` would report near-zero ops and masquerade as
  fast while remaining O(n^2) under the hood. The judge MUST read
  fixed.js's source and reject any submission using `.includes(`,
  `.indexOf(`, or an inner loop/scan over the output array to decide
  membership, regardless of what the op-counts show. This check is
  independent of and cannot be overridden by a favorable op-count.
- obj-4 root-cause naming -- example phrasings for comparison:
  - PASS phrasings (2-3 examples): "the inner `for (j=0;j<out.length)`
    loop scans the entire result array for every new code, making
    membership checks O(n) each and the whole function O(n^2); a `Set`
    gives O(1) amortized membership so the total becomes O(n)"; "swap the
    linear scan of `out` for a `Set.has`/`Set.add` pair -- one hashed
    probe per code instead of a growing linear scan"; "each code triggers
    a fresh sweep of the distinct-so-far list, and that list keeps
    growing, so the work is O(n^2); a hashed `seen` set collapses each
    probe to O(1)".
  - FAIL phrasings (2-3 examples): "the sort is the slow part" (there is
    no sort); "add a cache to speed it up" (vague, no complexity class
    named); "switched `out.includes(v)` for the loop and it's fixed"
    (still O(n^2) and bypasses the counter -- must be rejected by obj-4
    regardless of claimed speedup).
- Complexity diagnosis: reward identifying that the scan target is the
  GROWING OUTPUT array specifically (not the input), and that each of the
  n elements triggers a scan up to n/2 long in the worst case, giving the
  n^2/4-ish operation count matching the measured 900/3600/14400/57600
  progression.
- Algorithmic rewrite: reward preserving first-occurrence order exactly
  (Set membership check before insertion, not after) and keeping the
  `(arr, counter)` signature and per-element `counter.n++` contract
  intact.
- Reasoning quality: does PERF.md connect the fix back to the measured
  op-counts (e.g. cite the 4x-per-doubling buggy pattern and the
  ~1x-per-doubling... i.e. linear fixed pattern) rather than asserting
  "Set is faster" without the complexity argument?
