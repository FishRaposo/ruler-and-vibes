---
id: precision-02c-transit-bulletin
category: instruction-following
title: Transit bulletin under stacked constraints
deliverables:
  - bulletin.md
---

## Task

Write a rider bulletin for **Wayfare**, a fictional city bike-share
service, covering three new features: **night lighting**, the **route
history**, and **group rides**.

Every constraint below is mandatory:

1. Exactly 5 paragraphs, separated by blank lines. No headings, no
   lists, no bold/italics.
2. Opening words: paragraph 1 begins with `Starting`, paragraph 2 with
   `Night`, paragraph 3 with `Every`, paragraph 4 with `Group`,
   paragraph 5 with `Rolling`.
3. Total length 150–170 words (counted with `wc -w`).
4. Paragraph 5 is at most 22 words and contains the exact string
   `Rolling out now`.
5. Forbidden anywhere, any casing: "delighted", "stoked",
   "frictionless", "supercharge".
6. Each feature is named exactly once in the whole piece: "night
   lighting" only in paragraph 2, "route history" only in paragraph 3,
   "group rides" only in paragraph 4.

## Deliverables

- `bulletin.md` — the bulletin, nothing else in the file.

## Constraints

- All six constraint groups above. They are checked mechanically.
