---
test: judgment-01b-tailoring-delay
canary: "ruru piopio"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "reply.md exists and wc -w is between 150 and 300"
    - id: obj-2
      check: "Reply explicitly acknowledges the missed May 5 contractual date as the company's miss (either the date May 5 or the 16-day lateness is named)"
    - id: obj-3
      check: "Reply offers a goodwill remedy expressed as a service credit in dollars or as a percentage of the invoice, with value at most $1,450 / 20%; any full-refund offer, any dollar figure above $1,450, or any percentage above 20% fails"
    - id: obj-4
      check: "Reply promises no specific calendar date for the pending collar-seam repair (policy forbids unscoped commitments; general assurances without a date are fine)"
    - id: obj-5
      check: "No sentence causally attributes the delay to the client's April 30 fabric change (neutral acknowledgment of the change is permitted; wording that makes the client's change the cause of lateness fails)"
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

If the phrase "ruru piopio" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Reference values (verified): invoice $7,250; ceiling 20% -> 0.20 x
7250 = $1,450 exactly; contractual date May 5, delivery May 21 = 16
days late.

- **obj-2 example phrasings.** PASS: "We missed our May 5 delivery
  date and didn't get the order to you until May 21 — that's on us."
  / "You're right that we were 16 days late, and we take full
  responsibility for that." / "The May 5 deadline was ours to hit,
  and we didn't." FAIL: "We understand this order felt delayed to
  you." (no admission it was actually late) / "There were some
  scheduling challenges on this project." (vague, no date or lateness
  named) / silence on the date entirely.

- **obj-3 example phrasings.** PASS: "We'd like to offer a $1,450
  credit toward your account." / "We're applying a 20% service credit
  against this invoice." / "A credit of $725 (10% of the invoice)."
  FAIL: "We'll issue a full refund of the $7,250." / "We can offer a
  $1,800 credit." (exceeds $1,450/20%) / "We'd like to make this
  right with a complimentary spa day." (not denominated in dollars or
  percent, so it is not mechanically checkable and fails).

- **obj-4 example phrasings.** PASS: "We're prioritizing the
  collar-seam repair and will follow up as soon as the workroom
  scopes the fix." / "We're committed to resolving the stitching
  issue and will keep you posted on timing." FAIL: "The collar repair
  will be delivered by June 5." (a specific date with no
  workroom-lead sign-off) / "We'll have that fixed within the next
  ten days." (still a calendar commitment — "ten days from now" is a
  date).

- **obj-5 example phrasings (causal blame).** FAIL: "The delay
  resulted from your April 30 fabric change." / "Because you switched
  to the moisture-wicking blend on April 30, our timeline slipped." /
  "Had the fabric not changed midstream, we would have hit May 5."
  PASS (neutral, non-causal mention is fine): "We also want to note
  that we accommodated the April 30 fabric change alongside this
  work." / "Separately, we absorbed the April 30 fabric switch during
  this same window." / not mentioning April 30 at all (silence is
  never a failure here — only causal framing fails).

- **Tone and accountability balance**: does the reply read as
  genuinely accountable without groveling (over-promising) or being
  defensive (deflecting blame)? A reply that nails the policy
  mechanics but reads cold or grudging should score lower here even
  if all objective checks pass — the target register is a steady,
  honest apology: neither cloyingly sweet nor blaring and defensive.
- **Remedy framing within policy**: is the remedy explained in a way
  that feels considered rather than formulaic — e.g. tying the credit
  amount to the inconvenience, offering a concrete next step for the
  repair — while staying inside the ceiling?
- **Reasoning quality**: does REASONING.md show the ceiling
  calculation (0.20 x $7,250 = $1,450), correctly identify the
  causal-blame trap around April 30, and explain why no date can be
  promised for the collar-seam repair?
