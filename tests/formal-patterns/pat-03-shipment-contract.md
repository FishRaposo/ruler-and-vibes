---
id: pat-03-shipment-contract
category: formal-patterns
title: Enforce a conditional if/then shipment data contract
deliverables:
  - contract.js
---

## Task

Implement `validate(record)` for a fictional "shipment record" object.
The contract has cross-field conditional rules — pay equal attention
to what is *required when present* and what is *forbidden when
absent*.

Fields:

- `mode` — string enum, one of `"air"`, `"sea"`, `"ground"`.
- `weightKg` — number, must be `> 0`.
- `hazmat` — boolean.
- `unNumber` — string.
- `tempC` — number.
- `reefer` — boolean.

Rules:

- `mode`, `weightKg`, and `hazmat` are always required.
- The object is **closed**: no keys beyond these six names are
  allowed, under any circumstance.
- If `hazmat` is `true`, then `unNumber` is **required** and must
  match `/^UN\d{4}$/`. If `hazmat` is `false`, then `unNumber` **must
  be absent** — it is not merely optional, it is forbidden.
- If `mode` is `"air"`, then `weightKg` must be `<= 1000`.
- If `reefer` is `true`, then `tempC` is **required** and must be in
  the inclusive range `[-30, 25]`. If `reefer` is absent or `false`,
  then `tempC` **must be absent** — again, forbidden, not merely
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
  { mode: 'ground', weightKg: 500, hazmat: false },
  { mode: 'sea', weightKg: 20000, hazmat: false },
  { mode: 'air', weightKg: 1000, hazmat: false },
  { mode: 'ground', weightKg: 10, hazmat: true, unNumber: 'UN1203' },
  { mode: 'ground', weightKg: 10, hazmat: false, reefer: true, tempC: -30 },
  { mode: 'ground', weightKg: 10, hazmat: false, reefer: true, tempC: 25 },
  { mode: 'ground', weightKg: 10, hazmat: false, reefer: false },
  { mode: 'air', weightKg: 999.9, hazmat: true, unNumber: 'UN1993', reefer: true, tempC: 4 },
  // must be classified REJECT
  { mode: 'ground', weightKg: 10, hazmat: true },
  { mode: 'ground', weightKg: 10, hazmat: true, unNumber: 'UN12' },
  { mode: 'ground', weightKg: 10, hazmat: true, unNumber: '1203' },
  { mode: 'ground', weightKg: 10, hazmat: false, reefer: true },
  { mode: 'air', weightKg: 1000.1, hazmat: false },
  { mode: 'ground', weightKg: 10, hazmat: false, unNumber: 'UN1203' },
  { mode: 'ground', weightKg: 10, hazmat: false, reefer: false, tempC: 4 },
  { mode: 'ground', weightKg: 10, hazmat: false, tempC: 4 },
  { mode: 'ground', weightKg: 10, hazmat: false, priority: 'high' },
  { mode: 'drone', weightKg: 10, hazmat: false },
  { mode: 'ground', weightKg: 0, hazmat: false },
  { mode: 'ground', weightKg: -5, hazmat: false },
  { mode: 'ground', weightKg: 10, hazmat: 'false' },
  { mode: 'sea', hazmat: false },
  { mode: 'sea', weightKg: 10 },
  { weightKg: 10, hazmat: false },
  { mode: 'ground', weightKg: 10, hazmat: false, reefer: true, tempC: -30.1 },
  { mode: 'ground', weightKg: 10, hazmat: false, reefer: true, tempC: 25.1 },
  { mode: 'ground', weightKg: 10, hazmat: true, unNumber: 'UN19930' },
];
```

## Constraints

- Plain JavaScript, no dependencies, single file.
- `validate` must never throw, even on malformed input (missing keys,
  wrong types, `null`, arrays).
- The file must end with `module.exports = { validate }`; the judge's
  harness requires it.
