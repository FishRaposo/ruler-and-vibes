---
id: pat-03c-dive-plan-contract
category: formal-patterns
title: Enforce a conditional if/then dive-plan data contract
deliverables:
  - contract.js
---

## Task

Implement `validate(record)` for a fictional "dive plan" object used to
lodge a single scuba descent with a divemaster. The contract has
cross-field conditional rules — pay equal attention to what is
*required when present* and what is *forbidden when absent*.

Fields:

- `profile` — string enum, one of `"single"`, `"deco"`, `"sat"`.
- `depthM` — number, must be `> 0`.
- `enriched` — boolean.
- `blendId` — string.
- `offsetM` — number.
- `staged` — boolean.

Rules:

- `profile`, `depthM`, and `enriched` are always required.
- The object is **closed**: no keys beyond these six names are
  allowed, under any circumstance.
- If `enriched` is `true`, then `blendId` is **required** and must
  match `/^EAN\d{4}$/`. If `enriched` is `false`, then `blendId` **must
  be absent** — it is not merely optional, it is forbidden.
- If `profile` is `"single"`, then `depthM` must be `<= 40`.
- If `staged` is `true`, then `offsetM` is **required** and must be in
  the inclusive range `[-8, 40]`. If `staged` is absent or `false`,
  then `offsetM` **must be absent** — again, forbidden, not merely
  optional.

The negative direction (forbidden-when-absent) is exactly as important
as the positive direction (required-when): a validator that only
checks "is the required field present and valid when the flag is true"
but never checks "is the field correctly *absent* when the flag is
false/missing" will pass some cases it should reject.

## Deliverables

- `contract.js` — exports `validate(record)` returning `true` or
  `false`, via `module.exports = { validate }`. When run with
  `node contract.js`, it must print exactly one line per embedded
  record below, in the exact order listed, in the exact format
  `<index> ACCEPT` or `<index> REJECT` (1-indexed).

Embedded records — validate each and print one line per entry, in this
order:

```js
const RECORDS = [
  // must be classified ACCEPT
  { profile: 'sat', depthM: 60, enriched: false },
  { profile: 'deco', depthM: 90, enriched: false },
  { profile: 'single', depthM: 40, enriched: false },
  { profile: 'sat', depthM: 12, enriched: true, blendId: 'EAN3200' },
  { profile: 'sat', depthM: 12, enriched: false, staged: true, offsetM: -8 },
  { profile: 'sat', depthM: 12, enriched: false, staged: true, offsetM: 40 },
  { profile: 'sat', depthM: 12, enriched: false, staged: false },
  { profile: 'single', depthM: 39.5, enriched: true, blendId: 'EAN3600', staged: true, offsetM: 6 },
  // must be classified REJECT
  { profile: 'sat', depthM: 12, enriched: true },
  { profile: 'sat', depthM: 12, enriched: true, blendId: 'EAN32' },
  { profile: 'sat', depthM: 12, enriched: true, blendId: '3200' },
  { profile: 'sat', depthM: 12, enriched: false, staged: true },
  { profile: 'single', depthM: 40.1, enriched: false },
  { profile: 'sat', depthM: 12, enriched: false, blendId: 'EAN3200' },
  { profile: 'sat', depthM: 12, enriched: false, staged: false, offsetM: 6 },
  { profile: 'sat', depthM: 12, enriched: false, offsetM: 6 },
  { profile: 'sat', depthM: 12, enriched: false, lead: 'x' },
  { profile: 'freedive', depthM: 12, enriched: false },
  { profile: 'sat', depthM: 0, enriched: false },
  { profile: 'sat', depthM: -5, enriched: false },
  { profile: 'sat', depthM: 12, enriched: 'false' },
  { profile: 'deco', enriched: false },
  { profile: 'deco', depthM: 12 },
  { depthM: 12, enriched: false },
  { profile: 'sat', depthM: 12, enriched: false, staged: true, offsetM: -8.1 },
  { profile: 'sat', depthM: 12, enriched: false, staged: true, offsetM: 40.1 },
  { profile: 'sat', depthM: 12, enriched: true, blendId: 'EAN32000' },
];
```

## Constraints

- Plain JavaScript, no dependencies, single file.
- `validate` must never throw, even on malformed input (missing keys,
  wrong types, `null`, arrays).
- The file must end with `module.exports = { validate }`; the judge's
  harness requires it.
