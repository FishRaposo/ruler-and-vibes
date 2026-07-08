---
id: extr-01-receipt-fields
category: structured-extraction
title: Receipt to fixed schema with an unreadable field
deliverables:
  - receipt.json
---

## Task

Transcribe the receipt below into ONE flat JSON object matching the
schema EXACTLY. The receipt is a raw plain-text dump — read it
carefully; some of it is faint or smudged.

Receipt (as scanned):

```
        NORTHGATE PANTRY
      412 Elm Concourse, Bay 3
------------------------------
Date: 2024-11-08          Reg 02

  Oat Milk 1L ................ 10.00
  Sourdough Loaf .............. 18.00
  Roasted Almonds 200g ........ 15.00
------------------------------
SUBTOTAL ..................... 43.00
TAX (10%) ...................... 4.30
TOTAL ......................... 47.30
------------------------------
LOYALTY: 4471-**8-2*9
   (card smudged at register)
      THANK YOU FOR SHOPPING
```

## Schema

A single JSON object with EXACTLY these keys:

- `store_name` — string, the store's name in standard capitalization (the printed header is in ALL CAPS as a stylistic banner — e.g. transcribe "NORTHGATE PANTRY" as "Northgate Pantry").
- `purchase_date` — string, `YYYY-MM-DD`.
- `items` — array of the three item description strings, in the
  order printed (descriptions only, not prices).
- `subtotal` — number.
- `tax` — number.
- `total` — number.
- `loyalty_number` — string, or `null` if it cannot be read in full.

## Deliverables

- `receipt.json` — the object described above, matching the schema
  exactly: no missing keys, no extra keys.

## Constraints

- `receipt.json` must parse with `JSON.parse`. No trailing commas, no
  comments, no extra keys, no extra top-level fields.
- Do not guess, partially reconstruct, or invent any digits for a
  field you cannot read in full — use `null` instead.
