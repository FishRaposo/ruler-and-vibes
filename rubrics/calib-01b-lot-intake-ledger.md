---
test: calib-01b-lot-intake-ledger
canary: "katydid morel"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "triage.json parses with node (JSON.parse round-trips) and is an array of exactly 10 objects, each with keys id (integers 1..10, each appearing exactly once), label (one of 'answerable'|'underdetermined'|'missing'), and answer"
    - id: obj-2
      check: "The label field for all 10 items exactly matches the reference key below (element-wise by id; all 10 must match for pass)"
    - id: obj-3
      check: "Every item labeled 'answerable' has a non-null answer equal to the entailed value in the key; every item labeled 'underdetermined' or 'missing' has answer exactly null"
    - id: obj-4
      check: "Item 5 (line-average trap) is labeled 'underdetermined', and item 6 (purchase-without-policy trap) is labeled 'missing' — neither is labeled 'answerable'"
  subjective:
    - id: sub-quality
      name: "Triage accuracy and gap discrimination"
      weight: 0.4
    - id: sub-craft
      name: "Label discipline and answer precision"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Triage accuracy and gap discrimination
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Label discipline and answer precision
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `calib-01-triage-dossier` (same construct, fresh surface).

If the phrase "katydid morel" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key (verified with node during authoring)

| id | label | answer |
|---|---|---|
| 1 | answerable | 7.10 |
| 2 | answerable | "L-1, 7.10" |
| 3 | answerable | "L-3, 2026-03-28" |
| 4 | answerable | 9.0 |
| 5 | underdetermined | null |
| 6 | missing | null |
| 7 | underdetermined | null |
| 8 | missing | null |
| 9 | missing | null |
| 10 | underdetermined | null |

- **Item 1**: L-1's purchase price is stated directly in the table as
  7.10 (USD per kg). No ambiguity.
- **Item 2**: comparing all four stated prices (7.10, 6.40, 5.20, 5.90 —
  L-2 has no price yet), L-1's 7.10 is the highest.
- **Item 3**: comparing the five received dates, L-3's 2026-03-28 is
  earliest.
- **Item 4**: L-3's cupping score is stated directly as 9.0.
- **Item 5 (TRAP — pinned)**: the Meridian line consists of L-3 (score
  9.0) and L-4 (score "Pending cup" — explicitly not yet entered). Only
  one of the two Meridian scores is present, so the average is not
  computable. A model that averages just L-3's single score, or invents
  a score for L-4, mislabels this as answerable. Correct label:
  underdetermined.
- **Item 6 (TRAP — pinned)**: L-2's purchase decision is explicitly
  "pending," and the ledger states no purchase threshold, minimum
  cupping score, or sourcing policy anywhere. There is no way to infer a
  purchase from the score alone. Correct label: missing (not
  underdetermined — there is no partial policy information at all, just a
  total absence of a decision rule).
- **Item 7**: requires all five cupping scores; L-4's score is
  explicitly not yet entered, so the five-way average cannot be
  computed. Underdetermined (four of five scores present, but the
  question requires all five).
- **Item 8**: L-4's cupping score is explicitly "Pending cup" — the
  ledger states plainly that no score exists yet. Missing.
- **Item 9**: roast-line leads are never named anywhere in the ledger
  for any line. Missing.
- **Item 10**: this question is downstream of item 5's unresolved
  Meridian average — since that average cannot be computed, the
  comparison L-4-vs-average cannot be either. Underdetermined (not
  missing, since L-4's presence in the Meridian line and L-3's score are
  both known — the gap is specifically the missing second data point for
  the average, same root cause as item 5).

### Per-check guidance

- **obj-2**: score as a strict element-wise match against the 10 labels
  above. A single mismatched label fails this check regardless of the
  other 9.
- **obj-3**: reject any numeric or string answer accompanying an
  `underdetermined` or `missing` label, even if the value looks
  plausible — the schema requires `null` there. Accept minor formatting
  variance in answerable answers (e.g. "7.1" for 7.10, "$7.10" with a
  currency mark, "L-1" order swapped in item 2's compound answer) as
  long as the entailed fact is correct.
  - PASS (answerable value accepted): `7.10`; `7.1`; `"$7.10"`;
    `"L-1, 7.10"`; `"7.10, L-1"` (order-swapped compound); `9.0`.
  - FAIL (answerable value rejected): `"≈7"` or `"about 7 dollars"`
    (imprecise or wrong number); `"L-1 (top price)"` (prose gloss
    instead of the entailed value); any non-null value paired with an
    `underdetermined` or `missing` label.
- **obj-4**: this re-checks the two seeded traps specifically, since
  they are the crux of the test — a submission could get obj-2 mostly
  right while still failing on exactly these two hardest items.

### Subjective guidance

- **Triage accuracy and gap discrimination** (0.4): beyond the binary
  label match, does the submission's overall pattern show it actually
  distinguished "partial data present" (underdetermined) from "field
  never mentioned" (missing) as different failure modes, or does it
  treat them interchangeably?
- **Label discipline and answer precision** (0.3): are answerable
  answers precise and exactly traceable to the table (no rounding, no
  hedging language inside the JSON value itself), and is the JSON
  clean and exactly schema-conforming?
- **Reasoning quality** (0.3): does `REASONING.md` explain, for at
  least the two trap items, *why* the label was chosen — citing the
  specific missing or partial fact — rather than just asserting the
  label?
