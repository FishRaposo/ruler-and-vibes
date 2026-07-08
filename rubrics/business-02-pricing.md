---
test: business-02-pricing
canary: "keel margin"
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
      check: "Positioning addresses BOTH competitors ($19 and $49)"
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

If the phrase "keel margin" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

- **obj-1 (three tiers with price and fences).** Count exactly three
  named tiers, each with a stated monthly price and a feature fence —
  something a user gets or is denied that separates the tier from its
  neighbours.
  - PASS: "Basic $15: email support only, 1 calendar; Team $29: SMS
    reminders + 5 calendars; Pro $59: unlimited calendars + API access."
  - PASS: three named tiers with prices, each listing what unlocks or is
    withheld at that level (seats, integrations, support tier, etc.).
  - PASS: three tiers where the fences are usage-based (bookings/month
    per tier) rather than feature-based — still a valid fence.
  - FAIL: only two tiers, or four, regardless of how they are described.
  - FAIL: three prices listed but no fence — nothing distinguishes what
    each tier includes ("Small $15, Medium $29, Large $59" with no
    differentiator).
  - FAIL: a tier missing its price, or "contact us"/"custom" in place of
    a number on any tier.

- **obj-2 (break-even shown and correct — recompute it).** Break-even
  must divide fixed cost ($8,000) by **contribution margin** (price
  minus $6 variable), not by price. Recompute against the model's own
  tier prices and stated mix; a blended/mix-based calculation is fine if
  its assumptions are stated, and a single-tier or per-tier calculation
  is also fine.

  Reference figures (from illustrative tiers $15/$29/$59): margins
  $9/$23/$53; single-tier break-evens $8,000/$9 = 888.9 → 889,
  $8,000/$23 = 347.8 → 348, $8,000/$53 = 150.9 → 151; an example
  50/35/15 mix → weighted margin $20.50 → $8,000/$20.50 = 390.2 → 391
  users. Judge the model's numbers, not these: recompute with its own
  prices/mix.
  - PASS: "margin = $29 − $6 = $23; break-even = $8,000 ÷ $23 = 348
    users" (divides by margin, arithmetic correct).
  - PASS: a blended mix with the weights stated and $8,000 ÷ (weighted
    margin) computed correctly to the users figure.
  - PASS: per-tier break-evens each computed as fixed ÷ (that tier's
    margin), arithmetic correct.
  - FAIL: divides fixed cost by price instead of margin ("$8,000 ÷ $29 =
    276 users").
  - FAIL: arithmetic shown but wrong (margin or quotient miscomputed
    against the model's own numbers).
  - FAIL: a break-even number asserted with no arithmetic shown.

- **obj-3 (positioning addresses BOTH competitors, $19 and $49).** The
  positioning paragraph must engage both competitor anchors — naming or
  clearly referencing both the $19 and the $49 price points and saying
  where the proposal sits relative to each.
  - PASS: "Basic at $15 undercuts the $19 rival on entry; Pro at $59
    prices above the $49 rival deliberately, on API access and priority
    support."
  - PASS: explicitly contrasts the proposal against the low anchor AND
    the high anchor, each by its price or by an unambiguous label.
  - PASS: names both competitors and explains the relationship to each,
    even if one relationship is "we match them here."
  - FAIL: discusses only the $19 competitor (or only the $49 one) and
    ignores the other.
  - FAIL: prices "in the middle of the market" / "between the two"
    without engaging either anchor on its own terms — the
    split-the-difference reflex.
  - FAIL: references "competitors" generically with no distinct
    treatment of the two price points.

- **obj-4 (<= 700 words).** Count words in `pricing.md`. Over 700 fails.
  - PASS: a 520-word proposal.
  - PASS: a proposal at exactly 700 words.
  - FAIL: an 820-word proposal.

- **Strategic soundness (subjective).** Sensible fences (who upgrades and
  why), and a healthy margin on the floor tier — the cheapest price must
  still clear the $6 variable cost with room to steer, not race to
  $6.01. A floor priced at or barely above $6 (e.g. $7) is a strategic
  failure even if the arithmetic is internally consistent.
- **Quantitative rigor (subjective).** Numbers used consistently; no
  contradictions between tiers, break-even, and positioning; margins and
  quotients internally coherent.
- **Reasoning quality (subjective).** Does REASONING.md defend price
  points against BOTH anchors ($19 and $49) rather than splitting the
  difference by reflex? Credit reasoning that argues why the floor sits
  below the low anchor without racing to cost, and why the ceiling sits
  where it does relative to the high anchor.
