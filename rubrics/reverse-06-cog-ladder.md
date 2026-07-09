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
anchors:
  - id: Lift readability
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Equivalence rigor
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

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
  - PASS phrasing examples for obj-1 (ANSWER.md text): "The program
    computes factorial (n!); the accumulator r1 is seeded to 1 before
    the loop begins, not 0." / "This is n! — the trace shows r1 starting
    at 1, which is why f(0) correctly comes out to 1 by the
    empty-product convention." / "The chip computes n factorial; r1's
    initial `LOADI` sets it to 1, not 0, so the boundary case f(0)=1
    holds."
  - FAIL phrasing examples for obj-1: "The program computes a running
    product starting from 0." (wrong seed, classic zero-accumulator
    mistake) / "This machine returns the factorial of the input." (never
    states the seed value at all) / "r1 begins at 0 and accumulates the
    product." (directly contradicts the `LOADI r1, 1` instruction).
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
  - PASS phrasing examples for obj-4 (ANSWER.md trace): "Each pass
    multiplies r1 by the current r0 first, then decrements r0, then
    re-checks JZ r0 at the top — so the last factor folded in is
    r0==1, and the loop only exits once r0 has reached 0." / "Trace for
    n=5: r0=5 (JZ false) -> r1=1*5=5, r0=4 -> r1=5*4=20, r0=3 ->
    r1=20*3=60, r0=2 -> r1=60*2=120, r0=1 -> r1=120*1=120, r0=0 (JZ
    true) -> RET with r1=120=5!." / "Step trace confirms the multiply
    precedes the decrement each iteration, and the branch on r0==0 is
    what ends the loop, so the last factor used is 1, not 2."
  - FAIL phrasing examples for obj-4: "The loop decrements r0 first,
    then multiplies r1 by the new value of r0, exiting once r0 hits
    0." (describes the buggy order) / "It's just a standard countdown
    loop that multiplies by r0 each time." (no mention of the
    before/after ordering or the JZ test) / "The loop runs while r0 is
    nonzero and stops right after a final multiply by r0==0." (implies
    a multiply by 0 occurs, which the reference program never does).
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
  - PASS phrasing examples for obj-5 (code shape): a `for` loop counting
    `n` down to `1` multiplying into `acc` / a recursive
    `factorial(n) = n === 0 ? 1 : n * factorial(n - 1)` / domain-named
    variables (`acc`, `count`) with no opcode dispatch anywhere.
  - FAIL phrasing examples for obj-5: a `program` array of opcode
    tuples plus a `while (true) { switch (op) { ... } }` fetch-execute
    loop wrapped in a function / a lookup object like
    `{0:1,1:1,5:120,7:5040,10:3628800}` used to special-case exactly the
    five reference inputs / leftover register-machine variable names
    (`r0`, `r1`, `pc`, `regs[]`) still driving the computation.
- Lift readability: is the reimplementation clear and idiomatic (e.g. a
  `factorial(n)` function with an obvious loop), free of leftover
  register-machine artifacts (no `r0`/`r1` names, no PC/jump
  simulation)?
  - PASS phrasings: "idiomatic `factorial(n)` function with clear
    naming (`acc`, `n` or `count`) and no register-machine residue"; "a
    short, well-structured loop or recursion that reads like ordinary
    JavaScript, not a transliterated trace"; "clear variable names and a
    single obvious control-flow path, easy to follow without
    cross-referencing the opcode table".
  - FAIL phrasings: "variables named r0/r1 or pc still present in the
    final code"; "convoluted nested conditionals that only make sense
    next to the original opcode listing"; "a wrapper that re-simulates
    jumps and program-counter bookkeeping instead of a direct
    computation".
- Equivalence rigor (subjective): does the submission show it actually
  checked its reimplementation against the register machine's behavior,
  including the boundary case, rather than just asserting confidence?
  - PASS phrasings: "checks its own output against multiple of the five
    reference values before finalizing, and reasons about why n=0 must
    return 1"; "explicitly reasons through both traps (seed and
    ordering) and shows why its implementation avoids them"; "verifies
    the dual-invocation requirement (require vs direct run) explicitly
    in its own reasoning or testing".
  - FAIL phrasings: "states an answer without ever checking it against
    the given reference program's behavior"; "confidently ships a
    version that would fail on n=0 or n=1 without noticing"; "shows no
    evidence of cross-checking the reimplementation's output against
    the register machine's actual trace".
- Reasoning quality: does ANSWER.md explain the trace precisely enough
  to show both traps were noticed — the seed value and the
  multiply-then-decrement ordering — rather than just asserting "it's
  factorial" without walking through why the boundary case `n=0` and
  the loop ordering work out?
  - PASS phrasings: "explicitly connects the `LOADI r1, 1` seed to why
    f(0) = 1 by the empty-product convention"; "walks through why JZ
    being checked before the multiply means the last factor multiplied
    in is r0 == 1, not skipped"; "reasons about both the seed-trap and
    the ordering-trap explicitly, with the mechanism named, not just the
    answer".
  - FAIL phrasings: "says only 'I traced it and it's n!' with no
    mechanism discussed"; "asserts the seed is 1 without explaining why
    0 would have been wrong"; "describes the loop generically but never
    addresses which operation (multiply or decrement) happens first".
