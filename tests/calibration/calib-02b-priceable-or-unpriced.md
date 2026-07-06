---
id: calib-02b-priceable-or-unpriced
category: calibration
title: Priceable-versus-unpriced estimating over a sign-shop job board
deliverables:
  - estimate.json
---

## Task

Below is a fictional sign-fabrication job board: 5 jobs with a single
quantity field each, and a price list that rates some product lines/units
but not others, both embedded as fenced blocks. For each job, either
**compute** the line total (when both the needed quantity and its matching
rate are present) or flag it **unpriced** (when the required rate or
quantity is absent).

```
JOBS

  Job     Product line       Quantity given
  J-41    Corvin Plaza       46 sq ft
  J-42    Braddock Row       120 linear ft
  J-43    Merritt Court      32 letters
  J-44    Renshaw Gate       58 sq ft
  J-45    Oxley Landing      9 pieces

PRICE LIST

  Product line       Priced unit     Rate
  Corvin Plaza       per sq ft       7.5
  Braddock Row       per linear ft   3.2
  Oxley Landing      per piece       14
  Renshaw Gate       — no price list entry of any kind exists for this line —
  Merritt Court      — no price list entry of any kind exists for this line —

No price list entry anywhere rates a per-letter unit, on any product line.

IMPORTANT: units are NOT interconvertible in this job board. No coverage
figure, no letters-per-square-foot figure, and no piece-to-area factor is
given anywhere. A quantity in one unit cannot be restated as a different
priced unit.
```

## Deliverables

- `estimate.json` — a strict JSON array of exactly 5 objects, one per
  job, each with keys:
  - `job_id` — e.g. `"J-41"`
  - `status` — `"computed"` or `"unpriced"`
  - `total` — the computed line total (a number) when `status` is
    `"computed"`; `null` when `"unpriced"`
  - `missing_input` — `null` when `"computed"`; a short string naming
    the absent rate or quantity when `"unpriced"`

## Constraints

- The file must be valid JSON (parses with `JSON.parse`, no comments,
  no trailing commas).
- Do not invent a rate, reuse another product line's rate, assume a
  default, or restate a quantity in a different unit to force a
  computation — if the matching rate or quantity genuinely isn't on the
  job board, mark the job unpriced and name what's missing.
