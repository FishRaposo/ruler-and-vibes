---
id: precision-01-exact-format
category: instruction-following
title: Messy records to exact JSON
deliverables:
  - contacts.json
  - NOTES.md
---

## Task

Normalize the contact records below into JSON matching the schema
EXACTLY. Where the source is ambiguous, make a sensible call and
document it.

Source records (as received):

```
1. John SMITH <John.Smith@Acme.com>, phone 555-0101, joined 3/14/2024
2. maria garcia — maria.garcia@buendia.mx — joined 2024-01-30
3. Chen, Wei | wei.chen@nova.io | +1 (555) 010-2233 | Jan 5 2024
4. JOHN.SMITH@ACME.COM (no other data, joined 2024-03-20)
5. Fatima Al-Sayed <fatima@dune.ae> phone: 555.0177 joined 07/04/2024
6. bob o'brien, bob.obrien@clover.ie, joined 15/02/2024
7. Anya Petrova | anya.petrova@vostok.ru | joined March 2, 2024
8. wei chen <WEI.CHEN@NOVA.IO> phone 555-0199, joined 2024-02-11
9. Liam Murphy — liam@shamrock.ie — no join date
10. sofia rossi <sofia.rossi@venezia.it>, joined 2024-06-31
```

## Schema

- Top level: a JSON array, sorted by `email` ascending.
- Each object has EXACTLY these keys, in this order:
  - `email` — lowercase string.
  - `name` — `"First Last"` in Title Case, or `null` if unknown.
  - `phone` — digits only (no punctuation, keep country code digits),
    or `null` if absent.
  - `joined` — `YYYY-MM-DD`, or `null` if absent or invalid.
- Duplicates: same email case-insensitively = same person → ONE record.
  Keep the EARLIEST valid `joined` date; for other fields, prefer the
  value from the record carrying that earliest date, falling back to
  any non-null value.
- Ambiguous date formats: resolve them; dates that cannot exist are
  invalid (→ `null`), not guesses.

## Deliverables

- `contacts.json` — the array, pretty-printed with 2-space indent.
- `NOTES.md` — every judgment call: each date-format resolution, each
  merge, anything invalid and why.

## Constraints

- `contacts.json` must parse with `JSON.parse`. No trailing commas, no
  comments, no extra keys.
