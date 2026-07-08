---
id: precision-01c-library-accession
category: instruction-following
title: Messy acquisition records to exact JSON
deliverables:
  - catalog.json
  - NOTES.md
---

## Task

Normalize the accession records below into JSON matching the schema
EXACTLY. Where the source is ambiguous, make a sensible call and
document it.

Source records (as received):

```
1. The SALT ROADS — ISBN 978-1-56619-909-4 — 312 pp — acquired 9/21/2025
2. quiet tides | 9780306406157 | 204 pp | acquired 2025-04-11
3. Harbor, The <0-306-40615-2> 158 pp, acquired Feb 9 2024
4. 978 0 306 40615 7 (no title, no page count, acquired 2025-08-02)
5. Vellum & Ash — ISBN 080442957x — 277 pp — acquired 05/09/2025
6. o'hara-blythe letters | 978-0-14-044913-6 | 96 pp | acquired 23/06/2025
7. north wind rising <978-1-84195-492-3> 421 pp, acquired November 11, 2025
8. HARBOR, THE | 0306406152 | 160 pp | acquired 2024-01-05
9. shoreline notes — ISBN 978-0-393-04002-9 — 133 pp — no acquisition date
10. the far meridian | 978-0-7475-3269-9 | 188 pp | acquired 2024-09-31
```

## Schema

- Top level: a JSON array, sorted by `isbn` ascending.
- Each object has EXACTLY these keys, in this order:
  - `isbn` — string, canonical form: remove spaces and hyphens; if a
    trailing check character is the letter x, uppercase it to `X`.
  - `title` — Title Case, or `null` if unknown. A title written in
    inverted form `"X, The"` (or `"X, A"` / `"X, An"`) is rendered in
    natural reading order, e.g. `"The X"`.
  - `pages` — an integer (page count with any unit text stripped), or
    `null` if absent.
  - `acquired` — `YYYY-MM-DD`, or `null` if absent or invalid.
- Duplicates: same canonical `isbn` = same book → ONE record. Keep the
  EARLIEST valid `acquired` date; for other fields, prefer the value
  from the record carrying that earliest date, falling back to any
  non-null value.
- Ambiguous date formats: resolve them; dates that cannot exist are
  invalid (→ `null`), not guesses.

## Deliverables

- `catalog.json` — the array, pretty-printed with 2-space indent.
- `NOTES.md` — every judgment call: each date-format resolution, each
  merge, anything invalid and why.

## Constraints

- `catalog.json` must parse with `JSON.parse`. No trailing commas, no
  comments, no extra keys.
