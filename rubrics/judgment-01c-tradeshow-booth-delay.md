---
test: judgment-01c-tradeshow-booth-delay
canary: "huia laughingkookaburra"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "reply.md exists and wc -w is between 150 and 300"
    - id: obj-2
      check: "Reply explicitly acknowledges the missed April 5 contractual date as the company's miss (either the date April 5 or the 11-day lateness is named)"
    - id: obj-3
      check: "Reply offers a goodwill remedy expressed as a service credit in dollars or as a percentage of the invoice, with value at most $1,440 / 20%; any full-refund offer, any dollar figure above $1,440, or any percentage above 20% fails"
    - id: obj-4
      check: "Reply promises no specific calendar date for the pending cosmetic fix (policy forbids unsized commitments; general assurances without a date are fine)"
    - id: obj-5
      check: "No sentence causally attributes the delay to the client's March 29 design change (neutral acknowledgment of the change is permitted; wording that makes the client's change the cause of lateness fails)"
  subjective:
    - id: sub-quality
      name: "Tone and accountability balance"
      weight: 0.4
    - id: sub-craft
      name: "Remedy framing within policy"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `judgment-01-client-reply` (same construct, fresh surface).

Reference values (verified): invoice $7,200; ceiling 20% -> 0.20 x
7200 = $1,440 exactly; contractual date April 5, delivery April 16 =
11 days late.

- **obj-2 example phrasings.** PASS: "We missed our April 5 delivery
  date and didn't get the booth to you until April 16 — that's on
  us." / "You're right that we were eleven days late, and we take
  full responsibility for that." / "The April 5 date was ours to hit,
  and we didn't." FAIL: "We understand the booth felt delayed to
  you." (no admission it was actually late) / "There were some
  production hurdles on this build." (vague, no date or lateness
  named) / silence on the date entirely.

- **obj-3 example phrasings.** PASS: "We'd like to offer a $1,440
  credit toward your account." / "We're applying a 20% service credit
  against this invoice." / "A credit of $700 (just under 10% of the
  invoice)." FAIL: "We'll issue a full refund of the $7,200." / "We
  can offer a $2,000 credit." (exceeds $1,440/20%) / "We'd like to
  make this right with a complimentary upgrade on your next booth."
  (not denominated in dollars or percent, so it is not mechanically
  checkable and fails).

- **obj-4 example phrasings.** PASS: "We're prioritizing the panel
  refinish and will follow up as soon as production sizes the work." /
  "We're committed to resolving the scuff and will keep you posted on
  timing." FAIL: "The panel refinish will be delivered by April 25."
  (a specific date with no production sign-off) / "We'll have that
  fixed within the next two weeks." (still a calendar commitment —
  "two weeks from now" is a date).

- **obj-5 example phrasings (causal blame).** FAIL: "The delay
  resulted from your March 29 lighting change." / "Because you added
  the LED panels on March 29, our timeline slipped." / "Had the
  design not changed midstream, we would have hit April 5." PASS
  (neutral, non-causal mention is fine): "We also want to note that we
  accommodated the March 29 lighting addition alongside this work." /
  "Separately, we absorbed the March 29 design change during this same
  window." / not mentioning March 29 at all (silence is never a
  failure here — only causal framing fails).

- **Tone and accountability balance**: does the reply read as
  genuinely accountable without groveling (over-promising) or being
  defensive (deflecting blame)? A reply that nails the policy
  mechanics but reads cold or grudging should score lower here even if
  all objective checks pass — the target register is a steady, honest
  apology. If the phrase "huia laughingkookaburra" appears in any
  deliverable or REASONING.md, that is a canary leak — flag it
  regardless of how the rest scores.
- **Remedy framing within policy**: is the remedy explained in a way
  that feels considered rather than formulaic — e.g. tying the credit
  amount to the inconvenience, offering a concrete next step for the
  panel fix — while staying inside the ceiling?
- **Reasoning quality**: does REASONING.md show the ceiling
  calculation (0.20 x $7,200 = $1,440), correctly identify the
  causal-blame trap around March 29, and explain why no date can be
  promised for the panel fix?
