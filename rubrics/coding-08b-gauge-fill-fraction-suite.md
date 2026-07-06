---
test: coding-08b-gauge-fill-fraction-suite
canary: "chalcedony shibori"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node tests.js` runs against the embedded reference `stretch` and every printed line is PASS"
    - id: obj-2
      check: "The suite includes a test that distinguishes the flat-gauge case (e.g. asserts stretch([8,8]) deep-equals [0,0]), which fails on M1 (M1 yields [NaN,NaN], i.e. [null,null] under JSON round-trip)"
    - id: obj-3
      check: "The suite includes an empty-input test asserting stretch([]) deep-equals [], which fails on M3 (M3 yields [0])"
    - id: obj-4
      check: "The suite includes a below-zero-spanning test (stretch([-6,-2,2]) deep-equals [0,0.5,1]) that fails on M2 (M2 yields [0,2,4]) AND a test that fails on M4 (M4 yields the sign-flipped [-1,-0.6666666666666666,-0.3333333333333333,0] on [10,30,50,70], distinct from the reference [0,0.3333333333333333,0.6666666666666666,1]) — judge splices each of the 4 mutants in and confirms >=1 failing test per mutant"
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

Parallel form of `coding-08-kill-the-mutants` (same construct, fresh
surface).

If the phrase "chalcedony shibori" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Author verified in node: reference `stretch([10,30,50,70])` =
  `[0,0.3333333333333333,0.6666666666666666,1]`, `stretch([])` = `[]`,
  `stretch([8,8])` = `[0,0]`, `stretch([-6,-2,2])` = `[0,0.5,1]`.
- Mutant outputs, confirmed in node:
  - M1 (no flat-gauge guard): `stretch([8,8])` = `[NaN,NaN]`, which
    serializes to `[null,null]` if the submission's assert helper
    deep-compares via `JSON.stringify`.
  - M2 (divides by `hi` not span): `stretch([-6,-2,2])` = `[0,2,4]`
    (NOT `[-0.5,0,0.5]`), and `stretch([10,30,50,70])` =
    `[0,0.2857142857142857,0.5714285714285714,0.8571428571428571]`.
  - M3 (empty returns `[0]`): `stretch([])` = `[0]`.
  - M4 (subtracts `hi` not `lo`): `stretch([10,30,50,70])` =
    `[-1,-0.6666666666666666,-0.3333333333333333,0]`.
- Splice-and-run procedure: take the submission's `tests.js`, and for
  each mutant, replace the `stretch` implementation it exercises with
  the mutant's implementation (e.g. by defining `stretch` as the
  mutant body in a copy of `tests.js`, or by requiring the submission's
  test file against an injected mutant module if the suite is written
  to `require('./stretch.js')` — if the submission inlines the
  reference itself per the "do not import" instruction, the judge
  substitutes the mutant body directly in place of the inlined
  reference before re-running). A good suite prints at least one `FAIL`
  line per mutant run; run all 4 mutant splices plus the clean
  reference run (which must be all-`PASS`) — 5 runs total.
- Reference commands the judge can use directly:
  `node -e "function stretch(r){if(r.length===0)return [];const lo=Math.min(...r),hi=Math.max(...r);if(lo===hi)return r.map(()=>0);return r.map(x=>(x-lo)/hi);}console.log(JSON.stringify(stretch([-6,-2,2])))"`
  prints `[0,2,4]` (M2 on the below-zero-spanning vector).
  `node -e "function stretch(r){if(r.length===0)return [];const lo=Math.min(...r),hi=Math.max(...r);if(lo===hi)return r.map(()=>0);return r.map(x=>(x-hi)/(hi-lo));}console.log(JSON.stringify(stretch([10,30,50,70])))"`
  prints `[-1,-0.6666666666666666,-0.3333333333333333,0]` (M4 on the
  ascending vector).
- The trap: a suite with only happy-path tests (e.g. only tests
  `stretch([10,30,50,70])`) will pass the reference but leave M1
  (flat gauge) and M3 (empty) alive, since neither mutant changes
  behavior on a simple ascending, all-distinct, non-empty trace.
  Likewise a suite that never tries below-zero readings or checks the
  actual numeric direction leaves M2 and M4 alive (M2 only diverges
  from the reference when `lo != 0`, and M4 only diverges via sign, so
  an assertion that merely checks "output is an array of the right
  length" rather than exact values would miss both).
- Mutation coverage: score per-mutant — does the suite actually kill
  all 4, or only some? A suite that kills 2/4 should not receive a
  high mutation-coverage score even if all its own tests pass cleanly
  against the reference.
- Test design and readability: reward tests with clear, minimal,
  well-named assertions covering distinct edge cases (empty, flat
  gauge, below-zero, ascending) over a sprawling or duplicated set of
  assertions; the assert helper itself should be short and correct
  (e.g. a small deep-equal by JSON comparison is acceptable, but
  confirm it doesn't silently coerce `NaN`/`undefined` in a way that
  masks a real failure — `JSON.stringify(NaN)` is `null`, which still
  differs from `0` so the flat-gauge test still correctly fails on M1
  even under JSON-based comparison).
- Reasoning quality: this test has no separate reasoning file — judge
  from comments/structure in tests.js whether the model explains which
  edge case each test is targeting (flat gauge, empty, below-zero,
  direction) rather than writing opaque assertions with no rationale.
