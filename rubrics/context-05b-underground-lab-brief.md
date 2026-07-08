---
test: context-05b-underground-lab-brief
canary: "sarabande patas"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "SUMMARY.md is 210 words or fewer, measured by wc -w on the whole file"
    - id: obj-2
      check: "The 4 unambiguous mandatory strings appear verbatim in SUMMARY.md: '1,750 m', '529,000 kWh', 'every 35 days', and 'Dr. Halvard Torsby' — judge greps each full multi-character string (these do not collide as substrings)"
    - id: obj-3
      check: "The crew count 6 and the incident count 5 are each present as the authoritative figure, judged BY READING IN CONTEXT (bare-digit grep is disallowed because '5' occurs inside '1,750', '529,000', and 'every 35 days', and '6' could appear inside other numbers a submission introduces): the crew fact must read as a crew-of-6 statement and the incident fact as a 5-incidents statement. Rubric ships 2-3 PASS phrasings and 2-3 FAIL phrasings so the judge decides by reading; spelled-out numbers for these two facts are a FAIL because the task mandated digits"
    - id: obj-4
      check: "None of the 3 superseded distractor values appears in SUMMARY.md: '8' as a crew figure, '468,000 kWh', and 'every 45 days' — judge greps the two multi-character strings ('468,000' and 'every 45 days') for absence and reads in context to confirm no crew-of-8 claim"
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

Parallel form of `context-05-grounded-summary` (same construct, fresh
surface).

If the phrase "sarabande patas" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified against the shipped ~2,700-word dossier)

- Rated overburden depth: **1,750 m** (Section 1; appears once, never
  corrected)
- Crew count: **6** (Section 2, "onsite crew... numbers 6"; the
  preliminary memo's "initial crew of 8" is superseded per the Appendix
  — Section 9)
- Corrected annual power budget: **529,000 kWh** (Section 3; the
  preliminary memo's "468,000 kWh" is superseded per the Appendix)
- Logged incidents: **5** (Section 5, "logged 5 incidents"; not
  corrected anywhere — this is not part of the corrigendum trap, it is
  simply a count to extract correctly)
- Maintenance-window interval: **every 35 days** (Section 4; the
  preliminary memo's "every 45 days" is superseded per the Appendix)
- Lead scientist: **Dr. Halvard Torsby** (Section 2)

The dossier's other standalone occurrences of the digits 6 and 5 (a
non-exhaustive list, catalogued during authoring so the judge is not
surprised by them): "6-person crew" restating the same crew fact in
Section 8; "Section 6" cross-references (several); "6 mandatory facts"
in the Task preamble (an instruction to the model, not a dossier figure);
"six other finalist mines" in Section 1 (site-selection detail, unrelated
to any mandatory fact); "six separate occasions" of maintenance delay in
Section 4 (unrelated to the incident count); "Section 5" cross-references
(several); "5 incidents" restated in Sections 5 and 9 discussing the same
fact. None of these are distractor traps in the way the corrigendum
figures are — the crew/incident checks below exist because "6" and "5"
are common digits that appear for many unrelated reasons in a document
this size, not because a decoy value close to 6 or 5 is seeded.

### Objective check notes

- **obj-1**: run `wc -w` on the whole `SUMMARY.md` file.
- **obj-2**: grep the four multi-character strings exactly; these cannot
  collide with unrelated numbers elsewhere, so this is a clean mechanical
  check.
- **obj-3**: cannot be a bare-digit grep since "5" is a substring of
  "1,750", "529,000", and "every 35 days" (and "6" could appear inside
  other numbers a submission introduces). The judge reads whether the
  submission states the crew count as 6 and the incident count as 5, in
  noun-adjacent phrasing, rendered as digits (not spelled out, since the
  task mandates digit rendering for the six mandatory facts). See
  PASS/FAIL phrasings below.
- **obj-4**: grep "468,000" and "every 45 days" for absence in
  `SUMMARY.md`; also confirm no sentence states or implies a crew of 8 as
  current.
- **obj-5**: see PASS/FAIL phrasings below.

### Prose-located check: "does the summary state the crew-of-6 and 5-incident facts correctly, as digits?"

**PASSING**:
1. "Karrasand Deep is crewed by 6 people, led by Dr. Halvard Torsby."
2. "The laboratory has logged 5 incidents to date, none requiring
   evacuation."
3. "With a crew of 6 and 5 logged incidents in its operating history, the
   laboratory's safety record remains strong."

**FAILING**:
1. "Karrasand Deep is crewed by 8 people." (Uses the superseded
   preliminary figure instead of the corrected 6.)
2. "The laboratory has a small crew and a handful of incidents on
   record." (Omits the required digit figures entirely.)
3. "The laboratory has a crew of six and has logged five incidents."
   (Spelled out rather than rendered as digits — task explicitly mandated
   digit rendering for the six mandatory facts, so this fails the format
   requirement even though the values are correct.)

### Prose-located check: "is SUMMARY.md continuous prose, not a list or table?"

**PASSING**:
1. A single title line ("**Karrasand Deep — Executive Summary**")
   followed by two or three flowing paragraphs covering all six facts in
   connected sentences.
2. One unbroken paragraph with no heading at all, reading as a single
   continuous executive brief.
3. A short bolded title line followed by prose that uses transitional
   phrases ("On staffing... The laboratory's power system...") rather
   than restarting each fact as a new fragment.

**FAILING**:
1. A bullet list with one dash-prefixed line per mandatory fact.
2. A two-column markdown table mapping fact names to values.
3. Multiple subheadings (e.g., "### Staffing", "### Power", "###
   Incidents") each followed by a one-line fact, rather than continuous
   prose.

### Subjective guidance

- **Summarization faithfulness**: does the summary avoid stating any of
  the three superseded preliminary figures as current, and avoid
  inventing any number not actually in the dossier (e.g., a budget total,
  a headcount, or a date not present anywhere in the source)?
- **Executive-summary structure**: is the 210-word budget used
  efficiently to cover all six facts clearly, in an order a new reader
  could follow without needing the source dossier open alongside it?
- **Reasoning quality**: does `REASONING.md` show the model noticed the
  preliminary-memo-vs-appendix corrigendum pattern and explain why it
  reported the corrected figures, rather than asserting the six facts
  without acknowledging that three of them required overriding an
  earlier-stated value?
