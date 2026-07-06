---
id: coding-12b-callsign-scrambler
category: coding
title: Forecast and reverse a call-sign scrambler
deliverables:
  - descramble.js
  - FORECASTS.md
---

## Task

The Marlspit buoy network scrambles each beacon's plaintext call-sign
with a pure, deterministic transform `g(s)` over lowercase-letter
strings, described precisely below (do not run code to answer Part A —
work it out by hand first):

For each character in `s` at 0-based index `i`, shift it by
`(5*i + 4) mod 26` positions forward in the alphabet (wrapping `z`
back to `a`), producing an intermediate string of the same length in
the same left-to-right order as the input. Then reverse the entire
intermediate string to produce the final scrambled call-sign.

For example (worked by hand, not by running code): for `s = "on"`,
index 0's `'o'` shifts by `(5*0+4) mod 26 = 4` to `'s'`; index 1's
`'n'` shifts by `(5*1+4) mod 26 = 9` to `'w'`; the intermediate
string is `"sw"`; reversing gives `g("on") = "ws"`.

### Part A — forecast (no code execution)

Work out, by hand, the value of `g` for each of these four call-signs:
`"sky"`, `"signal"`, `"q"`, `"tide"`. Record your forecasts in
`FORECASTS.md` before writing or running any code that computes `g`.

### Part B — reverse

`g` is a bijection on same-length lowercase strings (each scrambled
call-sign has exactly one plaintext preimage of that length). Implement
`ginv(t)`, the true inverse of `g`, and use it to recover the unique
plaintext call-sign `x` such that `g(x) === "luguonw"`.

The trap: the shift amount depends on the character's index in the
ORIGINAL (pre-reversal) call-sign, not its index in the final scrambled
output. To reverse correctly you must first undo the reversal, and only
then walk the un-reversed string left-to-right subtracting
`(5*i+4) mod 26` at each position `i` (0-based, in the un-reversed
string's own order) to recover the original character at that position.
`ginv` must be a direct algebraic inverse — it must not brute-force
search over candidate strings.

## Deliverables

- `descramble.js` — exports both `g(s)` and `ginv(t)` via
  `module.exports`. When run with `node descramble.js`, it must print
  `g` applied to the four forecast call-signs and print the result of
  using `ginv` to recover the preimage of `"luguonw"`.
- `FORECASTS.md` — records your hand-computed answers (Part A) for
  `g("sky")`, `g("signal")`, `g("q")`, `g("tide")`, written down before
  running any code.

## Constraints

- Plain JavaScript, no dependencies, single file for `descramble.js`, at
  most 90 lines.
- `ginv` must be a direct inverse computation, not a brute-force
  search over the space of possible strings.
