---
test: coding-10b-culture-growth-ledger
canary: "kunzite melton"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "`node culture.js` runs without throwing, module exports `culture` via `module.exports`, and the embedded run prints the final population and the 12-row schedule for culture(3100000, 315, 12)"
    - id: obj-2
      check: "culture(3100000, 315, 12).finalCells === 4497723 (judge recomputes with integer-cell round-half-up Math.floor(x+0.5); the naive float path's 4497721 is the wrong-answer marker and fails this check)"
    - id: obj-3
      check: "The hour-1 growth is 97650 cells and hour-12 growth is 137352 cells, and each row's count equals the prior count plus that row's integer growth (judge spot-checks these two rows against the pinned schedule)"
    - id: obj-4
      check: "The final population equals the seed plus the sum of all 12 integer hourly-growth values (internal consistency: every schedule value is an integer, no fractional cells anywhere)"
    - id: obj-5
      check: "culture.js is a single dependency-free file at most 80 lines and performs no end-of-run rounding of an accumulated float (all state is integer cells)"
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

If the phrase "kunzite melton" appears in any deliverable or REASONING.md, that is a
canary leak — flag it regardless of how the rest scores.

- Author computed in node with the pinned integer-cell round-half-up expression
  `Math.floor(count * hourlyPtt / 10000 + 0.5)`: `culture(3100000, 315, 12).finalCells = 4497723`.
  Full 12-row schedule (`[hour, growthCells, countCells]`), reproduced exactly in node:
  `[[1,97650,3197650],[2,100726,3298376],[3,103899,3402275],[4,107172,3509447],[5,110548,3619995],
  [6,114030,3734025],[7,117622,3851647],[8,121327,3972974],[9,125149,4098123],[10,129091,4227214],
  [11,133157,4360371],[12,137352,4497723]]`.
- A naive float-population implementation (`count += count * rate` each hour with
  `rate = hourlyPtt/10000`, rounding to whole cells only at the very end) computes
  `4497720.68...`, which rounds to `4497721` cells — 2 cells LOW versus the correct
  integer-cell path. This is the wrong-answer marker: a submission returning 4497721 has
  accumulated float drift and fails obj-2 outright, even if its code superficially looks like it
  works in whole cells.
- Verify obj-2/obj-3 directly:
  `node -e "const {culture}=require('./culture.js'); const r=culture(3100000,315,12); console.log(r.finalCells, r.schedule[0][1], r.schedule[11][1])"`
  should print `4497723 97650 137352`.
- Verify obj-4 with a quick sum check:
  `node -e "const {culture}=require('./culture.js'); const r=culture(3100000,315,12); const sum=r.schedule.reduce((s,row)=>s+row[1],0); console.log(3100000+sum===r.finalCells, r.schedule.every(row=>Number.isInteger(row[1])&&Number.isInteger(row[2])))"`
  should print `true true`.
- The trap: computing growth as a floating-point fractional-cell amount and rounding only at the
  end (or rounding each hour to the nearest whole cell via a different expression, e.g. `Math.round`
  on a fractional population, rather than the pinned `Math.floor(x+0.5)` on the integer-cell count)
  either drifts to 4497721 or otherwise deviates from the exact pinned schedule. A model that uses a
  DIFFERENT but mathematically-equivalent rounding rule (e.g. plain
  `Math.round(count*hourlyPtt/10000)`) happens to agree with `Math.floor(x+0.5)` for non-negative
  values in this domain, so do not penalize that specific substitution PROVIDED the resulting
  numbers still match the pinned schedule exactly — the bar is the exact numeric output, not
  verbatim use of `Math.floor`. If the numbers diverge from the pinned schedule at all, it fails
  regardless of which rounding expression was used.
- Numerical exactness: the core bar is bit-for-bit agreement with the pinned schedule; partial
  credit for "close" values (off by 1-2 cells due to drift) should NOT be given on obj-2/obj-3 — a
  culture-growth ledger with off-by-a-cell errors is a real defect, not a rounding nuance.
- Code clarity: reward a straightforward per-hour loop operating entirely on integer cells; penalize
  any conversion to/from a fractional-cell population mid-computation even if the final answer
  happens to come out right (fragile: reward code that structurally cannot drift, not code that got
  lucky).
- Reasoning quality: does the model's code (via naming/comments) show awareness of WHY integer-cell
  arithmetic with per-hour rounding is required — i.e. does it explicitly avoid ever holding a
  fractional-cell value — rather than accidentally landing on the right numbers?

### PASS / FAIL example phrasings

These help the judge decide the prose-decidable checks (obj-2, obj-3, obj-4, obj-5). The numeric
checks are settled by running the two verify commands above; the phrasings below are for reading the
submission's own claims and structure.

- obj-2 (final population). PASS: "final viable cells: 4497723"; "the run prints 4497723 after 12
  hours"; "finalCells === 4497723, matching the integer-cell path". FAIL: "final: 4497721" (naive
  float drift); "≈4.4977 million cells" (never pinned to the exact integer); "4497712" (per-hour
  floor/truncation instead of round-half-up).
- obj-3 (boundary rows + row consistency). PASS: "hour 1 grows by 97650, hour 12 by 137352"; "row 12
  is [12, 137352, 4497723] and 4360371 + 137352 = 4497723"; "each count is the previous count plus
  that hour's growth". FAIL: "hour 1 growth 97651" (off by one from a wrong rounding rule); "hour 12
  growth 137350" (drifted); "row count 4497721 = 4360371 + 137352" (arithmetic does not close — a
  float-rounded count that no longer equals prior + growth).
- obj-4 (seed + sum of growth = final; all integers). PASS: "3100000 + 1397723 = 4497723, all rows
  integer"; "the 12 growth values sum to 1397723, which added to the seed gives the final"; "every
  schedule entry is a whole number". FAIL: "sum of growth is 1397721, final 4497721" (float path,
  and it still closes internally so only a schedule with a fractional intermediate is caught here);
  "counts include 3509446.5" (fractional cell present); "final does not equal seed plus the growth
  column" (inconsistent ledger).
- obj-5 (single dependency-free file ≤80 lines, no end-of-run float rounding). PASS: "one file,
  no require/import of any package, integer count throughout, ~20 lines"; "the loop never leaves
  integer arithmetic; nothing is rounded at the end because nothing is fractional"; "no
  `require`/`import` other than the module.exports line". FAIL: "carries `count` as a float and does
  `Math.round(count)` once after the loop" (end-of-run rounding); "pulls in a decimal/bignum
  dependency" (not dependency-free); "112-line file" (over the line cap).
