---
test: research-09-triangulation-matrix
canary: "gudgeon dowsing"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "triangulation.md contains a matrix with exactly 5 claim rows (C1-C5) and 4 source columns (S1-S4); every cell is exactly one of asserts / silent / contradicts and the full 5x4 grid matches the author's fixed support key"
    - id: obj-2
      check: "Each claim is labeled exactly CORROBORATED or NOT-CORROBORATED matching the fixed key: C1 CORROBORATED, C2 CORROBORATED, C3 NOT-CORROBORATED, C4 NOT-CORROBORATED, C5 CORROBORATED"
    - id: obj-3
      check: "The file explicitly notes that S3 is not independent of S1 (S3 draws on/summarizes S1) and that this is why C3 is NOT corroborated despite two sources asserting it"
    - id: obj-4
      check: "Exactly one synthesized theme sentence is present and its supporting claims are a subset of {C1,C2,C5} (it must not rest on C3 or C4)"
    - id: obj-5
      check: "The matrix marks BOTH the C3/S1 and C3/S3 cells as 'asserts' (the raw data is correct) even though C3's verdict is NOT-CORROBORATED"
  subjective:
    - id: sub-quality
      name: "Triangulation rigor"
      weight: 0.4
    - id: sub-craft
      name: "Theme abstraction"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "gudgeon dowsing" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Fixed support grid (node-confirmed)

|      | S1 | S2 | S3 | S4 |
|------|----|----|----|----|
| C1   | asserts | asserts | asserts | silent |
| C2   | asserts | asserts | silent | asserts |
| C3   | asserts | silent | asserts | silent |
| C4   | silent | silent | silent | asserts |
| C5   | asserts | asserts | asserts | asserts |

S3 explicitly states it is "drawing on the S1 review of remote-work
outcomes" — S3 is not independent of S1.

### Corroboration key (node-confirmed)

```
C1: asserters {S1,S2,S3} -> independent {S1,S2} = 2  -> CORROBORATED
C2: asserters {S1,S2,S4} -> independent {S1,S2,S4} = 3 -> CORROBORATED
C3: asserters {S1,S3}    -> independent {S1} = 1      -> NOT-CORROBORATED
C4: asserters {S4}       -> independent {S4} = 1      -> NOT-CORROBORATED
C5: asserters {S1,S2,S3,S4} -> independent {S1,S2,S4} = 3 -> CORROBORATED
```

(S3's assertions collapse into S1 throughout, since S3 is not
independent of S1.)

### Objective check notes

- **obj-1**: all 20 cells must match the grid above exactly; a
  submission that marks any cell `contradicts` is wrong (no source in
  this set contradicts another — the trap is about independence, not
  disagreement).
- **obj-2**: exact match to the five verdicts; a submission that marks
  C3 CORROBORATED (falling for the two-source-looks-sufficient trap)
  fails this check regardless of how well-reasoned its independence
  note is elsewhere.
- **obj-3**: prose-located check. Example phrasings:
  - PASS: "S3 states it is drawing on the S1 review, so S3 is not
    independent of S1 — C3 is asserted by S1 and S3, but that collapses
    to a single independent origin, so C3 is NOT-CORROBORATED despite
    appearing in two sources."
  - PASS: "Because S3 explicitly summarizes S1, its agreement with S1
    on fewer sick days for remote workers (C3) doesn't count as a
    second vote."
  - FAIL: "C3 is asserted by S1 and S3, so it is corroborated by two
    sources." (never notices or states the S3<-S1 dependency)
  - FAIL: mentions "S3 draws on S1" only in the independence note but
    never connects it to why C3 specifically is NOT-CORROBORATED.
- **obj-4**: exactly one sentence framed as the synthesized theme; check
  which claims it invokes (by number or by clear paraphrase) — any
  reliance on C3 or C4's content disqualifies it.
- **obj-5**: this checks the raw matrix wasn't tampered with to make the
  verdict "look consistent" — both cells must still read `asserts`; the
  collapse belongs in the verdict step, not the matrix.

### Subjective guidance

- **Triangulation rigor**: does the submission build the full grid
  carefully before drawing verdicts, and correctly distinguish "two
  sources assert this" from "two independent sources assert this"?
- **Theme abstraction**: is the synthesized theme sentence a genuine
  abstraction (a claim about the pattern across C1/C2/C5) rather than a
  restatement of one claim, or a sentence that quietly smuggles in
  C3/C4 content?
- **Reasoning quality**: does `REASONING.md` explain the independence
  check it ran on S3 before finalizing the C3 verdict, and why it chose
  the specific claims it drew the theme sentence from?
