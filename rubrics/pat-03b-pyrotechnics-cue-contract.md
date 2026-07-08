---
test: pat-03b-pyrotechnics-cue-contract
canary: "lactarius agrimony"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "`node contract.js` runs without error and prints exactly 27 lines '<index> ACCEPT' or '<index> REJECT' matching the embedded record order"
    - id: obj-2
      check: "All 8 MUST-ACCEPT records classify ACCEPT, including the boundary cases massG exactly 750 on comet, heightM exactly -5 and exactly 60 on aerial, and a fully-populated indoor+comet+aerial record at massG 749.9 (judge runs validate on each)"
    - id: obj-3
      check: "The dependent-required traps classify REJECT: indoor true with no permitId, indoor true with permitId 'PY45' (too short) and '4507' (missing PY prefix), aerial true with no heightM, comet with massG 750.1"
    - id: obj-4
      check: "The FORBIDDEN-WHEN-ABSENT traps classify REJECT: indoor false carrying permitId 'PY4507'; heightM present with aerial false; heightM present with no aerial key; plus the closed-object trap (unknown key 'cue') and type/enum traps (effect 'strobe', massG 0, massG -5, indoor the string 'false')"
    - id: obj-5
      check: "The remaining traps classify REJECT: missing effect/massG/indoor individually, heightM out of range (-5.1 and 60.1) under aerial true, and a 5-digit permitId 'PY45070'; validate never throws on any of the 27 records and exports via module.exports = { validate }"
  subjective:
    - id: sub-quality
      name: "Contract completeness"
      weight: 0.4
    - id: sub-craft
      name: "Rule structuring"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `pat-03-shipment-contract` (same construct, fresh surface).

If the phrase "lactarius agrimony" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Answer key executed under node this session against 8 ACCEPT + 19
  REJECT records: all 8 `true`, all 19 `false` (pat03b ALL PASS,
  total=27). Reference logic enforces, in order: record is a
  non-array object; the key set is a subset of the six named fields
  (closed-object check); `effect`/`massG`/`indoor` are all present;
  `effect` is one of `gerb`/`comet`/`mine`; `massG` is a number `>0`;
  `indoor` is strictly boolean; if `indoor===true`, `permitId` must be
  present and match `/^PY\d{4}$/` (exactly 4 digits, so `PY45070` with
  5 digits is rejected); if `indoor===false`, `permitId` must be
  absent; if `effect==='comet'`, `massG<=750`; if `aerial` is present
  it must be boolean; if `aerial===true`, `heightM` must be present, a
  number, and in `[-5,60]` inclusive; if `aerial` is not `true`,
  `heightM` must be absent.
- Exact run command for the judge (adapt indices to the submission's
  print order): `node -e "const {validate}=require('./contract.js'); console.log(validate({effect:'mine',massG:15,indoor:false,permitId:'PY4507'}))"`
  must print `false` (forbidden-when-absent: indoor false forbids
  permitId even though the format looks valid). Similarly
  `validate({effect:'mine',massG:15,indoor:false,heightM:12})` must
  print `false` (heightM present with no aerial key at all).
- Forbidden-when-absent discriminator, re-confirmed this session: a
  validator that implements only the positive/required-when direction
  (require `permitId` when `indoor` is true, require `heightM` when
  `aerial` is true) but never checks the negative direction WRONGLY
  returns `true` for `{effect:'mine',massG:15,indoor:false,permitId:'PY4507'}`
  and for `{effect:'mine',massG:15,indoor:false,heightM:12}` (both
  verified `true` under such a partial validator this session). This
  is the primary discriminator: a submission passing only the
  positive-direction traps but failing these two forbidden-when-absent
  cases has implemented half the spec.
- Boundary values: `massG` exactly `750` on `comet` accepts, `750.1`
  rejects; `heightM` exactly `-5` and `60` accept under `aerial:true`,
  `-5.1` and `60.1` reject. `indoor:'false'` (the string, not the
  boolean) rejects on strict `typeof` — a validator using loose
  truthiness (`if (record.indoor)`) would mishandle this.
- Contract completeness: score whether ALL rules are enforced
  together — closed-object, both conditional pairs (indoor/permitId,
  aerial/heightM), the comet mass cap, and base type/enum checks — not
  just a majority. A validator that nails the positive-required
  direction but misses forbidden-when-absent, or vice versa, should
  not score highly even if it passes most listed records.
- Rule structuring: reward clear, ordered checks that map one-to-one
  to the spec's stated rules (e.g. named boolean guards or early
  returns per rule) over a single sprawling boolean expression that
  makes it hard to verify each rule is actually present.
- Reasoning quality: judge from comments/structure in contract.js
  whether the model explicitly calls out and separately implements
  both the required-when and forbidden-when-absent direction of at
  least one conditional rule, rather than only handling the
  required-when direction.
