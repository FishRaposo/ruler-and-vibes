---
test: reverse-06b-gumball-jackpot
canary: "cyclone squall"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ANSWER.md names the computed function as three times n factorial (3 x n!), and states the seed accumulator is 3 (not 0 or 1)"
    - id: obj-2
      check: "Judge runs `node lifted.js` and it prints the function's values for n=0,1,4,6,8 as exactly 3, 3, 72, 2160, 120960"
    - id: obj-3
      check: "lifted.js exports a function (via module.exports) that returns 120960 for input 8 and 3 for input 0 when the judge calls it directly, AND auto-prints the reference vector only under require.main===module so both the direct-run and require paths work from one file"
    - id: obj-4
      check: "ANSWER.md's step-count or trace shows the loop multiplies the accumulator by c0 BEFORE decrementing c0 and terminates via the BZ-on-c0 branch (not an off-by-one that skips the largest factor)"
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

If the phrase "cyclone squall" appears in any deliverable or REASONING.md, that
is a canary leak — flag it regardless of how the rest scores.

- Author node v24.16.0-verified the chip's program by faithful interpretation:
  `f(0)=3`, `f(1)=3`, `f(4)=72`, `f(6)=2160`, `f(8)=120960`.
- The program is: `c1 = 3` (SETV); loop: if `c0 == 0` jump to HALT; otherwise
  `c1 = c1 * c0`; `c0 = c0 - 1`; jump back to the BZ test. This is exactly three
  times factorial: `f(n) = 3 * n * (n-1) * ... * 1`, with `f(0) = 3` (the empty
  product is 1, times the seed 3), which falls out correctly here ONLY because the
  accumulator seeds at 3.
- Seeded trap #1 (accumulator seed): the program is `SETV c1, 3`, not `SETV c1, 0`
  and not `SETV c1, 1`. A lifter that seeds its accumulator at 0 will produce 0 for
  every input — a clear giveaway this trap was missed. A lifter that seeds at 1,
  pattern-matching "this looks like plain factorial" and ignoring the literal
  immediate in the listing, will silently compute n! instead of 3 x n!, printing
  1, 1, 120, 5040, 3628800 — plausible-looking numbers that are wrong for every
  one of the five reference inputs. Treat any `lifted.js` returning 0, or matching
  the plain-factorial sequence above, for any of the five reference inputs as
  having fallen into this trap.
  - PASS phrasing examples for obj-1 (ANSWER.md text): "The chip computes three
    times n factorial (3 x n!); the accumulator c1 is seeded to 3 before the loop
    begins, not 0 or 1." / "Mathematically the output is 3*n! — the loop's
    accumulator begins life holding 3, which is essential to get f(0)=3 right." /
    "This is n! multiplied by a fixed bonus of 3; the reference trace shows c1
    starting at 3, so f(0) comes out to 3 rather than 0 or 1."
  - FAIL phrasing examples for obj-1: "The chip computes n! (factorial); the
    accumulator starts at 1." (misses the x3 seed entirely) / "The program
    computes a running product starting from 0." (wrong seed, classic
    zero-accumulator mistake) / "This machine returns the factorial of the
    input." (never states the x3 multiplier or the seed value at all).
- Seeded trap #2 (multiply-before-decrement / branch target): the loop multiplies
  `c1` by the *current* `c0` before decrementing it, and the loop exit test
  (`BZ c0`) is checked at the top of the loop, before the multiply — so the last
  multiplication that happens is by `c0 == 1`, not skipped. A lifter that
  decrements first and then multiplies produces a collapsed wrong answer: verify
  by checking `f(4) = 72` specifically — a decrement-before-multiply bug computes
  `3*3*2*1*0 = 0` instead (the freshly-decremented `c0` reaches 0 inside the
  final multiply), and in fact collapses every `n >= 1` to 0 while leaving `f(0)`
  unaffected at 3 — a distinctive, easy-to-spot signature.
  - PASS phrasing examples for obj-4 (ANSWER.md trace): "Each pass multiplies c1
    by the current c0 first, then decrements c0, then re-checks BZ c0 at the top
    — so the last factor folded in is c0==1, and the loop only exits once c0 has
    reached 0." / "Trace for n=3: c0=3 (BZ false) -> c1=3*3=9, c0=2 -> c1=9*2=18,
    c0=1 -> c1=18*1=18, c0=0 (BZ true) -> HALT with c1=18=3*3!. The multiply
    always happens before the decrement." / "Step trace for n=1: SETV, BZ(false),
    MULR, DECR, JMP, BZ(true), HALT — confirming the multiply precedes the
    decrement and the branch on c0==0 is what ends the loop."
  - FAIL phrasing examples for obj-4: "The loop decrements c0 first, then
    multiplies c1 by the new value of c0, exiting once c0 hits 0." (describes the
    buggy order) / "It's just a standard countdown loop that multiplies by c0
    each time." (no mention of the before/after ordering or the BZ test) / "The
    loop runs while c0 is nonzero and stops right after a final multiply by
    c0==0." (implies a multiply by 0 occurs, which the reference program never
    does).
- Verify obj-2 and obj-3 together by actually running the submission:
  `node lifted.js` should print exactly five lines covering n=0,1,4,6,8 with
  values 3, 3, 72, 2160, 120960 (in any clear per-line format); separately,
  `node -e "const f=require('./lifted.js'); console.log(f(8), f(0))"` should
  print `120960 3`. Both must work from the same unmodified file — a common
  failure is a file that only supports one of the two invocation paths (e.g. it
  runs its printing code unconditionally at module load, so requiring it also
  spams the reference vector, or it forgets `module.exports` entirely).
- Equivalence rigor / obj-5: read `lifted.js` — a compliant submission contains a
  genuine loop (`while`/`for`) or recursive structure that computes the product
  directly, using variable names that reflect the domain (accumulator, counter)
  rather than `c0`/`c1` register bookkeeping. Penalize a submission that keeps an
  instruction array and a tiny fetch-execute interpreter around it (that is
  tracing, not lifting) or that special-cases the five reference inputs via a
  lookup/if-chain instead of computing them.
  - PASS phrasing examples for obj-5 (code shape): a `for` loop counting `cur`
    down from `n` to `1` multiplying into `payout` / a recursive
    `jackpotPayout(n) = n === 0 ? 3 : n * jackpotPayout(n - 1)` / domain-named
    variables (`payout`, `cranksLeft`) with no opcode dispatch anywhere.
  - FAIL phrasing examples for obj-5: a `program` array of opcode tuples plus a
    `while (true) { switch (op) { ... } }` fetch-execute loop wrapped in a
    function / a lookup object like `{0:3,1:3,4:72,6:2160,8:120960}` used to
    special-case exactly the five reference inputs / leftover register-machine
    variable names (`c0`, `c1`, `pc`, `regs[]`) still driving the computation.
- Lift readability: is the reimplementation clear and idiomatic (e.g. a
  `jackpotPayout(n)` function with an obvious loop), free of leftover
  register-machine artifacts (no `c0`/`c1` names, no PC/jump simulation)?
  - PASS phrasings: "idiomatic `jackpotPayout(n)` function with clear naming
    (`payout`, `n` or `cranksLeft`) and no register-machine residue"; "a short,
    well-structured loop or recursion that reads like ordinary JavaScript, not
    a transliterated trace"; "clear variable names and a single obvious
    control-flow path, easy to follow without cross-referencing the opcode
    table".
  - FAIL phrasings: "variables named c0/c1 or pc still present in the final
    code"; "convoluted nested conditionals that only make sense next to the
    original opcode listing"; "a wrapper that re-simulates jumps and
    program-counter bookkeeping instead of a direct computation".
- Equivalence rigor (subjective): does the submission show it actually
  checked its reimplementation against the chip's behavior, including the
  boundary case, rather than just asserting confidence?
  - PASS phrasings: "checks its own output against multiple of the five
    reference values before finalizing, and reasons about why n=0 must return
    3, not 0 or 1"; "explicitly reasons through both traps (the x3 seed and
    the multiply-then-decrement ordering) and shows why its implementation
    avoids them"; "verifies the dual-invocation requirement (require vs
    direct run) explicitly in its own reasoning or testing".
  - FAIL phrasings: "states an answer without ever checking it against the
    given chip's actual behavior"; "confidently ships a version that would
    fail on n=0 or n=1 without noticing"; "shows no evidence of
    cross-checking the reimplementation's output against the reference
    program's actual trace".
- Reasoning quality: does ANSWER.md explain the trace precisely enough to show
  both traps were noticed — the seed value and the multiply-then-decrement
  ordering — rather than just asserting "it's three times factorial" without
  walking through why the boundary case `n=0` and the loop ordering work out?
  - PASS phrasings: "explicitly connects the `SETV c1, 3` seed to why f(0) = 3
    rather than 0 or 1"; "walks through why BZ being checked before the
    multiply means the last factor multiplied in is c0 == 1, not skipped";
    "reasons about both the seed-trap and the ordering-trap explicitly, with
    the mechanism named, not just the answer".
  - FAIL phrasings: "says only 'I traced it and it's three times factorial'
    with no mechanism discussed"; "asserts the seed is 3 without explaining
    why 0 or 1 would have been wrong"; "describes the loop generically but
    never addresses which operation (multiply or decrement) happens first".
