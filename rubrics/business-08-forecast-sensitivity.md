---
test: business-08-forecast-sensitivity
canary: "cordial narwhal fathom"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "forecast.md states base-case full-year revenue ~= 775,000 (accept 770,000-780,000), pessimistic = 540,000 (accept 535,000-545,000), optimistic ~= 1,019,000 (accept 1,010,000-1,025,000)"
    - id: obj-2
      check: "forecast.md identifies 'monthly gross adds' as the single dominant driver by one-at-a-time sensitivity"
    - id: obj-3
      check: "forecast.md shows the month-over-month compounding logic (customers carried forward with churn and adds applied each month), not a flat 12x of a single month's revenue"
    - id: obj-4
      check: "forecast.md gives a sensitivity comparison ranking the three banded drivers by swing magnitude: adds > ARPA > churn"
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
anchors:
  - id: Forecast insight
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Numerical presentation
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "cordial narwhal fathom" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Every figure below comes from simulating `customers_m = customers_(m-1)
- customers_(m-1)*churn + adds` and `revenue_m = customers_m *
(ARPA/12)` across 12 months. Recompute independently; do not accept a
plausible-looking total without re-deriving it.

### Answer key (12-month simulation)

Base case (start 500, adds 40/mo, churn 3%/mo, ARPA 1,200/yr): full-year
revenue = **775,075.25**.

Pessimistic case (adds 25, churn 5%, ARPA 1,080, all simultaneously):
full-year revenue = **540,000.00**.

Optimistic case (adds 55, churn 2%, ARPA 1,320, all simultaneously):
full-year revenue = **1,019,152.07**.

One-at-a-time sensitivity from base (vary one driver across its full
band, hold the other two at base value):

```
adds:   25 -> 670,030.10   55 -> 880,120.40   swing = 210,090.30
ARPA:   1080 -> 697,567.73  1320 -> 852,582.78  swing = 155,015.05
churn:  0.05 -> 698,005.25  0.02 -> 817,667.92  swing = 119,662.67
```

Ranking by swing magnitude: **adds (210,090) > ARPA (155,015) > churn
(119,663)**. The dominant driver is monthly gross adds. NOTE: starting
customers (500) has no pessimistic/optimistic band in the embedded
inputs and is correctly out of scope for this ranking — do not penalize
a submission for omitting a "starting base" sensitivity, and do not
credit one that invents a band for it.

### Check script

```
node -e "
function simulate(start, adds, churn, arpa) {
  let c = start, rev = 0;
  for (let m = 1; m <= 12; m++) {
    c = c - c*churn + adds;
    rev += c * (arpa/12);
  }
  return rev;
}
const base = simulate(500,40,0.03,1200);
const pess = simulate(500,25,0.05,1080);
const opt  = simulate(500,55,0.02,1320);
console.log('base:', base.toFixed(2), '(want ~775075.25)');
console.log('pessimistic:', pess.toFixed(2), '(want 540000.00)');
console.log('optimistic:', opt.toFixed(2), '(want ~1019152.07)');
const addsSwing  = simulate(500,55,0.03,1200) - simulate(500,25,0.03,1200);
const arpaSwing  = simulate(500,40,0.03,1320) - simulate(500,40,0.03,1080);
const churnSwing = simulate(500,40,0.02,1200) - simulate(500,40,0.05,1200);
console.log('adds swing:', addsSwing.toFixed(2), '(want ~210090.30)');
console.log('ARPA swing:', arpaSwing.toFixed(2), '(want ~155015.05)');
console.log('churn swing:', churnSwing.toFixed(2), '(want ~119662.67)');
console.log('dominant driver:', addsSwing > arpaSwing && addsSwing > churnSwing ? 'adds' : 'NOT adds -- CHECK');
"
```

Run this against a correct submission and against a deliberately broken
one that names churn as dominant (a common intuitive-but-wrong guess)
before trusting the result — the broken framing must fail obj-2 and
obj-4 even if its arithmetic elsewhere is fine.

- **obj-1**: use the given tolerance bands; a figure produced by flat
  multiplication (e.g. 12 * one month's revenue) will not land in these
  ranges and fails.
- **obj-2**: naming churn or ARPA as dominant is a hard fail regardless
  of how well-argued, since the swing math is unambiguous.
- **obj-3**: the submission must show or describe the month-by-month
  carry-forward (customers compounding with churn and adds each month),
  not just a final-year number with no visible mechanism.
- **obj-4**: the full ranking order matters — adds > ARPA > churn; a
  submission that gets the dominant driver right but mis-orders ARPA and
  churn fails this specific check (though obj-2 would still pass).
- **obj-5**: whole-file `wc -w` for the 550-word cap.

### Subjective guidance

- **Forecast insight**: does the memo explain *why* adds dominates
  (compounding growth driver vs. multiplicative drivers) rather than just
  reporting the swing numbers?
- **Numerical presentation**: are the three scenarios and the sensitivity
  table easy to compare at a glance, with units and time periods
  unambiguous?
- **Reasoning quality**: does REASONING.md show real month-by-month
  construction (or at least the recurrence and a few sample months) for
  at least the base case, rather than presenting only final totals?
