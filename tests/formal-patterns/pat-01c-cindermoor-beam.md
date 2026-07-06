---
id: pat-01c-cindermoor-beam
category: formal-patterns
title: Accept exactly canonical beam codes, reject the near-misses
deliverables:
  - validator.js
---

## Task

The fictional "Cindermoor" sky-survey tags every survey beam with a
**beam code** that looks like a colon-joined triple but follows a strict
canonical grammar. Implement a validator that accepts a string if and
only if it is a canonical **Cindermoor beam code**:

- Exactly three segments separated by single `:` characters — nothing
  more, nothing less.
- Each segment is a decimal integer in the range `0`-`500` inclusive.
- No segment may have a leading zero, **except** the single digit `0`
  itself (so `0` is valid, `00`, `01`, `03` are not).
- The string must contain nothing else: no surrounding whitespace, no
  trailing separator, no stray characters of any kind. The entire
  string must be consumed by the three segments and their two joining
  colons.

Do not accept segments above `500` (e.g. `501`, `600`), and do not
accept leading-zero segments. A plain regex like `\d{1,3}(:\d{1,3}){2}`
is NOT sufficient on its own because it cannot express the numeric
range `0`-`500` or reject leading zeros — reason carefully about how
you enforce both constraints.

## Deliverables

- `validator.js` — exports `validate(code)` returning `true` or
  `false`, via `module.exports = { validate }`. When run with
  `node validator.js`, it must print exactly one line per embedded
  corpus string below, in the exact order listed, in the exact format
  `<input> MATCH` or `<input> REJECT`.

Embedded corpus — validate each and print one line per entry, in this
order:

```js
const CORPUS = [
  // must be classified MATCH
  "0:0:0",
  "500:500:500",
  "1:2:3",
  "12:340:5",
  "7:7:7",
  "500:0:250",
  "63:127:9",
  "400:16:88",
  "100:64:0",
  "203:0:113",
  // must be classified REJECT
  "501:0:0",
  "1:2:501",
  "1:2:600",
  "999:999:999",
  "01:2:3",
  "1:2:03",
  "00:0:0",
  "12:340:5 ",
  " 1:2:3",
  "1:2:3:",
  "1:2",
  "1:2:3:4",
  "1::3",
  "1:2:3a",
  "1:2:-1",
];
```

## Constraints

- Plain JavaScript, no dependencies, single file.
- The file must end with `module.exports = { validate }`; the judge's
  harness requires it.
