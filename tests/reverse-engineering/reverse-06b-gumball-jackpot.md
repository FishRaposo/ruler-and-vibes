---
id: reverse-06b-gumball-jackpot
category: reverse-engineering
title: Lift the Jackpot Chip to Source
deliverables:
  - lifted.js
  - ANSWER.md
---

## Task

A novelty gumball machine hides a jackpot chip that decides the payout whenever a
customer finishes cranking the handle. The chip runs programs for a tiny register
machine: four cells `c0`-`c3` (all integers), a program counter, and the opcodes
below. `c0` always holds the chip's single input on entry.

**Opcode spec:**

| Opcode | Form | Behavior |
|---|---|---|
| `SETV` | `SETV reg, imm` | Set `reg` to the immediate value `imm`. |
| `CPY` | `CPY dst, src` | Set `dst` to the current value of `src`. |
| `ADDR` | `ADDR dst, src` | Set `dst` to `dst + src`. |
| `SUBR` | `SUBR dst, src` | Set `dst` to `dst - src`. |
| `MULR` | `MULR dst, src` | Set `dst` to `dst * src`. |
| `DECR` | `DECR reg` | Set `reg` to `reg - 1`. |
| `BZ` | `BZ reg, target` | If `reg == 0`, jump to instruction index `target`; otherwise continue to the next instruction. |
| `JMP` | `JMP target` | Unconditionally jump to instruction index `target`. |
| `HALT` | `HALT reg` | Halt and return the current value of `reg` as the chip's payout. |

**The chip's program** (6 instructions, 0-indexed):

```
0: SETV c1, 3
1: BZ   c0, 5
2: MULR c1, c0
3: DECR c0
4: JMP  1
5: HALT c1
```

Trace this program by hand for a few small inputs before writing any code, paying
close attention to what value `c1` starts at and exactly when the multiply happens
relative to the decrement and the zero test.

## Deliverables

- `lifted.js` — a clean, structured, re-executable JavaScript reimplementation of
  what this program computes (a real loop or recursion — not a re-embedding of the
  instruction array plus a tiny interpreter tuned to echo expected numbers). It
  must:
  - export the lifted function via `module.exports` so the judge can
    `require('./lifted.js')` and call it directly with a single integer argument
    (e.g. `require('./lifted.js')(8)` must return `120960`, and called with `0`
    must return `3`);
  - when run directly with `node lifted.js` (guard this with
    `require.main === module`), print the function's output for each of
    `n = 0, 1, 4, 6, 8`, one per line, in a clear `n -> value` style so both the
    direct-run and the require/call paths work from the same file.
- `ANSWER.md` — names the mathematical function the chip computes; states
  explicitly what value the accumulator (`c1`) is seeded to before the loop
  starts; and walks through the loop structure clearly enough to show the
  multiply happens before the decrement each iteration, and that the loop exits
  via the `BZ c0` test.

## Constraints

- Plain JavaScript, no dependencies, single file for `lifted.js`.
