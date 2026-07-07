---
id: reverse-08c-dosing-pump-loop
category: reverse-engineering
title: Unflatten the Dosing-Pump Cycle Loop
deliverables:
  - unflat.js
  - ANSWER.md
---

## Task

A fictional smart-aquarium dosing-pump controller's firmware compactor
applied control-flow flattening to a small helper routine, scrambling
its original loop/branch structure into a single step-dispatch loop.
Here is the flattened function, verbatim:

```js
function flattened(cycles) {
  let step = "INIT";
  let dose, tick;
  while (step !== "DONE") {
    switch (step) {
      case "INIT":
        dose = 0;
        tick = 1;
        step = "GUARD";
        break;
      case "GUARD":
        if (tick <= cycles) {
          step = "BODY";
        } else {
          step = "EXIT";
        }
        break;
      case "BODY":
        if (tick % 5 === 0) {
          dose += tick;
          step = "ADVANCE";
        } else {
          step = "ADVANCE";
        }
        break;
      case "ADVANCE":
        tick += 1;
        step = "GUARD";
        break;
      case "EXIT":
        step = "DONE";
        break;
      default:
        throw new Error("bad step " + step);
    }
  }
  return dose;
}
```

Work out what this computes, then recover its original, structured
control flow — the loop and conditional this dispatcher was built from
before flattening. Pay close attention to step `"BODY"`: trace exactly
what happens on both the `if` branch and the `else` branch, and where
each one sends execution next.

## Deliverables

- `unflat.js` — must contain BOTH the flattened function above,
  embedded verbatim, AND your recovered structured reimplementation (a
  real `for`/`while` loop with an inner conditional — containing NO
  step-variable dispatcher `switch`; the flattening must be genuinely
  removed, not just renamed). When run with `node unflat.js`, it must:
  - print the recovered function's output for `cycles = 0, 3, 5, 14, 22`;
  - then run BOTH the flattened function and your recovered function
    across every input `cycles` from 0 to 22, compare their outputs, and
    print a single line reading either `EQUIVALENCE: PASS (n=0..22)` if
    every input matches or `EQUIVALENCE: FAIL` (with the mismatching
    inputs) otherwise, so the judge can confirm equivalence by reading
    that one line rather than diffing two files by hand.
- `ANSWER.md` — states in plain words what the function computes; and
  explains precisely what step `"BODY"`'s `if`/`else` do — specifically,
  where each branch sends execution next, and why the `else` branch is
  not an unconditional accumulation.

## Constraints

- Plain JavaScript, no dependencies, single file for `unflat.js`.
