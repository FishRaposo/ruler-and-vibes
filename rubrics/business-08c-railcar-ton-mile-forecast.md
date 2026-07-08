---
test: business-08c-railcar-ton-mile-forecast
canary: "rowan alcor"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "forecast.md states base-case full-year ton-miles ~= 7,077,937 (accept 7,050,000-7,105,000), pessimistic ~= 5,034,307 (accept 5,015,000-5,050,000), optimistic ~= 9,594,567 (accept 9,570,000-9,620,000)"
    - id: obj-2
      check: "forecast.md identifies 'monthly deliveries' as the single dominant driver by one-at-a-time sensitivity"
    - id: obj-3
      check: "forecast.md shows the month-over-month compounding logic (cars carried forward with withdrawal and deliveries applied each month), not a flat 12x of a single month's ton-miles"
    - id: obj-4
      check: "forecast.md gives a sensitivity comparison ranking the three banded drivers by swing magnitude: deliveries > ton-miles per car > withdrawal"
    - id: obj-5
      check: "forecast.md is 550 words or fewer (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Forecast insight"
      weight: 0.4
    - id: sub-craft
      name: "Numerical presentation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `business-08-forecast-sensitivity` (same construct, fresh
surface).

If the phrase "rowan alcor" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Every figure below comes from simulating `cars_m = cars_(m-1) -
cars_(m-1)*withdrawal + deliveries` and `tonmiles_m = cars_m *
(per_car/12)` across 12 months. Recompute independently; do not accept a
plausible-looking total without re-deriving it.

### Answer key (12-month simulation)

Base case (start 550, deliveries 50/mo, withdrawal 4%/mo, per-car 10,000
TM/yr): full-year ton-miles = **7,077,936.60**.

Pessimistic case (deliveries 32, withdrawal 5.5%, per-car 9,000, all
simultaneously): full-year ton-miles = **5,034,306.63**.

Optimistic case (deliveries 68, withdrawal 2.5%, per-car 11,000, all
simultaneously): full-year ton-miles = **9,594,566.67**.

One-at-a-time sensitivity from base (vary one driver across its full band,
hold the other two at base value):

```
deliveries:  32 -> 6,063,548.79   68 -> 8,092,324.42   swing = 2,028,775.63
per-car:   9000 -> 6,370,142.94  11000 -> 7,785,730.26  swing = 1,415,587.32
withdrawal: 0.055 -> 6,557,178.39  0.025 -> 7,653,172.05  swing = 1,095,993.66
```

Ranking by swing magnitude: **deliveries (2,028,776) > per-car (1,415,587)
> withdrawal (1,095,994)**. The dominant driver is monthly deliveries. NOTE:
starting fleet (550) has no pessimistic/optimistic band in the embedded
inputs and is correctly out of scope for this ranking — do not penalize a
submission for omitting a "starting fleet" sensitivity, and do not credit
one that invents a band for it.

### Check script

```
node -e "
function simulate(start, deliveries, withdrawal, perCar) {
  let c = start, tm = 0;
  for (let m = 1; m <= 12; m++) {
    c = c - c*withdrawal + deliveries;
    tm += c * (perCar/12);
  }
  return tm;
}
const base = simulate(550,50,0.04,10000);
const pess = simulate(550,32,0.055,9000);
const opt  = simulate(550,68,0.025,11000);
console.log('base:', base.toFixed(2), '(want ~7077936.60)');
console.log('pessimistic:', pess.toFixed(2), '(want ~5034306.63)');
console.log('optimistic:', opt.toFixed(2), '(want ~9594566.67)');
const delSwing = simulate(550,68,0.04,10000) - simulate(550,32,0.04,10000);
const pcSwing  = simulate(550,50,0.04,11000) - simulate(550,50,0.04,9000);
const witSwing = simulate(550,50,0.025,10000) - simulate(550,50,0.055,10000);
console.log('deliveries swing:', delSwing.toFixed(2), '(want ~2028775.63)');
console.log('per-car swing:', pcSwing.toFixed(2), '(want ~1415587.32)');
console.log('withdrawal swing:', witSwing.toFixed(2), '(want ~1095993.66)');
console.log('dominant driver:', delSwing > pcSwing && delSwing > witSwing ? 'deliveries' : 'NOT deliveries -- CHECK');
"
```

Run this against a correct submission and against a deliberately broken
one that names withdrawal as dominant (a common intuitive-but-wrong guess)
before trusting the result — the broken framing must fail obj-2 and obj-4
even if its arithmetic elsewhere is fine.

- **obj-1**: use the given tolerance bands; a figure produced by flat
  multiplication (e.g. 12 * one month's ton-miles) will not land in these
  ranges and fails. PASS: "Base-case full-year ton-miles = 7,077,937";
  "Base 7.08M, pessimistic 5.03M, optimistic 9.59M"; "≈ 7,077,900 for the
  base year". FAIL: "Base-case ≈ 5,780,000" (flat 12x); "Full year ≈ 6.6M
  in the optimistic case" (below 9.57M band); "Pessimistic 4,965,750"
  (flat 12x, below band).
- **obj-2**: naming withdrawal or per-car as dominant is a hard fail
  regardless of how well-argued, since the swing math is unambiguous. PASS:
  "The dominant driver is monthly deliveries"; "Deliveries move the year
  most"; "New car deliveries is the single biggest lever". FAIL:
  "Withdrawal is the dominant driver"; "Per-car yield matters most"; "The
  retention rate is the key sensitivity".
- **obj-3**: the submission must show or describe the month-by-month
  carry-forward (cars compounding with withdrawal and deliveries each
  month), not just a final-year number with no visible mechanism. PASS: a
  month-by-month fleet table; "cars_m = cars_(m-1) - cars_(m-1)*0.04 + 50,
  iterated 12 times"; "the fleet grows 550 -> 578 -> 605 -> ... -> 821".
  FAIL: "one month is ~481,667 ton-miles, so the year is 12x that"; only a
  single final total with no recurrence; "annualized from a representative
  month".
- **obj-4**: the full ranking order matters — deliveries > per-car >
  withdrawal; a submission that gets the dominant driver right but
  mis-orders per-car and withdrawal fails this specific check (though obj-2
  would still pass). PASS: "deliveries > per-car > withdrawal"; "1st
  deliveries, 2nd ton-miles per car, 3rd withdrawal". FAIL: "deliveries >
  withdrawal > per-car"; "withdrawal > deliveries > per-car"; "per-car >
  deliveries > withdrawal".
- **obj-5**: whole-file `wc -w` for the 550-word cap.

### Subjective guidance

- **Forecast insight**: does the memo explain *why* deliveries dominates
  (additive, compounding growth driver vs. multiplicative rescalings)
  rather than just reporting the swing numbers?
- **Numerical presentation**: are the three scenarios and the sensitivity
  table easy to compare at a glance, with units (ton-miles) and time
  periods unambiguous?
- **Reasoning quality**: does REASONING.md show real month-by-month
  construction (or at least the recurrence and a few sample months) for at
  least the base case, rather than presenting only final totals?
