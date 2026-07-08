---
test: audit-01-aquifer-recharge-calculation
canary: "azurite serpentine"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "AUDIT.md renders an ERROR FOUND verdict on Derivation A and names Step A2 (the km^2-to-m^2 conversion) as the first erroneous step, not a later step such as A6 or A7 that merely carries the error forward"
    - id: obj-2
      check: "AUDIT.md states the corrected final recharge volume for Derivation A as 491,400 m^3 (equivalently 491.4 ML), matching the recompute"
    - id: obj-3
      check: "AUDIT.md gives a one-sentence cause for Step A2 identifying it as an order-of-magnitude (10x) unit-conversion error (4.20 km^2 should be 4.20 x 10^6 m^2, not 4.20 x 10^5 m^2), not a coefficient or rainfall-depth error"
    - id: obj-4
      check: "AUDIT.md renders a NO ERROR FOUND verdict on Derivation B and confirms its stated final value of 308,880 m^3 rather than flagging Step B5 or B6 as an error"
    - id: obj-5
      check: "AUDIT.md shows the recomputation arithmetic 4.20 x 10^6 m^2 x 0.780 m x 0.15 = 491,400 arriving at the stated corrected value for Derivation A"
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

If the phrase "azurite serpentine" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified by node during authoring)

- Derivation A (flawed): correct area conversion is `4.20 km^2 = 4.20 x
  10^6 m^2`; Step A2 instead states `4.20 x 10^5 m^2`, a 10x
  undershoot. Correct volume: `4.20e6 * 0.780 * 0.15 = 491,400 m^3`
  (node-confirmed). The derivation's stated result, 49,140 m^3, is
  exactly 10x too small, propagated unchanged through Steps A5-A7 once
  Step A2 is wrong.
- Derivation B (control): `2.60 km^2 = 2.60 x 10^6 m^2` (correct);
  `2.60e6 * 0.540 = 1,404,000 m^3` total rainfall volume (correct);
  `1,404,000 * 0.22 = 308,880 m^3` (correct, node-confirmed). No error
  anywhere in the chain.
- **Decoy trap**: Derivation A's Step A5 pre-multiplies rainfall depth
  by the coefficient (`0.780 x 0.15 = 0.117`) before multiplying by
  area, while Derivation B multiplies area by rainfall first and then
  by the coefficient. This is only a difference in grouping order
  (multiplication is associative/commutative) — neither order is an
  error, and a submission that flags Step A5 or the "different
  calculation order" as the problem has been fooled by the decoy and
  missed the actual Step A2 error.

### Per-check guidance

- **obj-1**: the only acceptable first-error label is Step A2. A
  submission naming A5, A6, or A7 (or a vague "the multiplication step")
  fails this check even if it eventually arrives at the right corrected
  number, since it has misattributed where the divergence begins.
- **obj-2**: accept 491,400 m^3, 491.4 ML, or 491,400,000 L as
  equivalent; reject anything that doesn't match to the nearest 100 m^3.
- **obj-3**: must specifically name the order-of-magnitude / 10x /
  km^2-to-m^2 nature of the error. A submission that says "the area is
  wrong" without identifying it as a unit-conversion magnitude slip is
  too vague to pass.
- **obj-4**: Derivation B must be confirmed, not flagged. A submission
  that raises any error against Derivation B — including against the
  decoy-adjacent Step B5/B6 ordering — fails this check regardless of
  how Derivation A is handled.
- **obj-5**: the recompute must show the corrected area figure
  (4.20 x 10^6, not 4.20 x 10^5) multiplied through to 491,400; a
  corrected final number with no shown arithmetic does not satisfy this
  check.

### Example phrasings — naming the flawed step (Derivation A)

**PASSING**:
1. "Step A2 is the first error: 4.20 km^2 converts to 4.20 x 10^6 m^2,
   not 4.20 x 10^5 m^2 — the derivation is off by a factor of 10 in the
   unit conversion, which propagates through every later step."
2. "The error originates at Step A2 (km^2 -> m^2 conversion). 1 km^2 =
   10^6 m^2, so 4.20 km^2 = 4,200,000 m^2, not 420,000 m^2 as stated.
   Steps A3-A7 are otherwise arithmetically consistent given that wrong
   input."

**FAILING**:
1. "The final answer in Step A7 is wrong." (Names only the terminal
   symptom, not the first divergent step — fails to localize where the
   derivation actually goes wrong.)
2. "Step A6's multiplication is the error, since 49,140 doesn't look
   like a clean recharge figure." (Flags the step that *uses* the
   already-corrupted area value rather than the step that corrupted it;
   A6's multiplication is itself performed correctly given its inputs.)

### Example phrasings — confirming the control (Derivation B)

**PASSING**:
1. "Derivation B is correct: 2.60 km^2 = 2.60 x 10^6 m^2, total rainfall
   volume is 1,404,000 m^3, and 22% of that is 308,880 m^3 — no error
   found."
2. "No error found in Derivation B. Recomputing independently:
   2.6e6 x 0.540 x 0.22 = 308,880 m^3, matching the stated conclusion."

**FAILING**:
1. "Derivation B's Step B5 looks suspicious since it multiplies area by
   rainfall before applying the coefficient, unlike Derivation A's
   ordering — this may be an error." (Flags the harmless
   reordering/decoy as a defect; multiplication order does not change
   the product.)
2. "Both derivations contain errors; Derivation B undercounts slightly."
   (Incorrectly flags the clean control — only one derivation has a
   planted error.)

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
