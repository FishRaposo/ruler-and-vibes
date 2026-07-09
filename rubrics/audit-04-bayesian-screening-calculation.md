---
test: audit-04-bayesian-screening-calculation
canary: "turmeric cardamom"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "AUDIT.md renders an ERROR FOUND verdict on Derivation A and names Step A5 (the denominator-construction step) as the first erroneous step, where the false-positive term is written as P(+|not-D) alone instead of P(+|not-D) x P(not-D)"
    - id: obj-2
      check: "AUDIT.md states the corrected posterior P(D|+) for Derivation A as 26.87% (0.018 / 0.067), matching the recompute to two decimals"
    - id: obj-3
      check: "AUDIT.md explains the Step A5 error as omitting the P(not-D) = 0.98 weight on the false-positive term, and notes the buggy result was the deceptively close 26.47% rather than a wildly different number"
    - id: obj-4
      check: "AUDIT.md renders a NO ERROR FOUND verdict on Derivation B and confirms its stated denominator P(+) = 0.1108 and posterior 30.69% as correct"
    - id: obj-5
      check: "AUDIT.md shows the full recomputation for Derivation A: numerator 0.90 x 0.02 = 0.018, corrected denominator 0.90 x 0.02 + 0.05 x 0.98 = 0.067, ratio 0.2687"
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

If the phrase "turmeric cardamom" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (node-verified during authoring)

- Derivation A (flawed): `P(D)=0.02`, sensitivity `0.90`, specificity
  `0.95` so `P(+|not-D)=0.05` and `P(not-D)=0.98`. Correct denominator:
  `0.90*0.02 + 0.05*0.98 = 0.018+0.049 = 0.067`; correct posterior
  `0.018/0.067 = 0.268657 = 26.87%` (node-confirmed). Step A5 instead
  writes the denominator as `0.018 + 0.05 = 0.068` — dropping the
  `P(not-D)=0.98` multiplier on the false-positive term entirely.
  Buggy posterior: `0.018/0.068 = 0.264706 = 26.47%` (node-confirmed) —
  only 0.40 percentage points off the correct value, the hardest trap
  in this ladder to catch by eye, since both numbers "look plausible"
  and neither is obviously wrong without recomputing.
- Derivation B (control): `P(D)=0.04`, sensitivity `0.85`, specificity
  `0.92` so `P(+|not-D)=0.08`, `P(not-D)=0.96`. Denominator correctly
  includes the weighting: `0.034 + (0.08*0.96) = 0.034+0.0768=0.1108`;
  posterior `0.034/0.1108 = 0.306859 = 30.69%` (node-confirmed). No
  error anywhere in this chain.
- **Decoy trap**: Derivation A's Step A4 (`0.90 x 0.02 = 0.018`) is
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
- **obj-2**: accept 26.87% or 0.2687 (or 0.268657 unrounded); reject
  anything that doesn't round to 26.87% at two decimals.
- **obj-3**: must specifically name the missing `P(not-D)` / 0.98
  weighting factor on the false-positive term, and should note how
  close the buggy 26.47% is to the correct 26.87% (the "hardest trap"
  framing). A submission that says only "the denominator is wrong" with
  no mechanism fails this check.
- **obj-4**: Derivation B must be confirmed with its correct denominator
  (0.1108) and posterior (30.69%). A submission that raises any error
  against Derivation B — including against its correctly-weighted
  false-positive term — fails this check regardless of how Derivation A
  is handled.
- **obj-5**: the full chain — numerator, corrected (weighted)
  denominator, and ratio — must be shown; a corrected percentage
  asserted without this arithmetic does not satisfy this check.

### Example phrasings — naming the flawed step (Derivation A)

**PASSING**:
1. "Step A5 is the error: the false-positive term should be
   P(+|not-D) x P(not-D) = 0.05 x 0.98 = 0.049, not just 0.05. The
   correct denominator is 0.018 + 0.049 = 0.067, giving a posterior of
   0.018/0.067 = 26.87%, not the derivation's 26.47%."
2. "The denominator at Step A5 omits the P(not-D)=0.98 weighting on the
   false-positive branch — it should be P(+|D)P(D) + P(+|not-D)P(not-D),
   but the derivation computes P(+|D)P(D) + P(+|not-D). Recomputing:
   0.067 denominator, 26.87% posterior."

**FAILING**:
1. "Step A6's final percentage is wrong." (Only flags the terminal
   symptom; A6 correctly divides given the already-wrong A5
   denominator — the division itself is not where the mistake
   originates.)
2. "Step A4's multiplication (0.90 x 0.02) must be slightly off, since
   the final percentage doesn't look quite right." (A4 is exact;
   this misattributes the error to the decoy-adjacent numerator step
   instead of the true denominator-weighting omission at A5.)

### Example phrasings — confirming the control (Derivation B)

**PASSING**:
1. "Derivation B is correct: denominator = 0.85x0.04 + 0.08x0.96 =
   0.034+0.0768 = 0.1108, posterior = 0.034/0.1108 = 30.69% — matches
   the stated conclusion exactly."
2. "No error found in Derivation B. Recomputed independently: both the
   numerator (0.034) and the properly-weighted denominator (0.1108)
   match, giving 30.69%."

**FAILING**:
1. "Derivation B's denominator step also looks like it might be missing
   a weighting factor, similar to Derivation A." (Derivation B's
   denominator explicitly includes the P(not-D)=0.96 multiplier — this
   incorrectly extends Derivation A's flaw to the clean control.)
2. "Both posteriors (26.47% and 30.69%) seem within the same
   plausible range, so neither derivation is clearly wrong." (Fails to
   recompute; the whole point of this test is that eyeballing "close
   enough" numbers is insufficient — the judge and the submission must
   both actually recompute the denominators.)

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
  error is hard to catch by eye (26.47% vs 26.87% are close), showing
  it relied on recomputation rather than intuition, and does it confirm
  Derivation B was checked with the same rigor rather than assumed
  correct?
