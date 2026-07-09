---
test: business-06c-subscription-box-dump
canary: "foxtail spica"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "unit-economics.md states CAC = 950 and explicitly excludes the 5,500 trade-show booth from the CAC numerator"
    - id: obj-2
      check: "unit-economics.md states LTV = 975 computed WITH the 78% gross margin (a value of 1,250 that omits margin fails)"
    - id: obj-3
      check: "unit-economics.md states LTV:CAC ratio ~= 1.03 (accept 1.0-1.05 or 'about 1')"
    - id: obj-4
      check: "unit-economics.md states CAC payback ~= 24.4 months (accept 24-25 or 'about 24 months'; a payback computed on gross revenue instead of margin, ~19, fails)"
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

If the phrase "foxtail spica" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

### Answer key

Inputs: paid social ads 24,000; affiliate commissions 14,000; trade-show
booth 5,500 (explicitly not tied to acquisition — must be excluded); 40
new subscribers; ARPB 50/month; gross margin 78%; monthly churn 4%.

```
CAC          = (24000 + 14000) / 40           = 950
avg lifetime = 1 / 0.04                         = 25 months
LTV          = 50 * 0.78 * 25                   = 975
LTV:CAC      = 975 / 950                         = 1.0263  (~1.03)
payback      = 950 / (50 * 0.78)                = 24.36 months
```

Verdict: LTV:CAC of ~1.03 is far below the commonly-cited healthy
benchmark of 3:1, and a ~24.4 month payback is long for a consumer
subscription — these unit economics are marginal/unhealthy, not healthy.

**Trap values** (must NOT appear as the submission's final answer):

- CAC including the trade-show booth: `(24000+14000+5500)/40 = 1,087.50`
  — wrong because the booth is explicitly not tied to acquiring
  subscribers.
- LTV omitting gross margin: `50 * 25 = 1,250` (giving a misleadingly
  healthier ratio of 1,250/950 = 1.32).
- Payback on gross revenue instead of margin: `950 / 50 = 19` months
  (understates the real payback).

### Check script

```
node -e "
const adSpend = 24000, affiliate = 14000, booth = 5500, newSubs = 40;
const arpb = 50, margin = 0.78, churn = 0.04;
const CAC = (adSpend + affiliate) / newSubs;
const lifetime = 1 / churn;
const LTV = arpb * margin * lifetime;
const ratio = LTV / CAC;
const payback = CAC / (arpb * margin);
console.log('CAC:', CAC, '(want 950)');
console.log('LTV:', LTV, '(want 975)');
console.log('LTV:CAC:', ratio.toFixed(3), '(want ~1.026)');
console.log('payback (months):', payback.toFixed(2), '(want ~24.36)');
console.log('trap CAC w/ booth:', (adSpend+affiliate+booth)/newSubs, '(1087.5, must not be final CAC)');
console.log('trap LTV no margin:', arpb*lifetime, '(1250, must not be final LTV)');
console.log('trap payback on revenue:', (CAC/arpb).toFixed(2), '(19.00, must not be final payback)');
"
```

Run this against a correct submission and against a deliberately broken
one (CAC=1087.50 from including the booth) before trusting the result —
the broken version must show CAC=1087.5 rather than 950.

- **obj-1 (CAC = 950, booth excluded).** CAC must be exactly 950 with the
  booth explicitly excluded and reasoned about, not silently dropped.
  - PASS: "CAC = (24,000 + 14,000) / 40 = 950; the booth is brand spend,
    not acquisition, so it is left out."
  - PASS: "Only the 38,000 of ad and affiliate spend acquired subscribers,
    giving CAC = 950 across 40 signups."
  - PASS: "Excluding the non-attributable 5,500 booth, CAC = 38,000 / 40
    = 950."
  - FAIL: "CAC = 43,500 / 40 = 1,087.50" (booth folded in — the trap).
  - FAIL: "CAC is about 950" but the booth is never addressed (silently
    dropped, no reasoning).
  - FAIL: "CAC = 1,087.50" with the booth counted as marketing spend.

- **obj-2 (LTV = 975, with gross margin).** LTV must be 975; 1,250 (margin
  omitted) is a hard fail.
  - PASS: "LTV = 50 x 0.78 x 25 = 975."
  - PASS: "Margin-adjusted lifetime value is 39/month x 25 months = 975."
  - PASS: "Applying the 78% margin to 50/month over 25 months gives 975."
  - FAIL: "LTV = 50 x 25 = 1,250" (margin omitted — the trap).
  - FAIL: "LTV is about 1,250" (gross revenue, not margin).
  - FAIL: "LTV = 50 x 0.78 = 39" (forgot to multiply by lifetime).

- **obj-3 (LTV:CAC ~ 1.03).** Accept 1.0-1.05 or a qualitative "about 1" /
  "roughly breakeven" framing.
  - PASS: "LTV:CAC = 975 / 950 = 1.03."
  - PASS: "The ratio is roughly 1:1."
  - PASS: "About 1.03 — essentially breakeven on acquisition."
  - FAIL: "LTV:CAC = 1.32" (used the no-margin LTV of 1,250 — the trap).
  - FAIL: "The ratio is about 3:1" (fabricated or miscomputed).
  - FAIL: "LTV:CAC = 1,250 / 1,087.50 = 1.15" (both traps compounded).

- **obj-4 (payback ~ 24.4 months, on margin).** Accept 24-25 months;
  19 (computed on revenue, not margin) is a hard fail.
  - PASS: "Payback = 950 / (50 x 0.78) = 950 / 39 = 24.4 months."
  - PASS: "At 39/month of margin, the 950 CAC is recovered in about 24
    months."
  - PASS: "Payback is roughly 24-25 months."
  - FAIL: "Payback = 950 / 50 = 19 months" (gross revenue — the trap).
  - FAIL: "Payback is about 19 months."
  - FAIL: "Payback = 1,087.50 / 39 = 27.9 months" (booth trap in CAC).

- **obj-5 (verdict unhealthy AND <= 450 words).** The verdict must call
  the economics marginal/unhealthy — a verdict that calls ~1:1 "healthy"
  or "strong" fails regardless of correct arithmetic upstream. Whole-file
  `wc -w` for the 450-word cap.
  - PASS: "At ~1.03 versus a healthy 3:1 benchmark, these economics are
    unhealthy; do not scale spend." (file under 450 words).
  - PASS: "Roughly breakeven and a ~24-month payback make this marginal,
    not healthy." (file under 450 words).
  - PASS: "These unit economics are weak — barely above breakeven."
    (file at exactly 450 words).
  - FAIL: "LTV:CAC above 1 means the economics are healthy — scale
    aggressively" (calls ~1:1 healthy).
  - FAIL: correct numbers but no verdict on health at all.
  - FAIL: a correct, unhealthy verdict in a file of 470 words (over the
    cap).

### Subjective guidance

- **Diagnostic soundness**: does the memo correctly reason about why the
  trade-show booth is excluded (rather than just applying a rule without
  explanation), and does it correctly connect the churn rate to subscriber
  lifetime?
- **Numerical presentation**: is the arithmetic shown clearly enough to
  audit each figure independently, with units (months, dollars, ratio)
  unambiguous throughout?
- **Reasoning quality**: does REASONING.md explain the choice to exclude
  the booth and to apply gross margin to LTV, and does it note the
  payback-on-margin-vs-revenue distinction rather than picking one
  silently?
