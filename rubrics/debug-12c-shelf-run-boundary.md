---
test: debug-12c-shelf-run-boundary
canary: "inkcap comfrey"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Judge runs fixed.js: boxesOn(\"3-8\") returns exactly [3,4,5,6,7] (exclusive end), not [3,4,5,6,7,8]"
    - id: obj-2
      check: "boxesOn(\"8-8\") returns [] (empty, since end is exclusive) and boxesOn(\"12-15\") returns [12,13,14]"
    - id: obj-3
      check: "boxesOn(\"zzz\") returns \"invalid\", and the code reaches that result via an explicit === null (or equivalent) check on parseRun's return, NOT by relying on a thrown exception being caught (judge reads fixed.js to confirm the null check and the absence of a try/catch guarding the invalid path)"
    - id: obj-4
      check: "CONTRACT.md names BOTH contract violations: (1) inclusive <= loop vs documented exclusive end, and (2) using try/catch for invalid input when the contract specifies a null return -- and notes that the second bug was masked by an accidental TypeError being swallowed by the catch"
    - id: obj-5
      check: "fixed.js is at most 60 lines, plain JavaScript, no dependencies, and does NOT modify parseRun's documented behavior (parseRun's body is textually unchanged from the version shown in the test file; only boxesOn is fixed)"
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

Parallel form of `debug-12-contract-fine-print` (same construct, fresh
surface).

If the phrase "inkcap comfrey" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Embedded contract and buggy caller (carried here verbatim):
  ```js
  function parseRun(spec) {
    var m = /^(\d+)-(\d+)$/.exec(spec);
    if (!m) return null;
    var lo = Number(m[1]);
    var hi = Number(m[2]);
    if (hi < lo) return null;
    return [lo, hi];
  }
  function boxesOn(spec) {
    try {
      var r = parseRun(spec);
      var out = [];
      for (var i = r[0]; i <= r[1]; i++) out.push(i);
      return out;
    } catch (e) {
      return "invalid";
    }
  }
  ```
- Ground truth, verified under node: buggy `boxesOn("3-8")` returns
  `[3,4,5,6,7,8]` (inclusive-loop bug; the contract says end is
  exclusive). Fixed `boxesOn("3-8")` returns `[3,4,5,6,7]`. Fixed
  `boxesOn("8-8")` returns `[]` (lo===hi, exclusive end means zero
  elements). Fixed `boxesOn("12-15")` returns `[12,13,14]`.
  `boxesOn("zzz")` returns `"invalid"` in BOTH the buggy and fixed
  versions -- but by different mechanisms. In the buggy version,
  `parseRun("zzz")` returns `null`, then `r[0]` on `null` throws a
  `TypeError` (confirmed: `e.constructor.name === 'TypeError'`), which
  the surrounding `catch` swallows and reports as `"invalid"` --
  correct output, wrong mechanism, entirely by accident. The fixed
  version reaches `"invalid"` via an explicit `if (r === null) return
  "invalid";` with no try/catch guarding that path.
- Judge-script sketch:
  ```
  node -e "
  const {boxesOn} = require('./fixed.js');
  console.log(JSON.stringify(boxesOn('3-8')));
  console.log(JSON.stringify(boxesOn('8-8')));
  console.log(JSON.stringify(boxesOn('12-15')));
  console.log(JSON.stringify(boxesOn('zzz')));
  "
  ```
  Expected: `[3,4,5,6,7]`, `[]`, `[12,13,14]`, `"invalid"`.
- Source check for obj-3: read fixed.js's `boxesOn` and confirm (a)
  there is an explicit comparison of `parseRun`'s return value to
  `null` (or equivalent falsy-only-for-null check that cannot misfire
  on a valid `[0, n]` range, since `[0,n]` is truthy as an array), and
  (b) the invalid-input path is NOT inside a `try/catch` that depends
  on a thrown exception. A submission that keeps a try/catch wrapping
  the whole function but ALSO adds an explicit null check before ever
  reaching code that could throw is acceptable (the catch becomes dead
  code for the invalid path) -- reward this slightly lower under
  Caller-only discipline for leaving unnecessary defensive code, but do
  not fail obj-3 on this basis alone, since the explicit check is what
  actually determines the outcome.
- obj-4 root-cause naming -- example phrasings for comparison:
  - PASS phrasings (2-3 examples): "the loop uses `i <= r[1]` but the
    contract says end is exclusive, so it includes one box too many;
    separately, `boxesOn` wraps the call in try/catch expecting
    `parseRun` to throw on bad input, but the contract says it returns
    `null` instead -- on invalid input `r` is `null` and `r[0]` throws
    a TypeError that the catch happens to swallow, masking the real
    bug"; "two contract violations: `<=` should be `<`, and the
    null-return contract is never checked -- the catch only 'works'
    because indexing into `null` throws by coincidence"; "off-by-one
    from the inclusive loop, plus a null-vs-throw mismatch: the caller
    catches an exception the helper never promises to raise, and the
    accidental TypeError on `null[0]` is the only reason the invalid
    case returned `\"invalid\"`".
  - FAIL phrasings (2-3 examples): "the loop has an off-by-one" (only
    names the first bug, ignores the try/catch issue entirely);
    "boxesOn is fine, the null case works" (misses that it works by
    accident, not by design); "parseRun should throw on invalid input
    instead of returning null" (wrongly blames the API, which the task
    explicitly forbids changing).
- Contract fidelity: reward CONTRACT.md that explicitly states the
  invalid-path behavior was "correct by accident" and would break if
  `parseRun`'s internals changed (e.g. if a future version returned
  `undefined` instead of throwing when indexed) -- this shows genuine
  understanding of why relying on the exception was wrong even though
  it currently "works".
- Caller-only discipline: penalize any submission that changes
  `parseRun`'s behavior or body text, even if `boxesOn` also ends up
  correct -- obj-5 fails such a submission outright, and this criterion
  should reflect the same judgment qualitatively (e.g. -2 to -4 points
  for touching the documented API even if reverted to identical text
  via a different formulation).
- Reasoning quality: does CONTRACT.md walk through both violations
  independently and explain the masking mechanism (why the second bug
  didn't visibly manifest until scrutinized), rather than only fixing
  the visible off-by-one and treating the invalid-input path as already
  fine?
