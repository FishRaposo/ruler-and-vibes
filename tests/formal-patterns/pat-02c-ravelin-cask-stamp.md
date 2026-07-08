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

- Exactly four uppercase letters `A`-`Z` (the yard code).
- A literal colon `:`.
- Then 2 to 4 digits (the lot number), whose **first digit is `1`-`9`**
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
  "FYNX:731",
  "QUOR:9876",
  "DRAK:409/r5",
  "DRAK:409/r58",
  "HALT:20",
  "VINE:876/r9",
  "CLOY:9214/r64",
  "BRIM:365",
  // must be classified REJECT
  "zzFYNX:731zz",
  "XFYNX:731",
  "FYNX:731895",
  "code FYNX:731 today",
  "fynx:731",
  "FYN:731",
  "FYNX:0731",
  "FYNX:7",
  "FYNX:731/r",
  "FYNX:731/r895",
  "FYNX:731/R5",
  "FYNX-731",
  "FYNX:7a1",
  "FYNX:731 ",
];
```

## Constraints

- Plain JavaScript, no dependencies, single file.
- `pattern` must be a single `RegExp` literal (or object) — do not
  implement matching by hand-parsing the string; the point of the
  exercise is regex craft.
- The file must end with `module.exports = { pattern, validate }`; the
  judge's harness requires it.
