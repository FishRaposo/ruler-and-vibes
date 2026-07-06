---
id: coding-04b-geartrain-formula
category: coding
title: Build a geartrain-formula evaluator with exact precedence, associativity, and error contracts
deliverables:
  - geartrain.js
---

## Task

A drivetrain shop describes gear stages with a tiny formula language and
needs a reference evaluator for those formula strings, in a single file.
Support non-negative integer literals (tooth counts), the binary
operators `+ - * /`, the compound-stage operator `#`, unary minus (a
reversed stage), parentheses, and arbitrary whitespace anywhere in the
input.

The following rules are pinned exactly — do not fall back on whatever
your language's native operator precedence happens to do; reason through
each case:

- `+ - * /` are left-associative, with the usual precedence
  (`*`/`/` bind tighter than `+`/`-`).
- `#` is the compound-stage operator (a power): `a # b` is `a` raised to
  the `b`. It is right-associative: `2#2#3` means `2#(2#3)`, not
  `(2#2)#3`.
- `#` binds tighter than unary minus at the START of a stage chain:
  `-3#2` means `-(3#2) = -9`, not `(-3)#2 = 9`.
- Unary minus may appear directly after another operator
  (`5*-3 = -15`) and inside an exponent (`8#-1 = 0.125`).
- Division is floating-point. Print results using standard JavaScript
  number-to-string conversion (e.g. `12` prints as `12`, `0.125` prints
  as `0.125`).
- Division by zero: return the exact string
  `ERROR: division by zero`.
- Any malformed input — unbalanced parentheses, a doubled operator like
  `++`, a trailing operator, an empty string, or any other input that
  doesn't parse — returns the exact string `ERROR: syntax`.
  `evaluate()` must never throw.

## Deliverables

- `geartrain.js` — exports `evaluate(str)` via `module.exports`, plus,
  when run with `node geartrain.js`, prints one line per embedded test
  vector in the exact format `INPUT => RESULT`, in the order the vectors
  are listed below (printing at require time is fine).

Test vectors — evaluate each and print one line per vector, in this
order. They are given as JavaScript string literals so that the
whitespace in vector 4 is unambiguous (its leading and trailing spaces
are part of the INPUT):

```js
const VECTORS = [
  "3+4*5",
  "(3+4)*5",
  "2#2#3",
  " 20 -  6-4 ",
  "144/6/2",
  "-3#2",
  "5*-3",
  "-(2+5)#2",
  "8#-1",
  "12/(4-4)",
  "3++4",
  "(6*2",
];
```

## Constraints

- Plain JavaScript, no dependencies, single file.
- The file must end with `module.exports = { evaluate }`; the judge's
  harness requires it.
