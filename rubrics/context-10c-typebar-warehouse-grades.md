---
test: context-10c-typebar-warehouse-grades
canary: "rampart bastion"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "LABELS.md contains exactly 15 lines 'T1:' through 'T15:' in order, each ending in one of Grade-I/Grade-II/Grade-III/Grade-IV — judge parses with node"
    - id: obj-2
      check: "At least 14 of the 15 test-code labels match the answer key (judge computes each label from the code by applying the author's 2-feature rule with node) — string comparison"
    - id: obj-3
      check: "All 8 crossed-combination test codes — every Grade-IV (even + letter in {C,D}) and Grade-I (odd + letter in {A,B}) code: T2, T3, T6, T7, T10, T11, T14, T15 — are labelled correctly. These are exactly the codes a single-feature shortcut (letter-only or parity-only) misclassifies, so this gate (ANDed separately from the 14/15 count) catches single-feature induction"
    - id: obj-4
      check: "LABELS.md includes a stated rule that references BOTH governing features (middle-field parity AND trailing-letter group) — judge-reads binary check; rubric ships 2-3 PASS phrasings and 2-3 FAIL phrasings"
    - id: obj-5
      check: "LABELS.md's applied labels are internally consistent with its OWN stated rule: judge applies the model's stated rule to 3 spot-check codes and confirms it reproduces the model's own labels — judge-reads/apply check; rubric ships 2-3 PASS examples and 2-3 FAIL examples"
  subjective:
    - id: sub-quality
      name: "Rule-induction correctness"
      weight: 0.4
    - id: sub-craft
      name: "Rule statement clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Rule-induction correctness
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Rule statement clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `context-10-icl-labeling` (same construct, fresh surface).

If the phrase "rampart bastion" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### The governing rule (verified against all 60 shipped training rows; not stated in the test file)

Let `m` = the numeric middle field, `L` = the trailing letter.

- even `m` + `L` in {A,B} => Grade-III
- even `m` + `L` in {C,D} => Grade-IV
- odd `m` + `L` in {A,B} => Grade-I
- odd `m` + `L` in {C,D} => Grade-II

This was confirmed to be genuinely two-feature by construction: letter
alone is ambiguous (A occurs in both Grade-III and Grade-I training rows;
C occurs in both Grade-IV and Grade-II rows), and parity alone is ambiguous
(even occurs in both Grade-III and Grade-IV rows; odd occurs in both
Grade-I and Grade-II rows). The workbench-station name and two-letter
prefix are pure flavor and never affect the grade — the task explicitly
says so.

### Answer key (15 test codes, computed from the rule and re-verified by parsing the shipped test file directly)

| # | Code | m | L | Grade |
|---|---|---|---|---|
| T1 | AH-30-ROLLBENCH-A | 30 (even) | A | Grade-III |
| T2 | BI-56-INKBENCH-D | 56 (even) | D | **Grade-IV** (crossed: both-feature) |
| T3 | CJ-71-FRAMEBENCH-A | 71 (odd) | A | **Grade-I** (crossed: both-feature) |
| T4 | EL-85-KEYBENCH-C | 85 (odd) | C | Grade-II |
| T5 | FM-40-BELLBENCH-B | 40 (even) | B | Grade-III |
| T6 | HO-68-INKBENCH-C | 68 (even) | C | **Grade-IV** (crossed: both-feature) |
| T7 | IP-19-ROLLBENCH-B | 19 (odd) | B | **Grade-I** (crossed: both-feature) |
| T8 | JQ-51-FRAMEBENCH-D | 51 (odd) | D | Grade-II |
| T9 | KR-46-KEYBENCH-A | 46 (even) | A | Grade-III |
| T10 | LS-54-BELLBENCH-C | 54 (even) | C | **Grade-IV** (crossed: both-feature) |
| T11 | MT-33-ROLLBENCH-A | 33 (odd) | A | **Grade-I** (crossed: both-feature) |
| T12 | NU-87-INKBENCH-C | 87 (odd) | C | Grade-II |
| T13 | OV-20-FRAMEBENCH-B | 20 (even) | B | Grade-III |
| T14 | QX-62-KEYBENCH-D | 62 (even) | D | **Grade-IV** (crossed: both-feature) |
| T15 | RY-39-BELLBENCH-B | 39 (odd) | B | **Grade-I** (crossed: both-feature) |

T2, T3, T6, T7, T10, T11, T14, and T15 were each independently re-verified
(during authoring) to require both features: for each, the training set
contains at least one example with the same trailing letter but opposite
parity landing in a different grade (kills a letter-only shortcut), and at
least one example with the same parity but the opposite letter-group
landing in a different grade (kills a parity-only shortcut). A model that
classifies using only one feature will get some of these 8 right by chance
but cannot get all 8 right without truly combining both features — this is
exactly what obj-3 gates on.

### Objective check notes

- **obj-1**: parse with node: exactly 15 lines matching
  `/^T(\d{1,2}):\s*Grade-(?:I|II|III|IV)$/`, T1 through T15 in order.
- **obj-2**: 14 or 15 of the 15 computed labels must match the key.
- **obj-3**: T2, T3, T6, T7, T10, T11, T14, T15 must ALL be correct — a
  submission that hits 14/15 overall by missing one of these eight still
  fails this gate, since it indicates a systematic single-feature shortcut
  rather than a one-off slip.
- **obj-4/obj-5**: see PASS/FAIL phrasings below; both are judge-reads
  checks on the `## Rule` section's prose.

### Prose-located check: "does the stated rule reference both features?"

**PASSING** (references both middle-field parity and trailing-letter
group):
1. "Grade depends on whether the middle number is even or odd, and whether
   the trailing letter is A/B versus C/D: even+AB is Grade-III, even+CD is
   Grade-IV, odd+AB is Grade-I, odd+CD is Grade-II."
2. "I found two things determine the grade together — the parity (even/odd)
   of the three-digit number, and which group the final letter falls into
   (A or B vs. C or D)."
3. "The rule is a 2x2: parity of the middle field crossed with the letter
   group of the trailing character."

**FAILING** (single feature or wrong feature):
1. "Grade is decided by the last letter: A and B give lower grades, C and D
   give higher grades." (Only one feature stated; ignores parity entirely.)
2. "Grade follows the station field — INKBENCH and KEYBENCH codes tend to
   be higher grades." (Wrong feature; the station is explicitly flavor-only
   per the task.)
3. "Grade depends on the number — smaller numbers are Grade-I and Grade-II,
   larger numbers are Grade-III and Grade-IV." (Only one feature, and not
   even the correct one — it's parity, not magnitude.)

### Prose-located check: "is the stated rule self-consistent with the model's own applied labels?"

**PASSING** (rule reproduces the model's own labels on a spot check):
1. Stated rule: "even+AB=Grade-III, even+CD=Grade-IV, odd+AB=Grade-I,
   odd+CD=Grade-II." Applying this to the model's own T1 answer
   (AH-30-ROLLBENCH-A, even+A) gives Grade-III — matches the model's stated
   `T1: Grade-III`.
2. The model's rule and its T4 answer (EL-85-KEYBENCH-C, odd+C) both agree
   on Grade-II when the stated rule is applied by the judge.
3. A model that states the rule with a worked example matching one of its
   own 15 answers exactly, with no contradiction found on spot-checking 3
   different labels.

**FAILING** (rule contradicts the model's own labels, or is too vague to
apply):
1. Stated rule: "the last letter mostly determines it, with some
   exceptions" — too vague to mechanically apply to any code, so it cannot
   be checked against the model's own T-labels at all.
2. Stated rule says "even middle + A/B = Grade-III", but the model's own
   `T5: Grade-IV` answer is for FM-40-BELLBENCH-B, which is even+B — the
   model's own rule would produce Grade-III, contradicting its own answer.
3. The rule statement and the applied labels appear to have been produced
   independently (e.g., the rule is a correct 2x2 but at least one
   spot-checked label contradicts it), indicating the model applied a
   different, unstated heuristic when actually labeling.

### Subjective guidance

- **Rule-induction correctness**: beyond the pass/fail gates, does the
  submission's rule match the true 2x2 structure exactly (not an
  approximation that happens to get most training examples right)?
- **Rule statement clarity**: could another person apply the stated rule to
  a brand-new code without needing to see the training table again?
- **Reasoning quality**: does `REASONING.md` describe how the model ruled
  out single-feature hypotheses (e.g., noticing the confuser pairs where
  the same letter appears in two different grades) rather than asserting the
  final rule without showing the induction process?
