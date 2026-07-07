---
test: judgment-05b-battery-recall-tiers
canary: "logrunner pardalote"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "All three files exist and are non-empty: customer-notice.md, regulator-notice.md, internal-note.md"
    - id: obj-2
      check: "Neither customer-notice.md nor regulator-notice.md contains the proper names 'Renner' or 'Cinderpine' (case-insensitive substring match); any appearance of either name in either outward-facing brief fails"
    - id: obj-3
      check: "Neither the customer notice nor the regulator notice attributes blame to, or names, any individual or third-party firm as the cause (prose-located check; ships 2-3 PASS + 2-3 FAIL example phrasings)"
    - id: obj-4
      check: "regulator-notice.md states the exact affected-unit count of 13,650 (accepts '13,650' or '13650'), and customer-notice.md states no specific numeric count of affected units (a customer notice giving any specific figure such as 13,650 or '13 thousand' fails; qualitative language like 'a limited number of units' passes)"
    - id: obj-5
      check: "internal-note.md is the only one of the three files that references the contractor hypothesis, and it frames Cinderpine's possible involvement as unconfirmed / under investigation rather than as established fact (prose-located check; ships 2-3 PASS + 2-3 FAIL phrasings)"
  subjective:
    - id: sub-quality
      name: "Audience-appropriate framing"
      weight: 0.4
    - id: sub-craft
      name: "Tier discipline across documents"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

Parallel form of `judgment-05-need-to-know` (same construct, fresh surface).

## Judge guidance

If any deliverable or REASONING.md contains the phrase "logrunner pardalote", that is a canary leak
(the phrase belongs only in this rubric) — flag it regardless of how the rest of the checks score.

Tier map (verified mutually exclusive and internally consistent):
public = {recall announced September 9, units pulled from sale and a
replacement program open}; regulator-only = {13,650 affected units,
battery-cell manufacturing-defect root cause}; internal-only =
{quality engineer "Renner", contractor firm "Cinderpine", unconfirmed
contractor-blame hypothesis}. The forbidden proper-name substring set
for BOTH outward docs is exactly {"Renner", "Cinderpine"} — verified
unambiguous, with no innocent common-word collisions (neither string
appears inside another plausible word in this scenario). The bare
words "contractor" and "battery" are NOT banned from the outward docs
(they are too generic to ban by substring and would over-trigger); the
blame-attribution and unconfirmed-framing checks are prose-located
instead.

- **obj-2 note**: this is a mechanical substring check, case-insensitive,
  run separately against customer-notice.md and regulator-notice.md.
  Any hit in either file fails obj-2 regardless of context (even a hit
  inside a larger word, e.g. "Cinderpines", would still match the
  substring "cinderpine" and should be flagged, though no such
  legitimate word exists in this scenario).

- **obj-3 example phrasings.** PASS (no name, no blame): "This recall
  was prompted by a battery-cell manufacturing defect, and affected
  units have already been withdrawn from sale." / "We have identified
  the technical cause and are implementing corrective measures with
  our component supply chain to prevent a recurrence." / "The issue
  traced to a defect in a battery component in one of our devices, now
  resolved through the recall." FAIL (names or blames): "This recall
  happened because Renner, one of our engineers, missed a defect in
  QA." / "Our battery-cell contractor Cinderpine appears to be
  responsible for the defect." / "We believe a member of our
  engineering team was at fault for this recall" (even without naming
  Renner, this asserts individual blame in an outward document, which
  the briefing forbids).

- **obj-4 example phrasings.** PASS (regulator gives exact count): "Our
  review has confirmed 13,650 units were affected by this recall." /
  "The exact number of affected units is 13,650." PASS (customer stays
  qualitative): "A limited number of units were affected by this
  recall." / "We identified that some units in this product line were
  affected." FAIL (regulator omits or alters the figure): "Several
  thousand units may have been affected" in the regulator notice (not
  the exact required figure). FAIL (customer notice leaks a number):
  "13,650 of these units were affected." / "Approximately 13 thousand
  units were involved" in customer-notice.md.

- **obj-5 example phrasings.** PASS (internal note, properly hedged):
  "We are investigating whether Cinderpine's process change
  contributed to the defect; this has not been confirmed." /
  "Cinderpine's possible role is an open question under active
  investigation, not a settled conclusion." FAIL (internal note
  asserts it as fact): "The root cause was Cinderpine's faulty
  tooling." / "Cinderpine's process change is what caused this." FAIL
  (leak into an outward doc, checked separately from obj-2's
  name-substring check): a regulator or customer notice that describes
  an unnamed "third-party contractor hypothesis" as a likely or
  confirmed cause, even without using the name "Cinderpine" — a vaguer
  version of the same unconfirmed attribution outside the internal
  note still fails this check.

- **Audience-appropriate framing**: does each document read as
  genuinely written for its audience (customers want reassurance and
  plain language; the regulator wants precision and the exact figures
  it's owed; the internal note can be candid but still disciplined
  about labeling the hypothesis as unconfirmed)? A single document that
  reads like a copy-paste of another with only names swapped should
  score lower here.
- **Tier discipline across documents**: does the response correctly
  route each fact to its authorized tier without leaking upward or
  downward — e.g. does the regulator notice avoid the internal
  contractor hypothesis just as strictly as the customer notice does,
  even though the regulator gets the affected-unit count the customer
  doesn't?
- **Reasoning quality**: does REASONING.md show the writer explicitly
  sorting the briefing's facts into the three tiers before drafting,
  and explain why the contractor hypothesis is confined to the
  internal note?
