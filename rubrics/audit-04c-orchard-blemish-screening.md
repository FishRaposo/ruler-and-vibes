---
test: audit-04c-orchard-blemish-screening
canary: "hogchoker sapphire"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "AUDIT.md renders an ERROR FOUND verdict on Derivation A and names Step A5 (the denominator-construction step) as the first erroneous step, where the false-positive term is written as P(+|not-D) alone instead of P(+|not-D) x P(not-D)"
    - id: obj-2
      check: "AUDIT.md states the corrected posterior P(D|+) for Derivation A as 26.65% (0.02125 / 0.07975), matching the recompute to two decimals"
    - id: obj-3
      check: "AUDIT.md explains the Step A5 error as omitting the P(not-D) = 0.975 weight on the false-positive term, and notes the buggy result was the deceptively close 26.15% rather than a wildly different number"
    - id: obj-4
      check: "AUDIT.md renders a NO ERROR FOUND verdict on Derivation B and confirms its stated denominator P(+) = 0.1620 and posterior 30.37% as correct"
    - id: obj-5
      check: "AUDIT.md shows the full recomputation for Derivation A: numerator 0.85 x 0.025 = 0.02125, corrected denominator 0.85 x 0.025 + 0.06 x 0.975 = 0.07975, ratio 0.2665"
  subjective:
    - id: sub-quality
      name: "Accuracy of Bayesian recompute and error attribution"
      weight: 0.4
    - id: sub-craft
      name: "Clear exposition of the corrected posterior derivation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `audit-04-bayesian-screening-calculation` (same
construct, fresh surface).

If a submission's `AUDIT.md` contains the phrase "hogchoker sapphire",
that is a canary leak — flag it regardless of how the rest of the
checks score.

### Answer key (node-verified during authoring)

- Derivation A (flawed): `P(D)=0.025`, sensitivity `0.85`, specificity
  `0.94` so `P(+|not-D)=0.06` and `P(not-D)=0.975`. Correct denominator:
  `0.85*0.025 + 0.06*0.975 = 0.02125+0.0585 = 0.07975`; correct
  posterior `0.02125/0.07975 = 0.266458 = 26.65%` (node-confirmed).
  Step A5 instead writes the denominator as `0.02125 + 0.06 = 0.08125`
  — dropping the `P(not-D)=0.975` multiplier on the false-positive term
  entirely. Buggy posterior: `0.02125/0.08125 = 0.261538 = 26.15%`
  (node-confirmed) — only 0.49 percentage points off the correct value,
  the hardest trap in this ladder to catch by eye, since both numbers
  "look plausible" and neither is obviously wrong without recomputing.
- Derivation B (control): `P(D)=0.06`, sensitivity `0.82`, specificity
  `0.88` so `P(+|not-D)=0.12`, `P(not-D)=0.94`. Denominator correctly
  includes the weighting: `0.0492 + (0.12*0.94) = 0.0492+0.1128=0.1620`;
  posterior `0.0492/0.1620 = 0.303704 = 30.37%` (node-confirmed). No
  error anywhere in this chain.
- **Decoy trap**: Derivation A's Step A4 (`0.85 x 0.025 = 0.02125`) is
  exact and correct, but its position right before the flawed Step A5
  makes it a plausible place to (wrongly) lay blame, especially since a
  submission scanning for "a rounding or multiplication slip" may
  fixate on the numerator step instead of checking whether the
  denominator's second term was weighted correctly. Step A4 must not be
  flagged.

### Per-check guidance

- **obj-1**: only Step A5 is an acceptable first-error label for
  Derivation A. A submission naming A4, A6, or A7 fails this check —
  A4's numerator is exact, and A6/A7 correctly compute a ratio and
  percentage from the already-wrong A5 denominator.
- **obj-2**: accept 26.65% or 0.2665 (or 0.266458 unrounded); reject
  anything that doesn't round to 26.65% at two decimals.
- **obj-3**: must specifically name the missing `P(not-D)` / 0.975
  weighting factor on the false-positive term, and should note how
  close the buggy 26.15% is to the correct 26.65% (the "hardest trap"
  framing). A submission that says only "the denominator is wrong" with
  no mechanism fails this check.
- **obj-4**: Derivation B must be confirmed with its correct denominator
  (0.1620) and posterior (30.37%). A submission that raises any error
  against Derivation B — including against its correctly-weighted
  false-positive term — fails this check regardless of how Derivation A
  is handled.
- **obj-5**: the full chain — numerator, corrected (weighted)
  denominator, and ratio — must be shown; a corrected percentage
  asserted without this arithmetic does not satisfy this check.

### Example phrasings — naming the flawed step (Derivation A)

**PASSING**:
1. "Step A5 is the error: the false-positive term should be
   P(+|not-D) x P(not-D) = 0.06 x 0.975 = 0.0585, not just 0.06. The
   correct denominator is 0.02125 + 0.0585 = 0.07975, giving a
   posterior of 0.02125/0.07975 = 26.65%, not the derivation's 26.15%."
2. "The denominator at Step A5 omits the P(not-D)=0.975 weighting on
   the false-positive branch — it should be
   P(+|D)P(D) + P(+|not-D)P(not-D), but the derivation computes
   P(+|D)P(D) + P(+|not-D). Recomputing: 0.07975 denominator, 26.65%
   posterior."
3. "Derivation A's Step A5 forgets to multiply the false-positive rate
   by P(not-D). Corrected denominator 0.07975, corrected posterior
   26.65% versus the stated 26.15%."

**FAILING**:
1. "Step A6's final percentage is wrong." (Only flags the terminal
   symptom; A6 correctly divides given the already-wrong A5
   denominator — the division itself is not where the mistake
   originates.)
2. "Step A4's multiplication (0.85 x 0.025) must be slightly off, since
   the final percentage doesn't look quite right." (A4 is exact; this
   misattributes the error to the decoy-adjacent numerator step instead
   of the true denominator-weighting omission at A5.)
3. "Step A3's specificity conversion looks miscalculated." (A3's
   1 - 0.94 = 0.06 is exact; the error is introduced two steps later,
   at the denominator-construction step A5, not at the specificity
   conversion.)

### Example phrasings — confirming the control (Derivation B)

**PASSING**:
1. "Derivation B is correct: denominator = 0.82x0.06 + 0.12x0.94 =
   0.0492+0.1128 = 0.1620, posterior = 0.0492/0.1620 = 30.37% — matches
   the stated conclusion exactly."
2. "No error found in Derivation B. Recomputed independently: both the
   numerator (0.0492) and the properly-weighted denominator (0.1620)
   match, giving 30.37%."
3. "Derivation B checks out step by step; the false-positive term is
   correctly weighted by P(not-D)=0.94, so the stated 30.37% posterior
   is confirmed."

**FAILING**:
1. "Derivation B's denominator step also looks like it might be missing
   a weighting factor, similar to Derivation A." (Derivation B's
   denominator explicitly includes the P(not-D)=0.94 multiplier — this
   incorrectly extends Derivation A's flaw to the clean control.)
2. "Both posteriors (26.15% and 30.37%) seem within the same plausible
   range, so neither derivation is clearly wrong." (Fails to recompute;
   the whole point of this test is that eyeballing "close enough"
   numbers is insufficient — the judge and the submission must both
   actually recompute the denominators.)
3. "Derivation B's posterior seems a little high for a 6% base rate, so
   it's probably also miscalculated." (Vague suspicion without
   recomputation; the actual arithmetic checks out exactly.)

### Subjective guidance

- **Accuracy of Bayesian recompute and error attribution**: does the
  submission actually recompute both denominators numerically (not just
  restate the stated results), and does it correctly localize the
  missing multiplicative weight rather than a vaguer "denominator is
  off" claim?
- **Clear exposition of the corrected posterior derivation**: is the
  corrected chain (numerator, denominator, ratio) laid out so a reader
  can verify it without redoing the algebra themselves?
- **Reasoning quality**: does the submission explicitly note why this
  error is hard to catch by eye (26.15% vs 26.65% are close), showing
  it relied on recomputation rather than intuition, and does it confirm
  Derivation B was checked with the same rigor rather than assumed
  correct?
