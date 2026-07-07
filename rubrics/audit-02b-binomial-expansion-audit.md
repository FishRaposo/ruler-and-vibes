---
test: audit-02b-binomial-expansion-audit
canary: "frogfish anglerfish"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "AUDIT.md renders an ERROR FOUND verdict on Derivation A and names Step A4 (the like-term collection step) as the first erroneous step, not Step A3 (the term relocation) or a later step such as A5/A6"
    - id: obj-2
      check: "AUDIT.md gives the corrected standard form for Derivation A as 4x^2 - 31x + 34 = 0 (discriminant 417) and corrected roots of approximately 6.43 and 1.32 (to at least 2 decimal places)"
    - id: obj-3
      check: "AUDIT.md explains the Step A4 error as combining -24x and -7x incorrectly (yielding -17x instead of -31x), and notes that the buggy standard form 4x^2 - 17x + 34 = 0 produces a negative discriminant (-255) that spuriously suggests no real roots"
    - id: obj-4
      check: "AUDIT.md renders a NO ERROR FOUND verdict on Derivation B and confirms its roots as 4 and 0.5 (from standard form 2x^2 - 9x + 4 = 0)"
    - id: obj-5
      check: "AUDIT.md shows the re-expansion 4(x-3)^2 = 4x^2 - 24x + 36 and the correct combination -24x - 7x = -31x that pins the corrected standard form"
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

If the phrase "frogfish anglerfish" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest of the checks score.

### Answer key (node-verified during authoring)

- Derivation A (flawed), starting `4(x-3)^2 = 7x+2`: expansion
  `4x^2-24x+36 = 7x+2` is correct (Steps A1-A2). Step A3's relocation
  `4x^2-24x-7x+36-2=0` is also algebraically valid. The error is
  planted at **Step A4**, where `-24x-7x` is collected as `-17x` instead
  of the correct `-31x` (a sign/collection error, treating the moved
  `-7x` as if it were `+7x` during collection, or simply mis-adding).
  Correct standard form: `4x^2-31x+34=0`, discriminant `961-544=417`,
  roots `(31±sqrt417)/8 = 6.4276, 1.3224` (node-confirmed). The buggy
  standard form `4x^2-17x+34=0` gives discriminant `289-544=-255`,
  spuriously concluding "no real roots" — a seductive trap because the
  buggy chain reaches a clean, confident-sounding conclusion.
- Derivation B (control), starting `2(x-1)^2 = 5x-2`: expansion
  `2x^2-4x+2=5x-2`, relocation `2x^2-4x-5x+2+2=0`, collection
  `2x^2-9x+4=0`, discriminant `81-32=49`, roots `4` and `0.5`
  (node-confirmed; also factorable as `(x-4)(2x-1)`). No error anywhere.
- **Decoy trap**: Step A3 (moving `7x+2` across the equals sign) is the
  step most likely to be flagged by pattern-matching on "sign errors
  happen when moving terms across the equals sign" — but A3's relocation
  is done correctly (`+36-2` and `-24x-7x` are the right terms to have
  produced, they are simply not yet *combined*). The actual bug is one
  step later, in the collection arithmetic at A4. A submission that
  flags A3 instead of A4 has been caught by the decoy.

### Per-check guidance

- **obj-1**: only Step A4 is acceptable as the first-error label. A
  submission naming A3 (the relocation, which is correct) or A5/A6
  (which correctly compute a discriminant from the already-wrong
  standard form) fails this check.
- **obj-2**: roots must be given to at least 2 decimal places (6.43 and
  1.32, or equivalently the exact form `(31±sqrt417)/8`); accept minor
  rounding (e.g. 6.43 or 6.428) but reject roots that don't match to
  within 0.01.
- **obj-3**: the explanation must identify the specific miscombination
  (-24x-7x should be -31x, not -17x) and should note the buggy
  discriminant is negative. A submission that only says "the algebra is
  wrong somewhere in the middle" without pinning the -17x vs -31x
  distinction fails this check.
- **obj-4**: Derivation B must be confirmed with its correct roots
  (4, 0.5). A submission that raises any error against Derivation B —
  including against its structurally similar relocation step B3 — fails
  this check regardless of how Derivation A is handled.
- **obj-5**: the re-expansion and the specific -31x recombination must
  both be shown; a corrected standard form asserted without this
  arithmetic does not satisfy this check.

### Example phrasings — naming the flawed step (Derivation A)

**PASSING**:
1. "Step A4 is the first error: combining -24x and -7x gives -31x, not
   -17x. The correct standard form is 4x^2-31x+34=0 (discriminant 417,
   roots ≈6.43 and 1.32), not the negative-discriminant form the
   derivation reaches."
2. "The mistake is in Step A4's like-term collection. -24x - 7x = -31x,
   but the derivation writes -17x, as if it had added +7x instead of
   subtracting it. This flips the sign of b enough to produce a
   spurious 'no real roots' conclusion."

**FAILING**:
1. "Step A3 is wrong — moving 7x+2 to the other side must have
   introduced a sign error." (A3's relocation is actually correct; this
   flags the decoy step instead of the true collection error at A4.)
2. "Step A6's conclusion that there are no real roots is the error."
   (Names only the terminal symptom; A6 correctly computes a negative
   discriminant from the already-wrong Step A4 coefficients — the
   discriminant step itself is not where the mistake originates.)

### Example phrasings — confirming the control (Derivation B)

**PASSING**:
1. "Derivation B is correct: expanding gives 2x^2-9x+4=0, discriminant
   49, roots 4 and 0.5 — confirmed by re-expansion and by factoring as
   (x-4)(2x-1)."
2. "No error found in Derivation B; independently re-deriving from
   2(x-1)^2=5x-2 reproduces 2x^2-9x+4=0 and the stated roots exactly."

**FAILING**:
1. "Derivation B's Step B3 relocation might hide the same kind of sign
   error as Derivation A, so it should be treated with suspicion." (No
   concrete error is identified; this hedges against the clean control
   based on surface similarity to the flawed derivation's structure.)
2. "Both derivations have the same class of collection error." (Derivation
   B's Step B4 collection, `-4x-5x=-9x`, is correct — incorrectly extends
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
