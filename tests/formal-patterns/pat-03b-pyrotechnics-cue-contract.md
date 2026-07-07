---
id: pat-03b-pyrotechnics-cue-contract
category: formal-patterns
title: Enforce a conditional if/then pyrotechnics cue data contract
deliverables:
  - contract.js
---

## Task

Implement `validate(record)` for a fictional "pyrotechnics cue" object
used to schedule a single stage-effect firing. The contract has
cross-field conditional rules — pay equal attention to what is
*required when present* and what is *forbidden when absent*.

Fields:

- `effect` — string enum, one of `"gerb"`, `"comet"`, `"mine"`.
- `massG` — number, must be `> 0`.
- `indoor` — boolean.
- `permitId` — string.
- `heightM` — number.
- `aerial` — boolean.

Rules:

- `effect`, `massG`, and `indoor` are always required.
- The object is **closed**: no keys beyond these six names are
  allowed, under any circumstance.
- If `indoor` is `true`, then `permitId` is **required** and must
  match `/^PY\d{4}$/`. If `indoor` is `false`, then `permitId` **must
  be absent** — it is not merely optional, it is forbidden.
- If `effect` is `"comet"`, then `massG` must be `<= 750`.
- If `aerial` is `true`, then `heightM` is **required** and must be in
  the inclusive range `[-5, 60]`. If `aerial` is absent or `false`,
  then `heightM` **must be absent** — again, forbidden, not merely
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
  { effect: 'mine', massG: 500, indoor: false },
  { effect: 'gerb', massG: 20000, indoor: false },
  { effect: 'comet', massG: 750, indoor: false },
  { effect: 'mine', massG: 10, indoor: true, permitId: 'PY1203' },
  { effect: 'mine', massG: 10, indoor: false, aerial: true, heightM: -5 },
  { effect: 'mine', massG: 10, indoor: false, aerial: true, heightM: 60 },
  { effect: 'mine', massG: 10, indoor: false, aerial: false },
  { effect: 'comet', massG: 749.9, indoor: true, permitId: 'PY1993', aerial: true, heightM: 12 },
  // must be classified REJECT
  { effect: 'mine', massG: 10, indoor: true },
  { effect: 'mine', massG: 10, indoor: true, permitId: 'PY12' },
  { effect: 'mine', massG: 10, indoor: true, permitId: '1203' },
  { effect: 'mine', massG: 10, indoor: false, aerial: true },
  { effect: 'comet', massG: 750.1, indoor: false },
  { effect: 'mine', massG: 10, indoor: false, permitId: 'PY1203' },
  { effect: 'mine', massG: 10, indoor: false, aerial: false, heightM: 12 },
  { effect: 'mine', massG: 10, indoor: false, heightM: 12 },
  { effect: 'mine', massG: 10, indoor: false, cue: 'A1' },
  { effect: 'strobe', massG: 10, indoor: false },
  { effect: 'mine', massG: 0, indoor: false },
  { effect: 'mine', massG: -5, indoor: false },
  { effect: 'mine', massG: 10, indoor: 'false' },
  { effect: 'gerb', indoor: false },
  { effect: 'gerb', massG: 10 },
  { massG: 10, indoor: false },
  { effect: 'mine', massG: 10, indoor: false, aerial: true, heightM: -5.1 },
  { effect: 'mine', massG: 10, indoor: false, aerial: true, heightM: 60.1 },
  { effect: 'mine', massG: 10, indoor: true, permitId: 'PY19930' },
];
```

## Constraints

- Plain JavaScript, no dependencies, single file.
- `validate` must never throw, even on malformed input (missing keys,
  wrong types, `null`, arrays).
- The file must end with `module.exports = { validate }`; the judge's
  harness requires it.
