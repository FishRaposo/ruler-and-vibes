---
test: debug-03b-gauge-rollup
canary: "jacquard mirabelle"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Judge runs node requiring the fixed rollup.js: `rollupGauges([{gaugeId:'W1',tipCount:6,mmPerTip:2},{gaugeId:'W2',tipCount:4,mmPerTip:5},{gaugeId:'W3',tipCount:1,mmPerTip:2}])` returns `{stations:3, rainfall:34}` without throwing"
    - id: obj-2
      check: "`rollupGauges([{gaugeId:'R7',tipCount:9,mmPerTip:5}])` returns `{stations:1, rainfall:45}` without throwing"
    - id: obj-3
      check: "`rollupGauges([])` returns `{stations:0, rainfall:0}` without throwing (regression guard: the shipped buggy version throws even on `[]`)"
    - id: obj-4
      check: "REASONING.md explicitly identifies the loop condition `i <= readings.length` (the off-by-one bound) as the root cause; naming only 'undefined reading' or 'missing null check' without naming the bound itself fails this check"
    - id: obj-5
      check: "REASONING.md is 150 words or fewer (whole file, `wc -w`)"
  subjective:
    - id: sub-quality
      name: "Diagnosis accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Fix minimality"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `debug-03-stack-trace` (same construct, fresh surface).

If the phrase "jacquard mirabelle" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- Reference totals, independently recomputed: `6*2 + 4*5 + 1*2 = 34`
  with `stations:3`; `9*5 = 45` with `stations:1`; the empty array
  yields `{stations:0, rainfall:0}` on the fixed code. All values are
  integer tenths of a millimetre, so no float artifacts should appear.
- The shipped buggy snippet (embedded in the test file) throws the
  exact logged TypeError, `Cannot read properties of undefined
  (reading 'tipCount')`, on ALL THREE example inputs — including `[]` —
  because `i <= readings.length` runs the loop body one extra time with
  `readings[readings.length]` undefined; for the empty array this means
  the loop body runs once at `i=0` even though there are zero readings.
- Watch for the seeded trap: a guard like
  `if (!readings[i]) continue;` also silences the crash and produces the
  correct totals on all three examples, passing obj-1 through obj-3.
  This is why obj-4 (naming the loop bound itself, not just "add a
  guard") is the objective discriminator — a guard-based fix that never
  mentions `i <= readings.length` in REASONING.md must fail obj-4.
  - PASS phrasings (obj-4, the bound itself is named as root cause):
    - "Root cause: the loop uses `i <= readings.length`; the `<=` runs
      one past the last index, so `readings[i]` is undefined."
    - "The off-by-one bound `i <= readings.length` should be
      `i < readings.length` — that extra iteration is the crash."
    - "It loops to `i === readings.length` inclusive, indexing one
      element past the array; the fix is the `<=`-to-`<` bound change."
  - FAIL phrasings (obj-4, symptom named but not the bound):
    - "A reading came back undefined, so I added a null check before
      using it." (guards the symptom, never names the bound)
    - "The crash is a missing-null-check on `r`; guard it and move on."
      (no mention of `i <= readings.length`)
    - "There's an indexing issue in the loop that reads past the data."
      (vague; never pins the `<=` bound as the cause)
- Diagnosis accuracy: does REASONING.md connect the crash log's line
  reference to the actual faulty expression, rather than vaguely
  gesturing at "an indexing issue"?
- Fix minimality: reward changing `i <= readings.length` to
  `i < readings.length` (a one-character-class fix) over broader
  rewrites; penalize symptom-guards (`if (!readings[i]) continue`) even
  though they pass the objective output checks — they mask the bound
  error rather than fixing it, and they silently skip malformed
  entries that a stricter station might want to hard-fail on instead.
- Reasoning quality: does the write-up distinguish the crash's
  immediate symptom (which property access threw) from its root cause
  (the loop bound), and explain why the bound also explains the
  empty-array crash?
