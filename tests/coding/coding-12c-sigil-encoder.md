---
id: coding-12c-sigil-encoder
category: coding
title: Predict and invert a sigil encoder
deliverables:
  - sigil.js
  - PREDICTIONS.md
---

## Task

Here is a pure, deterministic transform `g(s)` over lowercase-letter
strings, described precisely (do not run code to answer Part A —
compute it by hand first):

For each character in `s` at 0-based index `i`, shift it *backward*
by `(4*i + 5) mod 26` positions in the alphabet (wrapping `a` back to
`z`), producing an intermediate string of the same length in the same
left-to-right order as the input. Then reverse the entire intermediate
string to produce the final output.

For example (worked by hand, not by running code): for `s = "be"`,
index 0's `'b'` shifts backward by `(4*0+5) mod 26 = 5` to `'w'`;
index 1's `'e'` shifts backward by `(4*1+5) mod 26 = 9` to `'v'`; the
intermediate string is `"wv"`; reversing gives `g("be") = "vw"`.

### Part A — predict (no code execution)

Work out, by hand, the value of `g` for each of these four inputs:
`"cat"`, `"world"`, `"q"`, `"mint"`. Record your predictions in
`PREDICTIONS.md` before writing or running any code that computes `g`.

### Part B — invert

`g` is a bijection on same-length lowercase strings (each output has
exactly one preimage of that length). Implement `ginv(t)`, the true
inverse of `g`, and use it to recover the unique string `x` such that
`g(x) === "qtjeerc"`.

The trap: the shift amount depends on the character's index in the
ORIGINAL (pre-reversal) string, not its index in the final output. To
invert correctly you must first undo the reversal, and only then walk
the un-reversed string left-to-right adding `(4*i+5) mod 26` back at
each position `i` (0-based, in the un-reversed string's own order) to
recover the original character at that position. `ginv` must be a
direct algebraic inverse — it must not brute-force search over
candidate strings.

## Deliverables

- `sigil.js` — exports both `g(s)` and `ginv(t)` via
  `module.exports`. When run with `node sigil.js`, it must print `g`
  applied to the four predict-inputs and print the result of using
  `ginv` to recover the preimage of `"qtjeerc"`.
- `PREDICTIONS.md` — records your hand-computed answers (Part A) for
  `g("cat")`, `g("world")`, `g("q")`, `g("mint")`, written down before
  running any code.

## Constraints

- Plain JavaScript, no dependencies, single file for `sigil.js`, at
  most 90 lines.
- `ginv` must be a direct inverse computation, not a brute-force
  search over the space of possible strings.
