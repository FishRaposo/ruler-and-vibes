---
id: coding-04-expression-eval
category: coding
title: Build an arithmetic expression evaluator with exact precedence, associativity, and error contracts
deliverables:
  - evaluator.js
  - REASONING.md
---

## Task

Implement a complete evaluator for arithmetic expression strings in a
single file. Support non-negative integer literals, the binary
operators `+ - * /`, the power operator `^`, unary minus, parentheses,
and arbitrary whitespace anywhere in the input.

The following rules are pinned exactly — do not fall back on whatever
your language's native operator precedence happens to do; reason
through each case:

- `+ - * /` are left-associative, with the usual precedence
  (`*`/`/` bind tighter than `+`/`-`).
- `^` is right-associative: `2^3^2` means `2^(3^2)`, not `(2^3)^2`.
- `^` binds tighter than unary minus at the START of a power chain:
  `-2^2` means `-(2^2) = -4`, not `(-2)^2 = 4`.
- Unary minus may appear directly after another operator
  (`6*-2 = -12`) and inside an exponent (`4^-1 = 0.25`).
- Division is floating-point. Print results using standard JavaScript
  number-to-string conversion (e.g. `10` prints as `10`, `0.25` prints
  as `0.25`).
- Division by zero: return the exact string
  `ERROR: division by zero`.
- Any malformed input — unbalanced parentheses, a doubled operator like
  `**`, a trailing operator, an empty string, or any other input that
  doesn't parse — returns the exact string `ERROR: syntax`.
  `evaluate()` must never throw.

## Deliverables

- `evaluator.js` — exports `evaluate(str)` via `module.exports`, plus,
  when run with `node evaluator.js`, prints one line per embedded test
  vector in the exact format `INPUT => RESULT`, in the order the
  vectors are listed below (printing at require time is fine).
- `REASONING.md` — name the parsing strategy you used (e.g. recursive
  descent or shunting-yard) and explain specifically how you
  implemented right-associativity for `^` and the unary-minus rules
  above.

Test vectors — evaluate each and print one line per vector, in this
order. They are given as JavaScript string literals so that the
whitespace in vector 4 is unambiguous (its leading and trailing spaces
are part of the INPUT):

```js
const VECTORS = [
  "2+3*4",
  "(2+3)*4",
  "2^3^2",
  " 10 -  4-3 ",
  "100/5/2",
  "-2^2",
  "6*-2",
  "-(3+4)^2",
  "4^-1",
  "8/(3-3)",
  "2**3",
  "(1+2",
];
```

## Constraints

- Plain JavaScript, no dependencies, single file.
- The file must end with `module.exports = { evaluate }`; the judge's
  harness requires it.
- `REASONING.md`, at most 300 words (whole file, `wc -w`).
