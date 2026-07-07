---
id: pat-02c-ravelin-cask-stamp
category: formal-patterns
title: Author one anchored regex for the Ravelin cask stamp grammar
deliverables:
  - pattern.js
---

## Task

At the fictional Thackston Cooperage, every finished barrel is branded
with a "Ravelin cask stamp" — a short token in a token language. Author
a **single** JavaScript regular expression that matches a whole string
if and only if it is a valid Ravelin cask stamp, and nothing else.
Grammar:

- Exactly three uppercase letters `A`-`Z` (the yard code).
- A literal colon `:`.
- Then 4 to 6 digits (the lot number), whose **first digit is `1`-`9`**
  (no leading zero on the digit run).
- An **optional** reissue suffix: the literal characters `/r` followed
  by one or two digits.

The regex must match the **entire string** — a valid stamp appearing as
a substring of a longer string (e.g. surrounded by other text) must NOT
count as a match. Reason carefully about anchoring: an unanchored
pattern will incorrectly match many invalid strings that merely
*contain* a valid stamp.

## Deliverables

- `pattern.js` — exports `pattern` (a `RegExp`) and `validate(s)`
  (returns whether `s`, in its entirety, matches `pattern`), via
  `module.exports = { pattern, validate }`. When run with
  `node pattern.js`, it must print exactly one line per embedded
  corpus string below, in the exact order listed, in the exact format
  `<input> MATCH` or `<input> REJECT`.

Embedded corpus — validate each and print one line per entry, in this
order:

```js
const CORPUS = [
  // must be classified MATCH
  "WKT:1234",
  "QRS:987654",
  "MZP:5000/r3",
  "MZP:5000/r27",
  "BCD:1000",
  "GHT:2718/r9",
  "VXN:314159/r42",
  "JKL:80085",
  // must be classified REJECT
  "ooWKT:1234oo",
  "ABCD:1234",
  "WKT:1234567",
  "tag WKT:9000 x",
  "wkt:1234",
  "WK:1234",
  "WKT:0123",
  "WKT:123",
  "WKT:1234/r",
  "WKT:1234/r123",
  "WKT:1234/R3",
  "WKT-1234",
  "WKT:12a4",
  "WKT:1234 ",
];
```

## Constraints

- Plain JavaScript, no dependencies, single file.
- `pattern` must be a single `RegExp` literal (or object) — do not
  implement matching by hand-parsing the string; the point of the
  exercise is regex craft.
- The file must end with `module.exports = { pattern, validate }`; the
  judge's harness requires it.
