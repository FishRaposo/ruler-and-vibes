---
test: audit-02-quadratic-rearrangement-derivation
canary: "feldspar mica"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "AUDIT.md renders an ERROR FOUND verdict on Derivation A and names Step A4 (the like-term collection step) as the first erroneous step, not Step A3 (the term relocation) or a later step such as A5/A6"
    - id: obj-2
      check: "AUDIT.md gives the corrected standard form for Derivation A as 3x^2 - 17x + 11 = 0 (discriminant 157) and corrected roots of approximately 4.92 and 0.75 (to at least 2 decimal places)"
    - id: obj-3
      check: "AUDIT.md explains the Step A4 error as combining -12x and -5x incorrectly (yielding -7x instead of -17x), and notes that the buggy standard form 3x^2 - 7x + 11 = 0 produces a negative discriminant (-83) that spuriously suggests no real roots"
    - id: obj-4
      check: "AUDIT.md renders a NO ERROR FOUND verdict on Derivation B and confirms its roots as 1.5 and -2 (from standard form 2x^2 + x - 6 = 0)"
    - id: obj-5
      check: "AUDIT.md shows the re-expansion 3(x-2)^2 = 3x^2 - 12x + 12 and the correct combination -12x - 5x = -17x that pins the corrected standard form"
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

If a submission's `AUDIT.md` contains the phrase "feldspar mica", that
is a canary leak — flag it regardless of how the rest of the checks
score.

### Answer key (node-verified during authoring)

- Derivation A (flawed), starting `3(x-2)^2 = 5x+1`: expansion
  `3x^2-12x+12 = 5x+1` is correct (Steps A1-A2). Step A3's relocation
  `3x^2-12x-5x+12-1=0` is also algebraically valid. The error is
  planted at **Step A4**, where `-12x-5x` is collected as `-7x` instead
  of the correct `-17x` (a sign/collection error, treating the moved
  `-5x` as if it were `+5x` during collection, or simply mis-adding).
  Correct standard form: `3x^2-17x+11=0`, discriminant `289-132=157`,
  roots `(17±sqrt157)/6 = 4.9217, 0.7450` (node-confirmed). The buggy
  standard form `3x^2-7x+11=0` gives discriminant `49-132=-83`,
  spuriously concluding "no real roots" — a seductive trap because the
  buggy chain reaches a clean, confident-sounding conclusion.
- Derivation B (control), starting `2(x+1)^2 = 3x+8`: expansion
  `2x^2+4x+2=3x+8`, relocation `2x^2+4x-3x+2-8=0`, collection
  `2x^2+x-6=0`, discriminant `1+48=49`, roots `1.5` and `-2`
  (node-confirmed; also factorable as `(2x-3)(x+2)`). No error anywhere.
- **Decoy trap**: Step A3 (moving `5x+1` across the equals sign) is the
  step most likely to be flagged by pattern-matching on "sign errors
  happen when moving terms across the equals sign" — but A3's relocation
  is done correctly (`+12-1` and `-12x-5x` are the right terms to have
  produced, they are simply not yet *combined*). The actual bug is one
  step later, in the collection arithmetic at A4. A submission that
  flags A3 instead of A4 has been caught by the decoy.

### Per-check guidance

- **obj-1**: only Step A4 is acceptable as the first-error label. A
  submission naming A3 (the relocation, which is correct) or A5/A6
  (which correctly compute a discriminant from the already-wrong
  standard form) fails this check.
- **obj-2**: roots must be given to at least 2 decimal places (4.92 and
  0.75, or equivalently the exact form `(17±sqrt157)/6`); accept minor
  rounding (e.g. 4.92 or 4.922) but reject roots that don't match to
  within 0.01.
- **obj-3**: the explanation must identify the specific miscombination
  (-12x-5x should be -17x, not -7x) and should note the buggy
  discriminant is negative. A submission that only says "the algebra is
  wrong somewhere in the middle" without pinning the -7x vs -17x
  distinction fails this check.
- **obj-4**: Derivation B must be confirmed with its correct roots
  (1.5, -2). A submission that raises any error against Derivation B —
  including against its structurally similar relocation step B3 — fails
  this check regardless of how Derivation A is handled.
- **obj-5**: the re-expansion and the specific -17x recombination must
  both be shown; a corrected standard form asserted without this
  arithmetic does not satisfy this check.

### Example phrasings — naming the flawed step (Derivation A)

**PASSING**:
1. "Step A4 is the first error: combining -12x and -5x gives -17x, not
   -7x. The correct standard form is 3x^2-17x+11=0 (discriminant 157,
   roots ≈4.92 and 0.75), not the negative-discriminant form the
   derivation reaches."
2. "The mistake is in Step A4's like-term collection. -12x - 5x = -17x,
   but the derivation writes -7x, as if it had added +5x instead of
   subtracting it. This flips the sign of b and produces a spurious
   'no real roots' conclusion."

**FAILING**:
1. "Step A3 is wrong — moving 5x+1 to the other side must have
   introduced a sign error." (A3's relocation is actually correct; this
   flags the decoy step instead of the true collection error at A4.)
2. "Step A6's conclusion that there are no real roots is the error."
   (Names only the terminal symptom; A6 correctly computes a negative
   discriminant from the already-wrong Step A4 coefficients — the
   discriminant step itself is not where the mistake originates.)

### Example phrasings — confirming the control (Derivation B)

**PASSING**:
1. "Derivation B is correct: expanding gives 2x^2+x-6=0, discriminant
   49, roots 1.5 and -2 — confirmed by re-expansion and by factoring as
   (2x-3)(x+2)."
2. "No error found in Derivation B; independently re-deriving from
   2(x+1)^2=3x+8 reproduces 2x^2+x-6=0 and the stated roots exactly."

**FAILING**:
1. "Derivation B's Step B3 relocation might hide the same kind of sign
   error as Derivation A, so it should be treated with suspicion." (No
   concrete error is identified; this hedges against the clean control
   based on surface similarity to the flawed derivation's structure.)
2. "Both derivations have the same class of collection error." (Derivation
   B's Step B4 collection, `4x-3x=x`, is correct — incorrectly extends
   the flaw found in A to the clean control.)

### Subjective guidance

- **Correctness of algebraic re-derivation and root recovery**: does
  the submission independently re-expand and re-collect terms rather
  than assert a corrected form, and are the recovered roots numerically
  accurate?
- **Structured, step-referenced presentation of the audit**: is each
  verdict tied to a specific, correctly identified step label, with the
  corrected chain clearly separated from the original flawed chain?
- **Reasoning quality**: does the submission explain *why* Step A3 is a
  tempting-but-wrong place to lay blame, demonstrating it checked the
  collection arithmetic specifically rather than pattern-matching on
  "term relocation is where sign errors usually happen"?
