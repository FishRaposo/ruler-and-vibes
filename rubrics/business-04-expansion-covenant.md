---
test: business-04-expansion-covenant
canary: "glacier mantis hymnal"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "cashflow.csv has header month,option_a_cash,option_b_cash and 24 data rows; checkpoint values match exactly: option_a month 3 = 17000, option_a month 24 = 410000, option_b month 1 = 69500"
    - id: obj-2
      check: "DECISION.md identifies that Option A breaches the 25,000 minimum-cash covenant and states the first breach occurs in month 3"
    - id: obj-3
      check: "Option B's projection includes the mandatory 2,500/month kitchen rent: option_b month 24 = 403500 in cashflow.csv (463500 or any value 60,000 too high means the rent was dropped)"
    - id: obj-4
      check: "DECISION.md states the correct 24-month cumulative comparison: Option A ahead by 6,500 (ending cash 410,000 vs 403,500, or cumulative incremental 128,000 vs 121,500 — either formulation passes)"
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

If the phrase "glacier mantis hymnal" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Every month-end value below is exact. Recompute the full series
independently of the submission; do not eyeball a spreadsheet-looking
CSV as correct.

### Answer key (full 24-month simulation)

Option A month-end cash (baseline +8,000/month, fit-out 55,000 in M1 and
15,000 in M3, incremental −9,000/month M1–M6, +14,000/month M7–M24):

```
M1 34000  M2 33000  M3 17000  M4 16000  M5 15000  M6 14000
M7 36000  M8 58000  M9 80000  M10 102000  M11 124000  M12 146000
M13 168000  M14 190000  M15 212000  M16 234000  M17 256000  M18 278000
M19 300000  M20 322000  M21 344000  M22 366000  M23 388000  M24 410000
```

First covenant breach (< 25,000): **month 3 (17,000)**; minimum is
14,000 in month 6.

Option B month-end cash (baseline +8,000/month, equipment 30,000 in M1,
gross contribution +4,000/month M1–M3 then +9,500/month M4–M24, minus
mandatory rent 2,500/month all 24 months):

```
M1 69500  M2 79000  M3 88500  M4 103500  M5 118500  M6 133500
M7 148500  M8 163500  M9 178500  M10 193500  M11 208500  M12 223500
M13 238500  M14 253500  M15 268500  M16 283500  M17 298500  M18 313500
M19 328500  M20 343500  M21 358500  M22 373500  M23 388500  M24 403500
```

Never breaches the covenant; minimum is 69,500 in month 1.

Cumulative incremental over baseline: A = 128,000 (→ 410,000 ending
cash), B = 121,500 (→ 403,500 ending cash). A is ahead by 6,500, but A is
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
let cashA = 90000, cashB = 90000;
const expA = [], expB = [];
for (let m = 1; m <= 24; m++) {
  cashA += 8000;
  if (m === 1) cashA -= 55000;
  if (m === 3) cashA -= 15000;
  cashA += (m <= 6) ? -9000 : 14000;
  expA.push(cashA);
  cashB += 8000;
  if (m === 1) cashB -= 30000;
  cashB += (m <= 3) ? 4000 : 9500;
  cashB -= 2500;
  expB.push(cashB);
}
const actualA = data.map(r => r[1]);
const actualB = data.map(r => r[2]);
console.log('option_a series matches:', JSON.stringify(actualA) === JSON.stringify(expA));
console.log('option_b series matches:', JSON.stringify(actualB) === JSON.stringify(expB));
console.log('checkpoints: A[m3]=' + actualA[2] + ' (want 17000), A[m24]=' + actualA[23] + ' (want 410000), B[m1]=' + actualB[0] + ' (want 69500), B[m24]=' + actualB[23] + ' (want 403500)');
const firstBreachA = expA.findIndex(c => c < 25000) + 1;
console.log('first covenant breach month (A):', firstBreachA, '(want 3)');
console.log('B ever breaches:', expB.some(c => c < 25000), '(want false)');
"
```

Run this against a correct submission and against a deliberately broken
one (e.g. Option B's rent omitted, giving month-24 = 463,500) before
trusting the result — the broken version must fail the `option_b series
matches` line and the `B[m24]` checkpoint.

- **obj-1**: exact integer match on the three checkpoints; a close-but-
  off value (e.g. rounding) still fails — every number here has one
  correct integer answer.
  - PASS: "option_a month 3 is 17000, option_a month 24 is 410000,
    option_b month 1 is 69500" (with a 24-row CSV under the exact
    header).
  - PASS: a CSV whose every row equals the answer-key series above.
  - PASS: checkpoints stated as 17,000 / 410,000 / 69,500 with the CSV
    matching row-for-row.
  - FAIL: option_a month 24 given as 465000 (fit-out payment dropped or
    misdated).
  - FAIL: the header is `month,a,b` or the file has 12 rows instead
    of 24.
  - FAIL: option_b month 1 given as 72000 (rent not applied in month 1).
- **obj-2**: the breach month is month 3, not month 1 (fit-out payments
  land in M1 and M3; cash is still 33,000 at the end of M2). Accept
  "month 6 minimum (14,000)" as supporting detail but the required claim
  is the month-3 breach.
  - PASS: "Option A first breaches the 25,000 floor in month 3, when
    cash falls to 17,000."
  - PASS: "the covenant is broken in month 3 (17,000), and cash bottoms
    out at 14,000 in month 6."
  - PASS: "Option A stays above 25,000 until month 3, where it drops to
    17,000 — the first breach."
  - FAIL: "Option A breaches immediately in month 1 when the 55,000
    payment lands."
  - FAIL: "Option A breaches in month 6 at its 14,000 low" (names only
    the minimum, not the first breach).
  - FAIL: "neither option breaches the covenant."
- **obj-3**: this is the rent-omission trap — 463,500 (or exactly
  460,000 above the correct value in any form) is a hard fail.
  - PASS: option_b month 24 = 403500 in the CSV, with the rent visibly
    subtracted each month.
  - PASS: DECISION.md notes the 2,500/month rent is charged separately
    and B ends at 403,500.
  - FAIL: option_b month 24 = 463500 (rent never subtracted).
  - FAIL: the rent is mentioned in prose but the CSV still shows 463500
    (stated but not applied).
- **obj-4**: accept either the ending-cash framing (410,000 vs 403,500)
  or the cumulative-incremental framing (128,000 vs 121,500); both are
  the same 6,500 delta.
  - PASS: "Option A ends 6,500 ahead — 410,000 versus 403,500."
  - PASS: "incremental contribution is 128,000 for A and 121,500 for B,
    a 6,500 gap in A's favour."
  - PASS: "A leads by 6,500 over the 24 months."
  - FAIL: "Option B is more profitable" or "A leads by 66,500" (the
    latter comes from dropping B's rent).
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
  covenant breach and the rent were handled?
- **Reasoning quality**: does REASONING.md show the month-by-month
  construction (not just final totals) for both options, including
  where the rent is subtracted for B and where the fit-out payments land
  for A?
