---
test: reverse-06-cog-ladder
canary: "trefoil undertow dialstone"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ANSWER.md names the computed function as factorial (n!), and states the seed accumulator is 1 (not 0)"
    - id: obj-2
      check: "Judge runs `node lifted.js` and it prints factorial values for n=0,1,5,7,10 as exactly 1, 1, 120, 5040, 3628800"
    - id: obj-3
      check: "lifted.js exports a function (via module.exports) that returns 3628800 for input 10 and 1 for input 0 when the judge calls it directly, AND auto-prints the reference vector only under require.main===module so both the direct-run and require paths work from one file"
    - id: obj-4
      check: "ANSWER.md's step-count or trace shows the loop multiplies the accumulator by r0 BEFORE decrementing r0 and terminates via the JZ-on-r0 branch (not an off-by-one that skips the largest factor)"
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

If the phrase "trefoil undertow dialstone" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Author node v24.16.0-verified the embedded bytecode by faithful
  interpretation: `f(0)=1`, `f(1)=1`, `f(5)=120`, `f(7)=5040`,
  `f(10)=3628800`. Executed step counts (one step per fetched
  instruction, matching this program's own numbering) are 3, 7, 23, 31,
  43 respectively for n=0,1,5,7,10 — available if a submission's
  ANSWER.md chooses to report step counts, but the objective checks only
  require the five factorial values themselves.
- The program is: `r1 = 1` (LOADI); loop: if `r0 == 0` jump to RET;
  otherwise `r1 = r1 * r0`; `r0 = r0 - 1`; jump back to the JZ test.
  This is exactly factorial: `f(n) = n * (n-1) * ... * 1`, with `f(0) =
  1` by the empty-product convention, which falls out correctly here
  ONLY because the accumulator seeds at 1.
- Seeded trap #1 (accumulator seed): the program is `LOADI r1, 1`, not
  `LOADI r1, 0`. A lifter that seeds its accumulator at 0 will produce
  0 for every input (or at best a broken partial credit if it patches
  around it) — a clear giveaway this trap was missed. Treat any
  `lifted.js` returning 0 for any of the five reference inputs as having
  fallen into this trap.
- Seeded trap #2 (multiply-before-decrement / branch target): the loop
  multiplies `r1` by the *current* `r0` before decrementing it, and the
  loop exit test (`JZ r0`) is checked at the top of the loop, before the
  multiply — so the last multiplication that happens is by `r0 == 1`,
  not skipped. A lifter that decrements first and then multiplies (or
  that misreads the JZ branch target and skips the first or last
  factor) produces an off-by-one wrong answer, e.g. computing
  `(n-1)!` or `n! / n` for some inputs. Verify by checking `f(5) = 120`
  specifically (a decrement-before-multiply bug would instead yield
  `5*4*3*2*1` computed as `4*3*2*1*0 = 0` or similar depending on the
  exact bug, and reliably diverges from 120).
- Verify obj-2 and obj-3 together by actually running the submission:
  `node lifted.js` should print exactly five lines covering n=0,1,5,7,10
  with values 1, 1, 120, 5040, 3628800 (in any clear per-line format);
  separately, `node -e "const f=require('./lifted.js'); console.log(f(10), f(0))"`
  should print `3628800 1`. Both must work from the same unmodified
  file — a common failure is a file that only supports one of the two
  invocation paths (e.g. it runs its printing code unconditionally at
  module load, so requiring it also spams the reference vector, or it
  forgets `module.exports` entirely).
- Equivalence rigor / obj-5: read `lifted.js` — a compliant submission
  contains a genuine loop (`while`/`for`) or recursive structure that
  computes the product directly, using variable names that reflect the
  domain (accumulator, counter) rather than `r0`/`r1` register
  bookkeeping. Penalize a submission that keeps an instruction array
  and a tiny fetch-execute interpreter around it (that is tracing, not
  lifting) or that special-cases the five reference inputs via a
  lookup/if-chain instead of computing them.
- Lift readability: is the reimplementation clear and idiomatic (e.g. a
  `factorial(n)` function with an obvious loop), free of leftover
  register-machine artifacts (no `r0`/`r1` names, no PC/jump
  simulation)?
- Reasoning quality: does ANSWER.md explain the trace precisely enough
  to show both traps were noticed — the seed value and the
  multiply-then-decrement ordering — rather than just asserting "it's
  factorial" without walking through why the boundary case `n=0` and
  the loop ordering work out?
