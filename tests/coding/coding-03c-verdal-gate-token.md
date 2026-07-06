---
id: coding-03c-verdal-gate-token
category: coding
title: Implement the Verdal-9 gate-token checksum exactly as specified
deliverables:
  - validator.js
---

## Task

A fictional turnstile system, the **Verdal-9 gate token**, uses a
7-digit checksum. Implement it EXACTLY as specified below — do not
substitute a checksum algorithm you already know, even if it looks
similar.

**Verdal-9 checksum rule:**

- Number the 7 digit positions 1 through 7, counting from the LEFT
  (the first digit is position 1).
- At every ODD position (1, 3, 5, 7), double the digit.
- If a doubled value is greater than 9, subtract 9 from it.
- Positions 2, 4, 6 (even, from the left) contribute their digit
  unchanged.
- Sum all seven contributions.
- The token is **VALID** if and only if the sum is divisible by 10.

Worked example: `8371926` — contributions left to right are
7, 3, 5, 1, 9, 2, 3 (positions 1/3/5/7 doubled-with-carry, positions
2/4/6 unchanged), summing to 30, which is divisible by 10, so this
token is **VALID**.

## Deliverables

- `validator.js` — exports via `module.exports`:
  - `validate(code)` — takes a 7-digit string, returns `true`/`false`
    per the rule above.
  - `checkDigit(stem6)` — takes a 6-digit string (the first 6 digits of
    a token) and returns the single digit (0-9) that must be appended to
    make the resulting 7-digit token valid. Exactly one such digit
    exists for any 6-digit stem.
  - Every code passed to `validate` is exactly 7 digits and every stem
    passed to `checkDigit` is exactly 6 digits — no input validation is
    required.
- When run with `node validator.js`, the file must print exactly one
  line per embedded input, in this exact order and format:
  1. Ten lines, one per test token, each formatted exactly
     `<code> VALID` or `<code> INVALID`, in the order the tokens are
     listed below.
  2. Three lines, one per test stem, each formatted exactly
     `<stem> -> <digit>`, in the order the stems are listed below.

Test tokens (validate each, print in this order):
`8371926`, `5806125`, `2083102`, `9380312`, `5296850`,
`6705776`, `3022705`, `9669311`, `4868645`, `7932603`

Test stems (compute the check digit for each, print in this order):
`837192`, `350941`, `123456`

## Constraints

- Plain JavaScript, no dependencies, `validator.js` at most 80 lines.
- The file must end with `module.exports = { validate, checkDigit }`;
  the judge's harness requires it.
