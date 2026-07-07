---
test: reverse-08c-dosing-pump-loop
canary: "umbrella sieve"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ANSWER.md states the function computes the sum of multiples of 5 from 1 to cycles (any equivalent clear wording accepted)"
    - id: obj-2
      check: "Judge runs `node unflat.js` and the recovered structured function prints, for cycles=0,3,5,14,22, exactly 0, 0, 5, 15, 50"
    - id: obj-3
      check: "unflat.js's recovered function is structured (a real for/while loop with an inner conditional) containing NO step-variable dispatcher switch — the flattening is removed, not renamed"
    - id: obj-4
      check: "Judge runs unflat.js which includes both the embedded original flattened function and the recovered function, feeds both the inputs 0..22, and both produce identical outputs (the file asserts equivalence and prints a single PASS/FAIL line the judge reads)"
    - id: obj-5
      check: "ANSWER.md explains that BODY's if/else share successor ADVANCE, so only the true branch adds tick and the else is a no-op (not an unconditional accumulation)"
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

Parallel form of `reverse-08-loom-dispatch` (same construct, fresh
surface).

If the phrase "umbrella sieve" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Author node v24.16.0-verified: the flattened function and the
  structured recovered version agree on all `cycles` in `0..22`.
  Reference outputs: `f(0)=0`, `f(3)=0`, `f(5)=5`, `f(14)=15`,
  `f(22)=50`.
- Recovered structure — a `for` loop from `tick=1` to `tick<=cycles`,
  with an inner `if (tick % 5 === 0) dose += tick;` and no `else`
  action:

  ```js
  function recovered(cycles) {
    let dose = 0;
    for (let tick = 1; tick <= cycles; tick++) {
      if (tick % 5 === 0) {
        dose += tick;
      }
    }
    return dose;
  }
  ```

  This computes the sum of all multiples of 5 in `[1, cycles]`. Mapping
  back to the flattened steps: `"INIT"` is the loop init (`dose=0,
  tick=1`); `"GUARD"` is the loop guard (`tick <= cycles`, else exit via
  `"EXIT"` which sets `step="DONE"`); `"BODY"` is the conditional body;
  `"ADVANCE"` is the increment-and-jump-back (`tick += 1`, then back to
  the `"GUARD"` check).
- Seeded trap: in `"BODY"`, BOTH the `if` branch (`tick % 5 === 0`,
  which does `dose += tick`) and the `else` branch route to the same
  next step, `"ADVANCE"` — the shared successor. The `else` branch does
  nothing but fall through to the increment; it is not a second
  accumulation path. A model that misreads the shared successor as
  meaning both branches add `tick` will double-count non-multiples-of-5,
  producing wildly wrong totals (author-verified: a variant that adds
  `tick` unconditionally in both branches of `"BODY"` gives `0, 6, 15,
  105, 253` for `cycles=0,3,5,14,22` instead of the correct `0, 0, 5,
  15, 50` — sharply divergent, not a subtle off-by-one). A second,
  separate trap is misreading the `"GUARD"`/`"ADVANCE"` back-edge (which
  governs the iteration bound `tick <= cycles`): an off-by-one variant
  (looping while `tick < cycles` instead of `tick <= cycles`) is wrong
  at `cycles=5` (giving `0` instead of the correct `5`, since the
  boundary multiple of 5 is skipped) even though it happens to coincide
  with the correct value at the other four reference points — the
  judge should treat any deviation at `cycles=5` as a real failure, not
  a rounding quirk.
- Verify obj-2 and obj-4 by actually running `node unflat.js`: it must
  print the recovered function's five reference outputs, then a single
  `EQUIVALENCE: PASS (n=0..22)` line (or, if the submission's logic is
  wrong, an `EQUIVALENCE: FAIL` line with mismatches listed — treat any
  FAIL or missing equivalence line as failing obj-4 outright regardless
  of what the five printed reference outputs show).
- Recovered-structure fidelity / obj-3: read `unflat.js` — the
  recovered function must contain no `step`/`switch`-based dispatch of
  any kind. A submission that keeps a `switch(step)` loop but renames
  the steps or collapses cases without truly restructuring to
  `for`/`if` fails this check even if its output is correct.
- Deobfuscation completeness: does the recovered version read as a
  natural, idiomatic structured function a developer would have written
  originally (clear loop bound, clear conditional), rather than a
  literal one-to-one translation of each step into an equivalent
  if-chain that still shadows the state machine's shape?
- Reasoning quality: does ANSWER.md correctly and explicitly identify
  that `"BODY"`'s `if` and `else` are NOT symmetric — only the `if`
  accumulates, and the `else` is a bare fall-through to `"ADVANCE"` —
  rather than vaguely describing `"BODY"` as "the conditional part"?
  Does it correctly trace the `"GUARD"`/`"ADVANCE"` loop back-edge as
  the iteration mechanism?

### PASS / FAIL example phrasings (per prose-decidable check)

- **obj-1 (ANSWER.md states what the function computes):**
  - PASS: "It sums every cycle number from 1 to `cycles` that's a
    multiple of 5."
  - PASS: "Returns the total of all multiples of 5 in the inclusive
    range 1..cycles."
  - PASS: "Every 5th dosing cycle contributes a booster equal to its
    own cycle number to a running total, which is what's returned."
  - FAIL: "It counts how many dosing cycles ran." (wrong construct —
    describes a count, not a conditional sum)
  - FAIL: "It adds up every cycle number from 1 to `cycles`." (misses
    the divisible-by-5 condition entirely — this is the double-add
    trap's behavior, not the reference)
  - FAIL: "It computes the average dose per cycle." (wrong operation)
- **obj-5 (explains BODY's if/else and the shared successor):**
  - PASS: "Both branches of `BODY` lead to `ADVANCE` next; only the
    `if` (when `tick % 5 === 0`) adds to `dose` — the `else` is a bare
    fallthrough that changes nothing before advancing."
  - PASS: "The `if`/`else` in `BODY` aren't symmetric: only a multiple
    of 5 bumps `dose`; every other tick just falls through to
    `ADVANCE` with no side effect."
  - PASS: "`BODY`'s `else` exists only to route non-multiples to the
    same next step (`ADVANCE`) that the `if` branch reaches after
    adding — it is not a second accumulation path."
  - FAIL: "The `if` and `else` both add to `dose`, just by different
    amounts." (asserts a false symmetry)
  - FAIL: "`BODY`'s `else` branch skips the rest of the cycles and
    exits the loop." (misreads the control flow — `else` does not
    exit)
  - FAIL: "The conditional in `BODY` doesn't really affect the
    outcome." (vague, never identifies the actual mechanism)
- **sub-quality (Recovered-structure fidelity):**
  - PASS: "`for (let tick = 1; tick <= cycles; tick++) { if (tick % 5
    === 0) dose += tick; }` — the natural structure, with no leftover
    dispatcher."
  - PASS: "Uses a `while` loop with a manually incremented `tick` and a
    single plain `if`; no `step`/switch variable survives anywhere."
  - PASS: "Loop bound and body condition match the guard/body
    semantics exactly, with zero residual dispatch scaffolding."
  - FAIL: "Keeps a `switch(step)` loop internally but relabels the
    cases with comments claiming it's 'now structured'."
  - FAIL: "Wraps a call to the original flattened function in a
    differently-named wrapper and calls that the recovered version."
  - FAIL: "Uses an if-chain inside the loop that still branches on
    string constants like `\"GUARD\"`/`\"BODY\"`, shadowing the
    original dispatcher's shape."
- **sub-craft (Deobfuscation completeness):**
  - PASS: "Reads like code a developer would write from scratch: one
    clear loop bound, one readable conditional, sensible names."
  - PASS: "Uses plain names like `tick`/`dose` instead of retaining
    dispatch-flavored naming (`step`, `INIT`, `GUARD`) anywhere in the
    recovered function."
  - PASS: "No vestigial INIT/GUARD/BODY/ADVANCE/EXIT-shaped branching
    survives — it collapses cleanly to a two-line loop body."
  - FAIL: "Recovered function still has five sequential if-statements
    that mirror INIT/GUARD/BODY/ADVANCE/EXIT one-for-one instead of
    collapsing them into a loop."
  - FAIL: "Uses awkward, obviously-derived names like `bodyStepResult`
    that betray a literal case-by-case translation."
  - FAIL: "Adds an unnecessary label/flag construct to simulate the
    original dispatch instead of writing a plain loop."
- **sub-reasoning (Reasoning quality):**
  - PASS: "Explicitly states `BODY`'s `if` and `else` are NOT
    symmetric, and connects `GUARD`/`ADVANCE` to the loop's iteration
    bound."
  - PASS: "Explains why the `else` branch can't be a second
    accumulation path — both branches converge on `ADVANCE` with no
    side effect between them."
  - PASS: "Identifies `GUARD` as the loop guard (`tick <= cycles`) and
    `ADVANCE` as the increment-and-jump-back, and explains why an
    inclusive vs. exclusive guard changes the result at `cycles=5`."
  - FAIL: "Says only 'I ran it and the numbers matched' without
    explaining the mechanism."
  - FAIL: "Describes `BODY` as 'the conditional part' without saying
    which branch actually changes `dose`."
  - FAIL: "Never addresses why the `else` branch is not a second
    accumulation path, and never discusses the loop bound at all."
