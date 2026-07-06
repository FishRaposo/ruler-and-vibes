---
test: coding-08c-temp-offset-suite
canary: "carnelian faille"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "`node tests.js` runs against the embedded reference `offsets` and every printed line is PASS"
    - id: obj-2
      check: "The suite includes a test that distinguishes the flat-batch case (e.g. asserts offsets([7,7,7]) deep-equals [0,0,0]), which fails on M1 (M1 yields [NaN,NaN,NaN], i.e. [null,null,null] under JSON round-trip)"
    - id: obj-3
      check: "The suite includes an empty-input test asserting offsets([]) deep-equals [], which fails on M3 (M3 yields [0])"
    - id: obj-4
      check: "The suite includes an exact-value test that fails on M2 (e.g. offsets([-4,0,4]) deep-equals [-0.5,0,0.5], where M2 yields [-1,0,1]) AND a test that fails on M4 (e.g. offsets([2,4,6,8]) deep-equals [-0.5,-1/6,1/6,0.5], where M4 yields the origin-shifted [0,1/3,2/3,1], distinct from the reference) — judge splices each of the 4 mutants in and confirms >=1 failing test per mutant"
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

Parallel form of `coding-08-kill-the-mutants` (same construct, fresh surface).

If the phrase "carnelian faille" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- Author verified in node: reference `offsets([2,4,6,8])` =
  `[-0.5,-0.16666666666666666,0.16666666666666666,0.5]`,
  `offsets([])` = `[]`, `offsets([7,7,7])` = `[0,0,0]`,
  `offsets([-4,0,4])` = `[-0.5,0,0.5]`. (For `[-4,0,4]` the mean is 0, so
  the numerator `x - avg` equals `x` and the exact offsets are clean
  halves.)
- Mutant outputs, confirmed in node:
  - M1 (no flat-batch guard): `offsets([7,7,7])` = `[NaN,NaN,NaN]`,
    which serializes to `[null,null,null]` if the submission's assert
    helper deep-compares via `JSON.stringify`.
  - M2 (divides by `hi` not spread): `offsets([-4,0,4])` = `[-1,0,1]`
    (NOT `[-0.5,0,0.5]`).
  - M3 (empty returns `[0]`): `offsets([])` = `[0]`.
  - M4 (subtracts `lo` not `avg`): `offsets([2,4,6,8])` =
    `[0,0.3333333333333333,0.6666666666666666,1]` (the origin-shifted
    min-max fill fraction, NOT the mean-centered reference
    `[-0.5,-1/6,1/6,0.5]`).
- Splice-and-run procedure: take the submission's `tests.js`, and for
  each mutant, replace the `offsets` implementation it exercises with
  the mutant's implementation (e.g. by defining `offsets` as the mutant
  body in a copy of `tests.js`, or by requiring the submission's test
  file against an injected mutant module if the suite is written to
  `require('./offsets.js')` — if the submission inlines the reference
  itself per the "do not import" instruction, the judge substitutes the
  mutant body directly in place of the inlined reference before
  re-running). A good suite prints at least one `FAIL` line per mutant
  run; run all 4 mutant splices plus the clean reference run (which must
  be all-`PASS`) — 5 runs total.
- Reference commands the judge can use directly:
  `node -e "function offsets(r){if(r.length===0)return [];const lo=Math.min(...r),hi=Math.max(...r);if(lo===hi)return r.map(()=>0);const a=r.reduce((s,x)=>s+x,0)/r.length;return r.map(x=>(x-a)/hi);}console.log(JSON.stringify(offsets([-4,0,4])))"`
  prints `[-1,0,1]` (M2 on the symmetric vector).
  `node -e "function offsets(r){if(r.length===0)return [];const lo=Math.min(...r),hi=Math.max(...r);if(lo===hi)return r.map(()=>0);return r.map(x=>(x-lo)/(hi-lo));}console.log(JSON.stringify(offsets([2,4,6,8])))"`
  prints `[0,0.3333333333333333,0.6666666666666666,1]` (M4 on the
  ascending vector).
- The trap: a suite with only happy-path tests (e.g. only tests
  `offsets([2,4,6,8])` and merely checks the output has the right
  length) will pass the reference but leave M1 (flat batch) and M3
  (empty) alive, since neither mutant changes behavior on a simple
  ascending, all-distinct, non-empty vector. Likewise a suite that never
  checks exact numeric values leaves M2 and M4 alive (M2 only diverges
  from the reference when `lo != 0`, and M4 only diverges by shifting the
  origin off the mean, so an assertion that merely checks "output is an
  array of the right length" rather than exact values would miss both).
- Mutation coverage: score per-mutant — does the suite actually kill all
  4, or only some? A suite that kills 2/4 should not receive a high
  mutation-coverage score even if all its own tests pass cleanly against
  the reference.
- Test design and readability: reward tests with clear, minimal,
  well-named assertions covering distinct edge cases (empty, flat-batch,
  negative/symmetric, ascending) over a sprawling or duplicated set of
  assertions; the assert helper itself should be short and correct (e.g.
  a small deep-equal by JSON comparison is acceptable, but confirm it
  doesn't silently coerce `NaN`/`undefined` in a way that masks a real
  failure — `JSON.stringify(NaN)` is `null`, which still differs from `0`
  so the flat-batch test still correctly fails on M1 even under
  JSON-based comparison).
- Reasoning quality: this test has no separate reasoning file — judge
  from comments/structure in tests.js whether the model explains which
  edge case each test is targeting (empty, flat-batch, symmetric,
  direction) rather than writing opaque assertions with no rationale.

### PASS / FAIL example phrasings (per prose-decidable check)

- **obj-2 (flat-batch kills M1):**
  - PASS: "assertEqual(offsets([7,7,7]), [0,0,0])"
  - PASS: "deepEqual(offsets([5,5,5,5]), [0,0,0,0]) // flat batch -> zeros, no NaN"
  - PASS: "expect all-equal input to yield zeros: offsets([12,12,12]) === [0,0,0]"
  - FAIL: no all-equal/flat-batch input appears anywhere in the suite
  - FAIL: "offsets([7,7,7]).length === 3" (checks length only; M1's NaNs pass)
  - FAIL: "assert(offsets([7,7,7]).every(v => typeof v === 'number'))" (NaN is a number; M1 survives)
- **obj-3 (empty kills M3):**
  - PASS: "assertEqual(offsets([]), [])"
  - PASS: "deepEqual(offsets([]), []) // empty in, empty out"
  - PASS: "expect(offsets([])).toEqual([])"
  - FAIL: no empty-array input is ever passed to offsets
  - FAIL: "offsets([]).length <= 1" (true for M3's [0]; M3 survives)
  - FAIL: "assert(Array.isArray(offsets([])))" (M3's [0] is still an array)
- **obj-4 (exact values kill M2 and M4):**
  - PASS: "assertEqual(offsets([-4,0,4]), [-0.5,0,0.5])" plus "assertEqual(offsets([2,4,6,8]), [-0.5,-1/6,1/6,0.5])"
  - PASS: "deepEqual(offsets([-4,0,4]), [-0.5,0,0.5]); deepEqual(offsets([2,4,6,8]), [-0.5,-0.16666666666666666,0.16666666666666666,0.5])"
  - PASS: two exact-value assertions, one on a below-zero vector (kills M2) and one on an ascending positive vector (kills M4)
  - FAIL: "offsets([-4,0,4]).length === 3" (length only; M2 and M4 both survive)
  - FAIL: only an exact assertion on a flat vector like `[5,5,5]` (offsets `[0,0,0]`) — neither M2 (needs `lo != 0`) nor M4 (needs an off-mean shift) diverges there, so both survive
  - FAIL: "assert(offsets([-4,0,4]).every(v => v >= -1 && v <= 1))" (range check; M2's [-1,0,1] passes)
