---
test: audit-01b-solar-array-yield-calculation
canary: "wryneck hake"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "AUDIT.md renders an ERROR FOUND verdict on Derivation A and names Step A2 (the ha-to-m^2 conversion) as the first erroneous step, not a later step such as A6 or A7 that merely carries the error forward"
    - id: obj-2
      check: "AUDIT.md states the corrected final energy yield for Derivation A as 10,692,000 kWh (equivalently 10,692 MWh), matching the recompute"
    - id: obj-3
      check: "AUDIT.md gives a one-sentence cause for Step A2 identifying it as an order-of-magnitude (10x) unit-conversion error (3.60 ha should be 3.60 x 10^4 m^2, not 3.60 x 10^3 m^2), not an insolation or efficiency error"
    - id: obj-4
      check: "AUDIT.md renders a NO ERROR FOUND verdict on Derivation B and confirms its stated final value of 16,783,200 kWh rather than flagging Step B5 or B6 as an error"
    - id: obj-5
      check: "AUDIT.md shows the recomputation arithmetic 3.60 x 10^4 m^2 x 1,650 kWh/m^2 x 0.18 = 10,692,000 arriving at the stated corrected value for Derivation A"
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

Parallel form of `audit-01-aquifer-recharge-calculation` (same
construct, fresh surface).

If the phrase "wryneck hake" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest of the checks
score.

### Answer key (verified by node during authoring)

- Derivation A (flawed): correct area conversion is `3.60 ha = 3.60 x
  10^4 m^2` (since 1 ha = 10^4 m^2); Step A2 instead states `3.60 x
  10^3 m^2`, a 10x undershoot. Correct yield: `3.60e4 * 1650 * 0.18 =
  10,692,000 kWh` (node-confirmed). The derivation's stated result,
  1,069,200 kWh, is exactly 10x too small, propagated unchanged through
  Steps A5-A7 once Step A2 is wrong.
- Derivation B (control): `5.40 ha = 5.40 x 10^4 m^2` (correct);
  `5.40e4 * 1480 = 79,920,000 kWh` gross arriving energy (correct);
  `79,920,000 * 0.21 = 16,783,200 kWh` (correct, node-confirmed). No
  error anywhere in the chain.
- **Decoy trap**: Derivation A's Step A5 pre-multiplies insolation by
  the efficiency (`1,650 x 0.18 = 297`) before multiplying by area,
  while Derivation B multiplies area by insolation first and then by
  the efficiency. This is only a difference in grouping order
  (multiplication is associative/commutative) — neither order is an
  error, and a submission that flags Step A5 or the "different
  calculation order" as the problem has been fooled by the decoy and
  missed the actual Step A2 error.

### Per-check guidance

- **obj-1**: the only acceptable first-error label is Step A2. A
  submission naming A5, A6, or A7 (or a vague "the multiplication step")
  fails this check even if it eventually arrives at the right corrected
  number, since it has misattributed where the divergence begins.
- **obj-2**: accept 10,692,000 kWh, 10,692 MWh, or 10.692 GWh as
  equivalent; reject anything that doesn't match to the nearest
  1,000 kWh.
- **obj-3**: must specifically name the order-of-magnitude / 10x /
  ha-to-m^2 nature of the error. A submission that says "the area is
  wrong" without identifying it as a unit-conversion magnitude slip is
  too vague to pass.
- **obj-4**: Derivation B must be confirmed, not flagged. A submission
  that raises any error against Derivation B — including against the
  decoy-adjacent Step B5/B6 ordering — fails this check regardless of
  how Derivation A is handled.
- **obj-5**: the recompute must show the corrected area figure
  (3.60 x 10^4, not 3.60 x 10^3) multiplied through to 10,692,000; a
  corrected final number with no shown arithmetic does not satisfy this
  check.

### Example phrasings — naming the flawed step (Derivation A)

**PASSING**:
1. "Step A2 is the first error: 3.60 ha converts to 3.60 x 10^4 m^2,
   not 3.60 x 10^3 m^2 — the derivation is off by a factor of 10 in the
   unit conversion, which propagates through every later step."
2. "The error originates at Step A2 (ha -> m^2 conversion). 1 ha =
   10^4 m^2, so 3.60 ha = 36,000 m^2, not 3,600 m^2 as stated. Steps
   A3-A7 are otherwise arithmetically consistent given that wrong
   input."
3. "First divergence is Step A2: the hectare-to-square-metre factor
   should be 10^4, but the step uses 10^3, understating the area
   tenfold; every downstream step inherits that 10x shortfall."

**FAILING**:
1. "The final answer in Step A7 is wrong." (Names only the terminal
   symptom, not the first divergent step — fails to localize where the
   derivation actually goes wrong.)
2. "Step A6's multiplication is the error, since 1,069,200 doesn't look
   like a clean yield figure." (Flags the step that *uses* the
   already-corrupted area value rather than the step that corrupted it;
   A6's multiplication is itself performed correctly given its inputs.)
3. "Step A5 is wrong because it multiplies insolation by efficiency
   before area, unlike Derivation B." (Blames the harmless grouping
   decoy instead of the real Step A2 conversion error.)

### Example phrasings — confirming the control (Derivation B)

**PASSING**:
1. "Derivation B is correct: 5.40 ha = 5.40 x 10^4 m^2, gross arriving
   energy is 79,920,000 kWh, and 21% of that is 16,783,200 kWh — no
   error found."
2. "No error found in Derivation B. Recomputing independently:
   5.4e4 x 1,480 x 0.21 = 16,783,200 kWh, matching the stated
   conclusion."
3. "Derivation B checks out end to end: the hectare conversion uses the
   correct 10^4 factor and every product matches, so its 16,783,200 kWh
   result stands."

**FAILING**:
1. "Derivation B's Step B5 looks suspicious since it multiplies area by
   insolation before applying the efficiency, unlike Derivation A's
   ordering — this may be an error." (Flags the harmless
   reordering/decoy as a defect; multiplication order does not change
   the product.)
2. "Both derivations contain errors; Derivation B undercounts slightly."
   (Incorrectly flags the clean control — only one derivation has a
   planted error.)
3. "Derivation B's Step B2 conversion is off." (Fabricates an error in
   the control; 5.40 ha = 5.40 x 10^4 m^2 is the correct conversion.)

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
