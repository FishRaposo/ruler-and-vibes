---
id: reverse-06-cog-ladder
category: reverse-engineering
title: Lift the Register Machine to Source
deliverables:
  - lifted.js
  - ANSWER.md
---

## Task

A fictional embedded controller runs programs for a tiny register
machine: four registers `r0`-`r3` (all integers), a program counter, and
the opcodes below. `r0` always holds the program's single input on
entry.

**Opcode spec:**

| Opcode | Form | Behavior |
|---|---|---|
| `LOADI` | `LOADI reg, imm` | Set `reg` to the immediate value `imm`. |
| `MOV` | `MOV dst, src` | Set `dst` to the current value of `src`. |
| `ADD` | `ADD dst, src` | Set `dst` to `dst + src`. |
| `SUB` | `SUB dst, src` | Set `dst` to `dst - src`. |
| `MUL` | `MUL dst, src` | Set `dst` to `dst * src`. |
| `DEC` | `DEC reg` | Set `reg` to `reg - 1`. |
| `JZ` | `JZ reg, target` | If `reg == 0`, jump to instruction index `target`; otherwise continue to the next instruction. |
| `JMP` | `JMP target` | Unconditionally jump to instruction index `target`. |
| `RET` | `RET reg` | Halt and return the current value of `reg` as the program's output. |

**The embedded program** (6 instructions, 0-indexed):

```
0: LOADI r1, 1
1: JZ    r0, 5
2: MUL   r1, r0
3: DEC   r0
4: JMP   1
5: RET   r1
```

Trace this program by hand for a few small inputs before writing any
code, paying close attention to what value `r1` starts at and exactly
when the multiply happens relative to the decrement and the zero test.

## Deliverables

- `lifted.js` — a clean, structured, re-executable JavaScript
  reimplementation of what this program computes (a real loop or
  recursion — not a re-embedding of the instruction array plus a tiny
  interpreter tuned to echo expected numbers). It must:
  - export the lifted function via `module.exports` so the judge can
    `require('./lifted.js')` and call it directly with a single
    integer argument (e.g. `require('./lifted.js')(10)` must return
    `3628800`, and called with `0` must return `1`);
  - when run directly with `node lifted.js` (guard this with
    `require.main === module`), print the function's output for each of
    `n = 0, 1, 5, 7, 10`, one per line, in a clear `n -> value` style so
    both the direct-run and the require/call paths work from the same
    file.
- `ANSWER.md` — names the mathematical function the program computes;
  states explicitly what value the accumulator (`r1`) is seeded to
  before the loop starts; and walks through the loop structure clearly
  enough to show the multiply happens before the decrement each
  iteration, and that the loop exits via the `JZ r0` test.

## Constraints

- Plain JavaScript, no dependencies, single file for `lifted.js`.
