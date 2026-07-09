---
test: context-01c-glasshouse-report
canary: "frieze douc"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "ANSWERS.md contains exactly 12 lines matching 'Q1:' through 'Q12:' in order, with no other content (judge parses lines with node)"
    - id: obj-2
      check: "At least 11 of the 12 answers match the answer key below after whitespace trimming (exact string comparison; accepted variants enumerated per answer)"
    - id: obj-3
      check: "Q5 (corrected utilities spend) is answered 62,295 or 62295 — not the superseded 61,420"
    - id: obj-4
      check: "Q4 (footnote-only accession registry code) is answered exactly BBG-53R"
    - id: obj-5
      check: "Q2 (Fernvale capacity) is answered 395, not the Fernvault's 430"
  subjective:
    - id: sub-quality
      name: "Retrieval fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Answer format discipline"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Retrieval fidelity
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Answer format discipline
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `context-01-needle` (same construct, fresh surface).

If the phrase "frieze douc" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

### Answer key (canonical form; accepted variants in parentheses)

- Q1: 12
- Q2: 395 — this is the trap question; an answer of 430 means the model
  confused the Fernvale with the Fernvault
- Q3: 430
- Q4: BBG-53R (exact string; footnote-only value)
- Q5: 62,295 (accept 62295) — the corrigendum value; an answer of 61,420
  or 61420 means the model missed the Appendix B correction
- Q6: 93.6% (accept 93.6 without the % sign only if the question's
  instruction to include it is otherwise satisfied elsewhere — but strict
  grading treats a missing % sign as a format-discipline deduction, not a
  Q6 failure, since the numeric value is correct)
- Q7: 88.9% (same % sign note as Q6) — an answer of 93.6% here means the
  model conflated the estate-wide rate with the Palmhouse rate
- Q8: 534,700 (accept 534700)
- Q9: 3
- Q10: Curator Wistan Pryce (accept "Wistan Pryce" without the title)
- Q11: 178,000 (accept 178000, $178,000, $178000)
- Q12: 7

### Objective check notes

- **obj-1**: run a small node script that reads `ANSWERS.md`, splits on
  newlines, and confirms exactly 12 non-empty lines each matching
  `/^Q(\d{1,2}):\s*/` in strictly increasing order 1 through 12, with no
  extra prose before, between, or after them. Example command:
  `node -e "const fs=require('fs');const L=fs.readFileSync('ANSWERS.md','utf8').split(/\r?\n/).filter(s=>s.trim());let ok=L.length===12&&L.every((l,i)=>new RegExp('^Q'+(i+1)+':\\\\s*').test(l));console.log(ok?'PASS':'FAIL')"`
- **obj-2**: trim whitespace from each answer and compare case-sensitively
  against the canonical form or any accepted variant above; count how many
  of the 12 match. 11 or 12 matches passes.
- **obj-3**: this is the corrigendum trap (flag 2 in the kit's house
  style — exclude/supersede the earlier figure). 61,420 is explicitly
  superseded in Appendix B; only 62,295 (or 62295) passes.
- **obj-4**: BBG-53R appears only in footnote 1, nowhere in the Section 2
  house roster prose itself — this checks whether the model actually read
  the footnote rather than skimming the main table.
- **obj-5**: the Fernvault (430) and the Fernvale (395) are a deliberate
  confusable-name pair; only 395 passes for Q2.

### Subjective guidance

- **Retrieval fidelity**: does the submission get the harder needles right
  (Q2, Q4, Q5, Q7 — the four traps), not just the easy ones (Q1, Q3, Q9)?
  A submission that nails the easy questions but fumbles all four traps
  should score low here even if its raw obj-2 count looks passable.
  - PASS examples: "Q2=395, Q4=BBG-53R, Q5=62,295, Q7=88.9% — all four
    traps correct"; "got the Fernvale/Fernvault pair right and used the
    Appendix B corrected utilities figure"; "pulled the accession code from
    the footnote and did not conflate the Palmhouse rate with the
    estate-wide rate".
  - FAIL examples: "Q2=430 (took the Fernvault capacity), Q5=61,420 (used
    the superseded Section 3 figure)"; "Q4 left blank or guessed because
    the code was only in a footnote"; "Q7=93.6%, repeating the estate-wide
    rate instead of the Palmhouse-specific one".
- **Answer format discipline**: did the model follow each question's inline
  format instruction (digits only vs. % sign vs. exact string) rather than
  picking its own format? Penalize inconsistent formatting across the 12
  answers (e.g., a thousands separator on some numeric answers but not
  others) even where the underlying value is correct.
  - PASS examples: "digits-only answers are bare integers throughout, the
    two rate answers both carry the % sign, and the code is verbatim with
    its hyphen"; "consistent formatting across all 12 lines matching each
    stated format"; "no stray currency symbols where digits-only was
    requested".
  - FAIL examples: "wrote '$62,295' for Q5 where the value is fine but
    added prose like 'approximately 534,700 visitors'"; "included the % on
    Q6 but omitted it on Q7"; "mixed '178000' and '215,000'-style
    separators arbitrarily across numeric answers".
- **Reasoning quality**: does the reasoning show it noticed the
  corrigendum, the footnote, and the confusable house names as deliberate
  traps, or does it read as if the model got them right by chance?
  Penalize reasoning that doesn't mention re-checking Section 3 against
  Appendix B.
  - PASS examples: "explicitly noted Appendix B supersedes the Section 3
    utilities figure and used 62,295"; "flagged the Fernvault/Fernvale
    name similarity and verified which one Q2 asked about"; "called out
    that the accession code lives only in footnote 1".
  - FAIL examples: "answers are correct but the reasoning never mentions
    the corrigendum or the footnote"; "no sign it distinguished the two
    Fern- houses, so a correct Q2 reads as luck"; "reasoning restates the
    questions without noting any of the deliberate traps".
