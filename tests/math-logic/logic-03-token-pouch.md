---
id: logic-03-token-pouch
category: math-logic
title: Token Pouch Game
deliverables:
  - ANSWERS.md
---

## Task

A pouch holds 6 distinct physical tokens: 3 red tokens (each worth +4
points), 2 blue tokens (each worth -3 points), and 1 gold token. The
gold token is worth 0 points itself, but it **doubles the combined
score of the other token(s) drawn with it** (for example, drawing one
red token and the gold token scores 4 x 2 = 8).

**Game A**: draw 2 tokens from the pouch without replacement (both
tokens drawn are distinct physical tokens, order doesn't matter).

- **Q1**: What is the exact expected score of Game A, as a reduced
  fraction?
- **Q2**: What is P(score >= 8) and what is P(score < 0), each as a
  reduced fraction?

**Game B**: identical scoring rules, but played **with replacement**:
draw one token, note it, return it to the pouch, then draw again (the
same physical token can be drawn both times). If the gold token is
drawn on both draws, the score is 0.

- **Q3**: What is the exact expected score of Game B, as a reduced
  fraction?
- **Q4**: Which game has the higher expected score, and by exactly how
  much (as a reduced fraction)?

Decimal-only answers do not count as answering Q1, Q3, or Q4 — exact
reduced fractions are required (decimals may appear alongside them,
but the fraction must be present).

## Deliverables

- `ANSWERS.md` — must contain:
  - A full case-enumeration table for Game A covering the five
    unordered pair types (red-red, red-blue, red-gold, blue-blue,
    blue-gold), each with its count out of the total and its score.
  - A full case-enumeration table for Game B covering the same five
    types plus the gold-gold outcome, each with its count out of the
    total and its score.
  - Answers to Q1-Q4, each on its own line labeled `Q1:`, `Q2:`, `Q3:`,
    `Q4:`, with the exact reduced fraction(s) required.

## Constraints

- At most 500 words (whole file, `wc -w`).
- All four answers must be exact fractions, not decimal approximations.
