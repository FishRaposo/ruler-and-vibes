---
id: reverse-08b-phase-sequencer
category: reverse-engineering
title: Unflatten the Phase Sequencer
deliverables:
  - unflat.js
  - ANSWER.md
---

## Task

A fictional telemetry pipeline's bytecode packer applied control-flow
flattening to a small aggregation routine, scrambling its original
loop/branch structure into a single phase-dispatch loop. Here is the
flattened function, verbatim:

```js
function flattened(limit) {
  let phase = 0;
  let total, idx;
  while (phase !== -1) {
    switch (phase) {
      case 0:
        total = 0;
        idx = 1;
        phase = 1;
        break;
      case 1:
        if (idx <= limit) {
          phase = 2;
        } else {
          phase = 4;
        }
        break;
      case 2:
        if (idx % 4 === 0) {
          total += idx;
          phase = 3;
        } else {
          phase = 3;
        }
        break;
      case 3:
        idx += 1;
        phase = 1;
        break;
      case 4:
        phase = -1;
        break;
      default:
        throw new Error("bad phase " + phase);
    }
  }
  return total;
}
```

Work out what this routine computes, then recover the original,
structured control flow — the loop and conditional this sequencer was
built from before flattening. Pay close attention to phase `2`: trace
exactly what happens on both the `if` branch and the `else` branch, and
where each one sends execution next.

## Deliverables

- `unflat.js` — must contain BOTH the flattened function above,
  embedded verbatim, AND your recovered structured reimplementation (a
  real `for`/`while` loop with an inner conditional — containing NO
  phase-variable dispatcher `switch`; the flattening must be genuinely
  removed, not just renamed). When run with `node unflat.js`, it must:
  - print the recovered function's output for `limit = 0, 1, 4, 12, 24`;
  - then run BOTH the flattened function and your recovered function
    across every input `limit` from 0 to 24, compare their outputs, and
    print a single line reading either `EQUIVALENCE: PASS (n=0..24)` if
    every input matches or `EQUIVALENCE: FAIL` (with the mismatching
    inputs) otherwise, so the judge can confirm equivalence by reading
    that one line rather than diffing two files by hand.
- `ANSWER.md` — states in plain words what the function computes; and
  explains precisely what phase `2`'s `if`/`else` do — specifically,
  where each branch sends execution next, and why the `else` branch is
  not an unconditional accumulation.

## Constraints

- Plain JavaScript, no dependencies, single file for `unflat.js`.
