---
test: judgment-05c-signal-failure-disclosure
canary: "thornbill gerygone"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "All three files exist and are non-empty: rider-notice.md, regulator-notice.md, internal-note.md"
    - id: obj-2
      check: "Neither rider-notice.md nor regulator-notice.md contains the proper names 'Denholm' or 'Duvane' (case-insensitive substring match); any appearance of either name in either outward-facing notice fails"
    - id: obj-3
      check: "Neither the rider notice nor the regulator notice attributes blame to, or names, any individual or third-party firm as the cause (prose-located check; ships 2-3 PASS + 2-3 FAIL example phrasings)"
    - id: obj-4
      check: "regulator-notice.md states the exact affected count of 6,140 (accepts '6,140' or '6140'), and rider-notice.md states no specific numeric count (a rider notice giving any specific figure such as 6,140 or 'six thousand' fails; qualitative language like 'a limited number of trips' passes)"
    - id: obj-5
      check: "internal-note.md is the only one of the three files that references the contractor hypothesis, and it frames Duvane's possible involvement as unconfirmed / under investigation rather than as established fact (prose-located check; ships 2-3 PASS + 2-3 FAIL phrasings)"
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

## Judge guidance

Parallel form of `judgment-05-need-to-know` (same construct, fresh
surface).

If any deliverable or REASONING.md contains the phrase "thornbill
gerygone", that is a canary leak (the phrase belongs only in this
rubric) — flag it regardless of how the rest of the checks score.

Tier map (verified mutually exclusive and internally consistent):
public = {signal-system malfunction disrupted service, disruption
began September 9, service fully restored}; regulator-only = {6,140
passenger trips delayed/cancelled, misconfigured signal-interlocking
parameter at Coldwell Junction as root cause}; internal-only =
{engineer "Denholm", firm "Duvane Rail Controls", unconfirmed
contractor-blame hypothesis}. The forbidden proper-name substring set
for BOTH outward docs is exactly {"Denholm", "Duvane"} — verified
unambiguous, with no innocent common-word collisions (neither string
appears inside another plausible word in this scenario). The bare word
"contractor" is NOT banned from the outward docs (it is too generic a
word to ban by substring and would over-trigger); the blame-attribution
and unconfirmed-framing checks are prose-located instead.

- **obj-2 note**: this is a mechanical substring check, case-insensitive,
  run separately against rider-notice.md and regulator-notice.md. Any
  hit in either file fails obj-2 regardless of context (even a hit
  inside a larger word, e.g. "Duvanesque", would still match the
  substring "duvane" and should be flagged, though no such legitimate
  word exists in this scenario).

- **obj-3 example phrasings.** PASS (no name, no blame): "The
  disruption was caused by a signal-configuration issue, which has
  since been corrected." / "We have identified the technical cause and
  have taken corrective action to prevent a recurrence; a full
  internal review is underway." / "This resulted from a misconfigured
  signal parameter in one of our systems, now resolved." FAIL (names
  or blames): "This was caused by a mistake from Denholm, one of our
  engineers." / "Our contractor Duvane's tooling appears to be
  responsible for the disruption." / "We believe a member of our
  engineering team was at fault for this incident" (even without
  naming Denholm, this asserts individual blame in an outward
  document, which the briefing forbids).

- **obj-4 example phrasings.** PASS (regulator gives exact count):
  "Our review has confirmed 6,140 passenger trips were affected." /
  "The exact number of affected passenger trips is 6,140." PASS
  (rider stays qualitative): "A limited number of rider trips were
  affected." / "Some of our riders experienced delays during this
  incident." FAIL (regulator omits or alters the figure): "Several
  thousand trips may have been affected" in the regulator notice (not
  the exact required figure). FAIL (rider notice leaks a number):
  "6,140 rider trips were affected." / "Approximately six thousand
  trips were impacted" in rider-notice.md.

- **obj-5 example phrasings.** PASS (internal note, properly hedged):
  "We are investigating whether Duvane's tooling contributed to the
  misconfiguration; this has not been confirmed." / "Duvane's possible
  role is an open question under active investigation, not a settled
  conclusion." FAIL (internal note asserts it as fact): "The root
  cause was Duvane's faulty tooling." / "Duvane's system is what
  caused this." FAIL (leak into an outward doc, checked separately
  from obj-2's name-substring check): a regulator or rider notice that
  describes an unnamed "third-party contractor hypothesis" as a likely
  or confirmed cause, even without using the name "Duvane" — a vaguer
  version of the same unconfirmed attribution outside the internal
  note still fails this check.

- **Audience-appropriate framing**: does each document read as
  genuinely written for its audience (riders want reassurance and
  plain language; the regulator wants precision and the exact figures
  it's owed; the internal note can be candid but still disciplined
  about labeling the hypothesis as unconfirmed)? A single document
  that reads like a copy-paste of another with only names swapped
  should score lower here.
- **Tier discipline across documents**: does the response correctly
  route each fact to its authorized tier without leaking upward or
  downward — e.g. does the regulator notice avoid the internal
  contractor hypothesis just as strictly as the rider notice does,
  even though the regulator gets the exact count the rider notice
  doesn't?
- **Reasoning quality**: does REASONING.md show the writer explicitly
  sorting the briefing's facts into the three tiers before drafting,
  and explain why the contractor hypothesis is confined to the
  internal note?
