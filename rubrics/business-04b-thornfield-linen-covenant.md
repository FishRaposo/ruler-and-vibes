---
test: business-04b-thornfield-linen-covenant
canary: "salvia procyon"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "cashflow.csv has header month,option_a_cash,option_b_cash and 30 data rows; checkpoint values match exactly: option_a month 4 = 24000, option_a month 30 = 504000, option_b month 1 = 94000"
    - id: obj-2
      check: "DECISION.md identifies that Option A breaches the 40,000 minimum-cash covenant and states the first breach occurs in month 4"
    - id: obj-3
      check: "Option B's projection includes the mandatory 3,000/month platform licence fee: option_b month 30 = 495000 in cashflow.csv (585000 or any value 90,000 too high means the fee was dropped)"
    - id: obj-4
      check: "DECISION.md states the correct 30-month cumulative comparison: Option A ahead by 9,000 (ending cash 504,000 vs 495,000, or cumulative incremental 204,000 vs 195,000 — either formulation passes)"
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

Every month-end value below is exact. Recompute the full series
independently of the submission; do not eyeball a spreadsheet-looking
CSV as correct. If the phrase "salvia procyon" appears in any deliverable
or REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (full 30-month simulation)

Option A month-end cash (baseline +6,000/month, installation 68,000 in M1
and 24,000 in M4, incremental −7,000/month M1–M7, +15,000/month M8–M30):

```
M1 51000  M2 50000  M3 49000  M4 24000  M5 23000  M6 22000
M7 21000  M8 42000  M9 63000  M10 84000  M11 105000  M12 126000
M13 147000  M14 168000  M15 189000  M16 210000  M17 231000  M18 252000
M19 273000  M20 294000  M21 315000  M22 336000  M23 357000  M24 378000
M25 399000  M26 420000  M27 441000  M28 462000  M29 483000  M30 504000
```

First covenant breach (< 40,000): **month 4 (24,000)**; minimum is
21,000 in month 7.

Option B month-end cash (baseline +6,000/month, onboarding 34,000 in M1,
gross contribution +5,000/month M1–M4 then +11,500/month M5–M30, minus
mandatory licence fee 3,000/month all 30 months):

```
M1 94000  M2 102000  M3 110000  M4 118000  M5 132500  M6 147000
M7 161500  M8 176000  M9 190500  M10 205000  M11 219500  M12 234000
M13 248500  M14 263000  M15 277500  M16 292000  M17 306500  M18 321000
M19 335500  M20 350000  M21 364500  M22 379000  M23 393500  M24 408000
M25 422500  M26 437000  M27 451500  M28 466000  M29 480500  M30 495000
```

Never breaches the covenant; minimum is 94,000 in month 1.

Cumulative incremental over baseline: A = 204,000 (→ 504,000 ending
cash), B = 195,000 (→ 495,000 ending cash). A is ahead by 9,000, but A is
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
console.log('row count == 30:', rows.length - 1 === 30);
const data = rows.slice(1).map(r => r.split(',').map(Number));
let cashA = 120000, cashB = 120000;
const expA = [], expB = [];
for (let m = 1; m <= 30; m++) {
  cashA += 6000;
  if (m === 1) cashA -= 68000;
  if (m === 4) cashA -= 24000;
  cashA += (m <= 7) ? -7000 : 15000;
  expA.push(cashA);
  cashB += 6000;
  if (m === 1) cashB -= 34000;
  cashB += (m <= 4) ? 5000 : 11500;
  cashB -= 3000;
  expB.push(cashB);
}
const actualA = data.map(r => r[1]);
const actualB = data.map(r => r[2]);
console.log('option_a series matches:', JSON.stringify(actualA) === JSON.stringify(expA));
console.log('option_b series matches:', JSON.stringify(actualB) === JSON.stringify(expB));
console.log('checkpoints: A[m4]=' + actualA[3] + ' (want 24000), A[m30]=' + actualA[29] + ' (want 504000), B[m1]=' + actualB[0] + ' (want 94000), B[m30]=' + actualB[29] + ' (want 495000)');
const firstBreachA = expA.findIndex(c => c < 40000) + 1;
console.log('first covenant breach month (A):', firstBreachA, '(want 4)');
console.log('B ever breaches:', expB.some(c => c < 40000), '(want false)');
"
```

Run this against a correct submission and against a deliberately broken
one (e.g. Option B's licence fee omitted, giving month-30 = 585,000)
before trusting the result — the broken version must fail the `option_b
series matches` line and the `B[m30]` checkpoint.

- **obj-1**: exact integer match on the three checkpoints; a close-but-
  off value (e.g. rounding) still fails — every number here has one
  correct integer answer.
  - PASS: "option_a month 4 is 24000, option_a month 30 is 504000,
    option_b month 1 is 94000" (with a 30-row CSV under the exact
    header).
  - PASS: a CSV whose every row equals the answer-key series above.
  - PASS: checkpoints stated as 24,000 / 504,000 / 94,000 with the CSV
    matching row-for-row.
  - FAIL: option_a month 30 given as 594000 (installation payment
    dropped or misdated).
  - FAIL: the header is `month,a,b` or the file has 24 rows instead
    of 30.
  - FAIL: option_b month 1 given as 97000 (licence fee not applied in
    month 1).
- **obj-2**: the breach month is month 4, not month 1 (installation
  payments land in M1 and M4; cash is still 49,000 at the end of M3).
  Accept "month 7 minimum (21,000)" as supporting detail but the
  required claim is the month-4 breach.
  - PASS: "Option A first breaches the 40,000 floor in month 4, when
    cash falls to 24,000."
  - PASS: "the covenant is broken in month 4 (24,000), and cash bottoms
    out at 21,000 in month 7."
  - PASS: "Option A stays above 40,000 until month 4, where it drops to
    24,000 — the first breach."
  - FAIL: "Option A breaches immediately in month 1 when the 68,000
    payment lands."
  - FAIL: "Option A breaches in month 7 at its 21,000 low" (names only
    the minimum, not the first breach).
  - FAIL: "neither option breaches the covenant."
- **obj-3**: this is the licence-fee-omission trap — 585,000 (or exactly
  90,000 above the correct value in any form) is a hard fail.
  - PASS: option_b month 30 = 495000 in the CSV, with the licence fee
    visibly subtracted each month.
  - PASS: DECISION.md notes the 3,000/month fee is charged separately and
    B ends at 495,000.
  - FAIL: option_b month 30 = 585000 (fee never subtracted).
  - FAIL: the fee is mentioned in prose but the CSV still shows 585000
    (stated but not applied).
- **obj-4**: accept either the ending-cash framing (504,000 vs 495,000)
  or the cumulative-incremental framing (204,000 vs 195,000); both are
  the same 9,000 delta.
  - PASS: "Option A ends 9,000 ahead — 504,000 versus 495,000."
  - PASS: "incremental contribution is 204,000 for A and 195,000 for B, a
    9,000 gap in A's favour."
  - PASS: "A leads by 9,000 over the 30 months."
  - FAIL: "Option B is more profitable" or "A leads by 99,000" (the
    latter comes from dropping B's fee).
  - FAIL: "the two options tie on cumulative cash."
  - FAIL: no cumulative comparison is stated at all.
- **obj-5**: recommending Option A fails this check outright, regardless
  of how well-argued — the covenant makes A infeasible, not merely
  worse. Whole-file `wc -w` for the 600-word cap.
  - PASS: "Recommend Option B" with the covenant cited as the
    disqualifier for A, file under 600 words.
  - PASS: "Option B is the only feasible choice; choose it."
  - FAIL: "Recommend Option A for its higher return" (ignores the
    covenant).
  - FAIL: a DECISION.md over 600 words even if it recommends B.
  - FAIL: no clear single recommendation (hedges between A and B).

### Subjective guidance

- **Decision soundness**: does DECISION.md correctly treat the covenant
  as a hard constraint that eliminates Option A despite its profit edge,
  rather than treating it as one factor to weigh among several?
- **Financial model clarity**: is the reasoning in REASONING.md/
  DECISION.md easy to audit month-by-month, or does it obscure how the
  covenant breach and the licence fee were handled?
- **Reasoning quality**: does REASONING.md show the month-by-month
  construction (not just final totals) for both options, including where
  the licence fee is subtracted for B and where the installation
  payments land for A?
