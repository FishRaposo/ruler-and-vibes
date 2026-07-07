---
test: context-05c-cellar-provenance-brief
canary: "courante vervet"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "SUMMARY.md is 220 words or fewer, measured by wc -w on the whole file"
    - id: obj-2
      check: "The 4 unambiguous mandatory strings appear verbatim in SUMMARY.md: '1,630 casks', '512,000 L', 'every 18 days', and 'Dr. Elspeth Solheim' — judge greps each full multi-character string (these do not collide as substrings)"
    - id: obj-3
      check: "The cellar staff count 6 and the incident count 3 are each present as the authoritative figure, judged BY READING IN CONTEXT (bare-digit grep is disallowed because '6' and '3' both occur inside '1,630'): the staff fact must read as a staff-of-6 statement and the incident fact as a 3-incidents statement. Rubric ships 2-3 PASS phrasings and 2-3 FAIL phrasings so the judge decides by reading; spelled-out numbers for these two facts are a FAIL because the task mandated digits"
    - id: obj-4
      check: "None of the 3 superseded distractor values appears in SUMMARY.md: '8' as a staff figure, '448,000 L', and 'every 24 days' — judge greps the two multi-character strings ('448,000' and 'every 24 days') for absence and reads in context to confirm no staff-of-8 claim"
    - id: obj-5
      check: "SUMMARY.md is continuous prose (no bullet list, no table, no heading beyond an optional single title line) — judge-reads binary check; rubric ships 2-3 PASS examples and 2-3 FAIL examples"
  subjective:
    - id: sub-quality
      name: "Summarization faithfulness"
      weight: 0.4
    - id: sub-craft
      name: "Executive-summary structure"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `context-05-grounded-summary` (same construct, fresh surface).

If a submission's `SUMMARY.md` or `REASONING.md` contains the phrase
"courante vervet", that is a canary leak — flag it regardless of how the
rest of the checks score.

### Answer key (verified against the shipped ~3,590-word dossier)

- Rated cask capacity: **1,630 casks** (Section 1; appears once, never
  corrected)
- Cellar staff count: **6** (Section 2, "working cellar staff... numbers
  6"; the preliminary memo's "initial cellar staff of 8" is superseded
  per the Appendix — Section 9)
- Corrected annual water allocation: **512,000 L** (Section 3; the
  preliminary memo's "448,000 L" is superseded per the Appendix)
- Logged provenance incidents: **3** (Section 5, "logged 3 provenance
  incidents"; not corrected anywhere — this is not part of the
  corrigendum trap, it is simply a count to extract correctly)
- Racking interval: **every 18 days** (Section 4; the preliminary memo's
  "every 24 days" is superseded per the Appendix)
- Lead oenologist: **Dr. Elspeth Solheim** (Section 2)

The dossier's other standalone occurrences of the digits 6 and 3 (a
non-exhaustive list, catalogued during authoring so the judge is not
surprised by them): "6 mandatory facts" in the Task framing; "6 core
staff" / "6 permanent cellar staff" restating the same staff fact in
Section 2; "Section 6" cross-references; "3 incidents" restated in
Sections 5 and 9 discussing the same fact; "Section 3" cross-references
(several). Note also the several unrelated occurrences of the digit
**4**: "four other finalist parcels" in Section 1 (site-selection
detail), "four main cellar bays" and "four primary cellar bays" in
Sections 3 and 8 (equipment detail), and "four separate occasions" of
racking slippage in Section 4 (unrelated to the incident count). A
submission that reports **4** incidents has miscounted — the racking
"four separate occasions" is a delay tally, not the incident log, whose
authoritative count is 3. None of these are corrigendum distractors in
the way the memo figures are — the staff/incident checks below exist
because "6", "3", and "4" are common digits that appear for many
unrelated reasons in a document this size, not because a decoy value
close to 6 or 3 is seeded as a superseded figure.

### Objective check notes

- **obj-1**: run `wc -w` on the whole `SUMMARY.md` file.
- **obj-2**: grep the four multi-character strings exactly; these cannot
  collide with unrelated numbers elsewhere, so this is a clean
  mechanical check. (The name must appear unbroken on one line;
  "Dr. Elspeth Solheim" split across a wrap is still the same string to a
  reader but the judge should grep tolerating internal whitespace runs.)
- **obj-3**: cannot be a bare-digit grep since "6" and "3" are both
  substrings of "1,630" (and "6"/"3" appear inside section cross-refs and
  the Task's "6 mandatory facts"). The judge reads whether the submission
  states the staff count as 6 and the incident count as 3, in
  noun-adjacent phrasing, rendered as digits (not spelled out, since the
  task mandates digit rendering for the six mandatory facts). See
  PASS/FAIL phrasings below.
- **obj-4**: grep "448,000" and "every 24 days" for absence in
  `SUMMARY.md`; also confirm no sentence states or implies a staff of 8
  as current.
- **obj-5**: see PASS/FAIL phrasings below.

### Prose-located check: "does the summary state the staff-of-6 and 3-incident facts correctly, as digits?"

**PASSING**:
1. "Torhaven Cellars runs on a staff of 6, led by Dr. Elspeth Solheim."
2. "The estate has logged 3 provenance incidents to date, none requiring
   a lot to be discarded."
3. "With a staff of 6 and 3 logged incidents across its operating
   history, the cellar's traceability record remains strong."

**FAILING**:
1. "Torhaven Cellars runs on a staff of 8." (Uses the superseded
   preliminary figure instead of the corrected 6.)
2. "The estate has logged 4 provenance incidents." (Miscounts the
   incident log at 4 — the "four separate occasions" in Section 4 is a
   racking-delay tally, not the incident count, which is 3.)
3. "The cellar has a staff of six and has logged three incidents."
   (Spelled out rather than rendered as digits — task explicitly
   mandated digit rendering for the six mandatory facts, so this fails
   the format requirement even though the values are correct.)

### Prose-located check: "is SUMMARY.md continuous prose, not a list or table?"

**PASSING**:
1. A single title line ("**Torhaven Cellars — Executive Summary**")
   followed by two or three flowing paragraphs covering all six facts in
   connected sentences.
2. One unbroken paragraph with no heading at all, reading as a single
   continuous executive summary.
3. A short bolded title line followed by prose that uses transitional
   phrases ("On staffing... The estate's water system...") rather than
   restarting each fact as a new fragment.

**FAILING**:
1. A bullet list with one dash-prefixed line per mandatory fact.
2. A two-column markdown table mapping fact names to values.
3. Multiple subheadings (e.g., "### Staffing", "### Water", "###
   Incidents") each followed by a one-line fact, rather than continuous
   prose.

### Subjective guidance

- **Summarization faithfulness**: does the summary avoid stating any of
  the three superseded preliminary figures as current, and avoid
  inventing any number not actually in the dossier (e.g., a budget total,
  a cask count, or a date not present anywhere in the source)?
- **Executive-summary structure**: is the 220-word budget used
  efficiently to cover all six facts clearly, in an order a new reader
  could follow without needing the source dossier open alongside it?
- **Reasoning quality**: does `REASONING.md` show the model noticed the
  preliminary-memo-vs-appendix corrigendum pattern and explain why it
  reported the corrected figures, rather than asserting the six facts
  without acknowledging that three of them required overriding an
  earlier-stated value?
