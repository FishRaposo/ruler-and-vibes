---
id: coding-03b-alderport-consignment-seal
category: coding
title: Implement the Tolbridge-8 consignment seal exactly as specified
deliverables:
  - validator.js
---

## Task

A fictional container-terminal system at the port of Alderport stamps
each pallet with a **Tolbridge-8 consignment seal**, an 8-digit
checksum. Implement it EXACTLY as specified below — do not substitute a
checksum algorithm you already know, even if it looks similar.

**Tolbridge-8 checksum rule:**

- Number the 8 digit positions 1 through 8, counting from the LEFT
  (the first digit is position 1).
- At positions 1, 4, and 7, double the digit.
- If a doubled value is greater than 9, subtract 9 from it.
- Every other position (2, 3, 5, 6, 8) contributes its digit unchanged.
- Sum all eight contributions.
- The seal is **VALID** if and only if the sum is divisible by 10.

Worked example: `50346879` — contributions left to right are
1, 0, 3, 8, 6, 8, 5, 9 (positions 1/4/7 doubled-with-carry, the other
positions unchanged), summing to 40, which is divisible by 10, so this
seal is **VALID**.

## Deliverables

- `validator.js` — exports via `module.exports`:
  - `validate(code)` — takes an 8-digit string, returns `true`/`false`
    per the rule above.
  - `checkDigit(stem7)` — takes a 7-digit string (the first 7 digits of
    a seal) and returns the single digit (0-9) that must be appended to
    make the resulting 8-digit seal valid. Exactly one such digit
    exists for any 7-digit stem.
  - Every code passed to `validate` is exactly 8 digits and every stem
    passed to `checkDigit` is exactly 7 digits — no input validation is
    required.
- When run with `node validator.js`, the file must print exactly one
  line per embedded input, in this exact order and format:
  1. Ten lines, one per test seal, each formatted exactly
     `<code> VALID` or `<code> INVALID`, in the order the seals are
     listed below.
  2. Three lines, one per test stem, each formatted exactly
     `<stem> -> <digit>`, in the order the stems are listed below.

Test seals (validate each, print in this order):
`48160273`, `35729184`, `53792461`, `93052617`, `61947350`,
`72834690`, `49513870`, `80516492`, `90823154`, `27384095`

Test stems (compute the check digit for each, print in this order):
`5984123`, `7968345`, `3980741`

## Constraints

- Plain JavaScript, no dependencies, `validator.js` at most 80 lines.
- The file must end with `module.exports = { validate, checkDigit }`;
  the judge's harness requires it.
