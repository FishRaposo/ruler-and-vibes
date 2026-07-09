---
test: planning-02-estimate
canary: "anchor-and-fan"
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
      check: "Result gives a range for BOTH storage growth and egress"
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
anchors:
  - id: Estimation judgment
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Transparency
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "anchor-and-fan" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Estimation judgment: plausible assumption values (posting rates, photo
  sizes, view multipliers) and sound structure — good estimates anchor on
  one defensible number and fan the rest out from it, rather than
  stacking six wild guesses.
- Transparency: could you rebuild the whole estimate from the page alone?
- Reasoning quality: does REASONING.md admit which assumptions are
  weakest?

### Answer key (verified with node during authoring)

One defensible chain (submissions need not match these exact numbers —
any internally consistent, plausible chain passes; this is the reference
used to sanity-check the checks):

- Anchor: photos posted/user/month = 20 (plausible range 10-35). Total
  photos/month = 50,000 users x 20 = 1,000,000 photos.
- Storage growth: avg photo size 3 MB (range 2-5 MB) x 1,000,000 photos =
  **3,000,000 MB = 3 TB/month** central. Low = 50,000 x 10 x 2 MB =
  1,000,000 MB = 1 TB. High = 50,000 x 35 x 5 MB = 8,750,000 MB =
  8.75 TB. Range spread ~8.75x.
- Egress: views/photo 15 (range 8-25) x size served/view 0.3 MB (range
  0.2-0.5 MB). Total views/month = 1,000,000 x 15 = 15,000,000. Egress =
  15,000,000 x 0.3 MB = **4,500,000 MB = 4.5 TB/month** central. Low =
  50,000 x 10 x 8 x 0.2 MB = 800,000 MB = 0.8 TB. High = 50,000 x 35 x 25
  x 0.5 MB = 21,875,000 MB = 21.875 TB. Range spread ~27.3x.
- Sensitivity: the shared anchor (photos posted/user/month) is the
  highest-leverage assumption — a 20% swing in it moves BOTH storage
  growth and egress by ~20% each, since it's a multiplicative factor in
  both chains. A 20% swing in avg photo size moves only storage (~20%,
  unaffected egress); a 20% swing in views/photo moves only egress
  (~20%, unaffected storage). A correct sensitivity answer names the
  shared anchor, not one of the single-quantity factors, though a
  well-reasoned case for photo size or views/photo is acceptable if the
  "why" is actually argued rather than asserted.

### Trap

Same type as the source construct: the task supplies only a user count
and asks for two chained, uncertain quantities. The naive failure mode
is (a) reporting a single "best guess" number instead of a range —
hiding how much a chain of two-to-three multiplied uncertain factors can
swing a result — and (b) picking the most *emotionally* uncertain-
feeling assumption (e.g., "photo size could be anything") as the
sensitive one instead of reasoning about actual multiplicative leverage
across both quantities. The correct answer keeps the range wide enough
to reflect compounding uncertainty (an ~8-30x spread is typical here) and
identifies the shared anchor (photos/user/month) as highest-leverage
precisely because it propagates through both results at once.

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

1. "50,000 x 20 = 1,000,000 photos/month, and 1,000,000 x 3 MB =
   3,000,000 MB — recomputing the multiplication matches what's on the
   page."
2. "1,000,000 photos x 15 views/photo = 15,000,000 views, and
   15,000,000 x 0.3 MB = 4,500,000 MB — both steps check out."
3. "The total photos/month figure (1,000,000) is computed once and
   reused consistently in both the storage and egress lines below it."

**FAILING**:

1. "50,000 x 20 is written as '= 900,000 photos' (recomputing gives
   1,000,000 — the page's own multiplication is wrong)."
2. "States total photos as 1,000,000 in Calculation, then multiplies the
   egress line by 1,200,000 views with no stated reason for the
   change."
3. "1,000,000 x 3 MB is shown as '= 4,000,000 MB' (recomputes to
   3,000,000 — doesn't match)."

### Example phrasings — obj-3, is there a range (not a point) for BOTH quantities?

**PASSING**:

1. "Storage growth: 1 TB – 8.75 TB/month. Egress: 0.8 TB – 21.9 TB/month
   — both given as low/high brackets."
2. "Storage is estimated at 1.5 to 6 TB/month; egress bandwidth at 1 to
   15 TB/month."
3. "Both totals are presented as a low estimate and a high estimate, not
   single numbers."

**FAILING**:

1. "Storage growth: 3,000,000 MB/month. Egress: 4,500,000 MB/month."
   (both are single points, no range)
2. "Storage growth: 1–8.75 TB/month. Egress: about 4.5 TB/month." (only
   storage is a range; egress is a point)
3. "Roughly 3 TB and 4.5 TB, give or take." (a vague hedge, not a stated
   numeric range)

### Example phrasings — obj-4, does Sensitivity name one specific assumption with a why?

**PASSING**:

1. "Photos posted per user per month is the most sensitive input — it
   multiplies through both the storage and egress totals, so a 20% miss
   there moves both estimates by about 20%."
2. "Average photo size matters most for storage because it's the least-
   verified number and it's a direct linear multiplier on the growth
   total."
3. "Views per photo swings the egress estimate hardest since it directly
   scales total views served with nothing else to dampen it."

**FAILING**:

1. "Several assumptions could shift the numbers, like posting rate,
   photo size, and view count." (names three, picks none, gives no why)
2. "The estimate could be off if any assumption is wrong." (no specific
   assumption named at all)
3. "Photo size matters." (names exactly one, but gives no reasoning for
   why it dominates the result)
