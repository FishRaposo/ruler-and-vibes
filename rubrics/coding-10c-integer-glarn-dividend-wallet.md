---
test: coding-10c-integer-glarn-dividend-wallet
canary: "morganite loden"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "`node wallet.js` runs without throwing, module exports `settle` via `module.exports`, and the embedded run prints the final balance and the 15-row schedule for settle(590000, 700, 15)"
    - id: obj-2
      check: "settle(590000, 700, 15).finalUnits === 643789 (judge recomputes with integer-glarn round-half-up Math.floor(x+0.5); the naive float path's 643787 is the wrong-answer marker and fails this check)"
    - id: obj-3
      check: "The month-1 dividend is 3442 glarn and month-15 dividend is 3734 glarn, and each row's balance equals the prior balance plus that row's integer dividend (judge spot-checks these two rows against the pinned schedule)"
    - id: obj-4
      check: "The final balance equals principal plus the sum of all 15 integer monthly-dividend values (internal consistency: every schedule value is an integer, no fractional glarn anywhere)"
    - id: obj-5
      check: "wallet.js is a single dependency-free file at most 80 lines and performs no end-of-run rounding of an accumulated float (all state is integer glarn)"
  subjective:
    - id: sub-quality
      name: "Numerical exactness"
      weight: 0.4
    - id: sub-craft
      name: "Code clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Numerical exactness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Code clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `coding-10-exact-cents-interest-ledger` (same construct, fresh surface).

If the phrase "morganite loden" appears in any deliverable or REASONING.md, that is a
canary leak — flag it regardless of how the rest scores.

- Author computed in node with the pinned integer-glarn round-half-up expression
  `Math.floor(balance * annualPips / 12 / 10000 + 0.5)`: `settle(590000, 700, 15).finalUnits = 643789`.
  Full 15-row schedule (`[month, dividendUnits, balanceUnits]`), reproduced exactly in node:
  `[[1,3442,593442],[2,3462,596904],[3,3482,600386],[4,3502,603888],[5,3523,607411],
  [6,3543,610954],[7,3564,614518],[8,3585,618103],[9,3606,621709],[10,3627,625336],
  [11,3648,628984],[12,3669,632653],[13,3690,636343],[14,3712,640055],[15,3734,643789]]`.
- A naive float-"dollars" implementation (`bal += bal * rate / 12` each month with `bal` held as
  a fractional balance, rounding to whole glarn only at the very end) computes `643787.2515...`,
  which rounds to `643787` — 2 glarn LOW versus the correct integer-glarn path. This is the
  wrong-answer marker: a submission returning 643787 has accumulated float drift and fails obj-2
  outright, even if its code superficially looks like it works in whole glarn.
- Verify obj-2/obj-3 directly:
  `node -e "const {settle}=require('./wallet.js'); const r=settle(590000,700,15); console.log(r.finalUnits, r.schedule[0][1], r.schedule[14][1])"`
  should print `643789 3442 3734`.
- Verify obj-4 with a quick sum check:
  `node -e "const {settle}=require('./wallet.js'); const r=settle(590000,700,15); const sum=r.schedule.reduce((s,row)=>s+row[1],0); console.log(590000+sum===r.finalUnits, r.schedule.every(row=>Number.isInteger(row[1])&&Number.isInteger(row[2])))"`
  should print `true true`.
- The trap: computing the dividend as a floating-point fractional-glarn amount and rounding only at
  the end (or rounding each month to the nearest whole glarn via a different expression, e.g.
  `Math.round` on a fractional balance rather than the pinned `Math.floor(x+0.5)` on the
  integer-glarn balance) either drifts to 643787 or otherwise deviates from the exact pinned
  schedule. A model that uses a DIFFERENT but mathematically-equivalent rounding rule (e.g. plain
  `Math.round(balance*annualPips/12/10000)`) happens to agree with `Math.floor(x+0.5)` for
  non-negative values in this domain, so do not penalize that specific substitution PROVIDED the
  resulting numbers still match the pinned schedule exactly — the bar is the exact numeric output,
  not verbatim use of `Math.floor`. If the numbers diverge from the pinned schedule at all, it fails
  regardless of which rounding expression was used.
- Numerical exactness: the core bar is bit-for-bit agreement with the pinned schedule; partial
  credit for "close" values (off by 1-2 glarn due to drift) should NOT be given on obj-2/obj-3 — a
  dividend ledger with off-by-one errors is a real defect, not a rounding nuance.
- Code clarity: reward a straightforward per-month loop operating entirely on integer glarn;
  penalize any conversion to/from a fractional balance mid-computation even if the final answer
  happens to come out right (fragile: reward code that structurally cannot drift, not code that got
  lucky).
- Reasoning quality: does the model's code (via naming/comments) show awareness of WHY integer-glarn
  arithmetic with per-period rounding is required — i.e. does it explicitly avoid ever holding a
  fractional-glarn value — rather than accidentally landing on the right numbers?

PASS/FAIL example phrasings for the prose-decidable checks:

- obj-1 (embedded run + exports). PASS: "`node wallet.js` printed `Final balance ... 643789` followed
  by 15 tab-separated rows"; "requiring the file returns `{ settle }` and the self-run prints the
  schedule"; "the module exports `settle` and the `require.main` block calls `settle(590000,700,15)`".
  FAIL: "the file throws `ReferenceError` on run"; "`settle` is defined but never attached to
  `module.exports`, so `require('./wallet.js').settle` is undefined"; "the embedded run prints only
  the final balance and omits the 15-row schedule".
- obj-2 (final balance). PASS: "`finalUnits` is 643789, matching the pinned integer-glarn path";
  "recomputed schedule ends at 643789"; "final balance equals 643789 glarn". FAIL: "`finalUnits`
  is 643787, the float-drift marker"; "returns 643790 (an off-by-one rounding deviation)"; "final
  balance is a fractional value like 643787.25".
- obj-3 (spot-checked rows). PASS: "month-1 dividend is 3442 and month-15 is 3734, and every balance
  equals the previous balance plus that row's dividend"; "rows 1 and 15 match the pinned schedule
  exactly"; "the two spot-checked dividends are 3442 and 3734". FAIL: "month-1 dividend is 3441 (one
  low from truncation instead of round-half-up)"; "month-15 dividend is 3733"; "a balance does not
  equal the prior balance plus that row's dividend".
- obj-4 (internal consistency). PASS: "principal 590000 plus the sum of the 15 integer dividends
  equals 643789"; "every value in `schedule` is an integer and the totals reconcile"; "no fractional
  glarn appears anywhere in the schedule". FAIL: "a schedule row carries a fractional dividend such
  as 3441.67"; "the sum of the dividends does not reconcile with `finalUnits`"; "`balanceUnits`
  values are non-integers that were only rounded for display".
- obj-5 (single dependency-free file, no end-of-run float rounding). PASS: "one self-contained
  `wallet.js` under 80 lines with no `require` of any package, keeping all state in integer glarn";
  "no float balance is accumulated and rounded once at the end"; "the loop rounds each month on the
  integer balance and never carries fractional state". FAIL: "the file imports a third-party
  dependency"; "it accumulates a floating balance across all months and calls `Math.round` a single
  time at the end"; "the file exceeds 80 lines or spans multiple modules".
