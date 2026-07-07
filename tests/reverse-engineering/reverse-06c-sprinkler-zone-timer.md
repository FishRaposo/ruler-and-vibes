---
id: reverse-06c-sprinkler-zone-timer
category: reverse-engineering
title: Lift the Zone-Timer Machine to Source
deliverables:
  - lifted.js
  - ANSWER.md
---

## Task

A fictional automatic sprinkler system's zone-timer chip runs firmware
for a tiny register machine: four registers `z0`-`z3` (all integers), a
program counter, and the opcodes below. `z0` always holds the program's
single input on entry.

**Opcode spec:**

| Opcode | Form | Behavior |
|---|---|---|
| `SETV` | `SETV reg, imm` | Set `reg` to the immediate value `imm`. |
| `COPY` | `COPY dst, src` | Set `dst` to the current value of `src`. |
| `SUM` | `SUM dst, src` | Set `dst` to `dst + src`. |
| `DIFF` | `DIFF dst, src` | Set `dst` to `dst - src`. |
| `SCALE` | `SCALE dst, src` | Set `dst` to `dst * src`. |
| `STEP` | `STEP reg` | Set `reg` to `reg - 1`. |
| `BRZ` | `BRZ reg, target` | If `reg == 0`, jump to instruction index `target`; otherwise continue to the next instruction. |
| `GOTO` | `GOTO target` | Unconditionally jump to instruction index `target`. |
| `STOP` | `STOP reg` | Halt and return the current value of `reg` as the program's output. |

**The embedded program** (6 instructions, 0-indexed):

```
0: SETV z1, 1
1: BRZ  z0, 5
2: SCALE z1, z0
3: STEP  z0
4: GOTO  1
5: STOP  z1
```

Trace this program by hand for a few small inputs before writing any
code, paying close attention to what value `z1` starts at and exactly
when the scale happens relative to the step and the zero test.

## Deliverables

- `lifted.js` — a clean, structured, re-executable JavaScript
  reimplementation of what this program computes (a real loop or
  recursion — not a re-embedding of the instruction array plus a tiny
  interpreter tuned to echo expected numbers). It must:
  - export the lifted function via `module.exports` so the judge can
    `require('./lifted.js')` and call it directly with a single
    integer argument (e.g. `require('./lifted.js')(9)` must return
    `362880`, and called with `0` must return `1`);
  - when run directly with `node lifted.js` (guard this with
    `require.main === module`), print the function's output for each of
    `n = 0, 1, 3, 6, 9`, one per line, in a clear `n -> value` style so
    both the direct-run and the require/call paths work from the same
    file.
- `ANSWER.md` — names the mathematical function the program computes;
  states explicitly what value the accumulator (`z1`) is seeded to
  before the loop starts; and walks through the loop structure clearly
  enough to show the scale happens before the step each iteration, and
  that the loop exits via the `BRZ z0` test.

## Constraints

- Plain JavaScript, no dependencies, single file for `lifted.js`.
