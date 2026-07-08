---
test: logic-01c-dyehouse-ledger
canary: "palisade watchtower"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "A1 states exactly 30 batches (fails on 29 from an unrounded 613/21=29.19, or on 26 from a capacity-24 miscalculation)"
    - id: obj-2
      check: "A2 states exactly 988 coins (30 batches, 4 free of hire fee, 26 paid x 38; fails on 1140 = free-batch discount forgotten, or any other free-count)"
    - id: obj-3
      check: "A3 states mordant 525 coins, grand total 1513 coins, and per-bolt cost 2.47 (judge recomputes in node: 30*2.5*7=525; 988+525=1513; 1513/613=2.4682 -> 2.47)"
    - id: obj-4
      check: "A4 states 26 batches and 4 batches saved (ceil(613/24)=26; 30-26=4)"
    - id: obj-5
      check: "ANSWERS.md contains all four 'A1:'/'A2:'/'A3:'/'A4:' answer lines and is at most 300 words (whole file, `wc -w`)"
  subjective:
    - id: sub-quality
      name: "Working clarity"
      weight: 0.4
    - id: sub-craft
      name: "Trap navigation"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `logic-01-ferry-ledger` (same construct, fresh surface).

If the phrase "palisade watchtower" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

Recompute every value independently before grading; do not trust the
runner's stated numbers. Reference computation (verified in node):

```
bolts = 613
capPerBatch = 24 - 3 = 21
A1 = ceil(613 / 21) = ceil(29.190...) = 30

freeBatches = floor(30 / 7) = 4   // batches 7, 14, 21, 28
paidBatches = 30 - 4 = 26
A2 = 26 * 38 = 988                 // trap: 30*38=1140 if discount forgotten

mordantPerBatch = 2.5 * 7 = 17.5   // billed on EVERY batch, including free ones
mordantTotal = 30 * 17.5 = 525
grandTotal = 988 + 525 = 1513
perBolt = 1513 / 613 = 2.468188... -> 2.47

A4: swatch-free vat at 24/batch -> ceil(613/24) = ceil(25.541...) = 26
saved = 30 - 26 = 4
```

- **obj-1**: the swatch-capacity trap (21, not 24, bolts per batch) and
  the ceiling-division trap (round up, not down or truncate) both have to
  be navigated correctly; 29 batches is the tell that the rounding was
  missed and 26 is the tell the capacity reduction was ignored. PASS
  example: "usable = 24 − 3 = 21; 613/21 = 29.19, round up to 30." PASS
  example: "ceil(613/21) = 30 batches." PASS example: "29 full batches
  dye 609 bolts, leaving 4, so a 30th batch is required." FAIL example:
  "613/21 ≈ 29, so 29 batches." FAIL example: "613/24 = 25.5 → 26
  batches" (used full vat capacity, ignoring the 3 swatch slots). FAIL
  example: "30.5, so 31 batches" (mis-divided).
- **obj-2**: the hire-free trap is the every-7th-batch waiver; 1140 is
  the exact tell for a submission that computed 30 paid batches instead
  of 26. PASS example: "batches 7, 14, 21, 28 are free → 26 paid ×
  38 = 988." PASS example: "floor(30/7) = 4 waived, 26 × 38 = 988 coins."
  PASS example: "hire = 30×38 − 4×38 = 1140 − 152 = 988." FAIL example:
  "30 × 38 = 1140 coins" (waiver forgotten). FAIL example: "5 batches
  free (mistaking the modulus for every 6th) → 25 × 38 = 950" (wrong
  free-count). FAIL example: "27 paid batches × 38 = 1026" (miscounted
  the waived batches by one).
- **obj-3**: mordant must be charged on all 30 batches, not just the 26
  paid ones — a submission that only mordants paid batches would show
  26×17.5 = 455 and a grand total of 1443, both wrong. Per-bolt must be
  rounded to exactly 2 decimals (2.47), not truncated (2.46) or left
  unrounded. PASS example: "30 × 17.5 = 525 mordant; 988 + 525 = 1513;
  1513/613 = 2.4682 → 2.47." PASS example: "mordant on every batch incl.
  the 4 free ones: 525 coins; per bolt 2.47." PASS example: "grand 1513,
  2.47 per bolt after rounding the third decimal up." FAIL example:
  "mordant 26 × 17.5 = 455, grand 1443" (only paid batches mordanted).
  FAIL example: "per bolt = 2.46" (truncated). FAIL example:
  "1513/613 = 2.5" (under-rounded).
- **obj-4**: this is a check on whether the model can vary one assumption
  (capacity 24 vs 21) and redo the ceiling division cleanly; 26 and "4
  batches saved" are both required, not just one. PASS example: "at 24
  bolts/batch, ceil(613/24) = 26; 30 − 26 = 4 fewer." PASS example: "26
  batches, saving 4." PASS example: "613/24 = 25.54, round up to 26,
  which is 4 fewer than 30." FAIL example: "25 batches, 5 fewer" (floored
  instead of rounding up). FAIL example: "26 batches" with no difference
  stated. FAIL example: "4 fewer" with no batch count, or a batch count
  other than 26.
- **obj-5**: run `wc -w ANSWERS.md` on the whole file. PASS example: a
  180-word file with all four A-lines. FAIL example: a 340-word file.
  FAIL example: a file missing the `A4:` line even if under 300 words.

### Subjective guidance

- **Working clarity**: each of the four answers should show the
  arithmetic that produced it (not just the final number), in an order a
  reader can re-derive by hand.
- **Trap navigation**: does the submission explicitly acknowledge the
  swatch-capacity constraint, the need to round up (not down), and the
  every-7th-batch waiver, rather than silently landing on the right
  numbers by luck? Penalize a submission that gets correct numbers with
  working that doesn't actually justify them (e.g. rounds down but still
  writes 30).
- **Reasoning quality**: does REASONING.md name which of the three traps
  it had to watch for and how it double-checked itself (e.g. recomputing
  1513/613 to confirm the second decimal)?
