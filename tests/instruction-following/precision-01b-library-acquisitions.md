---
id: precision-01b-library-acquisitions
category: instruction-following
title: Messy acquisition slips to exact JSON
deliverables:
  - catalog.json
  - NOTES.md
---

## Task

Normalize the book acquisition slips below into JSON matching the schema
EXACTLY. Where the source is ambiguous, make a sensible call and
document it.

Source slips (as received):

```
1. "The Tide Clock" | ISBN 979-8-6120-0042-1 | 312 pp | acquired Sept 9 2023
2. salt and cedar — 978-1-4521-9930-7 — 204 pages — acquired 2023-01-22
3. Redgate Ledger; isbn 0-8090-5321-X; 488pp; Feb 8 2023
4. 979-8-6120-0042-1 (slip torn, no title or page count, acquired 2023-05-30)
5. the QUIET FOUNDRY / 978-1-9821-4477-0 / 176 pp / acquired 06/03/2023
6. o'dell survey | 978-0-3742-2001-9 | 259 pp | acquired 19/11/2023
7. Ashfall Almanac — 978-1-6803-5510-2 — 640 pages — March 2, 2023
8. redgate ledger <080905321x> 488 pp, acquired 2023-03-11
9. Hollow Reed | 978-1-7811-6642-8 | 128 pp | acquired: —
10. CINDER AND VANE | 979-8-2150-9987-5 | 420 pp | acquired 2023-02-29
```

## Schema

- Top level: a JSON array, sorted by `isbn` ascending.
- Each object has EXACTLY these keys, in this order:
  - `isbn` — lowercase string, digits only with hyphens and spaces
    removed (an `X`/`x` check digit is kept, lowercased).
  - `title` — Title Case string, or `null` if unknown.
  - `pages` — an integer (digits only, no punctuation), or `null` if
    absent.
  - `acquired` — `YYYY-MM-DD`, or `null` if absent or invalid.
- Duplicates: same `isbn` case-insensitively (after stripping hyphens
  and spaces) = same book → ONE record. Keep the EARLIEST valid
  `acquired` date; for other fields, prefer the value from the record
  carrying that earliest date, falling back to any non-null value.
- Ambiguous date formats: resolve them; dates that cannot exist are
  invalid (→ `null`), not guesses.

## Deliverables

- `catalog.json` — the array, pretty-printed with 2-space indent.
- `NOTES.md` — every judgment call: each date-format resolution, each
  merge, anything invalid and why.

## Constraints

- `catalog.json` must parse with `JSON.parse`. No trailing commas, no
  comments, no extra keys.
