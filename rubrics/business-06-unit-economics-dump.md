---
test: business-06-unit-economics-dump
canary: "numbat coppice eddy"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "unit-economics.md states CAC = 1,400 and explicitly excludes the 12,000 brand sponsorship from the CAC numerator"
    - id: obj-2
      check: "unit-economics.md states LTV = 1,440 computed WITH the 80% gross margin (a value of 1,800 that omits margin fails)"
    - id: obj-3
      check: "unit-economics.md states LTV:CAC ratio ~= 1.03 (accept 1.0-1.05 or 'about 1')"
    - id: obj-4
      check: "unit-economics.md states CAC payback ~= 19.4 months (accept 19-20 or 'about 19 months'; a payback computed on gross revenue instead of margin, ~15.6, fails)"
    - id: obj-5
      check: "unit-economics.md concludes the unit economics are unhealthy/marginal (ratio near 1, not the 'healthy 3:1' benchmark), AND the file is 450 words or fewer (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Diagnostic soundness"
      weight: 0.4
    - id: sub-craft
      name: "Numerical presentation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "numbat coppice eddy" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Every figure below is exact given the embedded dump.

### Answer key

Inputs: ad spend 48,000; SDR salaries 36,000; brand sponsorship 12,000
(explicitly not tied to acquisition — must be excluded); 60 new
customers; ARPA 90/month; gross margin 80%; monthly churn 5%.

```
CAC          = (48000 + 36000) / 60           = 1,400
avg lifetime = 1 / 0.05                        = 20 months
LTV          = 90 * 0.80 * 20                  = 1,440
LTV:CAC      = 1440 / 1400                     = 1.0286  (~1.03)
payback      = 1400 / (90 * 0.80)              = 19.44 months
```

Verdict: LTV:CAC of ~1.03 is far below the commonly-cited healthy
benchmark of 3:1, and a ~19.4 month payback is long for a SaaS business —
these unit economics are marginal/unhealthy, not healthy.

**Trap values** (must NOT appear as the submission's final answer):

- CAC including the brand sponsorship: `(48000+36000+12000)/60 = 1,600`
  — wrong because the sponsorship is explicitly not tied to acquiring
  accounts.
- LTV omitting gross margin: `90 * 20 = 1,800` (giving a misleadingly
  healthy ratio of 1,800/1,400 = 1.29).
- Payback on gross revenue instead of margin: `1400/90 = 15.56` months
  (understates the real payback).

### Check script

```
node -e "
const adSpend = 48000, sdr = 36000, brand = 12000, newCust = 60;
const arpa = 90, margin = 0.80, churn = 0.05;
const CAC = (adSpend + sdr) / newCust;
const lifetime = 1 / churn;
const LTV = arpa * margin * lifetime;
const ratio = LTV / CAC;
const payback = CAC / (arpa * margin);
console.log('CAC:', CAC, '(want 1400)');
console.log('LTV:', LTV, '(want 1440)');
console.log('LTV:CAC:', ratio.toFixed(3), '(want ~1.029)');
console.log('payback (months):', payback.toFixed(2), '(want ~19.44)');
console.log('trap CAC w/ brand:', (adSpend+sdr+brand)/newCust, '(1600, must not be final CAC)');
console.log('trap LTV no margin:', arpa*lifetime, '(1800, must not be final LTV)');
console.log('trap payback on revenue:', (CAC/arpa).toFixed(2), '(15.56, must not be final payback)');
"
```

Run this against a correct submission and against a deliberately broken
one (CAC=1600 from including the sponsorship) before trusting the
result — the broken version must show CAC=1600 rather than 1400.

- **obj-1**: CAC must be exactly 1,400 with the sponsorship explicitly
  excluded and reasoned about, not silently dropped.
- **obj-2**: LTV must be 1,440; 1,800 (margin omitted) is a hard fail.
- **obj-3**: accept 1.0–1.05 or a qualitative "about 1" / "roughly
  breakeven" framing.
- **obj-4**: accept 19–20 months; 15.6 (computed on revenue, not margin)
  is a hard fail.
- **obj-5**: the verdict must call the economics marginal/unhealthy —
  a verdict that calls ~1:1 "healthy" or "strong" fails regardless of
  correct arithmetic upstream. Whole-file `wc -w` for the 450-word cap.

### Subjective guidance

- **Diagnostic soundness**: does the memo correctly reason about why the
  brand sponsorship is excluded (rather than just applying a rule without
  explanation), and does it correctly connect the churn rate to customer
  lifetime?
- **Numerical presentation**: is the arithmetic shown clearly enough to
  audit each figure independently, with units (months, dollars, ratio)
  unambiguous throughout?
- **Reasoning quality**: does REASONING.md explain the choice to exclude
  the sponsorship and to apply gross margin to LTV, and does it note the
  payback-on-margin-vs-revenue distinction rather than picking one
  silently?
