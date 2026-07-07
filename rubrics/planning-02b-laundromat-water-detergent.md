---
test: planning-02b-laundromat-water-detergent
canary: "colocolo pampas"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "All four sections present in order: Assumptions, Calculation, Result, Sensitivity"
    - id: obj-2
      check: "Arithmetic is correct as written (recompute it)"
    - id: obj-3
      check: "Result gives a range for BOTH water consumption and detergent cost"
    - id: obj-4
      check: "Sensitivity names one specific assumption with a why"
  subjective:
    - id: sub-quality
      name: "Estimation judgment"
      weight: 0.4
    - id: sub-craft
      name: "Transparency"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `planning-02-estimate` (same construct, fresh surface).

If the phrase "colocolo pampas" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest of the submission scores.

### Answer key (verified with node during authoring)

One defensible chain (submissions need not match these exact numbers —
any internally consistent, plausible chain passes; this is the reference
used to sanity-check the checks):

- Total loads/month = 15,000 members x 4.5 loads/member = 67,500 loads.
- Blended water/load = (0.70 x 22 gal) + (0.30 x 40 gal) = 27.4 gal.
- Water/month = 67,500 x 27.4 = **1,849,500 gallons**.
- Dispensed-detergent loads = 67,500 x 0.75 = 50,625.
- Detergent/month = 50,625 x 1.5 oz x $0.30/oz = **$22,781.25**.
- A defensible range brackets each point estimate (e.g. ~1.3M–2.5M
  gallons; ~$17,000–$29,000) — the exact width is a judgment call, not a
  fixed target; what's checked is that a range appears at all for both
  quantities (obj-3) and that whatever arithmetic is shown recomputes
  cleanly (obj-2).

### Trap

Same two traps as the source, same type:

1. **Point estimate instead of a range.** A shallow answer computes one
   number per quantity and stops. The task and obj-3 force a range,
   exactly like the source — a submission that reports "1,849,500
   gallons" and "$22,781.25" with no bracket has skipped the required
   uncertainty step even if the arithmetic behind it is flawless.
2. **Stacking independent guesses instead of anchoring and fanning out.**
   The construct rewards deriving both quantities from one well-chosen
   base multiplier (here, loads per member per month, which is shared by
   both chains) rather than guessing water volume and detergent cost as
   two unrelated top-down totals. This mirrors the source's estimation
   guidance and is judged under Estimation judgment, not as an
   objective check — a plausible answer can anchor on a different
   number than loads/member, but it should visibly anchor on *something*
   rather than stack six independent wild guesses.

Verified with node: perturbing loads/member/month by 20% swings **both**
water and detergent by ~20% each, while perturbing a water-only
assumption (e.g. large-machine fill volume) swings only water (~8.8% for
a 20% input change, since it's a fraction of a blend), and perturbing a
detergent-only assumption (e.g. cost per ounce) swings only detergent
(20%, linear). So loads/member/month is the single assumption with
leverage over *both* results — a strong, defensible Sensitivity answer,
though not the only one obj-4 will accept (see examples below).

### Example phrasings — obj-1, are all four sections present in order?

**PASSING**:

1. "## Assumptions ... ## Calculation ... ## Result ... ## Sensitivity —
   all four headers appear once each, top to bottom, in this order."
2. "The four required headers are used verbatim as level-2 headings and
   nothing is reordered, even though each section has multiple bullets."
3. "Assumptions come first, then Calculation, then Result, then
   Sensitivity — no section is skipped or duplicated."

**FAILING**:

1. "Result is written before Calculation — the numbers appear before the
   arithmetic that produces them."
2. "There is no Sensitivity section at all; the page stops after
   Result."
3. "Assumptions and Calculation are merged under one heading, leaving
   only three sections total."

### Example phrasings — obj-2, does the arithmetic recompute correctly?

**PASSING**:

1. "67,500 loads x 27.4 gallons = 1,849,500 gallons — recomputing the
   multiplication matches what's on the page."
2. "50,625 x 1.5 oz x $0.30/oz = $22,781.25, and 50,625 itself checks
   out as 67,500 x 0.75."
3. "15,000 x 4.5 = 67,500 total loads, and this figure is reused
   consistently in both the water and detergent lines below it."

**FAILING**:

1. "67,500 loads x 27.4 gallons is written as '= 2,100,000 gallons'
   (recomputing gives 1,849,500 — the page's own multiplication is
   wrong)."
2. "States total loads as 67,500 in Calculation, then multiplies the
   detergent line by 70,000 loads with no stated reason for the
   change."
3. "48,000 x 1.5 oz x $0.30 is shown as '= $25,000' (recomputes to
   $21,600 — doesn't match)."

### Example phrasings — obj-3, is there a range (not a point) for BOTH quantities?

**PASSING**:

1. "Water: 1.3 million – 2.5 million gallons/month. Detergent: $17,000 –
   $29,000/month — both given as low/high brackets."
2. "Water consumption is estimated at 1.5 to 2.3 million gallons;
   detergent spend at $18k to $27k."
3. "Both totals are presented as a low estimate and a high estimate,
   not single numbers."

**FAILING**:

1. "Water: 1,849,500 gallons/month. Detergent: $22,781/month." (both are
   single points, no range)
2. "Water consumption: 1.3–2.5 million gallons. Detergent cost: about
   $22,781." (only water is a range; detergent is a point)
3. "Roughly 2 million gallons and 23 thousand dollars, give or take."
   (a vague hedge, not a stated numeric range)

### Example phrasings — obj-4, does Sensitivity name one specific assumption with a why?

**PASSING**:

1. "Loads per member per month is the most sensitive input — it
   multiplies through both the water and detergent totals, so a 20%
   miss there moves both estimates by about 20%."
2. "The large-machine fill volume (40 gallons) matters most because it's
   the least-verified number and it controls nearly a third of blended
   water use."
3. "Detergent price per ounce swings the cost estimate hardest since
   it's a direct linear multiplier with nothing else to dampen it."

**FAILING**:

1. "Several assumptions could shift the numbers, like the load
   frequency, machine mix, and detergent price." (names three, picks
   none, gives no why)
2. "The estimate could be off if any assumption is wrong." (no specific
   assumption named at all)
3. "Detergent dose matters." (names exactly one, but gives no reasoning
   for why it dominates the result)

### Subjective guidance

- **Estimation judgment (0.4):** plausible assumption values (wash
  frequency, machine mix, fill volumes, detergent dose and price) and
  sound structure — good estimates anchor on one defensible number and
  fan the rest out from it, rather than stacking six wild guesses.
- **Transparency (0.3):** could you rebuild the whole estimate from the
  page alone?
- **Reasoning quality (0.3):** does REASONING.md admit which assumptions
  are weakest?
