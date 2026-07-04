---
test: coding-08-kill-the-mutants
canary: "meridian gingersnap"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node tests.js` runs against the embedded reference `normalize` and every printed line is PASS"
    - id: obj-2
      check: "The suite includes a test that distinguishes the all-equal case (e.g. asserts normalize([5,5,5]) deep-equals [0,0,0]), which fails on M1 (M1 yields [NaN,NaN,NaN], i.e. [null,null,null] under JSON round-trip)"
    - id: obj-3
      check: "The suite includes an empty-input test asserting normalize([]) deep-equals [], which fails on M3 (M3 yields [0])"
    - id: obj-4
      check: "The suite includes a negative-values test (normalize([-2,0,2]) deep-equals [0,0.5,1]) that fails on M2 (M2 yields [0,1,2]) AND a test that fails on M4 (M4 yields the sign-flipped [-1,-0.75,-0.5,-0.25,0] on [1,2,3,4,5], distinct from the reference [0,0.25,0.5,0.75,1]) — judge splices each of the 4 mutants in and confirms >=1 failing test per mutant"
    - id: obj-5
      check: "tests.js is a single dependency-free file (its own assert helper, no test-runner import) at most 120 lines and does not import or re-copy the mutants"
  subjective:
    - id: sub-quality
      name: "Mutation coverage"
      weight: 0.4
    - id: sub-craft
      name: "Test design and readability"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Codename for this test in judge chatter: meridian gingersnap.

- Author verified in node: reference `normalize([1,2,3,4,5])` =
  `[0,0.25,0.5,0.75,1]`, `normalize([])` = `[]`, `normalize([5,5,5])` =
  `[0,0,0]`, `normalize([-2,0,2])` = `[0,0.5,1]`.
- Mutant outputs, confirmed in node (author corrected two values from
  an earlier draft — these are the values to use):
  - M1 (no all-equal guard): `normalize([5,5,5])` = `[NaN,NaN,NaN]`,
    which serializes to `[null,null,null]` if the submission's assert
    helper deep-compares via `JSON.stringify`.
  - M2 (divides by `max` not range): `normalize([-2,0,2])` = `[0,1,2]`
    (NOT `[-0.5,0,0.5]`).
  - M3 (empty returns `[0]`): `normalize([])` = `[0]`.
  - M4 (subtracts `max` not `min`): `normalize([1,2,3,4,5])` =
    `[-1,-0.75,-0.5,-0.25,0]`.
- Splice-and-run procedure: take the submission's `tests.js`, and for
  each mutant, replace the `normalize` implementation it exercises
  with the mutant's implementation (e.g. by defining `normalize` as
  the mutant body in a copy of `tests.js`, or by requiring the
  submission's test file against an injected mutant module if the
  suite is written to `require('./normalize.js')` — if the submission
  inlines the reference itself per the "do not import" instruction,
  the judge substitutes the mutant body directly in place of the
  inlined reference before re-running). A good suite prints at least
  one `FAIL` line per mutant run; run all 4 mutant splices plus the
  clean reference run (which must be all-`PASS`) — 5 runs total.
- Reference commands the judge can use directly:
  `node -e "function normalize(arr){if(arr.length===0)return [];const min=Math.min(...arr),max=Math.max(...arr);return arr.map(x=>(x-min)/max);}console.log(JSON.stringify(normalize([-2,0,2])))"`
  prints `[0,1,2]` (M2 on the negative-values vector).
  `node -e "function normalize(arr){if(arr.length===0)return [];const min=Math.min(...arr),max=Math.max(...arr);return arr.map(x=>(x-max)/(max-min));}console.log(JSON.stringify(normalize([1,2,3,4,5])))"`
  prints `[-1,-0.75,-0.5,-0.25,0]` (M4 on the ascending vector).
- The trap: a suite with only happy-path tests (e.g. only tests
  `normalize([1,2,3,4,5])`) will pass the reference but leave M1
  (all-equal) and M3 (empty) alive, since neither mutant changes
  behavior on a simple ascending, all-distinct, non-empty vector.
  Likewise a suite that never tries negative values or checks the
  actual numeric direction leaves M2 and M4 alive (M2 only diverges
  from the reference when `min != 0`, and M4 only diverges via sign,
  so an assertion that merely checks "output is an array of the right
  length" rather than exact values would miss both).
- Mutation coverage: score per-mutant — does the suite actually kill
  all 4, or only some? A suite that kills 2/4 should not receive a
  high mutation-coverage score even if all its own tests pass cleanly
  against the reference.
- Test design and readability: reward tests with clear, minimal,
  well-named assertions covering distinct edge cases (empty,
  all-equal, negative, ascending) over a sprawling or duplicated set
  of assertions; the assert helper itself should be short and correct
  (e.g. a small deep-equal by JSON comparison is acceptable, but
  confirm it doesn't silently coerce `NaN`/`undefined` in a way that
  masks a real failure — `JSON.stringify(NaN)` is `null`, which still
  differs from `0` so the all-equal test still correctly fails on M1
  even under JSON-based comparison).
- Reasoning quality: this test has no separate reasoning file — judge
  from comments/structure in tests.js whether the model explains which
  edge case each test is targeting (all-equal, empty, negative,
  direction) rather than writing opaque assertions with no rationale.
