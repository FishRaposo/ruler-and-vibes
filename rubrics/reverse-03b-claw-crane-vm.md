---
test: reverse-03b-claw-crane-vm
canary: "salsify jicama"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ANSWER.md states the emitted output is exactly 18 (an answer of 0 indicates the JNZ-pop trap was missed and is a hard fail on this check)"
    - id: obj-2
      check: "ANSWER.md identifies the algorithm as the Euclidean GCD (any clear wording — 'gcd via repeated modulo', 'Euclid's algorithm', etc. — is accepted)"
    - id: obj-3
      check: "ANSWER.md states the 100/88 variant emits exactly 4, and states exactly 19 instructions executed for the original 72/54 program per the counting rule stated in the test"
    - id: obj-4
      check: "Judge runs `node vm.js` — it prints output 18 AND instruction count 19 for the embedded program; judge then edits the two PUSH immediates to 100 and 88 and re-runs — it prints output 4"
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
anchors:
  - id: Trace exposition
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Interpreter fidelity
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `reverse-03-relay-vm` (same construct, fresh surface).

If the phrase "salsify jicama" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Full reference trace for the embedded program
  `[2,72, 2,54, 4,9,10, 7,3,1, 6,8,10, 5,4]` (pc = index into this
  array; stack shown after each instruction), node v24.16.0-verified,
  19 instructions total, HALT counted:

  ```
  1.  pc=0  PUSH 72         stack=[72]
  2.  pc=2  PUSH 54         stack=[72,54]
  3.  pc=4  DUP             stack=[72,54,54]
  4.  pc=5  JNZ v=54 addr=10  stack=[72,54]      (pops 54, jumps)
  5.  pc=10 SWAP            stack=[54,72]
  6.  pc=11 OVER            stack=[54,72,54]
  7.  pc=12 MOD -> 18       stack=[54,18]        (72 mod 54 = 18)
  8.  pc=13 JMP 4           stack=[54,18]
  9.  pc=4  DUP             stack=[54,18,18]
  10. pc=5  JNZ v=18 addr=10 stack=[54,18]       (pops 18, jumps)
  11. pc=10 SWAP            stack=[18,54]
  12. pc=11 OVER            stack=[18,54,18]
  13. pc=12 MOD -> 0        stack=[18,0]         (54 mod 18 = 0)
  14. pc=13 JMP 4           stack=[18,0]
  15. pc=4  DUP             stack=[18,0,0]
  16. pc=5  JNZ v=0 addr=10  stack=[18,0]        (pops 0, no jump; falls to pc=7)
  17. pc=7  POP 0           stack=[18]
  18. pc=8  OUT 18          stack=[]             (emits 18)
  19. pc=9  HALT            stack=[]
  ```

  This is the Euclidean GCD algorithm applied to 72 and 54: the
  loop repeatedly replaces the pair `(a, b)` with `(b, a mod b)` until
  `b` is 0, then emits the surviving value. `gcd(72, 54) = 18`.
- 100/88 variant: `gcd(100, 88) = 4` (100 mod 88 = 12, 88 mod 12 = 4,
  12 mod 4 = 0 -> 4). Re-verified by running the same interpreter with
  the immediates changed: emits `[4]` after 25 instructions (the step
  count differs because the loop runs one extra iteration for these
  inputs — the rubric's obj-3/obj-4 only require checking the *output*
  4 for the variant, not its step count).
- Both seeded traps produce distinctly wrong, spec-foreclosed results —
  neither is a subtle off-by-one:
  - **MOD operand-order flip** (pushing `y mod x` instead of `x mod y`
    at each MOD): changes step 7's result from 18 to 54 outright, and
    the program still emits an output, but it's **54** — the smaller
    input unchanged by a no-op first reduction — not 18. This is the
    "which operand is the divisor" trap; the spec is explicit that
    the value popped first (top of stack) is `y`, the divisor.
  - **JNZ not popping its tested value**: leaves an extra copy of the
    tested value sitting under the pointer, which desyncs the stack
    for the rest of execution; the program emits **0** after only
    **13** instructions instead of 18 after 19. An output of 0 is a
    reliable signal this trap was fallen into.
  - Neither trap produces 18 by coincidence; treat any ANSWER.md
    reporting 0, 54, or a step count other than 19 for the original
    program as having fallen into one of these traps.
- Verify obj-4/obj-5 by actually executing: run `node vm.js` as
  submitted (expect two lines: output `18`, count `19`), then edit
  only the two immediate operands (the `72` and `54` literals) to `100`
  and `88` and re-run — expect output `4`. Do not accept a vm.js that
  hardcodes the answer or the count instead of computing them from
  interpretation.
- Trace exposition: does ANSWER.md's step-by-step trace actually show
  the stack evolving (matching the reference above in substance, not
  necessarily formatting), or does it just assert the final answer
  without showing the intermediate MOD reductions
  (72,54)->(54,18)->(18,0)?
  - PASS phrasings: "shows the stack after every instruction, including
    both DUP/JNZ/SWAP/OVER cycles before each MOD"; "walks through 72
    mod 54 = 18, then 54 mod 18 = 0, and connects each reduction to the
    surviving stack values"; "labels each of the 19 steps with the
    opcode and resulting stack, matching the reference trace in
    substance".
  - FAIL phrasings: "just states 'the program computes gcd(72,54)=18'
    with no per-instruction stack shown"; "shows the first PUSH/DUP
    pair then skips ahead straight to the final OUT"; "gives a final
    answer but never shows either MOD reduction explicitly".
- Interpreter fidelity: does vm.js implement all 10 opcodes generally
  (a real fetch-decode-execute loop keyed on the opcode value), or does
  it special-case this one program's control flow? Penalize any
  interpreter that only "works" because it was reverse-engineered to
  match the expected output rather than genuinely executing the given
  opcode semantics — probe by mentally checking it would still work if
  the two PUSH immediates were swapped in position.
  - PASS phrasings: "a single dispatch (switch or lookup table) keyed
    on the opcode value handles all 10 cases uniformly"; "PC
    advancement is computed generically per opcode (one cell, two
    cells, or a jump target), not hardcoded to this program's length";
    "swapping the two PUSH immediates in the source array still
    produces a correctly computed (if different) result".
  - FAIL phrasings: "hardcodes `console.log(18, 19)` or otherwise
    prints constants instead of interpreting"; "special-cases the pc
    of the JNZ instruction to short-circuit straight to the known
    answer"; "only implements the opcodes this one program happens to
    use, silently ignoring the general spec".
- Reasoning quality: does ANSWER.md explicitly explain why JNZ must pop
  (e.g. citing the spec's stated pop-then-read-addr order) and why MOD
  takes its operands top-then-second (i.e., top of stack is divisor)?
  Surface-level "I ran it and got 18" without explaining the mechanism
  should score lower here even if the objective checks all pass.
  - PASS phrasings: "cites the spec's 'pop the top, then read addr'
    order to explain why JNZ must consume the tested value before
    branching"; "explains that MOD pops `y` first so the top of stack
    is always the divisor, not the dividend"; "connects the operand-
    order rule to why a naive same-order rewrite would silently
    corrupt the second reduction".
  - FAIL phrasings: "says only 'I ran it and got 18' with no mechanism
    discussed"; "asserts the algorithm is GCD without explaining the
    JNZ pop-order or MOD operand-order rules"; "describes the loop in
    general terms but never addresses why popping order matters for
    either JNZ or MOD".
