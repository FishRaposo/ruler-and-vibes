---
id: pat-02b-ferrule-stamp-regex
category: formal-patterns
title: Author one anchored regex for the Ferrule stamp grammar
deliverables:
  - pattern.js
---

## Task

The fictional "Ferrule stamp" is a token language used to mark foundry
billets. Author a **single** JavaScript regular expression that matches a
whole string if and only if it is a valid Ferrule stamp, and nothing
else. Grammar:

- Exactly three uppercase letters `A`-`Z`.
- A literal forward slash `/`.
- Then 4 to 6 digits, whose **first digit is `1`-`9`** (no leading zero
  on the digit run).
- An **optional** grade suffix: the literal characters `#g` followed by
  one or two digits.

The regex must match the **entire string** — a valid stamp appearing as
a substring of a longer string (e.g. surrounded by other text) must NOT
count as a match. Reason carefully about anchoring: an unanchored pattern
will incorrectly match many invalid strings that merely *contain* a valid
stamp.

## Deliverables

- `pattern.js` — exports `pattern` (a `RegExp`) and `validate(s)`
  (returns whether `s`, in its entirety, matches `pattern`), via
  `module.exports = { pattern, validate }`. When run with
  `node pattern.js`, it must print exactly one line per embedded corpus
  string below, in the exact order listed, in the exact format
  `<input> MATCH` or `<input> REJECT`.

Embedded corpus — validate each and print one line per entry, in this
order:

```js
const CORPUS = [
  // must be classified MATCH
  "TRV/1234",
  "ZZZ/999999",
  "QPR/45678#g1",
  "QPR/45678#g12",
  "AAA/1000",
  "XYK/1000#g9",
  "MNB/654321#g42",
  "BCD/9999",
  // must be classified REJECT
  "qqTRV/1234qq",
  "ABCD/1234",
  "TRV/1234567",
  "lot TRV/9999 flagged",
  "trv/1234",
  "AB/1234",
  "TRV/0123",
  "TRV/123",
  "TRV/1234#g",
  "TRV/1234#g123",
  "TRV/1234#G1",
  "TRV-1234",
  "TRV/12a4",
  "TRV/1234 ",
];
```

## Constraints

- Plain JavaScript, no dependencies, single file.
- `pattern` must be a single `RegExp` literal (or object) — do not
  implement matching by hand-parsing the string; the point of the
  exercise is regex craft.
- The file must end with `module.exports = { pattern, validate }`; the
  judge's harness requires it.
