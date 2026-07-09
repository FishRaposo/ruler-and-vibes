---
test: research-02c-grain-terminal-blast
canary: "dunlin lintel"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "brief.md word count (wc -w, whole file) is between 300 and 450"
    - id: obj-2
      check: "The 'Disputed points' table resolves all three conflicts to the official-report values: 23 workers on site, 13:30 blast time, static discharge igniting grain dust (not the wire's 18 / 14:05 / welding-crew spark)"
    - id: obj-3
      check: "The brief explicitly states that S5 repeats or derives from S1 (i.e., they are not independent corroboration)"
    - id: obj-4
      check: "The brief contains at least 8 inline citations in [S#] format, citing at least 4 of the 5 distinct source IDs"
    - id: obj-5
      check: "The brief addresses the grain-tonnage item from the required fact list as not established by any source, and states no numeric grain quantity anywhere"
  subjective:
    - id: sub-quality
      name: "Reconciliation judgment"
      weight: 0.4
    - id: sub-craft
      name: "Citation discipline"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Reconciliation judgment
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Citation discipline
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `research-02-conflict-brief` (same construct, fresh surface).

If the phrase "dunlin lintel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how
the rest scores.

### Reference resolution (fixed)

- Workers on site: **23** (S2, S3) — not 18 (S1, S5)
- Time of blast: **13:30** (S3) — not 14:05 (S1, S5)
- Cause: **static discharge igniting suspended grain dust** (S3,
  corroborated by S4) — not "welding-crew spark" (S1, S5)
- Tonnage of grain destroyed: **not established by any source** — zero
  sources mention any quantity of grain lost under any synonym (tonnage,
  tonnes, tons, bushels, quantity)

### Objective check notes

- **obj-1**: run `wc -w brief.md` on the whole file, including the table.
- **obj-2**: check the table's "Accepted finding" column for each of the
  three rows against the values above; a submission that (even partly)
  sides with the wire's figures on any of the three fails this check.
- **obj-3**: this is the circular-sourcing check — S5 explicitly states
  "According to the Harrowgate Clarion" (naming S1's outlet), meaning S1 and
  S5 are not two independent votes for 18/14:05/welding spark. The brief
  must say so explicitly, not just cite both sources without comment. See
  the passing/failing phrasing examples below.
- **obj-4**: count `[S1]` through `[S5]` occurrences; at least 8 total
  citations, touching at least 4 distinct IDs.
- **obj-5**: grep the brief for "tonnage", "tonne", "\bton", "bushel",
  "quantity of grain" — none of the sources mention this, so any numeric
  grain-quantity claim in the brief would be a fabrication.

### Prose-located check: "does the brief state S5 derives from S1?"

This determination is binary but requires reading in context. Example
phrasings a judge will encounter, and how to score them:

**PASSING** (correctly identifies the dependency):
1. "S5 explicitly attributes its figures to 'the Harrowgate Clarion' — the
   same outlet as S1 — so S1 and S5 represent a single source counted
   twice, not two independent accounts [S1][S5]."
2. "Although two sources (S1, S5) report 18 on site and a 14:05 blast, S5 is
   merely repeating S1's dispatch rather than independently confirming it,
   which is why the official report's later, evidence-based figures should
   govern instead [S1][S3][S5]."
3. "S5 adds no independent reporting of its own beyond what S1 already
   published, as S5 itself states its figures come from the Harrowgate
   Clarion [S5]."

**FAILING** (treats S5 as independent corroboration, or omits the point
entirely):
1. "Two sources (S1 and S5) report 18 on site, versus one source (S3)
   reporting 23, but the official report is more authoritative so we go with
   23." (Never notes that S5 derives from S1 — silently treats the headcount
   as 2-votes-vs-1 without flagging the dependency.)
2. "S1 and S5 both independently confirm the early reports of 18 workers and
   a 14:05 blast." (Explicitly and incorrectly describes S5 as independent
   confirmation.)
3. A brief that cites both S1 and S5 in the Disputed points table's
   "Competing accounts" column without ever mentioning that S5 derives from
   S1 anywhere in the document.

### Subjective guidance

- **Reconciliation judgment**: does the brief correctly recognize that
  authority and recency (S3's official, evidence-based, later report) should
  govern over apparent numerical majority (S1+S5 vs S3 alone on the blast
  time), and articulate why?
- **Citation discipline**: are citations placed on the specific claims they
  support, rather than clustered at the end of paragraphs? Does every
  disputed figure carry a citation to its source?
- **Reasoning quality**: does `REASONING.md` explain the circular-sourcing
  trap and why naive majority-counting would have produced the wrong answer
  on the blast time specifically (where S3 stands alone against what looks
  like two sources)?
