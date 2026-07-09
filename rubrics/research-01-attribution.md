---
test: research-01-attribution
canary: "paisley periscope"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "attribution.md contains a markdown table with exactly 10 claim rows and columns Claim, Verdict, Sources; every Verdict cell is exactly one of SUPPORTED / CONTRADICTED / UNSUPPORTED"
    - id: obj-2
      check: "At least 9 of 10 verdicts match the answer key: 1,2,5,8 SUPPORTED; 3,6,9 CONTRADICTED; 4,7,10 UNSUPPORTED"
    - id: obj-3
      check: "Trap claims 6 and 7 are both correct: claim 6 = CONTRADICTED citing S3 (or S1), claim 7 = UNSUPPORTED"
    - id: obj-4
      check: "Every SUPPORTED or CONTRADICTED row cites at least one source ID from {S1,S2,S3,S4}, and no row cites any ID outside that set"
    - id: obj-5
      check: "Every row whose keyed verdict is UNSUPPORTED (4, 7, 10) has 'none' in its Sources cell — no source cited as supporting a claim the key marks unsupported"
  subjective:
    - id: sub-quality
      name: "Evidence-mapping clarity"
      weight: 0.4
    - id: sub-craft
      name: "Verdict justification precision"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Evidence-mapping clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Verdict justification precision
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "paisley periscope" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how
the rest scores.

### Answer key

| Claim | Verdict | Sources |
|---|---|---|
| 1 | SUPPORTED | S1, S3 |
| 2 | SUPPORTED | S2 |
| 3 | CONTRADICTED | S3 (explicitly: contamination traced to a supplier's packaging line, "not to Bramblewick's own manufacturing facility") |
| 4 | UNSUPPORTED | none |
| 5 | SUPPORTED | S1, S3 |
| 6 | CONTRADICTED | S1, S3 (both explicitly state the recall lasted 13 days; the claim's "30 days" is a transposition of the digits in "13") |
| 7 | UNSUPPORTED | none — S4's "I have no idea if this is the first time... I'm just guessing out loud" is explicitly hedged speculation, not an assertion of fact, and does not support this claim |
| 8 | SUPPORTED | S4 |
| 9 | CONTRADICTED | S1 (explicitly: "the company's own testing lab identified this contamination risk... not a customer complaint" directly denies this claim) |
| 10 | UNSUPPORTED | none |

### Objective check notes

- **obj-1**: verify the table has exactly 10 rows and the three required
  columns; verify every Verdict cell is one of the three exact tokens
  (case-sensitive is reasonable but not required — judge discretion on
  case only, not on wording).
- **obj-2**: count matches against the key above; 9 or 10 out of 10
  passes.
- **obj-3**: claim 6 is a digit-transposition trap (13 days is stated
  twice, in S1 and S3; the claim says 30, testing whether the model
  actually reads the specific number rather than pattern-matching "the
  recall lasted some number of days" as true). Claim 7 is a
  plausible-sounding background claim with a hedged, speculative mention
  in S4 that must NOT be read as source support — a submission that
  marks claim 7 SUPPORTED citing S4 has over-credited a hedge as a fact.
- **obj-4**: reject any row citing an ID like "S5" or "the press
  release" instead of a canonical source ID.
- **obj-5**: this is the "none convention" check from the task text —
  claims 4, 7, and 10 must show `none`, not a blank cell or an
  unrelated citation.

### Prose-located check: is claim 7 (hedged speculation vs. asserted fact) correctly read as unsupported?

This determination is binary but requires reading S4's hedge in context.
Example phrasings a judge will encounter, and how to score them:

**PASSING** (correctly treats the hedge as non-support):
1. "S4's customer explicitly says 'I have no idea if this is the first
   time... I'm just guessing out loud' — this is the poster admitting
   they don't know, not a statement that it was or wasn't a first
   recall, so claim 7 is UNSUPPORTED."
2. "Although S4 touches on the topic of prior recalls, the poster frames
   it as their own uninformed guess rather than a known fact, so this
   cannot be read as source support for claim 7."
3. "No source states or implies whether this was Bramblewick's first
   recall; S4's musing is explicitly hedged and not evidence either
   way."

**FAILING** (treats the hedge as if it were a factual assertion):
1. "S4 confirms this was the company's first recall [S4]." (Reads a
   forum poster's admitted guess as a factual claim.)
2. "Since the customer in S4 wonders whether this has happened before
   and doesn't mention any prior incident, we can treat this as
   supporting evidence that it's the first recall." (Converts an
   acknowledged absence of knowledge into support.)
3. Marking claim 7 SUPPORTED citing S4 without any note that the
   language is hedged speculation rather than an assertion.

### Subjective guidance

- **Evidence-mapping clarity**: can a reader verify each verdict by
  reading only the cited source(s), without needing to re-read all four
  sources for every row?
- **Verdict justification precision**: does the submission (in
  `REASONING.md` or elsewhere) show it understands *why* claim 9 is
  CONTRADICTED rather than UNSUPPORTED (the stated precedence rule: an
  assertion directly denied by another source is CONTRADICTED, not
  merely unaddressed)? Reward explicit engagement with the precedence
  rule.
- **Reasoning quality**: does `REASONING.md` explain the claim-6
  transposition catch and the claim-7 hedge-vs-fact distinction, or does
  it just assert the verdicts without showing the discriminating
  language it relied on?
