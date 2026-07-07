---
id: precision-02b-bakehouse-bulletin
category: instruction-following
title: Bulletin under stacked constraints
deliverables:
  - bulletin.md
---

## Task

Write a membership bulletin for **Tallowfen Bakehouse**, a fictional
neighbourhood bakery co-op, introducing three new offerings: a
**sourdough club**, the **grain share**, and **evening bakes**.

Every constraint below is mandatory:

1. Exactly 5 paragraphs, separated by blank lines. No headings, no
   lists, no bold/italics.
2. Opening words: paragraph 1 begins with `Starting`, paragraph 2 with
   `Sourdough`, paragraph 3 with `Members`, paragraph 4 with `Evening`,
   paragraph 5 with `Doors`.
3. Total length 145–165 words (counted with `wc -w`).
4. Paragraph 5 is at most 18 words and contains the exact string
   `open now`.
5. Forbidden anywhere, any casing: "delighted", "elevate", "artisanal",
   "unbeatable".
6. Each offering is named exactly once in the whole piece: "sourdough
   club" only in paragraph 2, "grain share" only in paragraph 3,
   "evening bakes" only in paragraph 4.

## Deliverables

- `bulletin.md` — the bulletin, nothing else in the file.

## Constraints

- All six constraint groups above. They are checked mechanically.
