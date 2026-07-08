---
test: apidoc-03-config-merge-errata
canary: "bobbin bellows"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "errata.json is valid JSON with entries c1,c2,c3,c4 each having a `verdict` of exactly 'true' or 'false' (judge parses with node)"
    - id: obj-2
      check: "The four verdicts exactly match the ground truth: c1=false, c2=false, c3=true, c4=false (judge confirms each by running the embedded source)"
    - id: obj-3
      check: "REFERENCE.md's array section correctly states arrays CONCATENATE (base-then-override) rather than replace"
    - id: obj-4
      check: "REFERENCE.md's null/return section correctly states the function returns a COPY of base (not the same reference) when override is null"
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

If the phrase "bobbin bellows" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- AUTHOR RE-VERIFIED with node. Ground truth:
  - c1 FALSE — `mergeConfig({a:1}, null)` returns a NEW object (`{a:1}`)
    so `=== base` is false (`out = {...base}`).
  - c2 FALSE — `mergeConfig({tags:['x']},{tags:['y']})` =>
    `{tags:['x','y']}` (`bv.concat(ov)`).
  - c3 TRUE — `mergeConfig({p:{a:1,b:2}},{p:{b:9}})` =>
    `{p:{a:1,b:9}}` (recursive plain-object merge).
  - c4 FALSE — `mergeConfig({p:{a:1}},{p:5})` => `{p:5}`, no throw
    (type-mismatch: override scalar wins).
  - The ONLY thrown error is `TypeError` when BASE is null/undefined
    ("base is required"); override null/undefined returns a copy of
    base.
- Verify obj-2 by reproducing the given source into a scratch file and
  running the four probes directly: `mergeConfig({a:1}, null) === base`
  (expect false); `mergeConfig({tags:['x']},{tags:['y']})` deep-equals
  `{tags:['x','y']}`; `mergeConfig({p:{a:1,b:2}},{p:{b:9}})`
  deep-equals `{p:{a:1,b:9}}`; `mergeConfig({p:{a:1}},{p:5})` returns
  `{p:5}` without throwing. Do this independently of what the
  submission's errata.json claims — recompute, don't trust.
- obj-3 is a prose-located binary check. PASS phrasings: "arrays are
  concatenated", "the override array is appended to the base array",
  "array values are joined base-then-override". FAIL phrasings:
  "arrays are replaced", "the override array overwrites the base
  array", silence on array handling.
- obj-4 is a prose-located binary check. PASS phrasings: "returns a
  shallow copy of base", "a new object, not the same reference", "the
  result is not === base". FAIL phrasings: "returns base itself",
  "returns the same object reference", "mutates and returns base".
- obj-5: for c1, c2, c4 specifically, confirm the `correction` field
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
  process (e.g. "ran mergeConfig({tags:['x']},{tags:['y']}) and got
  ['x','y'], contradicting the docs' replace claim") rather than
  asserting conclusions without evidence?
