---
id: coding-12-predict-then-invert
category: coding
title: Predict and invert a string transform
deliverables:
  - invert.js
  - PREDICTIONS.md
---

## Task

Here is a pure, deterministic transform `f(s)` over lowercase-letter
strings, described precisely (do not run code to answer Part A —
compute it by hand first):

For each character in `s` at 0-based index `i`, shift it by
`(7*i + 3) mod 26` positions forward in the alphabet (wrapping `z`
back to `a`), producing an intermediate string of the same length in
the same left-to-right order as the input. Then reverse the entire
intermediate string to produce the final output.

For example (worked by hand, not by running code): for `s = "ab"`,
index 0's `'a'` shifts by `(7*0+3) mod 26 = 3` to `'d'`; index 1's
`'b'` shifts by `(7*1+3) mod 26 = 10` to `'l'`; the intermediate
string is `"dl"`; reversing gives `f("ab") = "ld"`.

### Part A — predict (no code execution)

Work out, by hand, the value of `f` for each of these four inputs:
`"abc"`, `"hello"`, `"z"`, `"code"`. Record your predictions in
`PREDICTIONS.md` before writing or running any code that computes
`f`.

### Part B — invert

`f` is a bijection on same-length lowercase strings (each output has
exactly one preimage of that length). Implement `finv(t)`, the true
inverse of `f`, and use it to recover the unique string `x` such that
`f(x) === "rmbckkj"`.

The trap: the shift amount depends on the character's index in the
ORIGINAL (pre-reversal) string, not its index in the final output. To
invert correctly you must first undo the reversal, and only then walk
the un-reversed string left-to-right subtracting `(7*i+3) mod 26` at
each position `i` (0-based, in the un-reversed string's own order) to
recover the original character at that position. `finv` must be a
direct algebraic inverse — it must not brute-force search over
candidate strings.

## Deliverables

- `invert.js` — exports both `f(s)` and `finv(t)` via
  `module.exports`. When run with `node invert.js`, it must print
  `f` applied to the four predict-inputs and print the result of
  using `finv` to recover the preimage of `"rmbckkj"`.
- `PREDICTIONS.md` — records your hand-computed answers (Part A) for
  `f("abc")`, `f("hello")`, `f("z")`, `f("code")`, written down before
  running any code.

## Constraints

- Plain JavaScript, no dependencies, single file for `invert.js`, at
  most 90 lines.
- `finv` must be a direct inverse computation, not a brute-force
  search over the space of possible strings.
