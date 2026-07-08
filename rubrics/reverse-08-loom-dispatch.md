---
test: reverse-08-loom-dispatch
canary: "teasel bollard quiver"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ANSWER.md states the function computes the sum of multiples of 3 from 1 to n (any equivalent clear wording accepted)"
    - id: obj-2
      check: "Judge runs `node unflat.js` and the recovered structured function prints, for n=0,1,3,10,20, exactly 0, 0, 3, 18, 63"
    - id: obj-3
      check: "unflat.js's recovered function is structured (a real for/while loop with an inner conditional) containing NO state-variable dispatcher switch — the flattening is removed, not renamed"
    - id: obj-4
      check: "Judge runs unflat.js which includes both the embedded original flattened function and the recovered function, feeds both the inputs 0..20, and both produce identical outputs (the file asserts equivalence and prints a single PASS/FAIL line the judge reads)"
    - id: obj-5
      check: "ANSWER.md explains that the case-2 if/else share successor case 3, so only the true branch adds i and the else is a no-op (not an unconditional accumulation)"
  subjective:
    - id: sub-quality
      name: "Recovered-structure fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Deobfuscation completeness"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "teasel bollard quiver" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Author node v24.16.0-verified: the flattened function and the
  structured recovered version agree on all `n` in `0..20`. Reference
  outputs: `f(0)=0`, `f(1)=0`, `f(3)=3`, `f(10)=18`, `f(20)=63`.
- Recovered structure — a `for` loop from `i=1` to `i<=n`, with an
  inner `if (i % 3 === 0) acc += i;` and no `else` action:

  ```js
  function unflattened(n) {
    let acc = 0;
    for (let i = 1; i <= n; i++) {
      if (i % 3 === 0) {
        acc += i;
      }
    }
    return acc;
  }
  ```

  This computes the sum of all multiples of 3 in `[1, n]`. Mapping back
  to the flattened states: case 0 is the loop init (`acc=0, i=1`); case
  1 is the loop guard (`i <= n`, else exit via case 4 which sets
  `state=99`); case 2 is the conditional body; case 3 is the
  increment-and-jump-back (`i += 1`, then back to the case-1 guard).
- Seeded trap: in case 2, BOTH the `if` branch (`i % 3 === 0`, which
  does `acc += i`) and the `else` branch route to the same next state,
  case 3 — the shared successor. The `else` branch does nothing but
  fall through to the increment; it is not a second accumulation path.
  A model that misreads the shared successor as meaning both branches
  add `i` will double-count non-multiples-of-3, producing wildly wrong
  totals (author-verified: a variant that adds `i` unconditionally in
  both branches of case 2 gives `0, 1, 6, 55, 210` for `n=0,1,3,10,20`
  instead of the correct `0, 0, 3, 18, 63` — sharply divergent, not a
  subtle off-by-one). A second, separate trap is misreading the
  case-1/case-3 back-edge (which governs the iteration bound `i <= n`);
  getting this wrong also produces wrong totals for the same reference
  inputs.
- Verify obj-2 and obj-4 by actually running `node unflat.js`: it must
  print the recovered function's five reference outputs, then a single
  `EQUIVALENCE: PASS (n=0..20)` line (or, if the submission's logic is
  wrong, an `EQUIVALENCE: FAIL` line with mismatches listed — treat any
  FAIL or missing equivalence line as failing obj-4 outright regardless
  of what the five printed reference outputs show).
- Recovered-structure fidelity / obj-3: read `unflat.js` — the
  recovered function must contain no `state`/`switch`-based dispatch of
  any kind. A submission that keeps a `switch(state)` loop but renames
  the states or collapses cases without truly restructuring to
  `for`/`if` fails this check even if its output is correct.
- Deobfuscation completeness: does the recovered version read as a
  natural, idiomatic structured function a developer would have written
  originally (clear loop bound, clear conditional), rather than a
  literal one-to-one translation of each case into an equivalent
  if-chain that still shadows the state machine's shape?
- Reasoning quality: does ANSWER.md correctly and explicitly identify
  that case 2's `if` and `else` are NOT symmetric — only the `if`
  accumulates, and the `else` is a bare fall-through to case 3 — rather
  than vaguely describing case 2 as "the conditional part"? Does it
  correctly trace the case-1/case-3 loop back-edge as the iteration
  mechanism?

### PASS / FAIL example phrasings (per prose-decidable check)

- **obj-1 (ANSWER.md states what the function computes):**
  - PASS: "It sums every value of `i` from 1 to `n` that's a multiple
    of 3."
  - PASS: "Returns the total of all multiples of 3 in the inclusive
    range 1..n."
  - PASS: "Every third iteration contributes its own value to a
    running total, which is what's returned."
  - FAIL: "It counts how many iterations ran." (wrong construct —
    describes a count, not a conditional sum)
  - FAIL: "It adds up every value from 1 to `n`." (misses the
    divisible-by-3 condition entirely — this is the double-add trap's
    behavior, not the reference)
  - FAIL: "It computes the average of the multiples of 3." (wrong
    operation)
- **obj-5 (explains case 2's if/else and the shared successor):**
  - PASS: "Both branches of case 2 lead to case 3 next; only the `if`
    (when `i % 3 === 0`) adds to `acc` — the `else` is a bare
    fallthrough that changes nothing before advancing."
  - PASS: "The `if`/`else` in case 2 aren't symmetric: only a multiple
    of 3 bumps `acc`; every other `i` just falls through to case 3 with
    no side effect."
  - PASS: "Case 2's `else` exists only to route non-multiples to the
    same next state (case 3) that the `if` branch reaches after adding
    — it is not a second accumulation path."
  - FAIL: "The `if` and `else` both add to `acc`, just by different
    amounts." (asserts a false symmetry)
  - FAIL: "Case 2's `else` branch skips the rest of the loop and
    exits." (misreads the control flow — `else` does not exit)
  - FAIL: "The conditional in case 2 doesn't really affect the
    outcome." (vague, never identifies the actual mechanism)
- **sub-quality (Recovered-structure fidelity):**
  - PASS: "`for (let i = 1; i <= n; i++) { if (i % 3 === 0) acc += i;
    }` — the natural structure, with no leftover dispatcher."
  - PASS: "Uses a `while` loop with a manually incremented `i` and a
    single plain `if`; no `state`/switch variable survives anywhere."
  - PASS: "Loop bound and body condition match the guard/body
    semantics exactly, with zero residual dispatch scaffolding."
  - FAIL: "Keeps a `switch(state)` loop internally but relabels the
    cases with comments claiming it's 'now structured'."
  - FAIL: "Wraps a call to the original flattened function in a
    differently-named wrapper and calls that the recovered version."
  - FAIL: "Uses an if-chain inside the loop that still branches on
    numeric state constants like `0`/`1`/`2`, shadowing the original
    dispatcher's shape."
- **sub-craft (Deobfuscation completeness):**
  - PASS: "Reads like code a developer would write from scratch: one
    clear loop bound, one readable conditional, sensible names."
  - PASS: "Uses plain names like `i`/`acc` instead of retaining
    dispatch-flavored naming (`state`, case numbers) anywhere in the
    recovered function."
  - PASS: "No vestigial case-0/case-1/case-2/case-3/case-4-shaped
    branching survives — it collapses cleanly to a two-line loop body."
  - FAIL: "Recovered function still has five sequential if-statements
    that mirror case 0/1/2/3/4 one-for-one instead of collapsing them
    into a loop."
  - FAIL: "Uses awkward, obviously-derived names like `case2Result`
    that betray a literal case-by-case translation."
  - FAIL: "Adds an unnecessary label/flag construct to simulate the
    original dispatch instead of writing a plain loop."
- **sub-reasoning (Reasoning quality):**
  - PASS: "Explicitly states case 2's `if` and `else` are NOT
    symmetric, and connects case-1/case-3 to the loop's iteration
    bound."
  - PASS: "Explains why the `else` branch can't be a second
    accumulation path — both branches converge on case 3 with no side
    effect between them."
  - PASS: "Identifies case 1 as the loop guard (`i <= n`) and case 3 as
    the increment-and-jump-back, and explains how the back-edge drives
    iteration."
  - FAIL: "Says only 'I ran it and the numbers matched' without
    explaining the mechanism."
  - FAIL: "Describes case 2 as 'the conditional part' without saying
    which branch actually changes `acc`."
  - FAIL: "Never addresses why the `else` branch is not a second
    accumulation path, and never discusses the loop bound at all."
