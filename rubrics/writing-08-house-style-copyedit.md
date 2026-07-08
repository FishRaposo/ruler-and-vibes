---
test: writing-08-house-style-copyedit
canary: "granite firefly"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "edited.md applies all 8 required edits from the frozen edit list below; every seeded violation outside the protected spans is corrected to match the style sheet"
    - id: obj-2
      check: "edited.md preserves all three protected spans verbatim: the direct quotation in paragraph 4 (including 'towards' and '40 percent' exactly as written), the brand name 'E-Mailer Pro' (hyphen kept), and 'Tier 3 Support' (numeral '3' kept) — none of these is 'corrected'; judge compares each protected span against its frozen verbatim form"
    - id: obj-3
      check: "changelog.md lists each change as an entry citing the specific style-sheet rule number it enforces, and contains no entry for any protected span"
    - id: obj-4
      check: "edited.md contains zero exclamation points, zero occurrences of the standalone word 'percent' in body text (outside the protected quotation), zero ' — ' (space-em-dash-space) sequences, and uses the Oxford comma in the North America/Europe/Asia-Pacific list — all decidable by scanning the text"
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

If the phrase "granite firefly" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Frozen required-edit list (author-computed and verified against the
seeded passage; 8 edits total, one per numbered rule except rule 6
which has zero required edits):

1. **Rule 4 (no exclamation points):** paragraph 1, "...a single
   dashboard!" -> "...a single dashboard." (the only exclamation
   point in the source outside the protected quotation-adjacent
   text; there is exactly one to remove)
2. **Rule 1 (spell out numbers under 10):** paragraph 1, "For 9
   years" -> "For nine years"
3. **Rule 3 (email, not e-mail):** paragraph 2, "e-mail-based" ->
   "email-based"
4. **Rule 7 (website, not web site):** paragraph 2, "web site" ->
   "website"
5. **Rule 5 (% not percent):** paragraph 2, "dropped by 42 percent"
   -> "dropped by 42%"
6. **Rule 2 (serial/Oxford comma):** paragraph 2, "North America,
   Europe and Asia-Pacific" -> "North America, Europe, and
   Asia-Pacific"
7. **Rule 1 (spell out numbers under 10):** paragraph 3, "for 6
   months" -> "for six months"
8. **Rule 8 (no spaced em dash):** paragraph 5, "...your team's day
   — and put more time..." -> "...your team's day—and put more
   time..." (remove the space on each side of the em dash)

Rule 6 ("toward," never "towards") has **zero required edits in body
text** — every body-text instance of "toward" in the source is
already correct ("toward—finally—a single dashboard," "building
toward this future"). The only "towards" in the whole passage is
inside the protected quotation and must NOT be changed (see below).
A model that "corrects" the quotation's "towards" has made an error,
not a fix.

Frozen protected spans (must appear in edited.md exactly as in the
source, untouched):

(a) The full quotation in paragraph 4: `"Our support team has been
moving towards a self-serve model for years, and this portal finally
gets us there. We cut our average response time by nearly 40
percent, and our staff has never been happier."` — this is a direct
quotation, so it is reproduced verbatim even though "towards" would
otherwise violate rule 6 and "40 percent" would otherwise violate
rule 5 outside a quotation.
(b) The brand name `E-Mailer Pro` in paragraph 3 — keeps its hyphen;
it is a proper name, not the common noun "email," so rule 3 does not
apply to it.
(c) `Tier 3 Support` in paragraph 3 — the numeral "3" is part of a
proper-noun team/tier label, not body-text prose stating a quantity,
so rule 1 does not apply to it.

Example phrasings for the prose-located comparison checks (apply the
same standard to equivalent wordings):

- **obj-1/obj-4 (required edits applied)** — PASS: "For nine years,
  our customers..."; "...dropped by 42%..."; "...day—and put more
  time..." FAIL (missed edit): "For 9 years..." still present
  unchanged; "42 percent" still present in body text; a lingering
  " — " with spaces anywhere outside the quotation.
- **obj-2 (protected spans left alone)** — PASS: the quotation
  reproduced with "towards" and "40 percent" intact; "E-Mailer Pro"
  unchanged; "Tier 3 Support" unchanged. FAIL: quotation edited to
  "toward" or "40%"; brand name changed to "Emailer Pro" or "E-mailer
  Pro"; "Tier 3 Support" changed to "Tier three Support."
- **obj-3 (changelog entries)** — PASS: "Rule 5: '42 percent' ->
  '42%' (paragraph 2)." PASS: "Rule 1 — spelled out '9' as 'nine'
  (numbers under 10), paragraph 1." FAIL (no rule cited): "Fixed a percentage."
  FAIL (protected span listed as a change): an entry claiming
  "Rule 6: fixed 'towards' in the testimonial quote" — this is
  wrong and must not appear, since the quotation is protected.

- **Editorial correctness and preservation discipline**: reward a
  copyedit that makes exactly the 8 required edits, no more and no
  less, and leaves the quotation, brand name, and tier label
  untouched. A single missed edit or a single over-correction into a
  protected span should weigh meaningfully against this dimension
  beyond its share of the objective score.
- **Change-log clarity and rule-citation precision**: reward a log
  that is organized (one entry per edit), cites the correct rule
  number for each, and quotes or clearly locates the before/after
  text — precise and traceable, rather than a vague gesture at "style
  fixes."
- **Reasoning quality**: does the model's process show it evaluated
  each of the 8 rules against the passage individually, explicitly
  recognized the three protected spans and why each is exempt
  (direct quotation, proper name, proper-noun label), and confirmed
  rule 6 required no body-text edits before finalizing?
