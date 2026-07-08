---
test: research-09b-rooftop-hive-triangulation
canary: "baobab banyan"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "triangulation.md contains a matrix with exactly 5 claim rows (C1-C5) and 4 source columns (S1-S4); every cell is exactly one of asserts / silent / contradicts and the full 5x4 grid matches the author's fixed support key"
    - id: obj-2
      check: "Each claim is labeled exactly CORROBORATED or NOT-CORROBORATED matching the fixed key: C1 NOT-CORROBORATED, C2 CORROBORATED, C3 NOT-CORROBORATED, C4 CORROBORATED, C5 CORROBORATED"
    - id: obj-3
      check: "The file explicitly notes that S3 is not independent of S2 (S3 draws on/summarizes S2's academic study) and that this is why C1 is NOT corroborated despite two sources asserting it"
    - id: obj-4
      check: "Exactly one synthesized theme sentence is present and its supporting claims are a subset of {C2,C4,C5} (it must not rest on C1 or C3)"
    - id: obj-5
      check: "The matrix marks BOTH the C1/S2 and C1/S3 cells as 'asserts' (the raw data is correct) even though C1's verdict is NOT-CORROBORATED"
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

Parallel form of `research-09-triangulation-matrix` (same construct, fresh surface).

If a submission's `triangulation.md` or `REASONING.md` contains the phrase
"baobab banyan", that is a canary leak — flag it regardless of how the rest
of the checks score.

### Fixed support grid (node-confirmed)

|      | S1 | S2 | S3 | S4 |
|------|----|----|----|----|
| C1   | silent | asserts | asserts | silent |
| C2   | asserts | asserts | silent | asserts |
| C3   | asserts | silent | silent | silent |
| C4   | asserts | asserts | asserts | asserts |
| C5   | asserts | silent | silent | asserts |

S3 explicitly states it is "drawing on the independent academic study of
urban apiaries" (S2) — S3 is not independent of S2.

### Corroboration key (node-confirmed)

```
C1: asserters {S2,S3} -> independent {S2} = 1      -> NOT-CORROBORATED
C2: asserters {S1,S2,S4} -> independent {S1,S2,S4} = 3 -> CORROBORATED
C3: asserters {S1}    -> independent {S1} = 1      -> NOT-CORROBORATED
C4: asserters {S1,S2,S3,S4} -> independent {S1,S2,S4} = 3 -> CORROBORATED
C5: asserters {S1,S4} -> independent {S1,S4} = 2   -> CORROBORATED
```

(S3's assertions collapse into S2 throughout, since S3 is not independent
of S2. Naive raw-count scoring would call C1 CORROBORATED — two sources
assert it — but only one independent origin backs it; C5 shows the other
side of the same rule, reaching CORROBORATED off exactly two independent
sources with no dependency to collapse.)

### Objective check notes

- **obj-1**: all 20 cells must match the grid above exactly; a submission
  that marks any cell `contradicts` is wrong (no source in this set
  contradicts another — the trap is about independence, not disagreement).
- **obj-2**: exact match to the five verdicts; a submission that marks C1
  CORROBORATED (falling for the two-source-looks-sufficient trap) fails
  this check regardless of how well-reasoned its independence note is
  elsewhere.
- **obj-3**: prose-located check. Example phrasings:
  - PASS: "S3 states it is drawing on the independent academic study
    (S2), so S3 is not independent of S2 — C1 is asserted by S2 and S3,
    but that collapses to a single independent origin, so C1 is
    NOT-CORROBORATED despite appearing in two sources."
  - PASS: "Because S3 explicitly summarizes S2's study, its agreement
    with S2 on fewer winter colony losses for rooftop hives (C1) doesn't
    count as a second vote."
  - FAIL: "C1 is asserted by S2 and S3, so it is corroborated by two
    sources." (never notices or states the S3<-S2 dependency)
  - FAIL: mentions "S3 draws on S2" only in the independence note but
    never connects it to why C1 specifically is NOT-CORROBORATED.
- **obj-4**: exactly one sentence framed as the synthesized theme; check
  which claims it invokes (by number or by clear paraphrase) — any
  reliance on C1 or C3's content disqualifies it.
- **obj-5**: this checks the raw matrix wasn't tampered with to make the
  verdict "look consistent" — both cells must still read `asserts`; the
  collapse belongs in the verdict step, not the matrix.

### Subjective guidance

- **Triangulation rigor**: does the submission build the full grid
  carefully before drawing verdicts, and correctly distinguish "two
  sources assert this" from "two independent sources assert this"?
- **Theme abstraction**: is the synthesized theme sentence a genuine
  abstraction (a claim about the pattern across C2/C4/C5) rather than a
  restatement of one claim, or a sentence that quietly smuggles in
  C1/C3 content?
- **Reasoning quality**: does `REASONING.md` explain the independence
  check it ran on S3 before finalizing the C1 verdict, and why it chose
  the specific claims it drew the theme sentence from?
