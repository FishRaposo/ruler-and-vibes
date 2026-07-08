---
id: pat-01b-valgrove-berth
category: formal-patterns
title: Accept exactly canonical berth codes, reject the near-misses
deliverables:
  - validator.js
---

## Task

The fictional "Valgrove" transit network labels every docking bay with a
**berth code** that looks like a hyphen-joined quad but follows a strict
canonical grammar. Implement a validator that accepts a string if and
only if it is a canonical **Valgrove berth code**:

- Exactly four segments separated by single `-` characters — nothing
  more, nothing less.
- Each segment is a decimal integer in the range `0`-`450` inclusive.
- No segment may have a leading zero, **except** the single digit `0`
  itself (so `0` is valid, `00`, `07`, `06` are not).
- The string must contain nothing else: no surrounding whitespace, no
  trailing separator, no stray characters of any kind. The entire
  string must be consumed by the four segments and their three joining
  hyphens.

Do not accept segments above `450` (e.g. `451`, `888`), and do not
accept leading-zero segments. A plain regex like `\d{1,3}(-\d{1,3}){3}`
is NOT sufficient on its own because it cannot express the numeric
range `0`-`450` or reject leading zeros — reason carefully about how
you enforce both constraints.

## Deliverables

- `validator.js` — exports `validate(addr)` returning `true` or
  `false`, via `module.exports = { validate }`. When run with
  `node validator.js`, it must print exactly one line per embedded
  corpus string below, in the exact order listed, in the exact format
  `<input> MATCH` or `<input> REJECT`.

Embedded corpus — validate each and print one line per entry, in this
order:

```js
const CORPUS = [
  // must be classified MATCH
  "0-0-0-0",
  "450-450-450-450",
  "7-19-83-6",
  "12-240-3-88",
  "9-9-9-9",
  "64-0-0-255",
  "200-1-1-2",
  "128-37-199-4",
  "5-250-16-73",
  "231-0-142-58",
  // must be classified REJECT
  "451-0-0-1",
  "7-19-83-451",
  "7-19-83-500",
  "888-888-888-888",
  "07-19-83-6",
  "7-19-83-06",
  "00-0-0-0",
  "12-240-3-88 ",
  " 7-19-83-6",
  "7-19-83-6-",
  "7-19-83",
  "7-19-83-6-5",
  "7--83-6",
  "7-19-83-6z",
  "7-19-+8-6",
];
```

## Constraints

- Plain JavaScript, no dependencies, single file.
- The file must end with `module.exports = { validate }`; the judge's
  harness requires it.
