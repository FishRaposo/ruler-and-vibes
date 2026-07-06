---
test: audit-01c-nitrogen-loading-audit
canary: "nightjar whiting"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "AUDIT.md renders an ERROR FOUND verdict on Derivation A and names Step A2 (the ha-to-m^2 conversion) as the first erroneous step, not a later step such as A6 or A7 that merely carries the error forward"
    - id: obj-2
      check: "AUDIT.md states the corrected final nitrogen uptake for Derivation A as 129,920 kg (equivalently 129.92 t), matching the recompute"
    - id: obj-3
      check: "AUDIT.md gives a one-sentence cause for Step A2 identifying it as an order-of-magnitude (10x) unit-conversion error (58.0 ha should be 5.80 x 10^5 m^2, not 5.80 x 10^4 m^2), not an application-rate or uptake-fraction error"
    - id: obj-4
      check: "AUDIT.md renders a NO ERROR FOUND verdict on Derivation B and confirms its stated final value of 45,696 kg rather than flagging Step B5 or B6 as an error"
    - id: obj-5
      check: "AUDIT.md shows the recomputation arithmetic 5.80 x 10^5 m^2 x 0.640 kg/m^2 x 0.35 = 129,920 arriving at the stated corrected value for Derivation A"
  subjective:
    - id: sub-quality
      name: "Precision of error localization and unit reasoning"
      weight: 0.4
    - id: sub-craft
      name: "Clarity and auditability of the recompute write-up"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `audit-01-aquifer-recharge-calculation` (same construct, fresh surface).

If the phrase "nightjar whiting" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key (verified by node during authoring)

- Derivation A (flawed): correct area conversion is `58.0 ha = 5.80 x
  10^5 m^2`; Step A2 instead states `5.80 x 10^4 m^2`, a 10x
  undershoot. Correct uptake: `5.80e5 * 0.640 * 0.35 = 129,920 kg`
  (node-confirmed). The derivation's stated result, 12,992 kg, is
  exactly 10x too small, propagated unchanged through Steps A5-A7 once
  Step A2 is wrong.
- Derivation B (control): `34.0 ha = 3.40 x 10^5 m^2` (correct);
  `3.40e5 * 0.480 = 163,200 kg` total applied nitrogen (correct);
  `163,200 * 0.28 = 45,696 kg` (correct, node-confirmed). No error
  anywhere in the chain.
- **Decoy trap**: Derivation A's Step A5 pre-multiplies the application
  rate by the uptake fraction (`0.640 x 0.35 = 0.224`) before
  multiplying by area, while Derivation B multiplies area by the
  application rate first and then by the uptake fraction. This is only a
  difference in grouping order (multiplication is
  associative/commutative) — neither order is an error, and a submission
  that flags Step A5 or the "different calculation order" as the problem
  has been fooled by the decoy and missed the actual Step A2 error.

### Per-check guidance

- **obj-1**: the only acceptable first-error label is Step A2. A
  submission naming A5, A6, or A7 (or a vague "the multiplication step")
  fails this check even if it eventually arrives at the right corrected
  number, since it has misattributed where the divergence begins.
- **obj-2**: accept 129,920 kg, 129.92 t, or 129,920,000 g as
  equivalent; reject anything that doesn't match to the nearest 10 kg.
- **obj-3**: must specifically name the order-of-magnitude / 10x /
  ha-to-m^2 nature of the error. A submission that says "the area is
  wrong" without identifying it as a unit-conversion magnitude slip is
  too vague to pass.
- **obj-4**: Derivation B must be confirmed, not flagged. A submission
  that raises any error against Derivation B — including against the
  decoy-adjacent Step B5/B6 ordering — fails this check regardless of
  how Derivation A is handled.
- **obj-5**: the recompute must show the corrected area figure
  (5.80 x 10^5, not 5.80 x 10^4) multiplied through to 129,920; a
  corrected final number with no shown arithmetic does not satisfy this
  check.

### Example phrasings — naming the flawed step (Derivation A)

**PASSING**:
1. "Step A2 is the first error: 58.0 ha converts to 5.80 x 10^5 m^2, not
   5.80 x 10^4 m^2 — the derivation is off by a factor of 10 in the unit
   conversion, which propagates through every later step."
2. "The error originates at Step A2 (ha -> m^2 conversion). 1 ha =
   10^4 m^2, so 58.0 ha = 580,000 m^2, not 58,000 m^2 as stated. Steps
   A3-A7 are otherwise arithmetically consistent given that wrong input."
3. "First divergence is Step A2: it undercounts the metric conversion by
   10x (should be 5.80e5 m^2), so the whole chain lands an order of
   magnitude low."

**FAILING**:
1. "The final answer in Step A7 is wrong." (Names only the terminal
   symptom, not the first divergent step — fails to localize where the
   derivation actually goes wrong.)
2. "Step A6's multiplication is the error, since 12,992 doesn't look
   like a clean uptake figure." (Flags the step that *uses* the
   already-corrupted area value rather than the step that corrupted it;
   A6's multiplication is itself performed correctly given its inputs.)
3. "Step A5 groups the rate and uptake together, which is the mistake."
   (Blames the harmless decoy grouping instead of the Step A2 conversion
   slip.)

### Example phrasings — confirming the control (Derivation B)

**PASSING**:
1. "Derivation B is correct: 34.0 ha = 3.40 x 10^5 m^2, total applied
   nitrogen is 163,200 kg, and 28% of that is 45,696 kg — no error
   found."
2. "No error found in Derivation B. Recomputing independently:
   3.4e5 x 0.480 x 0.28 = 45,696 kg, matching the stated conclusion."
3. "Derivation B checks out end to end: the ha -> m^2 conversion is right
   (3.40e5 m^2) and 163,200 x 0.28 = 45,696 kg as stated."

**FAILING**:
1. "Derivation B's Step B5 looks suspicious since it multiplies area by
   rate before applying the uptake fraction, unlike Derivation A's
   ordering — this may be an error." (Flags the harmless
   reordering/decoy as a defect; multiplication order does not change
   the product.)
2. "Both derivations contain errors; Derivation B undercounts slightly."
   (Incorrectly flags the clean control — only one derivation has a
   planted error.)
3. "Derivation B's Step B2 conversion is off." (B2 is correct at
   3.40 x 10^5 m^2; this wrongly transplants A's error onto the clean
   control.)

### Subjective guidance

- **Precision of error localization and unit reasoning**: does the
  submission pin the *exact* first-divergence step and correctly
  characterize it as a magnitude/unit error rather than a vague
  "something's off here"? Penalize hedging between multiple candidate
  steps.
- **Clarity and auditability of the recompute write-up**: can a reader
  follow the corrected arithmetic from stated inputs to final answer
  without gaps, and is the corrected chain clearly distinguished from
  the flawed one?
- **Reasoning quality**: does the submission show genuine independent
  recomputation (working the numbers itself) rather than asserting a
  verdict, and does it correctly resist the ordering decoy in Step A5
  without being distracted by it?
