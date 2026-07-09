---
test: context-05-grounded-summary
canary: "buckwheat carousel"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "SUMMARY.md is 220 words or fewer, measured by wc -w on the whole file"
    - id: obj-2
      check: "The 4 unambiguous mandatory strings appear verbatim in SUMMARY.md: '2,400 m', '418,000 kWh', 'every 21 days', and 'Dr. Imara Solvang' — judge greps each full multi-character string (these do not collide as substrings)"
    - id: obj-3
      check: "The crew count 7 and the incident count 4 are each present as the authoritative figure, judged BY READING IN CONTEXT (bare-digit grep is disallowed because '4' occurs inside '2,400' and '418,000'): the crew fact must read as a crew-of-7 statement and the incident fact as a 4-incidents statement. Rubric ships 2-3 PASS phrasings and 2-3 FAIL phrasings so the judge decides by reading; spelled-out numbers for these two facts are a FAIL because the task mandated digits"
    - id: obj-4
      check: "None of the 3 superseded distractor values appears in SUMMARY.md: '9' as a crew figure, '365,000 kWh', and 'every 28 days' — judge greps the two multi-character strings ('365,000' and 'every 28 days') for absence and reads in context to confirm no crew-of-9 claim"
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
anchors:
  - id: Summarization faithfulness
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Executive-summary structure
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "buckwheat carousel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (verified against the shipped ~3,470-word dossier)

- Rated depth: **2,400 m** (Section 1; appears once, never corrected)
- Crew count: **7** (Section 2, "onsite crew... numbers 7"; the
  preliminary memo's "initial crew of 9" is superseded per the
  Appendix — Section 9)
- Corrected annual power budget: **418,000 kWh** (Section 3; the
  preliminary memo's "365,000 kWh" is superseded per the Appendix)
- Logged incidents: **4** (Section 5, "logged 4 incidents"; not
  corrected anywhere — this is not part of the corrigendum trap, it is
  simply a count to extract correctly)
- Resupply interval: **every 21 days** (Section 4; the preliminary
  memo's "every 28 days" is superseded per the Appendix)
- Lead scientist: **Dr. Imara Solvang** (Section 2)

The dossier's other standalone occurrences of the digits 7 and 4 (a
non-exhaustive list, catalogued during authoring so the judge is not
surprised by them): "7-person crew" restating the same crew fact
in Section 8; "Section 7" cross-references (several); "4 incidents"
restated in Sections 5 and 9 discussing the same fact; "four other
finalist sites" in Section 1 (site-selection detail, unrelated to any
mandatory fact); "four separate occasions" of resupply delay in
Section 4 (unrelated to the incident count). None of these are
distractor traps in the way the corrigendum figures are — the
crew/incident checks below exist because "7" and "4" are common
digits that appear for many unrelated reasons in a document this
size, not because a decoy value close to 7 or 4 is seeded.

### Objective check notes

- **obj-1**: run `wc -w` on the whole `SUMMARY.md` file.
- **obj-2**: grep the four multi-character strings exactly; these
  cannot collide with unrelated numbers elsewhere, so this is a clean
  mechanical check.
- **obj-3**: cannot be a bare-digit grep since "4" is a substring of
  "2,400" and "418,000" (and "7" could appear inside other numbers a
  submission introduces). The judge reads whether the submission
  states the crew count as 7 and the incident count as 4, in
  noun-adjacent phrasing, rendered as digits (not spelled out, since
  the task mandates digit rendering for the six mandatory facts). See
  PASS/FAIL phrasings below.
- **obj-4**: grep "365,000" and "every 28 days" for absence in
  `SUMMARY.md`; also confirm no sentence states or implies a crew of 9
  as current.
- **obj-5**: see PASS/FAIL phrasings below.

### Prose-located check: "does the summary state the crew-of-7 and 4-incident facts correctly, as digits?"

**PASSING**:
1. "Station Kelburn is crewed by 7 people, led by Dr. Imara Solvang."
2. "The station has logged 4 incidents to date, none requiring
   evacuation."
3. "With a crew of 7 and 4 logged incidents in its operating history,
   the station's safety record remains strong."

**FAILING**:
1. "Station Kelburn is crewed by 9 people." (Uses the superseded
   preliminary figure instead of the corrected 7.)
2. "The station has a small crew and a handful of incidents on
   record." (Omits the required digit figures entirely.)
3. "The station has a crew of seven and has logged four incidents."
   (Spelled out rather than rendered as digits — task explicitly
   mandated digit rendering for the six mandatory facts, so this
   fails the format requirement even though the values are correct.)

### Prose-located check: "is SUMMARY.md continuous prose, not a list or table?"

**PASSING**:
1. A single title line ("**Station Kelburn — Executive Summary**")
   followed by two or three flowing paragraphs covering all six facts
   in connected sentences.
2. One unbroken paragraph with no heading at all, reading as a single
   continuous executive summary.
3. A short bolded title line followed by prose that uses transitional
   phrases ("In terms of staffing... The station's power system...")
   rather than restarting each fact as a new fragment.

**FAILING**:
1. A bullet list with one dash-prefixed line per mandatory fact.
2. A two-column markdown table mapping fact names to values.
3. Multiple subheadings (e.g., "### Staffing", "### Power", "###
   Incidents") each followed by a one-line fact, rather than
   continuous prose.

### Subjective guidance

- **Summarization faithfulness**: does the summary avoid stating any
  of the three superseded preliminary figures as current, and avoid
  inventing any number not actually in the dossier (e.g., a budget
  total, a headcount, or a date not present anywhere in the source)?
- **Executive-summary structure**: is the 220-word budget used
  efficiently to cover all six facts clearly, in an order a new reader
  could follow without needing the source dossier open alongside it?
- **Reasoning quality**: does `REASONING.md` show the model noticed
  the preliminary-memo-vs-appendix corrigendum pattern and explain why
  it reported the corrected figures, rather than asserting the six
  facts without acknowledging that three of them required overriding
  an earlier-stated value?
