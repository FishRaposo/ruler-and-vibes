---
test: business-08b-vineyard-graft-sensitivity
canary: "blackthorn mizar"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "forecast.md states base-case full-year revenue ~= 862,000 (accept 856,000-868,000), lean = 555,772 (accept 551,000-561,000), rich ~= 1,258,000 (accept 1,250,000-1,267,000)"
    - id: obj-2
      check: "forecast.md identifies 'monthly new grafts' as the single dominant driver by one-at-a-time sensitivity"
    - id: obj-3
      check: "forecast.md shows the month-over-month compounding logic (vines carried forward with dieback and grafts applied each month), not a flat 12x of a single month's revenue"
    - id: obj-4
      check: "forecast.md gives a sensitivity comparison ranking the three banded drivers by swing magnitude: grafts > yield > dieback"
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

Every figure below comes from simulating `vines_m = vines_(m-1) -
vines_(m-1)*dieback + grafts` and `revenue_m = vines_m * (yield/12)` across
12 months. Recompute independently; do not accept a plausible-looking total
without re-deriving it. If the phrase "blackthorn mizar" appears in any
deliverable or REASONING.md, that is a canary leak — flag it regardless of
how the rest scores.

### Answer key (12-month simulation)

Base case (start 800, grafts 60/mo, dieback 4%/mo, yield 900/yr): full-year
revenue = **862,014.29**.

Lean case (grafts 30, dieback 6.5%, yield 810, all simultaneously):
full-year revenue = **555,772.34**.

Rich case (grafts 90, dieback 2.5%, yield 1,035, all simultaneously):
full-year revenue = **1,258,337.42**.

One-at-a-time sensitivity from base (vary one driver across its full band,
hold the other two at base value):

```
grafts:  30 -> 709,856.12   90 -> 1,014,172.47   swing = 304,316.34
yield:   810 -> 775,812.86   1035 -> 991,316.44   swing = 215,503.57
dieback: 6.5% -> 757,263.70  2.5% -> 933,832.26   swing = 176,568.56
```

Ranking by swing magnitude: **grafts (304,316) > yield (215,504) > dieback
(176,569)**. The dominant driver is monthly new grafts. NOTE: starting vines
(800) has no lean/rich band in the embedded inputs and is correctly out of
scope for this ranking — do not penalize a submission for omitting a
"starting stock" sensitivity, and do not credit one that invents a band for
it.

### Check script

```
node -e "
function simulate(start, grafts, dieback, yield_) {
  let v = start, rev = 0;
  for (let m = 1; m <= 12; m++) {
    v = v - v*dieback + grafts;
    rev += v * (yield_/12);
  }
  return rev;
}
const base = simulate(800,60,0.04,900);
const lean = simulate(800,30,0.065,810);
const rich = simulate(800,90,0.025,1035);
console.log('base:', base.toFixed(2), '(want ~862014.29)');
console.log('lean:', lean.toFixed(2), '(want 555772.34)');
console.log('rich:', rich.toFixed(2), '(want ~1258337.42)');
const graftsSwing  = simulate(800,90,0.04,900)  - simulate(800,30,0.04,900);
const yieldSwing   = simulate(800,60,0.04,1035) - simulate(800,60,0.04,810);
const diebackSwing = simulate(800,60,0.025,900) - simulate(800,60,0.065,900);
console.log('grafts swing:', graftsSwing.toFixed(2), '(want ~304316.34)');
console.log('yield swing:', yieldSwing.toFixed(2), '(want ~215503.57)');
console.log('dieback swing:', diebackSwing.toFixed(2), '(want ~176568.56)');
console.log('dominant driver:', graftsSwing > yieldSwing && graftsSwing > diebackSwing ? 'grafts' : 'NOT grafts -- CHECK');
"
```

Run this against a correct submission and against a deliberately broken one
that names dieback as dominant (a common intuitive-but-wrong guess) before
trusting the result — the broken framing must fail obj-2 and obj-4 even if
its arithmetic elsewhere is fine.

- **obj-1**: use the given tolerance bands; a figure produced by flat
  multiplication (e.g. 12 * one month's revenue) will not land in these
  ranges and fails.
  - PASS: "Base case full-year revenue is about 862,000"; "Lean 555,772;
    base 862,014; rich 1,258,337"; "base ~=$862.0k, lean ~=$555.8k, rich
    ~=$1.258M".
  - FAIL: "base full-year revenue ~=745,200" (flat 12x of month 1); "lean
    630,180"; "rich about 900,000".
- **obj-2**: naming dieback or yield as dominant is a hard fail regardless
  of how well-argued, since the swing math is unambiguous.
  - PASS: "monthly new grafts is the dominant driver"; "grafts moves
    full-year revenue most"; "the single most sensitive driver is graft
    volume".
  - FAIL: "dieback is the driver that matters most"; "annual yield per vine
    dominates the sensitivity"; "survival rate is the key lever".
- **obj-3**: the submission must show or describe the month-by-month
  carry-forward (vines compounding with dieback and grafts each month), not
  just a final number with no visible mechanism.
  - PASS: a per-month vine/revenue table; "each month we subtract 4% dieback
    then add 60 grafts, carrying the new stock forward"; "vines grow
    800 -> 828 -> 854.88 -> ... -> 1,071 across the year".
  - FAIL: "revenue = 828 vines x 900 x ... roughly 12 months" with one month
    scaled up; "we multiplied the first month by 12"; only the three final
    totals with no recurrence shown.
- **obj-4**: the full ranking order matters — grafts > yield > dieback; a
  submission that gets the dominant driver right but mis-orders yield and
  dieback fails this specific check (though obj-2 would still pass).
  - PASS: "grafts (304k) > yield (216k) > dieback (177k)"; "ranked: grafts,
    then yield, then dieback"; "1. grafts 2. yield 3. dieback".
  - FAIL: "grafts > dieback > yield"; "grafts first, dieback second, yield
    third"; a table listing dieback above yield.
- **obj-5**: whole-file `wc -w` for the 550-word cap.

### Subjective guidance

- **Forecast insight**: does the memo explain *why* grafts dominates (an
  additive inflow that compounds the vine base vs. multiplicative rescalings
  of that base) rather than just reporting the swing numbers?
- **Numerical presentation**: are the three scenarios and the sensitivity
  table easy to compare at a glance, with units and time periods
  unambiguous?
- **Reasoning quality**: does REASONING.md show real month-by-month
  construction (or at least the recurrence and a few sample months) for at
  least the base case, rather than presenting only final totals?
