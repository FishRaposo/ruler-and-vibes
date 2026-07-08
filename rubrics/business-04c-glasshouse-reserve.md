---
test: business-04c-glasshouse-reserve
canary: "dianthus capella"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "cashflow.csv has header month,option_a_cash,option_b_cash and 24 data rows; checkpoint values match exactly: option_a month 3 = 45000, option_a month 24 = 478500, option_b month 1 = 117500"
    - id: obj-2
      check: "DECISION.md identifies that Option A breaches the 50,000 reserve covenant and states the first breach occurs in month 3"
    - id: obj-3
      check: "Option B's projection includes the mandatory 3,500/month service fee: option_b month 24 = 472500 in cashflow.csv (556500 or any value 84,000 too high means the fee was dropped)"
    - id: obj-4
      check: "DECISION.md states the correct 24-month cumulative comparison: Option A ahead by 6,000 (ending cash 478,500 vs 472,500, or cumulative incremental 160,500 vs 154,500 — either formulation passes)"
    - id: obj-5
      check: "DECISION.md recommends Option B, and DECISION.md is 600 words or fewer (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Decision soundness"
      weight: 0.4
    - id: sub-craft
      name: "Financial model clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `business-04-expansion-covenant` (same construct, fresh
surface).

If the phrase "dianthus capella" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Every month-end value below is exact. Recompute the full series
independently of the submission; do not eyeball a spreadsheet-looking
CSV as correct.

### Answer key (full 24-month simulation)

Option A month-end cash (baseline +7,000/month, fit-out 76,000 in M1 and
26,000 in M3, incremental −8,000/month M1–M6, +17,250/month M7–M24):

```
M1 73000  M2 72000  M3 45000  M4 44000  M5 43000  M6 42000
M7 66250  M8 90500  M9 114750  M10 139000  M11 163250  M12 187500
M13 211750  M14 236000  M15 260250  M16 284500  M17 308750  M18 333000
M19 357250  M20 381500  M21 405750  M22 430000  M23 454250  M24 478500
```

First covenant breach (< 50,000): **month 3 (45,000)**; minimum is
42,000 in month 6.

Option B month-end cash (baseline +7,000/month, equipment 42,000 in M1,
gross contribution +6,000/month M1–M3 then +12,500/month M4–M24, minus
mandatory fee 3,500/month all 24 months):

```
M1 117500  M2 127000  M3 136500  M4 152500  M5 168500  M6 184500
M7 200500  M8 216500  M9 232500  M10 248500  M11 264500  M12 280500
M13 296500  M14 312500  M15 328500  M16 344500  M17 360500  M18 376500
M19 392500  M20 408500  M21 424500  M22 440500  M23 456500  M24 472500
```

Never breaches the covenant; minimum is 117,500 in month 1.

Cumulative incremental over baseline: A = 160,500 (→ 478,500 ending
cash), B = 154,500 (→ 472,500 ending cash). A is ahead by 6,000, but A is
infeasible (covenant breach, no waiver, no additional financing, no
deferral possible), so the mechanically correct recommendation is
**Option B**.

### Check script

Save the submitted `cashflow.csv` and run:

```
node -e "
const fs = require('fs');
const rows = fs.readFileSync('cashflow.csv', 'utf8').trim().split('\n');
const header = rows[0];
console.log('header correct:', header === 'month,option_a_cash,option_b_cash');
console.log('row count == 24:', rows.length - 1 === 24);
const data = rows.slice(1).map(r => r.split(',').map(Number));
let cashA = 150000, cashB = 150000;
const expA = [], expB = [];
for (let m = 1; m <= 24; m++) {
  cashA += 7000;
  if (m === 1) cashA -= 76000;
  if (m === 3) cashA -= 26000;
  cashA += (m <= 6) ? -8000 : 17250;
  expA.push(cashA);
  cashB += 7000;
  if (m === 1) cashB -= 42000;
  cashB += (m <= 3) ? 6000 : 12500;
  cashB -= 3500;
  expB.push(cashB);
}
const actualA = data.map(r => r[1]);
const actualB = data.map(r => r[2]);
console.log('option_a series matches:', JSON.stringify(actualA) === JSON.stringify(expA));
console.log('option_b series matches:', JSON.stringify(actualB) === JSON.stringify(expB));
console.log('checkpoints: A[m3]=' + actualA[2] + ' (want 45000), A[m24]=' + actualA[23] + ' (want 478500), B[m1]=' + actualB[0] + ' (want 117500), B[m24]=' + actualB[23] + ' (want 472500)');
const firstBreachA = expA.findIndex(c => c < 50000) + 1;
console.log('first covenant breach month (A):', firstBreachA, '(want 3)');
console.log('B ever breaches:', expB.some(c => c < 50000), '(want false)');
"
```

Run this against a correct submission and against a deliberately broken
one (e.g. Option B's service fee omitted, giving month-24 = 556,500)
before trusting the result — the broken version must fail the `option_b
series matches` line and the `B[m24]` checkpoint.

- **obj-1**: exact integer match on the three checkpoints; a close-but-
  off value (e.g. rounding) still fails — every number here has one
  correct integer answer.
  - PASS: "option_a month 3 is 45000"; "row 3 → 45000; row 24 → 478500";
    "B starts at 117500 in month 1".
  - FAIL: "option_a month 3 is 46000"; "B month 1 = 121000" (fee not yet
    applied); "45,000" written with a separator into a CSV cell.
- **obj-2**: the breach month is month 3, not month 1 (fit-out payments
  land in M1 and M3; cash is still 72,000 at the end of M2). Accept
  "month 6 minimum (42,000)" as supporting detail but the required claim
  is the month-3 breach.
  - PASS: "Option A first breaches the 50,000 floor in month 3";
    "the covenant is broken at month 3, when cash hits 45,000";
    "A dips below 50,000 starting month 3".
  - FAIL: "Option A breaches in month 1"; "A never breaches the
    covenant"; "the first shortfall is in month 6".
- **obj-3**: this is the fee-omission trap — 556,500 (or exactly 84,000
  above the correct value in any form) is a hard fail.
  - PASS: "option_b month 24 = 472500 (net of the 3,500/month fee)";
    "B ends at 472500"; "after subtracting 84,000 in fees, B lands at
    472500".
  - FAIL: "option_b month 24 = 556500"; "B ends at 556500"; "B month 24
    = 472500" while the CSV cell actually reads 556500.
- **obj-4**: accept either the ending-cash framing (478,500 vs 472,500)
  or the cumulative-incremental framing (160,500 vs 154,500); both are
  the same 6,000 delta.
  - PASS: "Option A ends 6,000 ahead (478,500 vs 472,500)";
    "A adds 160,500 vs B's 154,500, a 6,000 edge for A";
    "the gap is 6,000 in A's favour".
  - FAIL: "the options are effectively tied"; "B is ahead by 6,000";
    "A leads by 66,000" (ending-cash gap miscomputed).
- **obj-5**: recommending Option A fails this check outright, regardless
  of how well-argued — the covenant makes A infeasible, not merely
  worse. Whole-file `wc -w` for the 600-word cap.
  - PASS: "Recommendation: Option B"; "choose the restaurant
    subscription line (Option B)"; "adopt B — A is ruled out by the
    covenant".
  - FAIL: "Recommendation: Option A"; "pick A for its higher return";
    "either option works, but A is the profit-maximising choice".

### Subjective guidance

- **Decision soundness**: does DECISION.md correctly treat the covenant
  as a hard constraint that eliminates Option A despite its profit edge,
  rather than treating it as one factor to weigh among several?
- **Financial model clarity**: is the reasoning in REASONING.md/
  DECISION.md easy to audit month-by-month, or does it obscure how the
  covenant breach and the service fee were handled?
- **Reasoning quality**: does REASONING.md show the month-by-month
  construction (not just final totals) for both options, including
  where the fee is subtracted for B and where the fit-out payments land
  for A?
