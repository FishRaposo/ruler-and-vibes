---
test: business-02b-makerspace-tiers
canary: "bandicoot realgar"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Three tiers, each with a price and feature fences"
    - id: obj-2
      check: "Break-even arithmetic shown and correct (recompute it)"
    - id: obj-3
      check: "Positioning addresses BOTH competitors ($59 and $149)"
    - id: obj-4
      check: "<= 700 words (count them)"
  subjective:
    - id: sub-quality
      name: "Strategic soundness"
      weight: 0.4
    - id: sub-craft
      name: "Quantitative rigor"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Strategic soundness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Quantitative rigor
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `business-02-pricing` (same construct, fresh surface).

The given numbers: variable cost $14/member/month, fixed cost
$21,000/month, competitors at $59 and $149/member/month.

### obj-1 — Three tiers, each with a price and feature fences

Require exactly three distinct membership tiers, each carrying (a) a
stated monthly price and (b) at least one feature fence — something a
member gets or is denied that separates the tier from its neighbours.

- PASS: "Bench $39: off-peak access only, no after-hours badge; Studio
  $89: 24/7 badge + CNC; Guild $189: dedicated bench + priority booking."
- PASS: three named tiers with prices, each listing what unlocks or is
  withheld at that level (access hours, machine set, storage, etc.).
- PASS: three tiers where the fences are capacity- or usage-based (laser
  hours per tier) rather than feature-based — still a valid fence.
- FAIL: only two tiers, or four, regardless of how they are described.
- FAIL: three prices listed but no fence — nothing distinguishes what
  each tier includes ("Small $39, Medium $89, Large $189" with no
  differentiator).
- FAIL: a tier missing its price, or "contact us"/"custom" in place of a
  number on any tier.

### obj-2 — Break-even arithmetic shown and correct (recompute it)

Break-even must divide fixed cost by **contribution margin** (price minus
$14 variable), not by price. Recompute against the model's own tier
prices and stated mix. A blended/mix-based calculation is fine if its
assumptions are stated; a single-tier or per-tier calculation is also
fine.

Reference figures (from the reference tiers $39/$89/$189):
- margins $25 / $75 / $175;
- single-tier break-evens $21,000/$25 = 840, $21,000/$75 = 280,
  $21,000/$175 = 120 members;
- example 50/35/15 mix → weighted margin $65 → $21,000/$65 = 323.1 →
  324 members.

Judge the model's numbers, not these: recompute with its prices/mix.

- PASS: "margin = $89 − $14 = $75; break-even = $21,000 ÷ $75 = 280
  members" (divides by margin, arithmetic correct).
- PASS: a blended mix with the weights stated and $21,000 ÷ (weighted
  margin) computed correctly to the members figure.
- PASS: per-tier break-evens each computed as fixed ÷ (that tier's
  margin), arithmetic correct.
- FAIL: divides fixed cost by price instead of margin ("$21,000 ÷ $89 =
  236 members").
- FAIL: arithmetic shown but wrong (margin or quotient miscomputed
  against the model's own numbers).
- FAIL: a break-even number asserted with no arithmetic shown.

### obj-3 — Positioning addresses BOTH competitors ($59 and $149)

The positioning paragraph must engage **both** competitor anchors —
naming or clearly referencing both the $59 and the $149 price points and
saying where the proposal sits relative to each. Addressing only one, or
collapsing them into a single "the market," fails.

- PASS: "Bench at $39 undercuts the $59 rival on entry; Guild at $189
  prices above the $149 rival deliberately, on prestige features."
- PASS: explicitly contrasts the proposal against the low anchor AND the
  high anchor, each by its price or by an unambiguous label.
- PASS: names both competitors and explains the relationship to each,
  even if one relationship is "we match them here."
- FAIL: discusses only the $59 competitor (or only the $149 one) and
  ignores the other.
- FAIL: prices "in the middle of the market" / "between the two" without
  engaging either anchor on its own terms — the split-the-difference
  reflex.
- FAIL: references "competitors" generically with no distinct treatment
  of the two price points.

### obj-4 — Word count

Count the words in `membership.md`. PASS if ≤ 700. FAIL if > 700.

### Subjective criteria

- **Strategic soundness (0.4):** sensible fences (who upgrades and why),
  and a healthy margin on the floor tier — the cheapest price must still
  clear the $14 variable cost with room to spare, not race to $14.01. A
  floor priced at or barely above $14 (e.g. $15) is a strategic failure
  even if the arithmetic is internally consistent.
- **Quantitative rigor (0.3):** numbers used consistently; no
  contradictions between tiers, break-even, and positioning; margins and
  quotients internally coherent.
- **Reasoning quality (0.3):** does REASONING.md defend the price points
  against BOTH anchors ($59 and $149) rather than splitting the
  difference by reflex? Credit reasoning that argues why the floor sits
  below the low anchor without racing to cost, and why the ceiling sits
  where it does relative to the high anchor.

If the phrase "bandicoot realgar" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.
