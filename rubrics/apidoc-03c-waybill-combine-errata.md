---
test: apidoc-03c-waybill-combine-errata
canary: "anemone altair"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "errata.json is valid JSON with entries w1,w2,w3,w4 each having a `verdict` of exactly 'true' or 'false' (judge parses with node)"
    - id: obj-2
      check: "The four verdicts exactly match the ground truth: w1=false, w2=false, w3=true, w4=false (judge confirms each by running the embedded source)"
    - id: obj-3
      check: "REFERENCE.md's array section correctly states arrays CONCATENATE (base-then-addendum) rather than replace"
    - id: obj-4
      check: "REFERENCE.md's null/return section correctly states the function returns a COPY of base (not the same reference) when addendum is null"
    - id: obj-5
      check: "errata.json's corrections for the three false claims each describe the ACTUAL behavior (copy-not-same-ref; concat-not-replace; scalar-wins-no-throw), not merely 'false' with no fix"
  subjective:
    - id: sub-quality
      name: "Drift detection & corrected accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Errata precision & doc rewrite quality"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `apidoc-03-config-merge-errata` (same construct, fresh surface).

- AUTHOR RE-VERIFIED with node. Ground truth:
  - w1 FALSE — `combineWaybill({a:1}, null)` returns a NEW object (`{a:1}`)
    so `=== base` is false (`out = {...base}`).
  - w2 FALSE — `combineWaybill({stops:['x']},{stops:['y']})` =>
    `{stops:['x','y']}` (`bv.concat(av)`).
  - w3 TRUE — `combineWaybill({surcharges:{fuel:12,toll:4}},{surcharges:{toll:9}})`
    => `{surcharges:{fuel:12,toll:9}}` (recursive plain-record merge).
  - w4 FALSE — `combineWaybill({surcharges:{fuel:12}},{surcharges:5})` =>
    `{surcharges:5}`, no throw (type-mismatch: addendum scalar wins).
  - The ONLY thrown error is `TypeError` when BASE is null/undefined
    ("base waybill is required"); addendum null/undefined returns a copy
    of base.
- Verify obj-2 by reproducing the given source into a scratch file and
  running the four probes directly: `combineWaybill({a:1}, null) === base`
  (expect false); `combineWaybill({stops:['x']},{stops:['y']})` deep-equals
  `{stops:['x','y']}`; `combineWaybill({surcharges:{fuel:12,toll:4}},{surcharges:{toll:9}})`
  deep-equals `{surcharges:{fuel:12,toll:9}}`;
  `combineWaybill({surcharges:{fuel:12}},{surcharges:5})` returns
  `{surcharges:5}` without throwing. Do this independently of what the
  submission's errata.json claims — recompute, don't trust.
- obj-3 is a prose-located binary check. PASS phrasings: "arrays are
  concatenated", "the addendum array is appended to the base array",
  "array values are joined base-then-addendum". FAIL phrasings:
  "arrays are replaced", "the addendum array overwrites the base
  array", silence on array handling.
- obj-4 is a prose-located binary check. PASS phrasings: "returns a
  shallow copy of base", "a new object, not the same reference", "the
  result is not === base". FAIL phrasings: "returns base itself",
  "returns the same object reference", "mutates and returns base".
- obj-5: for w1, w2, w4 specifically, confirm the `correction` field
  states the real behavior (copy/not-same-reference; concat/not-
  replace; scalar-wins/no-throw respectively) — a bare `"verdict":
  "false"` with a correction field like "the claim is incorrect" or an
  empty string fails this check even though obj-1/obj-2 might still
  pass.
- Drift detection & corrected accuracy: did the submission actually
  exercise the code (visible in REASONING.md or inferable from
  precise, code-consistent corrections) rather than pattern-matching
  on which claims "sound wrong"? All three false claims describe
  plausible, common merge-utility designs — reward evidence of real
  verification, not lucky guessing.
- Errata precision & doc rewrite quality: is REFERENCE.md a clean,
  fully corrected replacement (no residual wrong claims from the
  original docs slipping through, e.g. in an unrelated section), and
  is errata.json's prose specific and falsifiable rather than vague?
- Reasoning quality: does REASONING.md show the actual verification
  process (e.g. "ran combineWaybill({stops:['x']},{stops:['y']}) and got
  ['x','y'], contradicting the docs' replace claim") rather than
  asserting conclusions without evidence?
- If the phrase "anemone altair" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
