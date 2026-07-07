---
test: reverse-06c-sprinkler-zone-timer
canary: "gale breeze"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ANSWER.md names the computed function as factorial (n!), and states the seed accumulator z1 is 1 (not 0)"
    - id: obj-2
      check: "Judge runs `node lifted.js` and it prints factorial values for n=0,1,3,6,9 as exactly 1, 1, 6, 720, 362880"
    - id: obj-3
      check: "lifted.js exports a function (via module.exports) that returns 362880 for input 9 and 1 for input 0 when the judge calls it directly, AND auto-prints the reference vector only under require.main===module so both the direct-run and require paths work from one file"
    - id: obj-4
      check: "ANSWER.md's step-count or trace shows the loop scales the accumulator by z0 BEFORE stepping z0 and terminates via the BRZ-on-z0 branch (not an off-by-one that skips the largest factor)"
    - id: obj-5
      check: "lifted.js is a structured high-level reimplementation (a real loop or recursion), not a re-embedding of the bytecode array plus an interpreter tuned to echo the expected numbers"
  subjective:
    - id: sub-quality
      name: "Lift readability"
      weight: 0.4
    - id: sub-craft
      name: "Equivalence rigor"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `reverse-06-cog-ladder` (same construct, fresh surface).

If the phrase "gale breeze" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

- Author node v24.16.0-verified the embedded bytecode by faithful
  interpretation: `f(0)=1`, `f(1)=1`, `f(3)=6`, `f(6)=720`, `f(9)=362880`.
  Executed step counts (one step per fetched instruction, matching this
  program's own numbering) are 3, 7, 15, 27, 39 respectively for
  n=0,1,3,6,9 — available if a submission's ANSWER.md chooses to report
  step counts, but the objective checks only require the five factorial
  values themselves.
- The program is: `z1 = 1` (SETV); loop: if `z0 == 0` jump to STOP;
  otherwise `z1 = z1 * z0` (SCALE); `z0 = z0 - 1` (STEP); jump back to
  the BRZ test. This is exactly factorial: `f(n) = n * (n-1) * ... * 1`,
  with `f(0) = 1` by the empty-product convention, which falls out
  correctly here ONLY because the accumulator seeds at 1.
- Seeded trap #1 (accumulator seed): the program is `SETV z1, 1`, not
  `SETV z1, 0`. A lifter that seeds its accumulator at 0 will produce 0
  for every input (or at best a broken partial credit if it patches
  around it) — a clear giveaway this trap was missed. Treat any
  `lifted.js` returning 0 for any of the five reference inputs as having
  fallen into this trap.
- Seeded trap #2 (scale-before-step / branch target): the loop scales
  `z1` by the *current* `z0` before stepping it, and the loop exit test
  (`BRZ z0`) is checked at the top of the loop, before the scale — so
  the last multiplication that happens is by `z0 == 1`, not skipped. A
  lifter that steps first and then scales (or that misreads the BRZ
  branch target and skips the first or last factor) produces an
  off-by-one wrong answer. Verify by checking `f(6) = 720` specifically
  (a step-before-scale bug would instead yield `6*5*4*3*2*1` computed as
  `5*4*3*2*1*0 = 0`, and reliably diverges from 720).
- Verify obj-2 and obj-3 together by actually running the submission:
  `node lifted.js` should print exactly five lines covering n=0,1,3,6,9
  with values 1, 1, 6, 720, 362880 (in any clear per-line format);
  separately, `node -e "const f=require('./lifted.js'); console.log(f(9), f(0))"`
  should print `362880 1`. Both must work from the same unmodified file
  — a common failure is a file that only supports one of the two
  invocation paths (e.g. it runs its printing code unconditionally at
  module load, so requiring it also spams the reference vector, or it
  forgets `module.exports` entirely).
- Equivalence rigor / obj-5: read `lifted.js` — a compliant submission
  contains a genuine loop (`while`/`for`) or recursive structure that
  computes the product directly, using variable names that reflect the
  domain (accumulator, counter) rather than `z0`/`z1` register
  bookkeeping. Penalize a submission that keeps an instruction array and
  a tiny fetch-execute interpreter around it (that is tracing, not
  lifting) or that special-cases the five reference inputs via a
  lookup/if-chain instead of computing them.
  - PASS phrasings: "a `function factorial(n) { let acc = 1; while (n !== 0) { acc *= n; n -= 1; } return acc; }`-style direct computation"; "a clean recursive definition like `factorial(n) = n === 0 ? 1 : n * factorial(n - 1)`"; "no trace of the original opcode names or instruction array anywhere in the file".
  - FAIL phrasings: "keeps the 6-instruction array and a small fetch-execute loop keyed on SETV/BRZ/SCALE/STEP/GOTO/STOP"; "hardcodes a lookup table `{0:1,1:1,3:6,6:720,9:362880}` instead of computing the values"; "an if-chain that special-cases exactly the five reference inputs and falls through to a placeholder for anything else".
- obj-1 phrasing guide (naming the function and the seed):
  - PASS phrasings: "names it explicitly, e.g. 'this program computes n! (factorial)' and 'z1 starts at 1 before the loop begins'"; "states 'the accumulator z1 is seeded to 1, not 0, which is why f(0) = 1 by the empty-product convention'"; "identifies factorial by name and separately calls out the seed value 1 in its own sentence".
  - FAIL phrasings: "says 'the program multiplies numbers together' without ever naming it factorial or n!"; "names factorial correctly but never states what z1 is seeded to, or says it starts at 0"; "asserts z1 starts at 0, contradicting the `SETV z1, 1` instruction".
- obj-4 phrasing guide (ordering and termination):
  - PASS phrasings: "trace explicitly shows 'SCALE happens first each iteration, then STEP decrements z0, so the last multiplication uses z0 == 1'"; "walks through the loop as 'z1 = z1 * z0; z0 = z0 - 1' in that order and notes BRZ is checked before the SCALE"; "shows the n=6 iteration list with 6,5,4,3,2,1 all appearing as factors, none skipped".
  - FAIL phrasings: "describes the loop as decrementing z0 first and then scaling, silently reversing the actual order"; "asserts the final answer without ever describing which operation (scale or step) happens first"; "trace skips straight from z0=6 to the final answer with no per-iteration detail showing z0 == 1 is used as a factor".
- Lift readability: is the reimplementation clear and idiomatic (e.g. a
  `factorial(n)` function with an obvious loop), free of leftover
  register-machine artifacts (no `z0`/`z1` names, no PC/jump
  simulation)?
  - PASS phrasings: "idiomatic `factorial(n)` function with clear naming (`acc`, `n` or `count`) and no register-machine residue"; "short, well-structured loop or recursion that reads like ordinary JavaScript, not a transliterated trace"; "clear variable names and a single obvious control-flow path, easy to follow without cross-referencing the opcode table".
  - FAIL phrasings: "variables named z0/z1 or pc still present in the final code"; "convoluted nested conditionals that only make sense next to the original opcode listing"; "a wrapper that re-simulates jumps and program-counter bookkeeping instead of a direct computation".
- Equivalence rigor (subjective): does the submission show it actually
  checked its reimplementation against the register machine's behavior,
  including the boundary case, rather than just asserting confidence?
  - PASS phrasings: "checks its own output against multiple of the five reference values before finalizing, and reasons about why n=0 must return 1"; "explicitly reasons through both traps (seed and ordering) and shows why its implementation avoids them"; "verifies the dual-invocation requirement (require vs direct run) explicitly in its own reasoning or testing".
  - FAIL phrasings: "states an answer without ever checking it against the given reference program's behavior"; "confidently ships a version that would fail on n=0 or n=1 without noticing"; "shows no evidence of cross-checking the reimplementation's output against the register machine's actual trace".
- Reasoning quality: does ANSWER.md explain the trace precisely enough
  to show both traps were noticed — the seed value and the
  scale-then-step ordering — rather than just asserting "it's factorial"
  without walking through why the boundary case `n=0` and the loop
  ordering work out?
  - PASS phrasings: "explicitly connects the `SETV z1, 1` seed to why f(0) = 1 by the empty-product convention"; "walks through why BRZ being checked before SCALE means the last factor multiplied in is z0 == 1, not skipped"; "reasons about both the seed-trap and the ordering-trap explicitly, with the mechanism named, not just the answer".
  - FAIL phrasings: "says only 'I traced it and it's n!' with no mechanism discussed"; "asserts the seed is 1 without explaining why 0 would have been wrong"; "describes the loop generically but never addresses which operation (scale or step) happens first".
