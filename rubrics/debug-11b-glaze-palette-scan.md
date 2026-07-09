---
test: debug-11b-glaze-palette-scan
canary: "capuchin galago"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Judge runs fixed.js's distinctColors against a reference input and confirms its output is identical (same colour codes, same first-appearance order) to the embedded buggy distinctColors's output on the same input"
    - id: obj-2
      check: "Judge runs the EMBEDDED instrumented harness (unmodified) on fixed.js at n=120,240,480,960 and confirms counter.n is exactly 120,240,480,960 (or closely linear), NOT quadrupling"
    - id: obj-3
      check: "The buggy version's op-counts (3600,14400,57600,230400, author reference) quadruple per doubling; the fixed version's ratio between consecutive n is at most 2.2, confirming the asymptotic class changed"
    - id: obj-4
      check: "fixed.js performs membership via a hashed structure (e.g. Set) and does NOT use palette.includes / palette.indexOf / a nested scan of the palette to test membership (judge reads the source to confirm no native array-membership call and no inner loop deciding duplicates); PERF.md names the specific quadratic operation (nested membership scan of the growing palette) and states the fixed complexity as O(n) with the data structure used"
    - id: obj-5
      check: "fixed.js is at most 80 lines, plain JavaScript, no dependencies, and produces first-appearance-ordered distinct output"
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
anchors:
  - id: Complexity diagnosis
    0: Misattributes the cause or stops at the symptom.
    5: Names the right area but misses a contributing root cause.
    10: Names every distinct root cause precisely and proves each.
  - id: Algorithmic rewrite
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `debug-11-quadratic-creep` (same construct, fresh surface).

If the phrase "capuchin galago" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

- Embedded buggy distinctColors and harness (carried here verbatim; the
  harness must be run UNMODIFIED against the submission):
  ```js
  function distinctColors(tiles, counter) {
    var palette = [];
    for (var i = 0; i < tiles.length; i++) {
      var color = tiles[i];
      var found = false;
      for (var j = 0; j < palette.length; j++) {
        counter.n++;
        if (palette[j] === color) { found = true; break; }
      }
      if (!found) palette.push(color);
    }
    return palette;
  }
  ```
  ```js
  function makeInput(n) {
    var tiles = [];
    for (var i = 0; i < n / 2; i++) tiles.push(i);
    for (var i = 0; i < n / 2; i++) tiles.push(i);
    return tiles;
  }
  function run(distinctFn) {
    var results = [];
    [120, 240, 480, 960].forEach(function (n) {
      var input = makeInput(n);
      var counter = { n: 0 };
      var out = distinctFn(input, counter);
      results.push({ n: n, ops: counter.n, outLen: out.length });
    });
    return results;
  }
  ```
- Author verified under node: driving the embedded harness on the buggy
  distinctColors yields `counter.n` = 3600, 14400, 57600, 230400 at
  n=120,240,480,960 -- exactly 4x per doubling (O(n^2)). A Set-based fix
  (`counter.n++` once per tile on a hashed `.has()`/`.add()` probe)
  yields exactly 120, 240, 480, 960 -- exactly linear, ratio 2.00 at
  every doubling. Output for both: the first-appearance distinct list,
  length n/2, byte-identical between buggy and fixed.
- Judge-script sketch:
  ```
  node -e "
  const {distinctColors} = require('./fixed.js');
  const {run, makeInput} = require('./harness.js'); // embedded harness, reconstructed
  console.log(JSON.stringify(run(distinctColors)));
  const c={n:0}; console.log(JSON.stringify(distinctColors(makeInput(240), c)));
  "
  ```
  Expected ops: `[{n:120,ops:120,...},{n:240,ops:240,...},{n:480,ops:480,...},{n:960,ops:960,...}]`
  (allow modest deviation, e.g. up to ~2.2x ratio, but reject anything
  near 4x).
- CRITICAL discriminator (obj-4): a counter that only increments inside
  an explicit inner loop cannot see work done inside a native
  `palette.includes`/`palette.indexOf` call, so a submission that swaps
  the inner loop for `palette.includes(color)` would report near-zero
  ops and masquerade as fast while remaining O(n^2) under the hood. The
  judge MUST read fixed.js's source and reject any submission using
  `.includes(`, `.indexOf(`, or an inner loop/scan over the palette
  array to decide membership, regardless of what the op-counts show.
  This check is independent of and cannot be overridden by a favorable
  op-count.
- obj-4 root-cause naming -- example phrasings for comparison:
  - PASS phrasings (2-3 examples): "the inner `for (j=0;j<palette.length)`
    loop scans the entire palette array for every new tile, making
    membership checks O(n) each and the whole function O(n^2); a `Set`
    gives O(1) amortized membership so the total becomes O(n)"; "swap the
    linear scan of `palette` for a `Set.has`/`Set.add` pair -- one hashed
    probe per tile instead of a growing linear scan"; "each new tile
    re-walks the accumulated palette, so the count is the sum
    1+2+...+(n/2) ~ n^2/8 -- replacing the walk with a hashed lookup
    collapses it to one probe per tile, O(n)".
  - FAIL phrasings (2-3 examples): "the sort is the slow part" (there is
    no sort); "add a cache to speed it up" (vague, no complexity class
    named); "switched `palette.includes(color)` for the loop and it's
    fixed" (still O(n^2) and bypasses the counter -- must be rejected by
    obj-4 regardless of claimed speedup).
- Complexity diagnosis: reward identifying that the scan target is the
  GROWING PALETTE array specifically (not the input tile list), and that
  each of the n tiles triggers a scan up to n/2 long in the worst case,
  giving the n^2/4-ish operation count matching the measured
  3600/14400/57600/230400 progression.
- Algorithmic rewrite: reward preserving first-appearance order exactly
  (Set membership check before insertion, not after) and keeping the
  `(tiles, counter)` signature and per-tile `counter.n++` contract
  intact.
- Reasoning quality: does PERF.md connect the fix back to the measured
  op-counts (e.g. cite the 4x-per-doubling buggy pattern and the
  ~1x-per-doubling, i.e. linear, fixed pattern) rather than asserting
  "Set is faster" without the complexity argument?
