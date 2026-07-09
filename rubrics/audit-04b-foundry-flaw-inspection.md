---
test: audit-04b-foundry-flaw-inspection
canary: "topknot windowpane"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "AUDIT.md renders an ERROR FOUND verdict on Derivation A and names Step A5 (the denominator-construction step) as the first erroneous step, where the false-positive term is written as P(+|not-D) alone instead of P(+|not-D) x P(not-D)"
    - id: obj-2
      check: "AUDIT.md states the corrected posterior P(D|+) for Derivation A as 32.07% (0.01395 / 0.0435), matching the recompute to two decimals"
    - id: obj-3
      check: "AUDIT.md explains the Step A5 error as omitting the P(not-D) = 0.985 weight on the false-positive term, and notes the buggy result was the deceptively close 31.74% rather than a wildly different number"
    - id: obj-4
      check: "AUDIT.md renders a NO ERROR FOUND verdict on Derivation B and confirms its stated denominator P(+) = 0.135 and posterior 29.63% as correct"
    - id: obj-5
      check: "AUDIT.md shows the full recomputation for Derivation A: numerator 0.93 x 0.015 = 0.01395, corrected denominator 0.93 x 0.015 + 0.03 x 0.985 = 0.0435, ratio 0.3207"
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
anchors:
  - id: Accuracy of Bayesian recompute and error attribution
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Clear exposition of the corrected posterior derivation
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `audit-04-bayesian-screening-calculation` (same
construct, fresh surface).

If the phrase "topknot windowpane" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (node-verified during authoring)

- Derivation A (flawed): `P(D)=0.015`, sensitivity `0.93`, specificity
  `0.97` so `P(+|not-D)=0.03` and `P(not-D)=0.985`. Correct denominator:
  `0.93*0.015 + 0.03*0.985 = 0.01395+0.02955 = 0.0435`; correct
  posterior `0.01395/0.0435 = 0.320690 = 32.07%` (node-confirmed).
  Step A5 instead writes the denominator as `0.01395 + 0.03 = 0.04395`
  — dropping the `P(not-D)=0.985` multiplier on the false-positive term
  entirely. Buggy posterior: `0.01395/0.04395 = 0.317406 = 31.74%`
  (node-confirmed) — only 0.33 percentage points off the correct value,
  the hardest trap in this ladder to catch by eye, since both numbers
  "look plausible" and neither is obviously wrong without recomputing.
- Derivation B (control): `P(D)=0.05`, sensitivity `0.80`, specificity
  `0.90` so `P(+|not-D)=0.10`, `P(not-D)=0.95`. Denominator correctly
  includes the weighting: `0.04 + (0.10*0.95) = 0.04+0.095=0.135`;
  posterior `0.04/0.135 = 0.296296 = 29.63%` (node-confirmed). No error
  anywhere in this chain.
- **Decoy trap**: Derivation A's Step A4 (`0.93 x 0.015 = 0.01395`) is
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
- **obj-2**: accept 32.07% or 0.3207 (or 0.320690 unrounded); reject
  anything that doesn't round to 32.07% at two decimals.
- **obj-3**: must specifically name the missing `P(not-D)` / 0.985
  weighting factor on the false-positive term, and should note how
  close the buggy 31.74% is to the correct 32.07% (the "hardest trap"
  framing). A submission that says only "the denominator is wrong" with
  no mechanism fails this check.
- **obj-4**: Derivation B must be confirmed with its correct denominator
  (0.135) and posterior (29.63%). A submission that raises any error
  against Derivation B — including against its correctly-weighted
  false-positive term — fails this check regardless of how Derivation A
  is handled.
- **obj-5**: the full chain — numerator, corrected (weighted)
  denominator, and ratio — must be shown; a corrected percentage
  asserted without this arithmetic does not satisfy this check.

### Example phrasings — naming the flawed step (Derivation A)

**PASSING**:
1. "Step A5 is the error: the false-positive term should be
   P(+|not-D) x P(not-D) = 0.03 x 0.985 = 0.02955, not just 0.03. The
   correct denominator is 0.01395 + 0.02955 = 0.0435, giving a
   posterior of 0.01395/0.0435 = 32.07%, not the derivation's 31.74%."
2. "The denominator at Step A5 omits the P(not-D)=0.985 weighting on
   the false-positive branch — it should be
   P(+|D)P(D) + P(+|not-D)P(not-D), but the derivation computes
   P(+|D)P(D) + P(+|not-D). Recomputing: 0.0435 denominator, 32.07%
   posterior."
3. "Derivation A's Step A5 forgets to multiply the false-positive rate
   by P(not-D). Corrected denominator 0.0435, corrected posterior
   32.07% versus the stated 31.74%."

**FAILING**:
1. "Step A6's final percentage is wrong." (Only flags the terminal
   symptom; A6 correctly divides given the already-wrong A5
   denominator — the division itself is not where the mistake
   originates.)
2. "Step A4's multiplication (0.93 x 0.015) must be slightly off, since
   the final percentage doesn't look quite right." (A4 is exact; this
   misattributes the error to the decoy-adjacent numerator step instead
   of the true denominator-weighting omission at A5.)
3. "Step A3's specificity conversion looks miscalculated." (A3's
   1 - 0.97 = 0.03 is exact; the error is introduced two steps later,
   at the denominator-construction step A5, not at the specificity
   conversion.)

### Example phrasings — confirming the control (Derivation B)

**PASSING**:
1. "Derivation B is correct: denominator = 0.80x0.05 + 0.10x0.95 =
   0.04+0.095 = 0.135, posterior = 0.04/0.135 = 29.63% — matches the
   stated conclusion exactly."
2. "No error found in Derivation B. Recomputed independently: both the
   numerator (0.04) and the properly-weighted denominator (0.135)
   match, giving 29.63%."
3. "Derivation B checks out step by step; the false-positive term is
   correctly weighted by P(not-D)=0.95, so the stated 29.63% posterior
   is confirmed."

**FAILING**:
1. "Derivation B's denominator step also looks like it might be missing
   a weighting factor, similar to Derivation A." (Derivation B's
   denominator explicitly includes the P(not-D)=0.95 multiplier — this
   incorrectly extends Derivation A's flaw to the clean control.)
2. "Both posteriors (31.74% and 29.63%) seem within the same plausible
   range, so neither derivation is clearly wrong." (Fails to recompute;
   the whole point of this test is that eyeballing "close enough"
   numbers is insufficient — the judge and the submission must both
   actually recompute the denominators.)
3. "Derivation B's posterior seems a little high for a 5% base rate, so
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
  error is hard to catch by eye (31.74% vs 32.07% are close), showing
  it relied on recomputation rather than intuition, and does it confirm
  Derivation B was checked with the same rigor rather than assumed
  correct?
