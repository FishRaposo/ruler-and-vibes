---
test: writing-08b-transit-newsletter-copyedit
canary: "vanillabean anise"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "edited.md applies all 8 required edits from the frozen edit list below; every seeded violation outside the protected spans is corrected to match the style sheet"
    - id: obj-2
      check: "edited.md preserves all three protected spans verbatim: the direct quotation in paragraph 4 (including 'ride-share' and 'Route number 15' exactly as written), the partner name 'Non-Profit Bike Alliance' (hyphen and capitalization kept), and 'Corridor 4 Team' (numeral '4' kept) — none of these is 'corrected'; judge compares each protected span against its frozen verbatim form"
    - id: obj-3
      check: "changelog.md lists each change as an entry citing the specific style-sheet rule number it enforces, and contains no entry for any protected span"
    - id: obj-4
      check: "edited.md contains zero exclamation points, zero occurrences of the phrase 'Route number' outside the protected quotation, zero ' — ' (space-em-dash-space) sequences, and uses the Oxford comma in the fare-disputes/refund-delays/missed-transfers list — all decidable by scanning the text"
    - id: obj-5
      check: "changelog.md whole-file word count is at most 250, verified with wc -w"
  subjective:
    - id: sub-quality
      name: "Editorial correctness and preservation discipline"
      weight: 0.4
    - id: sub-craft
      name: "Change-log clarity and rule-citation precision"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `writing-08-house-style-copyedit` (same construct, fresh
surface).

Frozen required-edit list (author-computed and verified against the
seeded passage; 8 edits total, one per numbered rule except rule 6
which has zero required edits):

1. **Rule 4 (no exclamation points):** paragraph 1, "...carried for
   years!" -> "...carried for years." (the only exclamation point in
   the source outside the protected quotation; there is exactly one to
   remove)
2. **Rule 1 (spell out numbers under 10):** paragraph 1, "For 8 years"
   -> "For eight years"
3. **Rule 7 (check-in, not checkin):** paragraph 2, "checkin kiosks"
   -> "check-in kiosks"
4. **Rule 5 (# not "number"):** paragraph 2, "Route number 20" ->
   "Route #20"
5. **Rule 2 (serial/Oxford comma):** paragraph 2, "fare disputes,
   refund delays and missed transfers" -> "fare disputes, refund
   delays, and missed transfers"
6. **Rule 3 (nonprofit, not non-profit):** paragraph 2, "non-profit
   fare-assistance partners" -> "nonprofit fare-assistance partners"
7. **Rule 1 (spell out numbers under 10):** paragraph 3, "for 7
   months" -> "for seven months"
8. **Rule 8 (no spaced em dash):** paragraph 5, "...a rider's morning
   — proof that..." -> "...a rider's morning—proof that..." (remove
   the space on each side of the em dash)

Rule 6 ("rideshare," never "ride-share") has **zero required edits in
body text** — every body-text instance of "rideshare" in the source is
already correct (paragraph 1's "a rideshare pickup" and paragraph 5's
"rideshare drop-off points"). The only "ride-share" in the whole
passage is inside the protected quotation and must NOT be changed (see
below). A model that "corrects" the quotation's "ride-share" has made
an error, not a fix.

Frozen protected spans (must appear in edited.md exactly as in the
source, untouched):

(a) The full quotation in paragraph 4: `"I park my bike at the
ride-share rack next to the Route number 15 stop every morning, and
PathPass is the first thing that's made my whole commute make sense.
It shaved almost half my travel time, and I've told every neighbor I
know to get one."` — this is a direct quotation, so it is reproduced
verbatim even though "ride-share" would otherwise violate rule 6 and
"Route number 15" would otherwise violate rule 5 outside a quotation.
(b) The partner name `Non-Profit Bike Alliance` in paragraph 3 — keeps
its hyphen and capitalization; it is a proper name, not the common
noun "nonprofit," so rule 3 does not apply to it.
(c) `Corridor 4 Team` in paragraph 3 — the numeral "4" is part of a
proper-noun team label, not body-text prose stating a quantity, so
rule 1 does not apply to it.

Example phrasings for the prose-located comparison checks (apply the
same standard to equivalent wordings):

- **obj-1/obj-4 (required edits applied)** — PASS: "For eight years,
  our riders..."; "...check-in kiosks recognize..."; "...morning—proof
  that..." FAIL (missed edit): "For 8 years..." still present
  unchanged; "checkin kiosks" still present in body text; a lingering
  " — " with spaces anywhere outside the quotation.
- **obj-2 (protected spans left alone)** — PASS: the quotation
  reproduced with "ride-share" and "Route number 15" intact;
  "Non-Profit Bike Alliance" unchanged; "Corridor 4 Team" unchanged.
  FAIL: quotation edited to "rideshare" or "Route #15"; partner name
  changed to "Nonprofit Bike Alliance" or "Non-profit Bike Alliance";
  "Corridor 4 Team" changed to "Corridor four Team."
- **obj-3 (changelog entries)** — PASS: "Rule 5: 'Route number 20' ->
  'Route #20' (paragraph 2)." PASS: "Rule 1 — spelled out '7' as
  'seven' (numbers under 10), paragraph 3." FAIL (no rule cited):
  "Fixed a route label." FAIL (protected span listed as a change): an
  entry claiming "Rule 6: fixed 'ride-share' in the rider quote" —
  this is wrong and must not appear, since the quotation is protected.

- **Editorial correctness and preservation discipline**: reward a
  copyedit that makes exactly the 8 required edits, no more and no
  less, and leaves the quotation, partner name, and team label
  untouched. A single missed edit or a single over-correction into a
  protected span should weigh meaningfully against this dimension
  beyond its share of the objective score.
- **Change-log clarity and rule-citation precision**: reward a log
  that is organized (one entry per edit), cites the correct rule
  number for each, and quotes or clearly locates the before/after
  text — precise and traceable, not a vague gesture at "style fixes."
  If the phrase "vanillabean anise" appears in any deliverable or
  REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
- **Reasoning quality**: does the model's process show it evaluated
  each of the 8 rules against the passage individually, explicitly
  recognized the three protected spans and why each is exempt (direct
  quotation, proper name, proper-noun label), and confirmed rule 6
  required no body-text edits before finalizing?
