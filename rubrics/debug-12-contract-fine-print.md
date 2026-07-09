---
test: debug-12-contract-fine-print
canary: "pebble gantry"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Judge runs fixed.js: expand(\"2-5\") returns exactly [2,3,4] (exclusive end), not [2,3,4,5]"
    - id: obj-2
      check: "expand(\"5-5\") returns [] (empty, since end is exclusive) and expand(\"7-10\") returns [7,8,9]"
    - id: obj-3
      check: "expand(\"zzz\") returns \"invalid\", and the code reaches that result via an explicit === null (or equivalent) check on parseRange's return, NOT by relying on a thrown exception being caught (judge reads fixed.js to confirm the null check and the absence of a try/catch guarding the invalid path)"
    - id: obj-4
      check: "CONTRACT.md names BOTH contract violations: (1) inclusive <= loop vs documented exclusive end, and (2) using try/catch for invalid input when the contract specifies a null return -- and notes that the second bug was masked by an accidental TypeError being swallowed by the catch"
    - id: obj-5
      check: "fixed.js is at most 60 lines, plain JavaScript, no dependencies, and does NOT modify parseRange's documented behavior (parseRange's body is textually unchanged from the version shown in the test file; only expand is fixed)"
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
anchors:
  - id: Contract fidelity
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Caller-only discipline
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "pebble gantry" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Embedded contract and buggy caller (carried here verbatim):
  ```js
  function parseRange(spec) {
    var m = /^(\d+)-(\d+)$/.exec(spec);
    if (!m) return null;
    var start = Number(m[1]);
    var end = Number(m[2]);
    if (end < start) return null;
    return [start, end];
  }
  function expand(spec) {
    try {
      var r = parseRange(spec);
      var out = [];
      for (var i = r[0]; i <= r[1]; i++) out.push(i);
      return out;
    } catch (e) {
      return "invalid";
    }
  }
  ```
- Ground truth, verified under node: buggy `expand("2-5")` returns
  `[2,3,4,5]` (inclusive-loop bug; the contract says end is
  exclusive). Fixed `expand("2-5")` returns `[2,3,4]`. Fixed
  `expand("5-5")` returns `[]` (start===end, exclusive end means zero
  elements). Fixed `expand("7-10")` returns `[7,8,9]`.
  `expand("zzz")` returns `"invalid"` in BOTH the buggy and fixed
  versions -- but by different mechanisms. In the buggy version,
  `parseRange("zzz")` returns `null`, then `r[0]` on `null` throws a
  `TypeError` (confirmed: `e.constructor.name === 'TypeError'`), which
  the surrounding `catch` swallows and reports as `"invalid"` --
  correct output, wrong mechanism, entirely by accident. The fixed
  version reaches `"invalid"` via an explicit `if (r === null) return
  "invalid";` with no try/catch guarding that path.
- Judge-script sketch:
  ```
  node -e "
  const {expand} = require('./fixed.js');
  console.log(JSON.stringify(expand('2-5')));
  console.log(JSON.stringify(expand('5-5')));
  console.log(JSON.stringify(expand('7-10')));
  console.log(JSON.stringify(expand('zzz')));
  "
  ```
  Expected: `[2,3,4]`, `[]`, `[7,8,9]`, `"invalid"`.
- Source check for obj-3: read fixed.js's `expand` and confirm (a)
  there is an explicit comparison of `parseRange`'s return value to
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
  - PASS phrasings (2-3 examples): "the loop uses `i <= r[1]` but the
    contract says end is exclusive, so it includes one element too
    many; separately, `expand` wraps the call in try/catch expecting
    `parseRange` to throw on bad input, but the contract says it
    returns `null` instead -- on invalid input `r` is `null` and
    `r[0]` throws a TypeError that the catch happens to swallow,
    masking the real bug"; "two contract violations: `<=` should be
    `<`, and the null-return contract is never checked -- the catch
    only 'works' because indexing into `null` throws by coincidence".
  - FAIL phrasings (2-3 examples): "the loop has an off-by-one" (only
    names the first bug, ignores the try/catch issue entirely);
    "expand is fine, the null case works" (misses that it works by
    accident, not by design); "parseRange should throw on invalid
    input instead of returning null" (wrongly blames the API, which
    the task explicitly forbids changing).
- Contract fidelity: reward CONTRACT.md that explicitly states the
  invalid-path behavior was "correct by accident" and would break if
  `parseRange`'s internals changed (e.g. if a future version returned
  `undefined` instead of throwing when indexed) -- this shows genuine
  understanding of why relying on the exception was wrong even though
  it currently "works".
- Caller-only discipline: penalize any submission that changes
  `parseRange`'s behavior or body text, even if `expand` also ends up
  correct -- obj-5 fails such a submission outright, and this
  criterion should reflect the same judgment qualitatively (e.g. -2 to
  -4 points for touching the documented API even if reverted to
  identical text via a different formulation).
- Reasoning quality: does CONTRACT.md walk through both violations
  independently and explain the masking mechanism (why the second bug
  didn't visibly manifest until scrutinized), rather than only fixing
  the visible off-by-one and treating the invalid-input path as
  already fine?
