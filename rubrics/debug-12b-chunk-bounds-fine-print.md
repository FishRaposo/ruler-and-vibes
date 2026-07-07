---
test: debug-12b-chunk-bounds-fine-print
canary: "puffball crocket"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Judge runs fixed.js: gatherRows(\"4:9\") returns exactly [4,5,6,7,8] (exclusive hi), not [4,5,6,7,8,9]"
    - id: obj-2
      check: "gatherRows(\"6:6\") returns [] (empty, since hi is exclusive) and gatherRows(\"11:14\") returns [11,12,13]"
    - id: obj-3
      check: "gatherRows(\"qqq\") returns \"skip\", and the code reaches that result via an explicit === null (or equivalent) check on chunkBounds's return, NOT by relying on a thrown exception being caught (judge reads fixed.js to confirm the null check and the absence of a try/catch guarding the invalid path)"
    - id: obj-4
      check: "CONTRACT.md names BOTH contract violations: (1) inclusive <= loop vs documented exclusive hi, and (2) using try/catch for invalid input when the contract specifies a null return -- and notes that the second bug was masked by an accidental TypeError being swallowed by the catch"
    - id: obj-5
      check: "fixed.js is at most 60 lines, plain JavaScript, no dependencies, and does NOT modify chunkBounds's documented behavior (chunkBounds's body is textually unchanged from the version shown in the test file; only gatherRows is fixed)"
  subjective:
    - id: sub-quality
      name: "Contract fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Caller-only discipline"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `debug-12-contract-fine-print` (same construct, fresh surface).

If the phrase "puffball crocket" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Embedded contract and buggy caller (carried here verbatim):
  ```js
  function chunkBounds(spec) {
    var m = /^(\d+):(\d+)$/.exec(spec);
    if (!m) return null;
    var lo = Number(m[1]);
    var hi = Number(m[2]);
    if (hi < lo) return null;
    return [lo, hi];
  }
  function gatherRows(spec) {
    try {
      var b = chunkBounds(spec);
      var out = [];
      for (var i = b[0]; i <= b[1]; i++) out.push(i);
      return out;
    } catch (e) {
      return "skip";
    }
  }
  ```
- Ground truth, verified under node: buggy `gatherRows("4:9")` returns
  `[4,5,6,7,8,9]` (inclusive-loop bug; the contract says hi is
  exclusive). Fixed `gatherRows("4:9")` returns `[4,5,6,7,8]`. Fixed
  `gatherRows("6:6")` returns `[]` (lo===hi, exclusive hi means zero
  elements). Fixed `gatherRows("11:14")` returns `[11,12,13]`.
  `gatherRows("qqq")` returns `"skip"` in BOTH the buggy and fixed
  versions -- but by different mechanisms. In the buggy version,
  `chunkBounds("qqq")` returns `null`, then `b[0]` on `null` throws a
  `TypeError` (confirmed: `e.constructor.name === 'TypeError'`), which
  the surrounding `catch` swallows and reports as `"skip"` --
  correct output, wrong mechanism, entirely by accident. The fixed
  version reaches `"skip"` via an explicit `if (b === null) return
  "skip";` with no try/catch guarding that path. (The same accidental
  masking also covers the `hi < lo` case, e.g. `gatherRows("9:3")`,
  where `chunkBounds` likewise returns `null`.)
- Judge-script sketch:
  ```
  node -e "
  const {gatherRows} = require('./fixed.js');
  console.log(JSON.stringify(gatherRows('4:9')));
  console.log(JSON.stringify(gatherRows('6:6')));
  console.log(JSON.stringify(gatherRows('11:14')));
  console.log(JSON.stringify(gatherRows('qqq')));
  "
  ```
  Expected: `[4,5,6,7,8]`, `[]`, `[11,12,13]`, `"skip"`.
- Source check for obj-3: read fixed.js's `gatherRows` and confirm (a)
  there is an explicit comparison of `chunkBounds`'s return value to
  `null` (or equivalent falsy-only-for-null check that cannot
  misfire on a valid `[0, n]` range, since `[0,n]` is truthy as an
  array), and (b) the invalid-input path is NOT inside a `try/catch`
  that depends on a thrown exception. A submission that keeps a
  try/catch wrapping the whole function but ALSO adds an explicit
  null check before ever reaching code that could throw is acceptable
  (the catch becomes dead code for the invalid path) -- reward this
  slightly lower under Caller-only discipline for leaving unnecessary
  defensive code, but do not fail obj-3 on this basis alone, since the
  explicit check is what actually determines the outcome.
- obj-4 root-cause naming -- example phrasings for comparison:
  - PASS phrasings (2-3 examples): "the loop uses `i <= b[1]` but the
    contract says hi is exclusive, so it includes one row too
    many; separately, `gatherRows` wraps the call in try/catch expecting
    `chunkBounds` to throw on bad input, but the contract says it
    returns `null` instead -- on invalid input `b` is `null` and
    `b[0]` throws a TypeError that the catch happens to swallow,
    masking the real bug"; "two contract violations: `<=` should be
    `<`, and the null-return contract is never checked -- the catch
    only 'works' because indexing into `null` throws by coincidence";
    "off-by-one on the exclusive bound plus a bogus try/catch that
    silently relies on `null[0]` throwing rather than checking the
    documented null return".
  - FAIL phrasings (2-3 examples): "the loop has an off-by-one" (only
    names the first bug, ignores the try/catch issue entirely);
    "gatherRows is fine, the invalid case works" (misses that it works
    by accident, not by design); "chunkBounds should throw on invalid
    input instead of returning null" (wrongly blames the API, which
    the task explicitly forbids changing).
- Contract fidelity: reward CONTRACT.md that explicitly states the
  invalid-path behavior was "correct by accident" and would break if
  `chunkBounds`'s internals changed (e.g. if a future version returned
  `undefined` instead of throwing when indexed) -- this shows genuine
  understanding of why relying on the exception was wrong even though
  it currently "works".
- Caller-only discipline: penalize any submission that changes
  `chunkBounds`'s behavior or body text, even if `gatherRows` also ends
  up correct -- obj-5 fails such a submission outright, and this
  criterion should reflect the same judgment qualitatively (e.g. -2 to
  -4 points for touching the documented API even if reverted to
  identical text via a different formulation).
- Reasoning quality: does CONTRACT.md walk through both violations
  independently and explain the masking mechanism (why the second bug
  didn't visibly manifest until scrutinized), rather than only fixing
  the visible off-by-one and treating the invalid-input path as
  already fine?
