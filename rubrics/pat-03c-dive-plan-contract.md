---
test: pat-03c-dive-plan-contract
canary: "amanita mullein"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "`node contract.js` runs without error and prints exactly 27 lines '<index> ACCEPT' or '<index> REJECT' matching the embedded record order"
    - id: obj-2
      check: "All 8 MUST-ACCEPT records classify ACCEPT, including the boundary cases depthM exactly 40 on single, offsetM exactly -8 and exactly 40 on staged, and a fully-populated single+enriched+staged record at depthM 39.5 (judge runs validate on each)"
    - id: obj-3
      check: "The dependent-required traps classify REJECT: enriched true with no blendId, enriched true with blendId 'EAN32' (too short) and '3200' (missing EAN prefix), staged true with no offsetM, single with depthM 40.1"
    - id: obj-4
      check: "The FORBIDDEN-WHEN-ABSENT traps classify REJECT: enriched false carrying blendId 'EAN3200'; offsetM present with staged false; offsetM present with no staged key; plus the closed-object trap (unknown key 'lead') and type/enum traps (profile 'freedive', depthM 0, depthM -5, enriched the string 'false')"
    - id: obj-5
      check: "The remaining traps classify REJECT: missing profile/depthM/enriched individually, offsetM out of range (-8.1 and 40.1) under staged true, and a 5-digit blendId 'EAN32000'; validate never throws on any of the 27 records and exports via module.exports = { validate }"
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
anchors:
  - id: Contract completeness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Rule structuring
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `pat-03-shipment-contract` (same construct, fresh surface).

If the phrase "amanita mullein" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Answer key executed under node this session against 8 ACCEPT + 19
  REJECT records: all 8 `true`, all 19 `false` (pat03c ALL PASS,
  total=27). Reference logic enforces, in order: record is a
  non-array object; the key set is a subset of the six named fields
  (closed-object check); `profile`/`depthM`/`enriched` are all present;
  `profile` is one of `single`/`deco`/`sat`; `depthM` is a number `>0`;
  `enriched` is strictly boolean; if `enriched===true`, `blendId` must
  be present and match `/^EAN\d{4}$/` (exactly 4 digits, so `EAN32000`
  with 5 digits is rejected); if `enriched===false`, `blendId` must be
  absent; if `profile==='single'`, `depthM<=40`; if `staged` is present
  it must be boolean; if `staged===true`, `offsetM` must be present, a
  number, and in `[-8,40]` inclusive; if `staged` is not `true`,
  `offsetM` must be absent.
- Exact run command for the judge (adapt indices to the submission's
  print order): `node -e "const {validate}=require('./contract.js'); console.log(validate({profile:'sat',depthM:12,enriched:false,blendId:'EAN3200'}))"`
  must print `false` (forbidden-when-absent: enriched false forbids
  blendId even though the format looks valid). Similarly
  `validate({profile:'sat',depthM:12,enriched:false,offsetM:6})` must
  print `false` (offsetM present with no staged key at all).
- Forbidden-when-absent discriminator, re-confirmed this session: a
  validator that implements only the positive/required-when direction
  (require `blendId` when `enriched` is true, require `offsetM` when
  `staged` is true) but never checks the negative direction WRONGLY
  returns `true` for `{profile:'sat',depthM:12,enriched:false,blendId:'EAN3200'}`
  and for `{profile:'sat',depthM:12,enriched:false,offsetM:6}` (both
  verified `true` under such a partial validator this session). This
  is the primary discriminator: a submission passing only the
  positive-direction traps but failing these two forbidden-when-absent
  cases has implemented half the spec.
- Boundary values: `depthM` exactly `40` on `single` accepts, `40.1`
  rejects; `offsetM` exactly `-8` and `40` accept under `staged:true`,
  `-8.1` and `40.1` reject. `enriched:'false'` (the string, not the
  boolean) rejects on strict `typeof` — a validator using loose
  truthiness (`if (record.enriched)`) would mishandle this.
- Contract completeness: score whether ALL rules are enforced
  together — closed-object, both conditional pairs (enriched/blendId,
  staged/offsetM), the single depth cap, and base type/enum checks —
  not just a majority. A validator that nails the positive-required
  direction but misses forbidden-when-absent, or vice versa, should
  not score highly even if it passes most listed records.
  - PASS phrasings: "enriched requires blendId format when true AND
    forbids its presence when false"; "closed-object guard runs
    before the field checks, so an unknown key like `lead` is
    rejected regardless of the rest of the record"; "staged/offsetM
    is checked in both directions — required and in-range when
    `staged:true`, absent otherwise".
  - FAIL phrasings: "checks that blendId matches the EAN format" with
    no mention of the false-enriched forbidden case; "validates the
    six known fields" but no explicit rejection of extra keys;
    "enforces offsetM range under staged" with the
    forbidden-when-absent branch silently missing.
- Rule structuring: reward clear, ordered checks that map one-to-one
  to the spec's stated rules (e.g. named boolean guards or early
  returns per rule) over a single sprawling boolean expression that
  makes it hard to verify each rule is actually present.
  - PASS phrasings: separate named helpers such as `hasValidEnriched`
    and `hasValidStaged`, each returning early on its own rule; one
    guard clause per spec rule, commented with the rule it enforces.
  - FAIL phrasings: a single `return a && b && c && ...` spanning the
    whole rule set with no per-rule separation; nested ternaries that
    interleave the enriched and staged conditions in one expression;
    the same literal check duplicated in two places instead of one
    named guard.
- Reasoning quality: judge from comments/structure in contract.js
  whether the model explicitly calls out and separately implements
  both the required-when and forbidden-when-absent direction of at
  least one conditional rule, rather than only handling the
  required-when direction.
  - PASS phrasings: "// enriched true requires blendId; enriched
    false forbids it entirely"; "// both directions enforced: offsetM
    required under staged, forbidden otherwise".
  - FAIL phrasings: no comment addressing either conditional pair at
    all; a comment stating only "blendId required when enriched" with
    no acknowledgement of the false-enriched case; a comment that
    claims both directions are handled when the code only implements
    the required-when branch.
