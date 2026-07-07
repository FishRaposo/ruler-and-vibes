---
test: context-07c-crate-grading-log
canary: "gazelle springbok"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "CRATES.md's 'A:' line states 11958 — total packed Duskfield weight; judge parses the embedded 200-row table with node and recomputes (sum where block=Duskfield AND grade=packed). A total that includes culled Duskfield rows fails"
    - id: obj-2
      check: "CRATES.md's 'B:' line states 32 — count of culled rows across all blocks; judge recomputes with node"
    - id: obj-3
      check: "CRATES.md's 'C:' line states 359 — the maximum weight in the log, drawn regardless of grade; judge recomputes with node. A max computed over packed rows only lands on 357 and fails"
    - id: obj-4
      check: "CRATES.md's 'D:' line states 47478 — total of all packed weights across all blocks; judge recomputes with node and confirms it excludes culls"
    - id: obj-5
      check: "CRATES.md contains exactly four labeled lines 'A:' 'B:' 'C:' 'D:' in order and no other line whose value could be mistaken for an answer — judge parses the four labeled lines with node (not grep) and ignores prose"
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

Parallel form of `context-07-ledger-query` (same construct, fresh
surface).

If the phrase "gazelle springbok" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Reference computation (verify with node before scoring)

The embedded table follows a deterministic generation rule (not shown to
the model): for row `r` = 1..200, `block =
[Oxleaze,Duskfield,Harrowdene,Pippinbrook][(r-1)%4]`, `weight =
210 + ((r*19)%150)`, and `grade = culled` when
`floor((r-1)/4) % 6 == 5` else `packed` (i.e. every sixth crate within
each block's own sequence is culled, spread evenly across the four
blocks). This rule is provided here only so the judge can sanity-check
the table's shape; **scoring must recompute directly from the pasted
200-row table in the test file**, not from the rule, since the check is
whether the model read the actual rows.

```js
// Parse tests/long-context/context-07c-crate-grading-log.md, extract
// every "| crate | block | weight | grade |" row, then:
let A = 0, B = 0, C = 0, D = 0;
for (const row of rows) {
  if (row.grade === "culled") B++;
  if (row.weight > C) C = row.weight;
  if (row.grade === "packed") {
    D += row.weight;
    if (row.block === "Duskfield") A += row.weight;
  }
}
// A = 11958, B = 32, C = 359, D = 47478
```

These four values were re-confirmed by independent recompute directly
against the shipped table (not just the generation rule) during
authoring: A=11958, B=32, C=359, D=47478.

### Objective check notes

- **obj-1**: 11958 is correct. A submission that includes the culled
  Duskfield crates (rows 22, 46, 70, 94, 118, 142, 166, 190) in the
  total will land on a different number — recompute independently to
  catch this rather than trusting the submission's arithmetic.
  - PASS: `A: 11958`; `A: 11958 lbs`; a line reading exactly `A: 11958`.
  - FAIL: `A: 14450` (all Duskfield weights, culled included);
    `A: 13560`; `A: 11958` reported for the wrong block.
- **obj-2**: 32 is correct — every sixth crate within each block is
  culled (8 per block × 4 blocks), and cull status does not depend on
  which block a crate is in.
  - PASS: `B: 32`; `B: 32 crates`; a line reading exactly `B: 32`.
  - FAIL: `B: 40`; `B: 33`; `B: 8` (one block only).
- **obj-3**: 359 is correct — it is the largest value in the `Weight`
  column and appears once, at crate 71, whose grade happens to be
  `culled`; the maximum is drawn regardless of grade, so the culled
  status is irrelevant here. A submission that restricts the maximum to
  packed crates lands on 357 (crate 63) and fails.
  - PASS: `C: 359`; `C: 359 lbs`; a line reading exactly `C: 359`.
  - FAIL: `C: 357` (maximum over packed rows only); `C: 358`; `C: 356`.
- **obj-4**: 47478 is correct. Confirm the submission's D excludes all
  32 culled crates; a total equal to the sum of literally all 200 rows
  (culls included) is a clear tell that grade filtering was skipped.
  - PASS: `D: 47478`; `D: 47478 lbs`; a line reading exactly `D: 47478`.
  - FAIL: `D: 56700` (all 200 rows, culls included); `D: 47470`;
    `D: 47578`.
- **obj-5**: parse `CRATES.md` with a node script that looks for exactly
  four lines matching `/^[ABCD]:\s*-?\d/` in order A, B, C, D; any extra
  line (a recomputed table, a caveat, a fifth label) fails this check
  even if the four values are otherwise correct.
  - PASS: exactly the four lines `A:`/`B:`/`C:`/`D:` in order and nothing
    else; the four lines with trailing units and no other content; the
    four lines preceded only by blank lines.
  - FAIL: a fifth line such as `Note: culls excluded`; a recomputed
    table appended below D; the four values printed out of order
    (`B:` before `A:`).

### Subjective guidance

- **Aggregation correctness**: beyond the four pass/fail gates, does the
  submission show it filtered correctly in general (e.g., does its
  `REASONING.md` describe iterating the table and applying the
  block/grade filters), rather than landing on the right numbers by a
  lucky partial read?
- **Answer labeling clarity**: are the four lines unambiguous and
  exactly as specified, with no extra hedging ("approximately",
  "around") that would undermine an exact numeric answer?
- **Reasoning quality**: does `REASONING.md` describe an actual pass over
  the 200 rows (or a stated method, such as summing by block) rather than
  asserting the four numbers without showing how culled rows were
  excluded from A and D?
