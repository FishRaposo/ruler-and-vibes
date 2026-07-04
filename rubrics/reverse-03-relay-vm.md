---
test: reverse-03-relay-vm
canary: "hazelnut gazebo mazurka"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ANSWER.md states the emitted output is exactly 12 (an answer of 0 indicates the JNZ-pop trap was missed and is a hard fail on this check)"
    - id: obj-2
      check: "ANSWER.md identifies the algorithm as the Euclidean GCD (any clear wording — 'gcd via repeated modulo', 'Euclid's algorithm', etc. — is accepted)"
    - id: obj-3
      check: "ANSWER.md states the 91/63 variant emits exactly 7, and states exactly 19 instructions executed for the original 84/36 program per the counting rule stated in the test"
    - id: obj-4
      check: "Judge runs `node vm.js` — it prints output 12 AND instruction count 19 for the embedded program; judge then edits the two PUSH immediates to 91 and 63 and re-runs — it prints output 7"
    - id: obj-5
      check: "vm.js's own printed instruction count for the original program equals the 19 stated in ANSWER.md (the two must agree with each other and with the rubric's reference value)"
  subjective:
    - id: sub-quality
      name: "Trace exposition"
      weight: 0.4
    - id: sub-craft
      name: "Interpreter fidelity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Codename for this test in judge chatter: hazelnut gazebo mazurka.

- Full reference trace for the embedded program
  `[1,84, 1,36, 2,5,10, 8,6,7, 3,9,4, 10,4]` (pc = index into this
  array; stack shown after each instruction), node v24.16.0-verified,
  19 instructions total, HALT counted:

  ```
  1.  pc=0  PUSH 84         stack=[84]
  2.  pc=2  PUSH 36         stack=[84,36]
  3.  pc=4  DUP             stack=[84,36,36]
  4.  pc=5  JNZ v=36 addr=10  stack=[84,36]      (pops 36, jumps)
  5.  pc=10 SWAP            stack=[36,84]
  6.  pc=11 OVER            stack=[36,84,36]
  7.  pc=12 MOD -> 12       stack=[36,12]        (84 mod 36 = 12)
  8.  pc=13 JMP 4           stack=[36,12]
  9.  pc=4  DUP             stack=[36,12,12]
  10. pc=5  JNZ v=12 addr=10 stack=[36,12]       (pops 12, jumps)
  11. pc=10 SWAP            stack=[12,36]
  12. pc=11 OVER            stack=[12,36,12]
  13. pc=12 MOD -> 0        stack=[12,0]         (36 mod 12 = 0)
  14. pc=13 JMP 4           stack=[12,0]
  15. pc=4  DUP             stack=[12,0,0]
  16. pc=5  JNZ v=0 addr=10  stack=[12,0]        (pops 0, no jump; falls to pc=7)
  17. pc=7  POP 0           stack=[12]
  18. pc=8  OUT 12          stack=[]             (emits 12)
  19. pc=9  HALT            stack=[]
  ```

  This is the Euclidean GCD algorithm applied to 84 and 36: the
  loop repeatedly replaces the pair `(a, b)` with `(b, a mod b)` until
  `b` is 0, then emits the surviving value. `gcd(84, 36) = 12`.
- 91/63 variant: `gcd(91, 63) = 7` (91 = 63+28, 63 mod 28 = 7, 28 mod 7
  = 0 -> 7). Re-verified by running the same interpreter with the
  immediates changed: emits `[7]` after 25 instructions (the step
  count differs because the loop runs one extra iteration for these
  inputs — the rubric's obj-3/obj-4 only require checking the *output*
  7 for the variant, not its step count).
- Both seeded traps produce distinctly wrong, spec-foreclosed results —
  neither is a subtle off-by-one:
  - **MOD operand-order flip** (pushing `y mod x` instead of `x mod y`
    at each MOD): changes step 7's result from 12 to 36 outright, and
    the program still emits an output, but it's **36** — the larger
    input unchanged by a no-op first reduction — not 12. This is the
    "which operand is the divisor" trap; the spec is explicit that
    the value popped first (top of stack) is `y`, the divisor.
  - **JNZ not popping its tested value**: leaves an extra copy of the
    tested value sitting under the pointer, which desyncs the stack
    for the rest of execution; the program emits **0** after only
    **13** instructions instead of 12 after 19. An output of 0 is a
    reliable signal this trap was fallen into.
  - Neither trap produces 12 by coincidence; treat any ANSWER.md
    reporting 0, 36, or a step count other than 19 for the original
    program as having fallen into one of these traps.
- Verify obj-4/obj-5 by actually executing: run `node vm.js` as
  submitted (expect two lines: output `12`, count `19`), then edit
  only the two immediate operands (the `84` and `36` literals) to `91`
  and `63` and re-run — expect output `7`. Do not accept a vm.js that
  hardcodes the answer or the count instead of computing them from
  interpretation.
- Trace exposition: does ANSWER.md's step-by-step trace actually show
  the stack evolving (matching the reference above in substance, not
  necessarily formatting), or does it just assert the final answer
  without showing the intermediate MOD reductions (84,36)->(36,12)->
  (12,0)?
- Interpreter fidelity: does vm.js implement all 10 opcodes generally
  (a real fetch-decode-execute loop keyed on the opcode value), or does
  it special-case this one program's control flow? Penalize any
  interpreter that only "works" because it was reverse-engineered to
  match the expected output rather than genuinely executing the given
  opcode semantics — probe by mentally checking it would still work if
  the two PUSH immediates were swapped in position.
- Reasoning quality: does ANSWER.md explicitly explain why JNZ must pop
  (e.g. citing the spec's stated pop-then-read-addr order) and why MOD
  takes its operands top-then-second (i.e., top of stack is divisor)?
  Surface-level "I ran it and got 12" without explaining the mechanism
  should score lower here even if the objective checks all pass.
