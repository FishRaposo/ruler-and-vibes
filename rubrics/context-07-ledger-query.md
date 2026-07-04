---
test: context-07-ledger-query
canary: "seagull stanchion"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "LEDGER.md's 'A:' line states 5720 — total posted South amount; judge parses the embedded 200-row table with node and recomputes (sum where region=South AND status=posted). A total that includes voided South rows fails"
    - id: obj-2
      check: "LEDGER.md's 'B:' line states 40 — count of void rows (every 5th of 200); judge recomputes with node"
    - id: obj-3
      check: "LEDGER.md's 'C:' line states 189 — the maximum amount in the ledger; judge recomputes with node"
    - id: obj-4
      check: "LEDGER.md's 'D:' line states 23060 — total of all posted amounts across all regions; judge recomputes with node and confirms it excludes voids"
    - id: obj-5
      check: "LEDGER.md contains exactly four labeled lines 'A:' 'B:' 'C:' 'D:' in order and no other line whose value could be mistaken for an answer — judge parses the four labeled lines with node (not grep) and ignores prose"
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
---

## Judge guidance

If a submission's `LEDGER.md` or `REASONING.md` contains the phrase
"seagull stanchion", that is a canary leak — flag it regardless of how
the rest of the checks score.

### Reference computation (verify with node before scoring)

The embedded table follows a deterministic generation rule (not shown
to the model): for row `r` = 1..200, `region =
[North,South,East,West][(r-1)%4]`, `amount = 100 + ((r*7)%90)`,
`status = (r%5==0) ? void : posted`. This rule is provided here only so
the judge can sanity-check the table's shape; **scoring must recompute
directly from the pasted 200-row table in the test file**, not from the
rule, since the check is whether the model read the actual rows.

```js
// Parse tests/long-context/context-07-ledger-query.md, extract every
// "| r | region | amount | status |" row, then:
let A = 0, B = 0, C = 0, D = 0;
for (const row of rows) {
  if (row.status === "void") B++;
  if (row.amount > C) C = row.amount;
  if (row.status === "posted") {
    D += row.amount;
    if (row.region === "South") A += row.amount;
  }
}
// A = 5720, B = 40, C = 189, D = 23060
```

These four values were re-confirmed by independent recompute directly
against the shipped table (not just the generation rule) during
authoring: A=5720, B=40, C=189, D=23060.

### Objective check notes

- **obj-1**: 5720 is correct. A submission that includes voided South
  rows (every 5th South row) in the total will land on a different
  number — recompute independently to catch this rather than trusting
  the submission's arithmetic.
- **obj-2**: 40 is correct — exactly every 5th row (200/5) is void, and
  void status does not depend on region.
- **obj-3**: 189 is correct — the maximum appears at several rows
  (e.g., row 77, row 167) since the amount formula cycles; any of these
  is the same value, so there is exactly one correct number regardless
  of which occurrence a submission points to.
- **obj-4**: 23060 is correct. Confirm the submission's D excludes all
  40 void rows; a total equal to the sum of literally all 200 rows
  (voids included) is a clear tell that void filtering was skipped.
- **obj-5**: parse `LEDGER.md` with a node script that looks for
  exactly four lines matching `/^[ABCD]:\s*-?\d/` in order A, B, C, D;
  any extra line (a recomputed table, a caveat, a fifth label) fails
  this check even if the four values are otherwise correct.

### Subjective guidance

- **Aggregation correctness**: beyond the four pass/fail gates, does
  the submission show it filtered correctly in general (e.g., does its
  `REASONING.md` describe iterating the table and applying the
  region/status filters), rather than landing on the right numbers by
  a lucky partial read?
- **Answer labeling clarity**: are the four lines unambiguous and
  exactly as specified, with no extra hedging ("approximately",
  "around") that would undermine an exact numeric answer?
- **Reasoning quality**: does `REASONING.md` describe an actual pass
  over the 200 rows (or a stated method, such as summing by region)
  rather than asserting the four numbers without showing how void rows
  were excluded from A and D?
