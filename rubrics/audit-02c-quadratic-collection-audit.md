---
test: audit-02c-quadratic-collection-audit
canary: "batfish flatfish"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "AUDIT.md renders an ERROR FOUND verdict on Derivation P and names Step P4 (the like-term collection step) as the first erroneous step, not Step P3 (the term relocation) or a later step such as P5/P6"
    - id: obj-2
      check: "AUDIT.md gives the corrected standard form for Derivation P as 2x^2 - 19x + 14 = 0 (discriminant 249) and corrected roots of approximately 8.69 and 0.81 (to at least 2 decimal places)"
    - id: obj-3
      check: "AUDIT.md explains the Step P4 error as combining -12x and -7x incorrectly (yielding -5x instead of -19x), and notes that the buggy standard form 2x^2 - 5x + 14 = 0 produces a negative discriminant (-87) that spuriously suggests no real roots"
    - id: obj-4
      check: "AUDIT.md renders a NO ERROR FOUND verdict on Derivation Q and confirms its roots as 5/3 (or approximately 1.67) and -3 (from standard form 3x^2 + 4x - 15 = 0)"
    - id: obj-5
      check: "AUDIT.md shows the re-expansion 2(x-3)^2 = 2x^2 - 12x + 18 and the correct combination -12x - 7x = -19x that pins the corrected standard form"
  subjective:
    - id: sub-quality
      name: "Correctness of algebraic re-derivation and root recovery"
      weight: 0.4
    - id: sub-craft
      name: "Structured, step-referenced presentation of the audit"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `audit-02-quadratic-rearrangement-derivation` (same construct, fresh surface).

If the phrase "batfish flatfish" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest of the checks score.

### Answer key (node-verified during authoring)

- Derivation P (flawed), starting `2(x-3)^2 = 7x+4`: expansion
  `2x^2-12x+18 = 7x+4` is correct (Steps P1-P2). Step P3's relocation
  `2x^2-12x-7x+18-4=0` is also algebraically valid. The error is
  planted at **Step P4**, where `-12x-7x` is collected as `-5x` instead
  of the correct `-19x` (a sign/collection error, treating the moved
  `-7x` as if it were `+7x` during collection, i.e. `-12x+7x=-5x`).
  Correct standard form: `2x^2-19x+14=0`, discriminant `361-112=249`,
  roots `(19±sqrt249)/4 = 8.6949, 0.8051` (node-confirmed). The buggy
  standard form `2x^2-5x+14=0` gives discriminant `25-112=-87`,
  spuriously concluding "no real roots" — a seductive trap because the
  buggy chain reaches a clean, confident-sounding conclusion.
- Derivation Q (control), starting `3(x+1)^2 = 2x+18`: expansion
  `3x^2+6x+3=2x+18`, relocation `3x^2+6x-2x+3-18=0`, collection
  `3x^2+4x-15=0`, discriminant `16+180=196`, roots `5/3` and `-3`
  (node-confirmed; also factorable as `(3x-5)(x+3)`). No error anywhere.
- **Decoy trap**: Step P3 (moving `7x+4` across the equals sign) is the
  step most likely to be flagged by pattern-matching on "sign errors
  happen when moving terms across the equals sign" — but P3's relocation
  is done correctly (`+18-4` and `-12x-7x` are the right terms to have
  produced, they are simply not yet *combined*). The actual bug is one
  step later, in the collection arithmetic at P4. A submission that
  flags P3 instead of P4 has been caught by the decoy.

### Per-check guidance

- **obj-1**: only Step P4 is acceptable as the first-error label. A
  submission naming P3 (the relocation, which is correct) or P5/P6
  (which correctly compute a discriminant from the already-wrong
  standard form) fails this check.
- **obj-2**: roots must be given to at least 2 decimal places (8.69 and
  0.81, or equivalently the exact form `(19±sqrt249)/4`); accept minor
  rounding (e.g. 8.69 or 8.695) but reject roots that don't match to
  within 0.01.
- **obj-3**: the explanation must identify the specific miscombination
  (-12x-7x should be -19x, not -5x) and should note the buggy
  discriminant is negative. A submission that only says "the algebra is
  wrong somewhere in the middle" without pinning the -5x vs -19x
  distinction fails this check.
- **obj-4**: Derivation Q must be confirmed with its correct roots
  (5/3, -3). A submission that raises any error against Derivation Q —
  including against its structurally similar relocation step Q3 — fails
  this check regardless of how Derivation P is handled.
- **obj-5**: the re-expansion and the specific -19x recombination must
  both be shown; a corrected standard form asserted without this
  arithmetic does not satisfy this check.

### Example phrasings — naming the flawed step (Derivation P)

**PASSING**:
1. "Step P4 is the first error: combining -12x and -7x gives -19x, not
   -5x. The correct standard form is 2x^2-19x+14=0 (discriminant 249,
   roots ≈8.69 and 0.81), not the negative-discriminant form the
   derivation reaches."
2. "The mistake is in Step P4's like-term collection. -12x - 7x = -19x,
   but the derivation writes -5x, as if it had added +7x instead of
   subtracting it. This flips the sign of b and produces a spurious
   'no real roots' conclusion."
3. "Derivation P goes wrong at Step P4, not at the relocation in Step
   P3: -12x-7x must equal -19x, and the correct discriminant is
   249, giving real roots near 8.69 and 0.81."

**FAILING**:
1. "Step P3 is wrong — moving 7x+4 to the other side must have
   introduced a sign error." (P3's relocation is actually correct; this
   flags the decoy step instead of the true collection error at P4.)
2. "Step P6's conclusion that there are no real roots is the error."
   (Names only the terminal symptom; P6 correctly computes a negative
   discriminant from the already-wrong Step P4 coefficients — the
   discriminant step itself is not where the mistake originates.)
3. "Somewhere in the middle the algebra breaks down and the final
   answer is wrong." (No step is pinned down and no corrected
   coefficients or roots are given.)

### Example phrasings — confirming the control (Derivation Q)

**PASSING**:
1. "Derivation Q is correct: expanding gives 3x^2+4x-15=0, discriminant
   196, roots 5/3 and -3 — confirmed by re-expansion and by factoring as
   (3x-5)(x+3)."
2. "No error found in Derivation Q; independently re-deriving from
   3(x+1)^2=2x+18 reproduces 3x^2+4x-15=0 and the stated roots exactly."
3. "Derivation Q checks out at every step, including the relocation in
   Step Q3, and the final roots 1.67 and -3 match a fresh re-derivation."

**FAILING**:
1. "Derivation Q's Step Q3 relocation might hide the same kind of sign
   error as Derivation P, so it should be treated with suspicion." (No
   concrete error is identified; this hedges against the clean control
   based on surface similarity to the flawed derivation's structure.)
2. "Both derivations have the same class of collection error." (Derivation
   Q's Step Q4 collection, `6x-2x=4x`, is correct — incorrectly extends
   the flaw found in P to the clean control.)
3. "Derivation Q is probably fine but the roots should be double-checked
   later." (Hedges instead of confirming; no independent re-derivation is
   shown.)

### Subjective guidance

- **Correctness of algebraic re-derivation and root recovery**: does
  the submission independently re-expand and re-collect terms rather
  than assert a corrected form, and are the recovered roots numerically
  accurate?
- **Structured, step-referenced presentation of the audit**: is each
  verdict tied to a specific, correctly identified step label, with the
  corrected chain clearly separated from the original flawed chain?
- **Reasoning quality**: does the submission explain *why* Step P3 is a
  tempting-but-wrong place to lay blame, demonstrating it checked the
  collection arithmetic specifically rather than pattern-matching on
  "term relocation is where sign errors usually happen"?
