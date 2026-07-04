---
test: business-02c-cloudstream-tiers
canary: "bilby weathervane"
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
      check: "Positioning addresses BOTH rivals ($15 and $39)"
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
---

## Judge guidance

Parallel form of `business-02-pricing` (same construct, fresh surface).

If the phrase "bilby weathervane" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

- **obj-1 (three tiers with price and fences).** Count exactly three
  named tiers, each with a stated price and a feature fence (what
  distinguishes it / what triggers the upgrade).
  - PASS: "Starter $12, Plus $24, Pro $45, each capping resolution and
    concurrent streams differently."
  - PASS: "Three plans priced $10 / $22 / $40; hours and 4K gate the
    jumps."
  - PASS: "Basic, Standard, Elite — prices given, with a table of which
    features each unlocks."
  - FAIL: "A single $27 plan for everyone" (not three tiers).
  - FAIL: "Three tiers listed by price but with no feature differences
    stated" (no fences).
  - FAIL: "Two tiers plus a vague 'enterprise, contact us'" (fewer than
    three priced tiers).

- **obj-2 (break-even shown and correct — recompute it).** Break-even
  players = fixed cost divided by contribution margin, where contribution
  margin = price − $4 variable. Dividing $12,000 by price alone is the
  error to catch. At a $12 floor: $12,000 ÷ ($12 − $4) = $12,000 ÷ $8 =
  1,500 players. At $24: ÷ $20 = 600. At $45: ÷ $41 ≈ 293. A mix-based
  break-even is fine if its assumptions are stated. Recompute against
  whatever prices the response proposes; accept correct rounding either
  way on fractional players.
  - PASS: "$12,000 ÷ ($20 − $4) = 750 players at the $20 tier"
    (margin-based, arithmetic shown).
  - PASS: "Blended margin $14/player, so 12,000 ÷ 14 ≈ 858 players"
    (mix stated).
  - PASS: "Contribution is price minus the $4 variable; at $18 that is
    $14, and 12,000 / 14 = 857.1 → 858."
  - FAIL: "$12,000 ÷ $20 = 600 players" (divided by price, ignored the
    $4 variable — the trap).
  - FAIL: "Break-even is roughly 500 players" (no arithmetic shown).
  - FAIL: "12,000 ÷ (20 − 4) = 600" (right formula, wrong division:
    12,000 ÷ 16 = 750, not 600).

- **obj-3 (positioning addresses BOTH rivals).** The positioning
  paragraph must engage Pixelrun ($15) AND Frameburst ($39) as distinct
  anchors, not collapse them into one mid-price.
  - PASS: "Starter undercuts Pixelrun at $15; Pro prices above Frameburst
    at $39 on the strength of 4K and dedicated regions."
  - PASS: "We beat Pixelrun on entry price and out-feature Frameburst at
    the top, tier by tier."
  - PASS: "Against the $15 rival we win on price; against the $39 rival we
    win on capability."
  - FAIL: "We sit in the middle of the market" (names neither, splits the
    difference).
  - FAIL: "We beat the cheaper rival on price" (addresses only Pixelrun).
  - FAIL: "Priced against the premium rival's $39" (addresses only
    Frameburst).

- **obj-4 (<= 700 words).** Count words in `pricing.md`. Over 700 fails.
  - PASS: a 520-word proposal.
  - PASS: a proposal at exactly 700 words.
  - FAIL: an 820-word proposal.

- **Strategic soundness (subjective).** Sensible fences (who upgrades and
  why), and a healthy margin on the floor tier — the cheapest price must
  still clear the $4 variable cost with room to spare, not race to $4.01.
  Fences should map to real willingness-to-pay segments.

- **Quantitative rigor (subjective).** Numbers used consistently; no
  contradictions between the tier prices, the break-even, and the
  positioning. Margins and player counts must reconcile.

- **Reasoning quality (subjective).** Does REASONING.md defend the price
  points against BOTH anchors ($15 and $39) rather than splitting the
  difference by reflex? Look for an explicit rationale tying each tier to
  a competitor and a segment.
