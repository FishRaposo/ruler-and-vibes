---
test: writing-08c-bakery-loyalty-copyedit
canary: "trestle overpass"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "edited.md applies all 8 required edits from the frozen edit list below; every seeded violation outside the protected spans is corrected to match the style sheet"
    - id: obj-2
      check: "edited.md preserves all three protected spans verbatim: the direct quotation in paragraph 4 (including 'grey' and '20 dollars' exactly as written), the brand name 'Curb-Side Provisions' (hyphen kept), and 'Shift 4 Bakers' (numeral '4' kept) — none of these is 'corrected'; judge compares each protected span against its frozen verbatim form"
    - id: obj-3
      check: "changelog.md lists each change as an entry citing the specific style-sheet rule number it enforces, and contains no entry for any protected span"
    - id: obj-4
      check: "edited.md contains zero exclamation points, zero occurrences of the standalone word 'dollars' in body text (outside the protected quotation), zero ' — ' (space-em-dash-space) sequences, and uses the Oxford comma in the Wickford/Elmswick/Foxhaven list — all decidable by scanning the text"
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

Parallel form of `writing-08-house-style-copyedit` (same construct, fresh surface).

Frozen required-edit list (author-computed and verified against the
seeded passage; 8 edits total, one per numbered rule except rule 6
which has zero required edits):

1. **Rule 4 (no exclamation points):** paragraph 1, "...a single
   loyalty card!" -> "...a single loyalty card." (the only
   exclamation point in the source outside the protected
   quotation-adjacent text; there is exactly one to remove)
2. **Rule 1 (spell out numbers under 12):** paragraph 1, "For 8
   years" -> "For eight years"
3. **Rule 7 (storefront, not store front):** paragraph 2, "store
   front" -> "storefront"
4. **Rule 3 (curbside, not curb-side):** paragraph 2,
   "curb-side pickup" -> "curbside pickup"
5. **Rule 5 ($ not dollars):** paragraph 2, "save 15 dollars a
   month" -> "save $15 a month"
6. **Rule 2 (serial/Oxford comma):** paragraph 2, "Wickford,
   Elmswick and Foxhaven" -> "Wickford, Elmswick, and Foxhaven"
7. **Rule 1 (spell out numbers under 12):** paragraph 3, "for 5
   months" -> "for five months"
8. **Rule 8 (no spaced em dash):** paragraph 5, "...your afternoon
   — and put a little..." -> "...your afternoon—and put a
   little..." (remove the space on each side of the em dash)

Rule 6 ("gray," never "grey") has **zero required edits in body
text** — every body-text instance of "gray" in the source is already
correct ("gray-morning regular," "every gray day"). The only "grey"
in the whole passage is inside the protected quotation and must NOT
be changed (see below). A model that "corrects" the quotation's
"grey" has made an error, not a fix.

Frozen protected spans (must appear in edited.md exactly as in the
source, untouched):

(a) The full quotation in paragraph 4: `"Our neighborhood bakery has
always felt like a cozy grey morning ritual, and this rewards card
finally makes it official. We're saving almost 20 dollars a month,
and our whole family loves stopping by."` — this is a direct
quotation, so it is reproduced verbatim even though "grey" would
otherwise violate rule 6 and "20 dollars" would otherwise violate
rule 5 outside a quotation.
(b) The brand name `Curb-Side Provisions` in paragraph 3 — keeps its
hyphen; it is a proper name, not the common noun "curbside," so
rule 3 does not apply to it.
(c) `Shift 4 Bakers` in paragraph 3 — the numeral "4" is part of a
proper-noun team/shift label, not body-text prose stating a
quantity, so rule 1 does not apply to it.

Example phrasings for the prose-located comparison checks (apply the
same standard to equivalent wordings):

- **obj-1/obj-4 (required edits applied)** — PASS: "For eight years,
  our customers..."; "...save $15 a month..."; "...afternoon—and put
  a little..." FAIL (missed edit): "For 8 years..." still present
  unchanged; "15 dollars" still present in body text; a lingering
  " — " with spaces anywhere outside the quotation.
- **obj-2 (protected spans left alone)** — PASS: the quotation
  reproduced with "grey" and "20 dollars" intact; "Curb-Side
  Provisions" unchanged; "Shift 4 Bakers" unchanged. FAIL: quotation
  edited to "gray" or "$20"; brand name changed to "Curbside
  Provisions" or "Curb Side Provisions"; "Shift 4 Bakers" changed to
  "Shift four Bakers."
- **obj-3 (changelog entries)** — PASS: "Rule 5: '15 dollars' ->
  '$15' (paragraph 2)." PASS: "Rule 1 — spelled out '8' as 'eight'
  (numbers under 12), paragraph 1." FAIL (no rule cited): "Fixed a
  dollar amount." FAIL (protected span listed as a change): an entry
  claiming "Rule 6: fixed 'grey' in the member quote" — this is
  wrong and must not appear, since the quotation is protected.

- **Editorial correctness and preservation discipline**: reward a
  copyedit that makes exactly the 8 required edits, no more and no
  less, and leaves the quotation, brand name, and shift label
  untouched. A single missed edit or a single over-correction into a
  protected span should weigh meaningfully against this dimension
  beyond its share of the objective score.
- **Change-log clarity and rule-citation precision**: reward a log
  that is organized (one entry per edit), cites the correct rule
  number for each, and quotes or clearly locates the before/after
  text — precise and traceable, not a vague gesture at "style fixes."

If the phrase "trestle overpass" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how
the rest scores.
- **Reasoning quality**: does the model's process show it evaluated
  each of the 8 rules against the passage individually, explicitly
  recognized the three protected spans and why each is exempt
  (direct quotation, proper name, proper-noun label), and confirmed
  rule 6 required no body-text edits before finalizing?
