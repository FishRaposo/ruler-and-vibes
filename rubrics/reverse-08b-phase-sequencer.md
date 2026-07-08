---
test: reverse-08b-phase-sequencer
canary: "meteor vortex"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ANSWER.md states the function computes the sum of multiples of 4 from 1 to limit (any equivalent clear wording accepted)"
    - id: obj-2
      check: "Judge runs `node unflat.js` and the recovered structured function prints, for limit=0,1,4,12,24, exactly 0, 0, 4, 24, 84"
    - id: obj-3
      check: "unflat.js's recovered function is structured (a real for/while loop with an inner conditional) containing NO phase-variable dispatcher switch — the flattening is removed, not renamed"
    - id: obj-4
      check: "Judge runs unflat.js which includes both the embedded original flattened function and the recovered function, feeds both the inputs 0..24, and both produce identical outputs (the file asserts equivalence and prints a single PASS/FAIL line the judge reads)"
    - id: obj-5
      check: "ANSWER.md explains that the phase-2 if/else share successor phase 3, so only the true branch adds idx and the else is a no-op (not an unconditional accumulation)"
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

If the phrase "meteor vortex" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Author node v24.16.0-verified: the flattened function and the
  structured recovered version agree on all `limit` in `0..24`.
  Reference outputs: `f(0)=0`, `f(1)=0`, `f(4)=4`, `f(12)=24`,
  `f(24)=84`.
- obj-1 (ANSWER.md states what the function computes):
  - PASS phrasings: "It sums every index from 1 to `limit` that's a
    multiple of 4"; "Returns the total of all multiples of 4 in the
    inclusive range 1..limit"; "Every 4th step contributes its own
    index value to a running total, which is what's returned".
  - FAIL phrasings: "It counts how many steps ran" (wrong construct —
    describes a count, not a conditional sum); "It adds up every index
    from 1 to `limit`" (misses the divisible-by-4 condition entirely —
    this is the double-add trap's behavior, not the reference); "It
    computes the average value per step" (wrong operation).
- Recovered structure — a `for` loop from `idx=1` to `idx<=limit`, with
  an inner `if (idx % 4 === 0) total += idx;` and no `else` action:

  ```js
  function recovered(limit) {
    let total = 0;
    for (let idx = 1; idx <= limit; idx++) {
      if (idx % 4 === 0) {
        total += idx;
      }
    }
    return total;
  }
  ```

  This computes the sum of all multiples of 4 in `[1, limit]`. Mapping
  back to the flattened phases: phase 0 is the loop init (`total=0,
  idx=1`); phase 1 is the loop guard (`idx <= limit`, else exit via
  phase 4 which sets `phase=-1`); phase 2 is the conditional body;
  phase 3 is the increment-and-jump-back (`idx += 1`, then back to the
  phase-1 guard).
- Seeded trap: in phase 2, BOTH the `if` branch (`idx % 4 === 0`, which
  does `total += idx`) and the `else` branch route to the same next
  phase, phase 3 — the shared successor. The `else` branch does nothing
  but fall through to the increment; it is not a second accumulation
  path. A model that misreads the shared successor as meaning both
  branches add `idx` will double-count non-multiples-of-4, producing
  wildly wrong totals (author-verified: a variant that adds `idx`
  unconditionally in both branches of phase 2 gives `0, 1, 10, 78, 300`
  for `limit=0,1,4,12,24` instead of the correct `0, 0, 4, 24, 84` —
  sharply divergent, not a subtle off-by-one). A second, separate trap
  is misreading the phase-1/phase-3 back-edge (which governs the
  iteration bound `idx <= limit`): an off-by-one variant (looping while
  `idx < limit` instead of `idx <= limit`) gives `0, 0, 0, 12, 60`
  instead of the correct `0, 0, 4, 24, 84` — also sharply wrong at the
  reference inputs, not a subtle discrepancy.
- obj-5 (explains phase-2's if/else and the shared successor):
  - PASS phrasings: "Both branches of phase 2 lead to phase 3 next;
    only the `if` (when `idx % 4 === 0`) adds to `total` — the `else`
    is a bare fallthrough that changes nothing before advancing"; "The
    `if`/`else` in phase 2 aren't symmetric: only a multiple of 4 bumps
    `total`; every other idx just falls through to phase 3 with no side
    effect"; "Phase 2's `else` exists only to route non-multiples to
    the same next phase (phase 3) that the `if` branch reaches after
    adding — it is not a second accumulation path".
  - FAIL phrasings: "The `if` and `else` both add to `total`, just by
    different amounts" (asserts a false symmetry); "Phase 2's `else`
    branch skips the rest of the loop and exits" (misreads the control
    flow — `else` does not exit); "The conditional in phase 2 doesn't
    really affect the outcome" (vague, never identifies the actual
    mechanism).
- Verify obj-2 and obj-4 by actually running `node unflat.js`: it must
  print the recovered function's five reference outputs, then a single
  `EQUIVALENCE: PASS (n=0..24)` line (or, if the submission's logic is
  wrong, an `EQUIVALENCE: FAIL` line with mismatches listed — treat any
  FAIL or missing equivalence line as failing obj-4 outright regardless
  of what the five printed reference outputs show).
- Recovered-structure fidelity / obj-3: read `unflat.js` — the
  recovered function must contain no `phase`/`switch`-based dispatch of
  any kind. A submission that keeps a `switch(phase)` loop but renames
  the phases or collapses cases without truly restructuring to
  `for`/`if` fails this check even if its output is correct.
  - PASS phrasings: "recovered() is a plain `for (let idx = 1; idx <=
    limit; idx++)` loop with a single `if`, no `phase`/`switch`
    anywhere"; "the dispatcher is fully gone — no state variable, no
    `while (phase !== -1)`, just a straight loop and conditional";
    "reads like an ordinary hand-written summation function, not a
    translated state machine".
  - FAIL phrasings: "kept `switch(phase)` but merged two cases
    together"; "renamed `phase` to `step` and `idx` to `i` but the
    dispatcher loop is still there"; "replaced the while/switch with a
    `for` loop that still increments a hidden state variable each pass
    instead of using `idx` directly".
- Deobfuscation completeness: does the recovered version read as a
  natural, idiomatic structured function a developer would have written
  originally (clear loop bound, clear conditional), rather than a
  literal one-to-one translation of each phase into an equivalent
  if-chain that still shadows the phase machine's shape?
  - PASS phrasings: "one clean `for` loop with a single `if (idx % 4
    === 0)` guard, no residual phase-by-phase mirroring"; "loop bound
    and conditional read as if a person designed them from scratch, not
    derived case-by-case from the dispatcher"; "no leftover artifacts of
    the original 5-phase structure (no dead branches, no vestigial phase
    checks)".
  - FAIL phrasings: "translates each phase into its own if-block chained
    in sequence, still shaped like the dispatcher"; "keeps a redundant
    early-exit check that only makes sense if you know about phase 4";
    "uses a `while` loop with manual index bookkeeping that just
    relabels the original phases instead of collapsing them into an
    idiomatic loop".
- Reasoning quality: does ANSWER.md correctly and explicitly identify
  that phase 2's `if` and `else` are NOT symmetric — only the `if`
  accumulates, and the `else` is a bare fall-through to phase 3 —
  rather than vaguely describing phase 2 as "the conditional part"?
  Does it correctly trace the phase-1/phase-3 loop back-edge as the
  iteration mechanism?
  - PASS phrasings: "explicitly states the else branch in phase 2 does
    nothing but jump to phase 3, it never touches total"; "traces phase
    1 -> phase 2 -> phase 3 -> phase 1 as the loop back-edge and names
    phase 1 as the guard"; "calls out that both phase-2 branches share
    the same successor, which is why the else looks like it 'does
    something' but doesn't".
  - FAIL phrasings: "describes phase 2 only as 'the conditional part'
    with no mention of the shared successor"; "claims the else branch
    also adds to total"; "never explains how the loop terminates or
    which phase acts as the guard".
