---
test: coding-10-exact-cents-interest-ledger
canary: "riverstone kettle"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "`node ledger.js` runs without throwing, module exports `accrue` via `module.exports`, and the embedded run prints the final balance and the 12-row schedule for accrue(1000000, 500, 12)"
    - id: obj-2
      check: "accrue(1000000, 500, 12).finalCents === 1051164 (judge recomputes with integer-cent round-half-up Math.floor(x+0.5); the naive float path's 1051162 is the wrong-answer marker and fails this check)"
    - id: obj-3
      check: "The month-1 interest is 4167 cents and month-12 interest is 4362 cents, and each row's balance equals the prior balance plus that row's integer interest (judge spot-checks these two rows against the pinned schedule)"
    - id: obj-4
      check: "The final balance equals principal plus the sum of all 12 integer monthly-interest values (internal consistency: every schedule value is an integer, no fractional cents anywhere)"
    - id: obj-5
      check: "ledger.js is a single dependency-free file at most 80 lines and performs no end-of-run rounding of an accumulated float (all state is integer cents)"
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
---

## Judge guidance

If the phrase "riverstone kettle" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Author computed in node with the pinned integer-cent round-half-up expression
  `Math.floor(balance * annualBps / 12 / 10000 + 0.5)`: `accrue(1000000, 500, 12).finalCents = 1051164`.
  Full 12-row schedule (`[month, interestCents, balanceCents]`), reproduced exactly in node:
  `[[1,4167,1004167],[2,4184,1008351],[3,4201,1012552],[4,4219,1016771],[5,4237,1021008],
  [6,4254,1025262],[7,4272,1029534],[8,4290,1033824],[9,4308,1038132],[10,4326,1042458],
  [11,4344,1046802],[12,4362,1051164]]`.
- A naive float-dollars implementation (`balanceDollars += balanceDollars * rate / 12` each month,
  rounding to cents only at the very end) computes `10511.6189...` dollars, which rounds to
  `1051162` cents — 2 cents LOW versus the correct integer-cent path. This is the wrong-answer
  marker: a submission returning 1051162 has accumulated float drift and fails obj-2 outright, even
  if its code superficially looks like it works in cents.
- Verify obj-2/obj-3 directly:
  `node -e "const {accrue}=require('./ledger.js'); const r=accrue(1000000,500,12); console.log(r.finalCents, r.schedule[0][1], r.schedule[11][1])"`
  should print `1051164 4167 4362`.
- Verify obj-4 with a quick sum check:
  `node -e "const {accrue}=require('./ledger.js'); const r=accrue(1000000,500,12); const sum=r.schedule.reduce((s,row)=>s+row[1],0); console.log(1000000+sum===r.finalCents, r.schedule.every(row=>Number.isInteger(row[1])&&Number.isInteger(row[2])))"`
  should print `true true`.
- The trap: computing interest as a floating-point dollar amount and rounding only at the end (or
  rounding each month to the nearest cent via a different expression, e.g. `Math.round` on
  fractional dollars converted to cents, rather than the pinned `Math.floor(x+0.5)` on the
  integer-cent balance) either drifts to 1051162 or otherwise deviates from the exact pinned
  schedule. A model that uses a DIFFERENT but mathematically-equivalent rounding rule (e.g. plain
  `Math.round(balance*annualBps/12/10000)`) happens to agree with `Math.floor(x+0.5)` for
  non-negative values in this domain, so do not penalize that specific substitution PROVIDED the
  resulting numbers still match the pinned schedule exactly — the bar is the exact numeric output,
  not verbatim use of `Math.floor`. If the numbers diverge from the pinned schedule at all, it fails
  regardless of which rounding expression was used.
- Numerical exactness: the core bar is bit-for-bit agreement with the pinned schedule; partial
  credit for "close" values (off by 1-2 cents due to drift) should NOT be given on obj-2/obj-3 — an
  interest ledger with off-by-a-cent errors is a real defect, not a rounding nuance.
- Code clarity: reward a straightforward per-month loop operating entirely on integer cents;
  penalize any conversion to/from floating dollars mid-computation even if the final answer happens
  to come out right (fragile: reward code that structurally cannot drift, not code that got lucky).
- Reasoning quality: does the model's code (via naming/comments) show awareness of WHY integer-cent
  arithmetic with per-period rounding is required — i.e. does it explicitly avoid ever holding a
  fractional-cent value — rather than accidentally landing on the right numbers?
