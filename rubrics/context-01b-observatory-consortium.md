---
test: context-01b-observatory-consortium
canary: "architrave titi"
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
      check: "Q5 (corrected maintenance spend) is answered 53,180 or 53180 — not the superseded 52,400"
    - id: obj-4
      check: "Q4 (footnote-only instrument registration) is answered exactly DOC-14R"
    - id: obj-5
      check: "Q2 (Kelmarsh Rise aperture) is answered 340, not Kelmarsh Ridge's 372"
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

Parallel form of `context-01-needle` (same construct, fresh surface).

If the phrase "architrave titi" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key (canonical form; accepted variants in parentheses)

- Q1: 16
- Q2: 340 — this is the trap question; an answer of 372 means the model
  confused Kelmarsh Rise with Kelmarsh Ridge
- Q3: 372
- Q4: DOC-14R (exact string; footnote-only value)
- Q5: 53,180 (accept 53180) — the corrigendum value; an answer of 52,400
  or 52400 means the model missed the Appendix B correction
- Q6: 89.6% (accept 89.6 without the % sign only if the question's
  instruction to include it is otherwise satisfied elsewhere — but strict
  grading treats a missing % sign as a format-discipline deduction, not a
  Q6 failure, since the numeric value is correct)
- Q7: 83.5% (same % sign note as Q6) — an answer of 89.6% here means the
  model conflated the network-wide efficiency with the north-ridge station
  rate
- Q8: 418,900 (accept 418900)
- Q9: 3
- Q10: Dr. Isolde Frayn (accept "Isolde Frayn" without the title)
- Q11: 268,000 (accept 268000, $268,000, $268000)
- Q12: 7

### Objective check notes

- **obj-1**: run a small node script that reads `ANSWERS.md`, splits on
  newlines, and confirms exactly 12 non-empty lines each matching
  `/^Q(\d{1,2}):\s*/` in strictly increasing order 1 through 12, with no
  extra prose before, between, or after them. Exact command:
  `node -e "const fs=require('fs');const L=fs.readFileSync(process.argv[1],'utf8').split(/\r?\n/).filter(x=>x.trim());let ok=L.length===12;for(let i=0;i<L.length&&ok;i++){const m=L[i].match(/^Q(\d{1,2}):\s*/);if(!m||Number(m[1])!==i+1)ok=false;}console.log(ok?'obj-1 PASS':'obj-1 FAIL');" ANSWERS.md`
  - PASS phrasings: a file of exactly twelve lines `Q1: 16` … `Q12: 7`
    with nothing else; the same twelve lines with trailing spaces trimmed;
    the twelve lines with a single trailing newline at end of file.
  - FAIL phrasings: a preamble line such as `Here are my answers:` before
    `Q1:`; a blank line or commentary between `Q6:` and `Q7:`; the
    questions answered out of order (e.g. `Q3:` printed before `Q2:`).
- **obj-2**: trim whitespace from each answer and compare case-sensitively
  against the canonical form or any accepted variant above; count how many
  of the 12 match. 11 or 12 matches passes.
  - PASS phrasings: all twelve answers equal to a canonical/variant value;
    eleven correct with a single miss on any one question; `Q11: $268,000`
    using the accepted dollar-sign variant.
  - FAIL phrasings: three or more answers wrong (10 or fewer matches);
    both confusable apertures given as `372`; the network-wide rate
    repeated for both Q6 and Q7.
- **obj-3**: this is the corrigendum trap (flag 2 in the kit's house style
  — exclude/supersede the earlier figure). 52,400 is explicitly superseded
  in Appendix B; only 53,180 (or 53180) passes.
  - PASS phrasings: `Q5: 53,180`; `Q5: 53180`; `Q5: 53,180` with a note
    that Appendix B supersedes Section 3.
  - FAIL phrasings: `Q5: 52,400`; `Q5: 52400`; any figure other than the
    Appendix B corrected total.
- **obj-4**: DOC-14R appears only in footnote 1, nowhere in the Section 2
  instrument roster prose itself — this checks whether the model actually
  read the footnote rather than skimming the main text.
  - PASS phrasings: `Q4: DOC-14R`; the same code cited with an explicit
    "(from footnote 1)" annotation; `Q4: DOC-14R` on its own line.
  - FAIL phrasings: `Q4: DOC14R` (missing the required hyphen); `Q4:
    14R`; `Q4: not stated in the roster` (failing to consult the
    footnote).
- **obj-5**: Kelmarsh Rise (340) and Kelmarsh Ridge (372) are a deliberate
  confusable-name pair; only 340 passes for Q2.
  - PASS phrasings: `Q2: 340`; `Q2: 340` with a note distinguishing Rise
    from Ridge; `Q2: 340 cm` reduced to the digits-only value 340.
  - FAIL phrasings: `Q2: 372` (Kelmarsh Ridge's aperture); `Q2: 340` and
    `Q3: 340` (both given as Rise's value); swapping the two so `Q2: 372`
    and `Q3: 340`.

### Subjective guidance

- **Retrieval fidelity**: does the submission get the harder needles right
  (Q2, Q4, Q5, Q7 — the four traps), not just the easy ones (Q1, Q3, Q9)?
  A submission that nails the easy questions but fumbles all four traps
  should score low here even if its raw obj-2 count looks passable.
- **Answer format discipline**: did the model follow each question's
  inline format instruction (digits only vs. % sign vs. exact string)
  rather than picking its own format? Penalize inconsistent formatting
  across the 12 answers (e.g., a thousands separator on some numeric
  answers but not others) even where the underlying value is correct.
- **Reasoning quality**: does the reasoning show it noticed the
  corrigendum, the footnote, and the confusable instrument names as
  deliberate traps, or does it read as if the model got them right by
  chance? Penalize reasoning that doesn't mention re-checking Section 3
  against Appendix B.
