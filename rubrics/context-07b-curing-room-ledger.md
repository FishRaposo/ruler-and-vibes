---
test: context-07b-curing-room-ledger
canary: "fandango dunnart"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "CURING.md's 'A:' line states 17760 — total cured Camino grams; judge parses the embedded 200-row table with node and recomputes (sum where chamber=Camino AND status=cured). A total that includes spoiled Camino batches fails"
    - id: obj-2
      check: "CURING.md's 'B:' line states 44 — count of spoiled batches across all chambers; judge recomputes with node"
    - id: obj-3
      check: "CURING.md's 'C:' line states 489 — the maximum grams value in the ledger; judge recomputes with node"
    - id: obj-4
      check: "CURING.md's 'D:' line states 69278 — total of all cured grams across all chambers; judge recomputes with node and confirms it excludes spoiled batches"
    - id: obj-5
      check: "CURING.md contains exactly four labeled lines 'A:' 'B:' 'C:' 'D:' in order and no other line whose value could be mistaken for an answer — judge parses the four labeled lines with node (not grep) and ignores prose"
  subjective:
    - id: sub-quality
      name: "Aggregation correctness"
      weight: 0.4
    - id: sub-craft
      name: "Answer labeling clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Aggregation correctness
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Answer labeling clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `context-07-ledger-query` (same construct, fresh
surface).

If the phrase "fandango dunnart" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Reference computation (verify with node before scoring)

The embedded table follows a deterministic generation rule (not shown to
the model): for batch `r` = 1..200, `chamber =
[Cortile,Grotta,Camino,Fienile][(r-1)%4]`, `grams = 400 + ((r*13)%90)`,
`status = (r%9==0 || r%9==4) ? spoiled : cured`. This rule is provided
here only so the judge can sanity-check the table's shape; **scoring
must recompute directly from the pasted 200-row table in the test
file**, not from the rule, since the check is whether the model read the
actual rows.

```js
// Parse tests/long-context/context-07b-curing-room-ledger.md, extract
// every "| r | chamber | grams | status |" row, then:
let A = 0, B = 0, C = 0, D = 0;
for (const row of rows) {
  if (row.status === "spoiled") B++;
  if (row.grams > C) C = row.grams;
  if (row.status === "cured") {
    D += row.grams;
    if (row.chamber === "Camino") A += row.grams;
  }
}
// A = 17760, B = 44, C = 489, D = 69278
```

These four values were re-confirmed by independent recompute directly
against the shipped table (not just the generation rule) during
authoring: A=17760, B=44, C=489, D=69278.

### Objective check notes

- **obj-1**: 17760 is correct. A submission that includes spoiled Camino
  batches (there are 10 of them: batches 27, 31, 63, 67, 99, 103, 135,
  139, 171, 175) in the total will land on a different number (22200 if
  every spoiled Camino batch is wrongly added) — recompute independently
  to catch this rather than trusting the submission's arithmetic.
  - PASS phrasings: `A: 17760`; `A: 17760 grams`; `A:17760`.
  - FAIL phrasings: `A: 22200` (spoiled Camino batches included);
    `A: 17761` (off-by-one / misread row); `A: 15768` (some cured
    Camino batches missed).
- **obj-2**: 44 is correct — the spoiled rule fires on two residues per
  block of nine (`r%9==0` and `r%9==4`), and spoiled status does not
  depend on chamber, so spoiled batches spread across all four chambers
  (Cortile 12, Grotta 11, Camino 10, Fienile 11).
  - PASS phrasings: `B: 44`; `B: 44 batches`; `B:44`.
  - FAIL phrasings: `B: 40` (naive "every 5th" assumption carried over
    from a different ledger); `B: 22` (only one residue counted);
    `B: 156` (cured counted instead of spoiled).
- **obj-3**: 489 is correct — the maximum appears at more than one batch
  (batch 83 in Camino and batch 173 in Cortile) since the grams formula
  cycles; any of these is the same value, so there is exactly one
  correct number regardless of which occurrence a submission points to.
  - PASS phrasings: `C: 489`; `C: 489 grams`; `C:489`.
  - FAIL phrasings: `C: 488` (second-largest value picked); `C: 480`
    (last row's value mistaken for the max); `C: 189` (a value from an
    unrelated ledger, not present in this table).
- **obj-4**: 69278 is correct. Confirm the submission's D excludes all
  44 spoiled batches; a total equal to the sum of literally all 200
  batches (spoiled included, 88850) is a clear tell that spoiled
  filtering was skipped.
  - PASS phrasings: `D: 69278`; `D: 69278 grams`; `D:69278`.
  - FAIL phrasings: `D: 88850` (all 200 batches summed, spoiled
    included); `D: 69279` (arithmetic slip); `D: 51518` (a whole
    chamber dropped).
- **obj-5**: parse `CURING.md` with a node script that looks for exactly
  four lines matching `/^[ABCD]:\s*-?\d/` in order A, B, C, D; any extra
  line (a recomputed table, a caveat, a fifth label) fails this check
  even if the four values are otherwise correct.
  - PASS phrasings: a four-line file with `A:`, `B:`, `C:`, `D:` in
    order and nothing else; the same four lines with a single trailing
    newline; the same four lines each carrying only its number.
  - FAIL phrasings: a fifth `E:` summary line appended; a Markdown table
    of the recomputed totals added below the four lines; a prose caveat
    ("Note: spoiled batches excluded") added as its own line.

### Subjective guidance

- **Aggregation correctness**: beyond the four pass/fail gates, does the
  submission show it filtered correctly in general (e.g., does its
  `REASONING.md` describe iterating the table and applying the
  chamber/status filters), rather than landing on the right numbers by a
  lucky partial read?
- **Answer labeling clarity**: are the four lines unambiguous and
  exactly as specified, with no extra hedging ("approximately",
  "around") that would undermine an exact numeric answer?
- **Reasoning quality**: does `REASONING.md` describe an actual pass over
  the 200 batches (or a stated method, such as summing by chamber)
  rather than asserting the four numbers without showing how spoiled
  batches were excluded from A and D?
