---
test: business-06b-subscription-cohort-dump
canary: "nigella fomalhaut"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "unit-economics.md states CAC = 1,080 and explicitly excludes the 8,000 packaging rebrand from the CAC numerator"
    - id: obj-2
      check: "unit-economics.md states LTV = 1,091 (accept 1,090-1,091 or ~1,091) computed WITH the 75% gross margin (a value of ~1,455 that omits margin fails)"
    - id: obj-3
      check: "unit-economics.md states LTV:CAC ratio ~= 1.01 (accept 1.0-1.05 or 'about 1')"
    - id: obj-4
      check: "unit-economics.md states CAC payback = 18 months (accept 18-18.2 or 'about 18 months'; a payback computed on gross revenue instead of margin, ~13.5, fails)"
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
anchors:
  - id: Diagnostic soundness
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

Parallel form of `business-06-unit-economics-dump` (same construct, fresh
surface).

If the phrase "nigella fomalhaut" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Every figure below is exact given the embedded dump.

### Answer key

Inputs: paid acquisition 30,000; referral commissions 24,000; packaging
rebrand 8,000 (explicitly not tied to acquisition — must be excluded); 50
new subscribers; ARPA 80/month; gross margin 75%; monthly churn 5.5%.

```
CAC          = (30000 + 24000) / 50            = 1,080
avg lifetime = 1 / 0.055                        = 18.18 months
LTV          = 80 * 0.75 * 18.18               = 1,091  (exact 1090.91)
LTV:CAC      = 1091 / 1080                       = 1.0101 (~1.01)
payback      = 1080 / (80 * 0.75)               = 18.0 months
```

Verdict: LTV:CAC of ~1.01 is far below the commonly-cited healthy
benchmark of 3:1, and an ~18 month margin payback is long for a
subscription business — these unit economics are marginal/unhealthy, not
healthy.

**Trap values** (must NOT appear as the submission's final answer):

- CAC including the packaging rebrand: `(30000+24000+8000)/50 = 1,240`
  — wrong because the rebrand is explicitly not tied to acquiring
  subscribers.
- LTV omitting gross margin: `80 * 18.18 = 1,455` (giving a misleadingly
  healthy ratio of 1,455/1,080 = 1.35).
- Payback on gross revenue instead of margin: `1080/80 = 13.5` months
  (understates the real payback).

### Check script

```
node -e "
const paidAcq = 30000, referral = 24000, rebrand = 8000, newSubs = 50;
const arpa = 80, margin = 0.75, churn = 0.055;
const CAC = (paidAcq + referral) / newSubs;
const lifetime = 1 / churn;
const LTV = arpa * margin * lifetime;
const ratio = LTV / CAC;
const payback = CAC / (arpa * margin);
console.log('CAC:', CAC, '(want 1080)');
console.log('LTV:', LTV.toFixed(2), '(want ~1091)');
console.log('LTV:CAC:', ratio.toFixed(3), '(want ~1.010)');
console.log('payback (months):', payback.toFixed(2), '(want 18.00)');
console.log('trap CAC w/ rebrand:', (paidAcq+referral+rebrand)/newSubs, '(1240, must not be final CAC)');
console.log('trap LTV no margin:', (arpa*lifetime).toFixed(2), '(1454.55, must not be final LTV)');
console.log('trap payback on revenue:', (CAC/arpa).toFixed(2), '(13.50, must not be final payback)');
"
```

Run this against a correct submission and against a deliberately broken
one (CAC=1240 from including the rebrand) before trusting the result —
the broken version must show CAC=1240 rather than 1080.

- **obj-1**: CAC must be exactly 1,080 with the rebrand explicitly
  excluded and reasoned about, not silently dropped.
  - PASS: "CAC = (30,000 + 24,000) / 50 = 1,080; the 8,000 rebrand is
    excluded because it drove no signups."
  - PASS: "Excluding the packaging rebrand (not an acquisition cost),
    CAC = 54,000 / 50 = 1,080 per subscriber."
  - PASS: "The rebrand is a production cost, not acquisition spend, so
    CAC = 1,080."
  - FAIL: "CAC = (30,000 + 24,000 + 8,000) / 50 = 1,240."
  - FAIL: "CAC = 1,080" with no mention of the rebrand at all (silently
    dropped, not reasoned).
  - FAIL: "All quarterly spend is acquisition, so CAC = 1,240."
- **obj-2**: LTV must be ~1,091 (1090.91); 1,455 (margin omitted) is a
  hard fail.
  - PASS: "LTV = 80 x 0.75 x 18.18 = 1,091 (margin dollars)."
  - PASS: "Lifetime 18.18 months x 60 margin dollars/month = ~1,091."
  - PASS: "LTV ~= 1,090 using the 75% gross margin."
  - FAIL: "LTV = 80 x 18.18 = 1,455."
  - FAIL: "LTV = 1,455 (revenue over the subscriber's life)."
  - FAIL: "LTV = 80 x 0.75 x 20 = 1,200" (wrong lifetime, ignores 5.5%).
- **obj-3**: accept 1.0-1.05 or a qualitative "about 1" / "roughly
  breakeven" framing.
  - PASS: "LTV:CAC = 1,091 / 1,080 = 1.01."
  - PASS: "The ratio is about 1:1 — essentially breakeven."
  - PASS: "LTV:CAC ~= 1.0."
  - FAIL: "LTV:CAC = 1.35" (from the no-margin LTV).
  - FAIL: "LTV:CAC = 1.17" (from a rebrand-inflated CAC and no-margin LTV).
  - FAIL: "LTV:CAC = 3.0" or any framing that lands near the 3:1 benchmark.
- **obj-4**: accept 18-18.2 months; 13.5 (computed on revenue, not
  margin) is a hard fail.
  - PASS: "Payback = 1,080 / (80 x 0.75) = 1,080 / 60 = 18.0 months."
  - PASS: "At 60 margin dollars/month, payback = 18 months."
  - PASS: "CAC payback is about 18 months."
  - FAIL: "Payback = 1,080 / 80 = 13.5 months."
  - FAIL: "Payback ~= 13.5 months" (revenue-based).
  - FAIL: "Payback = 1,240 / 60 = 20.7 months" (rebrand-inflated CAC).
- **obj-5**: the verdict must call the economics marginal/unhealthy —
  a verdict that calls ~1:1 "healthy" or "strong" fails regardless of
  correct arithmetic upstream. Whole-file `wc -w` for the 450-word cap.
  - PASS: "At ~1:1, well below the 3:1 benchmark, these unit economics
    are unhealthy."
  - PASS: "The model is marginal — barely breakeven with an 18-month
    payback; not healthy."
  - PASS: "These economics do not yet support scaling; the ratio is far
    below 3:1."
  - FAIL: "With LTV:CAC above 1, the economics are healthy."
  - FAIL: "The business is in a strong position to scale acquisition."
  - FAIL: A verdict paragraph that omits any health judgment entirely.

### Subjective guidance

- **Diagnostic soundness**: does the memo correctly reason about why the
  packaging rebrand is excluded (rather than just applying a rule without
  explanation), and does it correctly connect the churn rate to
  subscriber lifetime?
- **Numerical presentation**: is the arithmetic shown clearly enough to
  audit each figure independently, with units (months, dollars, ratio)
  unambiguous throughout?
- **Reasoning quality**: does REASONING.md explain the choice to exclude
  the rebrand and to apply gross margin to LTV, and does it note the
  payback-on-margin-vs-revenue distinction rather than picking one
  silently?
