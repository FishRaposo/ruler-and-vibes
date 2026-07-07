---
id: reverse-03b-claw-crane-vm
category: reverse-engineering
title: Trace the Claw-Crane Stack Machine
deliverables:
  - vm.js
---

## Task

A fictional arcade claw-crane's prize-drop controller runs firmware for a
tiny stack-based virtual machine. You have the complete opcode spec and
one embedded program. Work out exactly what the program computes.

**Opcode spec** (the VM has a single integer stack; `PC` starts at 0
and advances past whatever it just fetched unless a jump changes it):

| Opcode | Name | Behavior |
|---|---|---|
| 1 | `HALT` | Stop execution. |
| 2 | `PUSH imm` | The next program cell is the immediate value; push it. |
| 3 | `OUT` | Pop the top of stack and emit it as output. |
| 4 | `DUP` | Push a copy of the top of stack. |
| 5 | `JMP addr` | The next program cell is `addr`; jump there unconditionally. |
| 6 | `SWAP` | Swap the top two stack values. |
| 7 | `POP` | Pop and discard the top of stack. |
| 8 | `OVER` | Push a copy of the second-from-top stack value. |
| 9 | `JNZ addr` | Pop the top of stack. Then read the next program cell as `addr`. If the popped value is nonzero, jump to `addr`; otherwise continue to the cell after `addr`. |
| 10 | `MOD` | Pop `y` (top), then pop `x`. Push `x mod y`. |

The embedded program (15 cells, values only, no labels):

```
[2, 72, 2, 54, 4, 9, 10, 7, 3, 1, 6, 8, 10, 5, 4]
```

Cell indices are 0-based; `PUSH` and `JNZ`/`JMP` each occupy their
opcode cell plus one operand cell. Trace execution from `PC = 0` by
hand before you write any code.

For the purposes of counting, one "executed instruction" is one
fetched opcode — `HALT` counts as an instruction, and `PUSH`/`JNZ`/`JMP`
each count as exactly one instruction apiece (their operand cell is
part of that same fetch, not a separate step).

## Deliverables

- `ANSWER.md` — states: the exact value the program emits via `OUT`;
  what general-purpose algorithm the program implements (name it, and
  say what the two `PUSH` immediates represent as inputs to that
  algorithm); what the program would emit if the two `PUSH` immediates
  were `100` and `88` instead of `72` and `54`; the exact number of
  instructions executed for the original `72`/`54` program under the
  counting rule above; and a step-by-step trace (stack contents after
  each instruction) for the original program.
- `vm.js` — a faithful interpreter for all 10 opcodes. Running
  `node vm.js` must execute the embedded 15-cell program as given and
  print two lines: the emitted output value, and the number of
  instructions executed under the counting rule above.

## Constraints

- Plain JavaScript, no dependencies, single file.
