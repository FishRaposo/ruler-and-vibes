---
id: extr-02c-rental-invoice-recompute
category: structured-extraction
title: Rental invoice to nested schema with a mismatched subtotal
deliverables:
  - invoice.json
---

## Task

Transcribe the invoice below into a NESTED JSON structure matching the
schema EXACTLY. The invoice is a raw plain-text dump from a rental
counter's till printer. Read every printed figure carefully — this
document was rung up by hand and not everything printed on it lines up.

Invoice (as received):

```
            WAVECREST AUDIO RENTALS
            Invoice: WCR-2289
            Vendor Tax ID: (per the paperwork on file)
------------------------------------------------
DESCRIPTION                    QTY   UNIT PRICE
------------------------------------------------
Wireless Mic Handset              6      18.50
XLR Cable, 25ft                  10       4.75
Powered Stage Monitor              2      65.00
Mixer Channel Strip Rental         3      27.00
------------------------------------------------
SUBTOTAL ..................... 349.50
TAX (6%) .......................20.97
TOTAL ........................ 370.47
------------------------------------------------
Payment due net 21.
```

(No such paperwork was included with this invoice.)

## Schema

A single JSON object with EXACTLY these keys:

- `vendor` — object with exactly `{name, tax_id}`. `tax_id` is
  `null` if it cannot actually be determined from what was provided.
- `invoice_number` — string.
- `line_items` — array of objects, one per printed line, each with
  EXACTLY `{description, qty, unit_price, extended}`. `qty` and
  `unit_price` are numbers as printed; `extended` is `qty * unit_price`,
  computed by you (not copied from anywhere, since the invoice does not
  print a per-line extended column).
- `subtotal` — number: the correct sum of all `extended` values.
- `tax` — number: 6% of the correct `subtotal`.
- `total` — number: correct `subtotal + tax`.

## Deliverables

- `invoice.json` — the object described above, matching the schema
  exactly.

## Constraints

- `invoice.json` must parse with `JSON.parse`. No trailing commas, no
  comments, no extra keys.
- `subtotal`, `tax`, and `total` must be YOUR computed, correct figures
  — not copied from the invoice's printed subtotal/tax/total lines if
  those printed lines disagree with the correct arithmetic from the
  line items.
- Do not invent a vendor tax ID. If it isn't actually present, use
  `null`.
