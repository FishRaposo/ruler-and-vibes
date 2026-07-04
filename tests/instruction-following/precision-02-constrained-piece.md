---
id: precision-02-constrained-piece
category: instruction-following
title: Announcement under stacked constraints
deliverables:
  - announcement.md
---

## Task

Write a product-update announcement for **Lumen**, a fictional habit-
tracking app, covering three new features: **offline mode**, the
**weekly digest**, and **shared streaks**.

Every constraint below is mandatory:

1. Exactly 5 paragraphs, separated by blank lines. No headings, no
   lists, no bold/italics.
2. Opening words: paragraph 1 begins with `Today`, paragraph 2 with
   `Offline`, paragraph 3 with `Every`, paragraph 4 with `Streaks`,
   paragraph 5 with `Update`.
3. Total length 140–160 words (counted with `wc -w`).
4. Paragraph 5 is at most 20 words and contains the exact string
   `available today`.
5. Forbidden anywhere, any casing: "excited", "thrilled", "seamless",
   "revolutionize".
6. Each feature is named exactly once in the whole piece: "offline
   mode" only in paragraph 2, "weekly digest" only in paragraph 3,
   "shared streaks" only in paragraph 4.

## Deliverables

- `announcement.md` — the announcement, nothing else in the file.

## Constraints

- All six constraint groups above. They are checked mechanically.
