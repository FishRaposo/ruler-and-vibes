---
test: context-01-needle
canary: "tweed pendulum"
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
      check: "Q5 (corrected maintenance spend) is answered 48,730 or 48730 — not the superseded 48,150"
    - id: obj-4
      check: "Q4 (footnote-only hull registration) is answered exactly MSF-77Q"
    - id: obj-5
      check: "Q2 (Alderpoint capacity) is answered 380, not Aldercrest's 412"
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
---

## Judge guidance

If the phrase "tweed pendulum" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (canonical form; accepted variants in parentheses)

- Q1: 14
- Q2: 380 — this is the trap question; an answer of 412 means the model
  confused Alderpoint with Aldercrest
- Q3: 412
- Q4: MSF-77Q (exact string; footnote-only value)
- Q5: 48,730 (accept 48730) — the corrigendum value; an answer of 48,150
  or 48150 means the model missed the Appendix B correction
- Q6: 91.4% (accept 91.4 without the % sign only if the question's
  instruction to include it is otherwise satisfied elsewhere — but
  strict grading treats a missing % sign as a format-discipline
  deduction, not a Q6 failure, since the numeric value is correct)
- Q7: 87.2% (same % sign note as Q6) — an answer of 91.4% here means the
  model conflated the fleet-wide rate with the north-route rate
- Q8: 612,400 (accept 612400)
- Q9: 2
- Q10: Captain Elena Vosk (accept "Elena Vosk" without the rank)
- Q11: 215,000 (accept 215000, $215,000, $215000)
- Q12: 9

### Objective check notes

- **obj-1**: run a small node script that reads `ANSWERS.md`, splits on
  newlines, and confirms exactly 12 non-empty lines each matching
  `/^Q(\d{1,2}):\s*/` in strictly increasing order 1 through 12, with no
  extra prose before, between, or after them.
- **obj-2**: trim whitespace from each answer and compare case-sensitively
  against the canonical form or any accepted variant above; count how
  many of the 12 match. 11 or 12 matches passes.
- **obj-3**: this is the corrigendum trap (flag 2 in the kit's house
  style — exclude/supersede the earlier figure). 48,150 is explicitly
  superseded in Appendix B; only 48,730 (or 48730) passes.
- **obj-4**: MSF-77Q appears only in footnote 1, nowhere in the Section 2
  vessel roster prose itself — this checks whether the model actually
  read the footnote rather than skimming the main table.
- **obj-5**: Aldercrest (412) and Alderpoint (380) are a deliberate
  confusable-name pair; only 380 passes for Q2.

### Subjective guidance

- **Retrieval fidelity**: does the submission get the harder needles
  right (Q2, Q4, Q5, Q7 — the four traps), not just the easy ones (Q1,
  Q3, Q9)? A submission that nails the easy questions but fumbles all
  four traps should score low here even if its raw obj-2 count looks
  passable.
- **Answer format discipline**: did the model follow each question's
  inline format instruction (digits only vs. % sign vs. exact string)
  rather than picking its own format? Penalize inconsistent formatting
  across the 12 answers (e.g., a thousands separator on some numeric
  answers but not others) even where the underlying value is correct.
- **Reasoning quality**: does the reasoning show it noticed the
  corrigendum, the footnote, and the confusable vessel names as
  deliberate traps, or does it read as if the model got them right by
  chance? Penalize reasoning that doesn't mention re-checking Section 3
  against Appendix B.
