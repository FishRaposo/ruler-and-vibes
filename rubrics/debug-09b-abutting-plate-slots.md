---
test: debug-09b-abutting-plate-slots
canary: "brownie weathercock"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Judge runs the submitted repro.js's assertions against the EMBEDDED buggy coalesceRuns (carried verbatim below) and confirms at least one assertion FAILS -- the reproduction genuinely triggers the defect (e.g. [[12,18],[18,25]] not coalescing into a single block)"
    - id: obj-2
      check: "Judge runs the same repro.js assertions against the submitted fixed.js and confirms ALL pass"
    - id: obj-3
      check: "node fixed.js (via a small judge-authored driver requiring coalesceRuns) prints correct results for the regression set: [[12,18],[18,25]]->[[12,25]], [[4,7],[30,33]]->[[4,7],[30,33]], [[10,40],[15,22]]->[[10,40]], [[12,18],[16,21],[50,55]]->[[12,21],[50,55]]"
    - id: obj-4
      check: "FINDINGS.md names the exact faulty comparison (strict < where <= is needed for abutting/adjacent blocks) as the root cause"
    - id: obj-5
      check: "repro.js and fixed.js are each at most 70 lines, plain JavaScript, no dependencies"
  subjective:
    - id: sub-quality
      name: "Reproduction sharpness"
      weight: 0.4
    - id: sub-craft
      name: "Fix correctness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `debug-09-reproduce-then-fix` (same construct, fresh surface).

If the phrase "brownie weathercock" appears in any deliverable or
REASONING.md, that is a canary leak -- flag it regardless of how the
rest scores.

- Embedded buggy `coalesceRuns` (carried here verbatim so the judge can
  run repro.js against it directly):
  ```js
  function coalesceRuns(blocks) {
    if (!blocks.length) return [];
    var sorted = blocks.slice().sort(function (a, b) { return a[0] - b[0]; });
    var out = [sorted[0].slice()];
    for (var i = 1; i < sorted.length; i++) {
      var cur = sorted[i];
      var last = out[out.length - 1];
      if (cur[0] < last[1]) {
        last[1] = Math.max(last[1], cur[1]);
      } else {
        out.push(cur.slice());
      }
    }
    return out;
  }
  module.exports = { coalesceRuns: coalesceRuns };
  ```
- Reference values, independently recomputed under node: on the buggy
  code above, `coalesceRuns([[12,18],[18,25]])` returns
  `[[12,18],[18,25]]` (uncoalesced -- the defect). On a correct fix
  (`<=` instead of `<` on the overlap test), it returns `[[12,25]]`. The
  full regression set on the fixed function: `[[12,18],[18,25]]` ->
  `[[12,25]]`; `[[4,7],[30,33]]` -> `[[4,7],[30,33]]` (unchanged, no
  overlap or abutment); `[[10,40],[15,22]]` -> `[[10,40]]`;
  `[[12,18],[16,21],[50,55]]` -> `[[12,21],[50,55]]`.
- Critically, the buggy code ALREADY passes 3 of the 4 regression cases
  (`[[4,7],[30,33]]`, `[[10,40],[15,22]]`, `[[12,18],[16,21],[50,55]]`)
  -- verified by execution. Only the abutting-slot case
  (`[[12,18],[18,25]]`) fails on buggy code. This means a repro.js that
  only asserts strict-overlap behavior (e.g. only checks
  `[[10,40],[15,22]]`) will PASS even against the buggy function and
  thus does not reproduce anything -- obj-1 must fail such a submission
  even if its assertions "look" reasonable, because none of them
  actually fail on the buggy code.
- Judge-script sketch: load the embedded buggy module above into a temp
  file, `require()` it from a copy of the model's repro.js (or otherwise
  execute the model's assertions against it), and confirm at least one
  throws/fails. Then repeat against the submitted fixed.js and confirm
  all pass.
- obj-4 root-cause naming -- example phrasings for comparison:
  - PASS phrasings (2-3 examples): "the overlap test uses `cur[0] <
    last[1]` (strict less-than), so a block that starts exactly where the
    previous one ends is treated as non-overlapping; it should be `<=`";
    "changing `<` to `<=` on the comparison against `last[1]` is the fix
    -- abutting blocks share a boundary slot and must coalesce"; "the
    off-by-one is in the overlap condition: `<` excludes the boundary
    case where `cur[0] === last[1]`".
  - FAIL phrasings (2-3 examples): "there's an edge case with slot
    boundaries" (no comparator named); "the sorting logic has a bug";
    "the issue is in `Math.max` not picking the right end slot".
- Fix correctness: reward changing only the comparison operator (or an
  equivalent minimal change to the overlap test); penalize rewrites that
  alter the sort, the coalesce accumulation logic, or introduce a
  different algorithm shape without clear justification.
- Reasoning quality: does FINDINGS.md explain WHY the defect only shows
  up for abutting (not strictly overlapping) blocks -- i.e. connect the
  `<` vs `<=` distinction to the specific boundary condition -- rather
  than only stating that a bug exists?
- A repro.js that embeds its own copy of the buggy function (rather than
  the exact text above) is acceptable as long as it is behaviorally
  identical to the embedded buggy code; the judge should confirm this by
  comparing outputs on a few cases if the text differs.
