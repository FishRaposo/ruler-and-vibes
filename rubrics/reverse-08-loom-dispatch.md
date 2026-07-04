---
test: reverse-08-loom-dispatch
canary: "teasel bollard quiver"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ANSWER.md states the function computes the sum of multiples of 3 from 1 to n (any equivalent clear wording accepted)"
    - id: obj-2
      check: "Judge runs `node unflat.js` and the recovered structured function prints, for n=0,1,3,10,20, exactly 0, 0, 3, 18, 63"
    - id: obj-3
      check: "unflat.js's recovered function is structured (a real for/while loop with an inner conditional) containing NO state-variable dispatcher switch — the flattening is removed, not renamed"
    - id: obj-4
      check: "Judge runs unflat.js which includes both the embedded original flattened function and the recovered function, feeds both the inputs 0..20, and both produce identical outputs (the file asserts equivalence and prints a single PASS/FAIL line the judge reads)"
    - id: obj-5
      check: "ANSWER.md explains that the case-2 if/else share successor case 3, so only the true branch adds i and the else is a no-op (not an unconditional accumulation)"
  subjective:
    - id: sub-quality
      name: "Recovered-structure fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Deobfuscation completeness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Codename for this test in judge chatter: teasel bollard quiver.

- Author node v24.16.0-verified: the flattened function and the
  structured recovered version agree on all `n` in `0..20`. Reference
  outputs: `f(0)=0`, `f(1)=0`, `f(3)=3`, `f(10)=18`, `f(20)=63`.
- Recovered structure — a `for` loop from `i=1` to `i<=n`, with an
  inner `if (i % 3 === 0) acc += i;` and no `else` action:

  ```js
  function unflattened(n) {
    let acc = 0;
    for (let i = 1; i <= n; i++) {
      if (i % 3 === 0) {
        acc += i;
      }
    }
    return acc;
  }
  ```

  This computes the sum of all multiples of 3 in `[1, n]`. Mapping back
  to the flattened states: case 0 is the loop init (`acc=0, i=1`); case
  1 is the loop guard (`i <= n`, else exit via case 4 which sets
  `state=99`); case 2 is the conditional body; case 3 is the
  increment-and-jump-back (`i += 1`, then back to the case-1 guard).
- Seeded trap: in case 2, BOTH the `if` branch (`i % 3 === 0`, which
  does `acc += i`) and the `else` branch route to the same next state,
  case 3 — the shared successor. The `else` branch does nothing but
  fall through to the increment; it is not a second accumulation path.
  A model that misreads the shared successor as meaning both branches
  add `i` will double-count non-multiples-of-3, producing wildly wrong
  totals (author-verified: a variant that adds `i` unconditionally in
  both branches of case 2 gives `0, 1, 6, 55, 210` for `n=0,1,3,10,20`
  instead of the correct `0, 0, 3, 18, 63` — sharply divergent, not a
  subtle off-by-one). A second, separate trap is misreading the
  case-1/case-3 back-edge (which governs the iteration bound `i <= n`);
  getting this wrong also produces wrong totals for the same reference
  inputs.
- Verify obj-2 and obj-4 by actually running `node unflat.js`: it must
  print the recovered function's five reference outputs, then a single
  `EQUIVALENCE: PASS (n=0..20)` line (or, if the submission's logic is
  wrong, an `EQUIVALENCE: FAIL` line with mismatches listed — treat any
  FAIL or missing equivalence line as failing obj-4 outright regardless
  of what the five printed reference outputs show).
- Recovered-structure fidelity / obj-3: read `unflat.js` — the
  recovered function must contain no `state`/`switch`-based dispatch of
  any kind. A submission that keeps a `switch(state)` loop but renames
  the states or collapses cases without truly restructuring to
  `for`/`if` fails this check even if its output is correct.
- Deobfuscation completeness: does the recovered version read as a
  natural, idiomatic structured function a developer would have written
  originally (clear loop bound, clear conditional), rather than a
  literal one-to-one translation of each case into an equivalent
  if-chain that still shadows the state machine's shape?
- Reasoning quality: does ANSWER.md correctly and explicitly identify
  that case 2's `if` and `else` are NOT symmetric — only the `if`
  accumulates, and the `else` is a bare fall-through to case 3 — rather
  than vaguely describing case 2 as "the conditional part"? Does it
  correctly trace the case-1/case-3 loop back-edge as the iteration
  mechanism?
