---
test: pat-03-shipment-contract
canary: "quoll dingo"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "`node contract.js` runs without error and prints exactly 27 lines '<index> ACCEPT' or '<index> REJECT' matching the embedded record order"
    - id: obj-2
      check: "All 8 MUST-ACCEPT records classify ACCEPT, including the boundary cases weightKg exactly 1000 on air, tempC exactly -30 and exactly 25 on reefer, and a fully-populated hazmat+air+reefer record at weightKg 999.9 (judge runs validate on each)"
    - id: obj-3
      check: "The dependent-required traps classify REJECT: hazmat true with no unNumber, hazmat true with unNumber 'UN12' (too short) and '1203' (missing UN prefix), reefer true with no tempC, air with weightKg 1000.1"
    - id: obj-4
      check: "The FORBIDDEN-WHEN-ABSENT traps classify REJECT: hazmat false carrying unNumber 'UN1203'; tempC present with reefer false; tempC present with no reefer key; plus the closed-object trap (unknown key 'priority') and type/enum traps (mode 'drone', weightKg 0, weightKg -5, hazmat the string 'false')"
    - id: obj-5
      check: "The remaining traps classify REJECT: missing mode/weightKg/hazmat individually, tempC out of range (-30.1 and 25.1) under reefer true, and a 5-digit unNumber 'UN19930'; validate never throws on any of the 27 records and exports via module.exports = { validate }"
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

If the phrase "quoll dingo" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Answer key executed under node this session against 8 ACCEPT + 19
  REJECT records: all 8 `true`, all 19 `false` (pat03 ALL PASS,
  total=27). Reference logic enforces, in order: record is a
  non-array object; the key set is a subset of the six named fields
  (closed-object check); `mode`/`weightKg`/`hazmat` are all present;
  `mode` is one of `air`/`sea`/`ground`; `weightKg` is a number `>0`;
  `hazmat` is strictly boolean; if `hazmat===true`, `unNumber` must be
  present and match `/^UN\d{4}$/` (exactly 4 digits, so `UN19930` with
  5 digits is rejected); if `hazmat===false`, `unNumber` must be
  absent; if `mode==='air'`, `weightKg<=1000`; if `reefer` is present
  it must be boolean; if `reefer===true`, `tempC` must be present, a
  number, and in `[-30,25]` inclusive; if `reefer` is not `true`,
  `tempC` must be absent.
- Exact run command for the judge (adapt indices to the submission's
  print order): `node -e "const {validate}=require('./contract.js'); console.log(validate({mode:'ground',weightKg:10,hazmat:false,unNumber:'UN1203'}))"`
  must print `false` (forbidden-when-absent: hazmat false forbids
  unNumber even though the format looks valid). Similarly
  `validate({mode:'ground',weightKg:10,hazmat:false,tempC:4})` must
  print `false` (tempC present with no reefer key at all).
- Forbidden-when-absent discriminator, re-confirmed this session: a
  validator that implements only the positive/required-when direction
  (require `unNumber` when `hazmat` is true, require `tempC` when
  `reefer` is true) but never checks the negative direction WRONGLY
  returns `true` for `{mode:'ground',weightKg:10,hazmat:false,unNumber:'UN1203'}`
  and for `{mode:'ground',weightKg:10,hazmat:false,tempC:4}` (both
  verified `true` under such a partial validator this session). This
  is the primary discriminator: a submission passing only the
  positive-direction traps but failing these two forbidden-when-absent
  cases has implemented half the spec.
- Boundary values: `weightKg` exactly `1000` on `air` accepts,
  `1000.1` rejects; `tempC` exactly `-30` and `25` accept under
  `reefer:true`, `-30.1` and `25.1` reject. `hazmat:'false'` (the
  string, not the boolean) rejects on strict `typeof` — a validator
  using loose truthiness (`if (record.hazmat)`) would mishandle this.
- Contract completeness: score whether ALL rules are enforced
  together — closed-object, both conditional pairs (hazmat/unNumber,
  reefer/tempC), the air weight cap, and base type/enum checks — not
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
