---
test: judgment-01-client-reply
canary: "marzipan foghorn"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "reply.md exists and wc -w is between 150 and 300"
    - id: obj-2
      check: "Reply explicitly acknowledges the missed March 3 contractual date as the company's miss (either the date March 3 or the 14-day lateness is named)"
    - id: obj-3
      check: "Reply offers a goodwill remedy expressed as a service credit in dollars or as a percentage of the invoice, with value at most $960 / 20%; any full-refund offer, any dollar figure above $960, or any percentage above 20% fails"
    - id: obj-4
      check: "Reply promises no specific calendar date for the pending defect fix (policy forbids unsized commitments; general assurances without a date are fine)"
    - id: obj-5
      check: "No sentence causally attributes the delay to the client's February 24 requirements change (neutral acknowledgment of the change is permitted; wording that makes the client's change the cause of lateness fails)"
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

If the phrase "marzipan foghorn" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Reference values (verified): invoice $4,800; ceiling 20% -> 0.20 x
4800 = $960 exactly; contractual date March 3, delivery March 17 = 14
days late.

- **obj-2 example phrasings.** PASS: "We missed our March 3 delivery
  date and didn't get the signage to you until March 17 — that's on
  us." / "You're right that we were 14 days late, and we take full
  responsibility for that." / "The March 3 deadline was ours to hit,
  and we didn't." FAIL: "We understand delivery felt delayed to you."
  (no admission it was actually late) / "There were some scheduling
  challenges on this project." (vague, no date or lateness named) /
  silence on the date entirely.

- **obj-3 example phrasings.** PASS: "We'd like to offer a $960 credit
  toward your account." / "We're applying a 20% service credit against
  this invoice." / "A credit of $500 (just over 10% of the invoice)."
  FAIL: "We'll issue a full refund of the $4,800." / "We can offer a
  $1,200 credit." (exceeds $960/20%) / "We'd like to make this right
  with a free month of service." (not denominated in dollars or
  percent, so it is not mechanically checkable and fails).

- **obj-4 example phrasings.** PASS: "We're prioritizing the material
  defect fix and will follow up as soon as engineering sizes the
  work." / "We're committed to resolving the defect and will keep you
  posted on timing." FAIL: "The defect fix will be delivered by March
  25." (a specific date with no engineering sign-off) / "We'll have
  that fixed within the next two weeks." (still a calendar commitment
  — "two weeks from now" is a date).

- **obj-5 example phrasings (causal blame).** FAIL: "The delay resulted
  from your February 24 scope change." / "Because you changed the
  dimensions on February 24, our timeline slipped." / "Had the
  requirements not changed midstream, we would have hit March 3."
  PASS (neutral, non-causal mention is fine): "We also want to note
  that we accommodated the February 24 dimension change alongside this
  work." / "Separately, we absorbed the February 24 scope change during
  this same window." / not mentioning February 24 at all (silence is
  never a failure here — only causal framing fails).

- **Tone and accountability balance**: does the reply read as genuinely
  accountable without groveling (over-promising) or being defensive
  (deflecting blame)? A reply that nails the policy mechanics but reads
  cold or grudging should score lower here even if all objective checks
  pass — the target register is a steady, honest apology: neither
  cloyingly sweet nor blaring and defensive.
- **Remedy framing within policy**: is the remedy explained in a way
  that feels considered rather than formulaic — e.g. tying the credit
  amount to the inconvenience, offering a concrete next step for the
  defect — while staying inside the ceiling?
- **Reasoning quality**: does REASONING.md show the ceiling
  calculation (0.20 x $4,800 = $960), correctly identify the causal-
  blame trap around February 24, and explain why no date can be
  promised for the defect fix?
