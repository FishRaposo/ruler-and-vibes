---
id: reverse-08-loom-dispatch
category: reverse-engineering
title: Unflatten the Dispatch Loop
deliverables:
  - unflat.js
  - ANSWER.md
---

## Task

A fictional build tool's minifier applied control-flow flattening to a
small function, scrambling its original loop/branch structure into a
single dispatch loop. Here is the flattened function, verbatim:

```js
function flattened(n) {
  let state = 0;
  let acc, i;
  while (state !== 99) {
    switch (state) {
      case 0:
        acc = 0;
        i = 1;
        state = 1;
        break;
      case 1:
        if (i <= n) {
          state = 2;
        } else {
          state = 4;
        }
        break;
      case 2:
        if (i % 3 === 0) {
          acc += i;
          state = 3;
        } else {
          state = 3;
        }
        break;
      case 3:
        i += 1;
        state = 1;
        break;
      case 4:
        state = 99;
        break;
      default:
        throw new Error("bad state " + state);
    }
  }
  return acc;
}
```

Work out what this computes, then recover its original, structured
control flow — the loop and conditional this dispatcher was built from
before flattening. Pay close attention to case `2`: trace exactly what
happens on both the `if` branch and the `else` branch, and where each
one sends execution next.

## Deliverables

- `unflat.js` — must contain BOTH the flattened function above,
  embedded verbatim, AND your recovered structured reimplementation (a
  real `for`/`while` loop with an inner conditional — containing NO
  state-variable dispatcher `switch`; the flattening must be genuinely
  removed, not just renamed). When run with `node unflat.js`, it must:
  - print the recovered function's output for `n = 0, 1, 3, 10, 20`;
  - then run BOTH the flattened function and your recovered function
    across every input `n` from 0 to 20, compare their outputs, and
    print a single line reading either `EQUIVALENCE: PASS (n=0..20)` if
    every input matches or `EQUIVALENCE: FAIL` (with the mismatching
    inputs) otherwise, so the judge can confirm equivalence by reading
    that one line rather than diffing two files by hand.
- `ANSWER.md` — states in plain words what the function computes; and
  explains precisely what case `2`'s `if`/`else` do — specifically,
  where each branch sends execution next, and why the `else` branch is
  not an unconditional accumulation.

## Constraints

- Plain JavaScript, no dependencies, single file for `unflat.js`.
