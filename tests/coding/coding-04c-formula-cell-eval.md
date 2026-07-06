---
id: coding-04c-formula-cell-eval
category: coding
title: Build a spreadsheet formula evaluator with exact precedence, associativity, and error contracts
deliverables:
  - formula.js
---

## Task

A small spreadsheet needs an engine that turns the text a user types into
a cell (its *formula*) into a value. Implement that engine in a single
file. Support non-negative integer literals, the binary operators
`+ - * /`, the power operator `^`, unary minus, parentheses, and
arbitrary whitespace anywhere in the formula.

The following rules are pinned exactly — do not fall back on whatever
your language's native operator precedence happens to do; reason
through each case:

- `+ - * /` are left-associative, with the usual precedence
  (`*`/`/` bind tighter than `+`/`-`).
- `^` is right-associative: `2^2^3` means `2^(2^3)`, not `(2^2)^3`.
- `^` binds tighter than unary minus at the START of a power chain:
  `-3^2` means `-(3^2) = -9`, not `(-3)^2 = 9`.
- Unary minus may appear directly after another operator
  (`5*-3 = -15`) and inside an exponent (`8^-1 = 0.125`).
- Division is floating-point. Print values using standard JavaScript
  number-to-string conversion (e.g. `8` prints as `8`, `0.125` prints
  as `0.125`).
- Division by zero: return the exact string `ERR: divide by zero`.
- Any malformed formula — unbalanced parentheses, a doubled operator
  like `//`, a trailing operator, an empty string, or any other input
  that doesn't parse — returns the exact string `ERR: malformed`.
  `compute()` must never throw.

## Deliverables

- `formula.js` — exports `compute(str)` via `module.exports`, plus,
  when run with `node formula.js`, prints one line per embedded formula
  in the exact format `FORMULA -> VALUE`, in the order the formulas are
  listed below (printing at require time is fine).
Formulas — evaluate each and print one line per formula, in this order.
They are given as JavaScript string literals so that the whitespace in
formula 4 is unambiguous (its leading and trailing spaces are part of
the FORMULA):

```js
const FORMULAS = [
  "3+4*5",
  "(3+4)*5",
  "2^2^3",
  " 20 -  5-4 ",
  "144/6/3",
  "-3^2",
  "5*-3",
  "-(2+3)^2",
  "8^-1",
  "9/(4-4)",
  "3//4",
  "(6+7",
];
```

## Constraints

- Plain JavaScript, no dependencies, single file.
- The file must end with `module.exports = { compute }`; the judge's
  harness requires it.
