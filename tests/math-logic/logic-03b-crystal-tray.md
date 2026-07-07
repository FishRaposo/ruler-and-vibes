---
id: logic-03b-crystal-tray
category: math-logic
title: Crystal Tray Appraisal
deliverables:
  - ANSWERS.md
---

## Task

A velvet tray holds 7 distinct physical crystal shards: 4 glowstone
shards (each worth +5 clarity points), 2 sootstone shards (each worth
-2 clarity points), and 1 lensstone shard. The lensstone shard is worth
0 clarity points itself, but it **doubles the combined clarity of the
other shard(s) lifted with it** (for example, lifting one glowstone
shard and the lensstone shard scores 5 x 2 = 10).

**Appraisal A**: lift 2 shards from the tray without replacement (both
shards lifted are distinct physical shards, order doesn't matter).

- **Q1**: What is the exact expected clarity of Appraisal A, as a
  reduced fraction?
- **Q2**: What is P(clarity >= 10) and what is P(clarity < 0), each as a
  reduced fraction?

**Appraisal B**: identical scoring rules, but performed **with
replacement**: lift one shard, record it, return it to the tray, then
lift again (the same physical shard can be lifted both times). If the
lensstone shard is lifted on both draws, the clarity is 0.

- **Q3**: What is the exact expected clarity of Appraisal B, as a
  reduced fraction?
- **Q4**: Which appraisal has the higher expected clarity, and by
  exactly how much (as a reduced fraction)?

Decimal-only answers do not count as answering Q1, Q3, or Q4 — exact
reduced fractions are required (decimals may appear alongside them,
but the fraction must be present).

## Deliverables

- `ANSWERS.md` — must contain:
  - A full case-enumeration table for Appraisal A covering the five
    unordered pair types (glowstone-glowstone, glowstone-sootstone,
    glowstone-lensstone, sootstone-sootstone, sootstone-lensstone),
    each with its count out of the total and its clarity.
  - A full case-enumeration table for Appraisal B covering the same
    five types plus the lensstone-lensstone outcome, each with its
    count out of the total and its clarity.
  - Answers to Q1-Q4, each on its own line labeled `Q1:`, `Q2:`, `Q3:`,
    `Q4:`, with the exact reduced fraction(s) required.

## Constraints

- At most 500 words (whole file, `wc -w`).
- All four answers must be exact fractions, not decimal approximations.
