---
id: pat-02-sable-tag-regex
category: formal-patterns
title: Author one anchored regex for the Sable tag grammar
deliverables:
  - pattern.js
---

## Task

The fictional "Sable tag" is a token language. Author a **single**
JavaScript regular expression that matches a whole string if and only
if it is a valid Sable tag, and nothing else. Grammar:

- Exactly two uppercase letters `A`-`Z`.
- A literal hyphen `-`.
- Then 3 to 5 digits, whose **first digit is `1`-`9`** (no leading
  zero on the digit run).
- An **optional** version suffix: the literal characters `.v` followed
  by one or two digits.

The regex must match the **entire string** — a valid tag appearing as
a substring of a longer string (e.g. surrounded by other text) must
NOT count as a match. Reason carefully about anchoring: an unanchored
pattern will incorrectly match many invalid strings that merely
*contain* a valid tag.

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
  "AB-123",
  "ZZ-99999",
  "QR-4567.v1",
  "QR-4567.v12",
  "AA-100",
  "XY-100.v9",
  "MN-12345.v42",
  "BC-999",
  // must be classified REJECT
  "xxAB-123xx",
  "ABC-123",
  "AB-123456",
  "see AB-999 here",
  // must be classified REJECT
  "ab-123",
  "A-123",
  "AB-023",
  "AB-12",
  "AB-123.v",
  "AB-123.v123",
  "AB-123.V1",
  "AB_123",
  "AB-1a3",
  "AB-123 ",
];
```

## Constraints

- Plain JavaScript, no dependencies, single file.
- `pattern` must be a single `RegExp` literal (or object) — do not
  implement matching by hand-parsing the string; the point of the
  exercise is regex craft.
- The file must end with `module.exports = { pattern, validate }`; the
  judge's harness requires it.
