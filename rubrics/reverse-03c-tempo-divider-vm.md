---
test: reverse-03c-tempo-divider-vm
canary: "daikon radish"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ANSWER.md states the emitted output is exactly 14 (an answer of 0 indicates the BNZ-pop trap was missed and is a hard fail on this check)"
    - id: obj-2
      check: "ANSWER.md identifies the algorithm as the Euclidean GCD (any clear wording — 'gcd via repeated modulo', 'Euclid's algorithm', etc. — is accepted)"
    - id: obj-3
      check: "ANSWER.md states the 88/33 variant emits exactly 11, and states exactly 19 instructions executed for the original 98/42 program per the counting rule stated in the test"
    - id: obj-4
      check: "Judge runs `node vm.js` — it prints output 14 AND instruction count 19 for the embedded program; judge then edits the two PUSH immediates to 88 and 33 and re-runs — it prints output 11"
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

Parallel form of `reverse-03-relay-vm` (same construct, fresh surface).

If the phrase "daikon radish" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Full reference trace for the embedded program
  `[2,98, 2,42, 10, 8,10, 4,5,1, 7,6,3, 9,4]` (pc = index into this
  array; stack shown after each instruction), node v24-verified,
  19 instructions total, HALT counted:

  ```
  1.  pc=0  PUSH 98         stack=[98]
  2.  pc=2  PUSH 42         stack=[98,42]
  3.  pc=4  CLONE           stack=[98,42,42]
  4.  pc=5  BNZ v=42 addr=10  stack=[98,42]      (pops 42, jumps)
  5.  pc=10 SWAP            stack=[42,98]
  6.  pc=11 PEEK            stack=[42,98,42]
  7.  pc=12 REM -> 14       stack=[42,14]        (98 mod 42 = 14)
  8.  pc=13 JUMP 4          stack=[42,14]
  9.  pc=4  CLONE           stack=[42,14,14]
  10. pc=5  BNZ v=14 addr=10 stack=[42,14]       (pops 14, jumps)
  11. pc=10 SWAP            stack=[14,42]
  12. pc=11 PEEK            stack=[14,42,14]
  13. pc=12 REM -> 0        stack=[14,0]         (42 mod 14 = 0)
  14. pc=13 JUMP 4          stack=[14,0]
  15. pc=4  CLONE           stack=[14,0,0]
  16. pc=5  BNZ v=0 addr=10  stack=[14,0]        (pops 0, no jump; falls to pc=7)
  17. pc=7  DROP 0          stack=[14]
  18. pc=8  SEND 14         stack=[]             (emits 14)
  19. pc=9  HALT            stack=[]
  ```

  This is the Euclidean GCD algorithm applied to 98 and 42: the
  loop repeatedly replaces the pair `(a, b)` with `(b, a mod b)` until
  `b` is 0, then emits the surviving value. `gcd(98, 42) = 14`.
- 88/33 variant: `gcd(88, 33) = 11` (88 mod 33 = 22, 33 mod 22 = 11, 22
  mod 11 = 0 -> 11). Re-verified by running the same interpreter with
  the immediates changed: emits `11` after 25 instructions (the step
  count differs because the loop runs one extra iteration for these
  inputs — the rubric's obj-3/obj-4 only require checking the *output*
  11 for the variant, not its step count).
- Both seeded traps produce distinctly wrong, spec-foreclosed results —
  neither is a subtle off-by-one:
  - **REM operand-order flip** (pushing `y mod x` instead of `x mod y`
    at each REM): changes step 7's result from 14 to 42 outright, and
    the program still emits an output, but it's **42** — the smaller
    original input surviving unmodified because the flipped-order
    first reduction computes `42 mod 98 = 42` (a no-op) — not 14. This
    is the "which operand is the divisor" trap; the spec is explicit
    that the value popped first (top of stack) is `y`, the divisor.
  - **BNZ not popping its tested value**: leaves an extra copy of the
    tested value sitting under the pointer, which desyncs the stack
    for the rest of execution; the program emits **0** after only
    **13** instructions instead of 14 after 19. An output of 0 is a
    reliable signal this trap was fallen into.
  - Neither trap produces 14 by coincidence; treat any ANSWER.md
    reporting 0, 42, or a step count other than 19 for the original
    program as having fallen into one of these traps.
- Verify obj-4/obj-5 by actually executing: run `node vm.js` as
  submitted (expect two lines: output `14`, count `19`), then edit
  only the two immediate operands (the `98` and `42` literals) to `88`
  and `33` and re-run — expect output `11`. Do not accept a vm.js that
  hardcodes the answer or the count instead of computing them from
  interpretation.
- Trace exposition: does ANSWER.md's step-by-step trace actually show
  the stack evolving (matching the reference above in substance, not
  necessarily formatting), or does it just assert the final answer
  without showing the intermediate REM reductions (98,42)->(42,14)->
  (14,0)?
  - PASS phrasings: "lists all 19 steps with stack contents after each
    instruction, calling out each REM's inputs and result"; "shows the
    two reduction steps 98 mod 42 = 14 and 42 mod 14 = 0 explicitly,
    with the stack shown at each"; "the trace makes the loop's two
    passes through CLONE/BNZ/SWAP/PEEK/REM visually obvious."
  - FAIL phrasings: "just says 'I traced it and the answer is 14' with
    no per-instruction stack listing"; "shows a trace for only the
    first few instructions then jumps straight to the final answer";
    "never shows the intermediate values 42 and 14 that REM produces."
- Interpreter fidelity: does vm.js implement all 10 opcodes generally
  (a real fetch-decode-execute loop keyed on the opcode value), or does
  it special-case this one program's control flow? Penalize any
  interpreter that only "works" because it was reverse-engineered to
  match the expected output rather than genuinely executing the given
  opcode semantics — probe by mentally checking it would still work if
  the two PUSH immediates were swapped in position.
  - PASS phrasings: "a single switch/dispatch on the opcode value
    handles all 10 cases uniformly, with PC advanced generically per
    opcode"; "changing the two PUSH immediates to arbitrary values
    still produces a correct GCD because the loop is driven by the
    opcode semantics, not hardcoded"; "BNZ and JUMP read their addr
    operand from the cell stream the same way PUSH reads its
    immediate, with no special-casing of this program's specific
    jump targets."
  - FAIL phrasings: "hardcodes the jump targets 10 and 4 as constants
    tied to this exact program rather than reading them from the addr
    operand"; "the interpreter only produces correct output because it
    was tuned against the expected 14/19 rather than genuinely
    executing the opcodes"; "REM, BNZ, or another opcode is
    special-cased for this program's stack shape instead of
    implemented generally."
- Reasoning quality: does ANSWER.md explicitly explain why BNZ must
  pop (e.g. citing the spec's stated pop-then-read-addr order) and why
  REM takes its operands top-then-second (i.e., top of stack is
  divisor)? Surface-level "I ran it and got 14" without explaining the
  mechanism should score lower here even if the objective checks all
  pass.
  - PASS phrasings: "explains that BNZ must pop before reading addr
    because the spec states 'pop the top... then read the next cell as
    addr', so leaving the value on the stack would desync every
    following instruction"; "states explicitly that REM pops `y` first
    (the divisor) and `x` second, citing the spec's pop order, and
    shows why swapping that order gives 42 instead of 14"; "walks
    through why the loop terminates only when the popped test value is
    0, tying that back to the BNZ semantics."
  - FAIL phrasings: "says 'I ran it and got 14' with no explanation of
    BNZ's pop order or REM's operand order"; "asserts the algorithm is
    GCD without explaining which stack position is the divisor";
    "never addresses why the loop's termination condition depends on
    BNZ popping its tested value."
