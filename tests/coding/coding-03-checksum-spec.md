---
id: coding-03-checksum-spec
category: coding
title: Implement the Kestrel-8 checksum exactly as specified
deliverables:
  - validator.js
---

## Task

A fictional voucher system, the **Kestrel-8 voucher code**, uses an
8-digit checksum. Implement it EXACTLY as specified below — do not
substitute a checksum algorithm you already know, even if it looks
similar.

**Kestrel-8 checksum rule:**

- Number the 8 digit positions 1 through 8, counting from the LEFT
  (the first digit is position 1).
- At every EVEN position (2, 4, 6, 8), double the digit.
- If a doubled value is greater than 9, subtract 9 from it.
- Positions 1, 3, 5, 7 (odd, from the left) contribute their digit
  unchanged.
- Sum all eight contributions.
- The code is **VALID** if and only if the sum is divisible by 10.

Worked example: `46718296` — contributions left to right are
4, 3, 7, 2, 8, 4, 9, 3 (positions 2/4/6/8 doubled-with-carry, positions
1/3/5/7 unchanged), summing to 40, which is divisible by 10, so this
code is **VALID**.

## Deliverables

- `validator.js` — exports via `module.exports`:
  - `validate(code)` — takes an 8-digit string, returns `true`/`false`
    per the rule above.
  - `checkDigit(stem7)` — takes a 7-digit string (the first 7 digits of
    a code) and returns the single digit (0-9) that must be appended to
    make the resulting 8-digit code valid. Exactly one such digit
    exists for any 7-digit stem.
  - Every code passed to `validate` is exactly 8 digits and every stem
    passed to `checkDigit` is exactly 7 digits — no input validation is
    required.
- When run with `node validator.js`, the file must print exactly one
  line per embedded input, in this exact order and format:
  1. Ten lines, one per test code, each formatted exactly
     `<code> VALID` or `<code> INVALID`, in the order the codes are
     listed below.
  2. Three lines, one per test stem, each formatted exactly
     `<stem> -> <digit>`, in the order the stems are listed below.

Test codes (validate each, print in this order):
`46718296`, `24681357`, `12121212`, `11223344`, `44332211`,
`10203040`, `12345678`, `87654321`, `11111111`, `22222222`

Test stems (compute the check digit for each, print in this order):
`4671829`, `1234567`, `8765432`

## Constraints

- Plain JavaScript, no dependencies, `validator.js` at most 80 lines.
- The file must end with `module.exports = { validate, checkDigit }`;
  the judge's harness requires it.
