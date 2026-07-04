---
id: extr-02-invoice-nested
category: structured-extraction
title: Invoice to nested schema with a wrong printed subtotal
deliverables:
  - invoice.json
---

## Task

Transcribe the invoice below into a NESTED JSON structure matching the
schema EXACTLY. The invoice is a raw plain-text dump. Read every
printed figure carefully — this document was typeset by hand and not
everything printed on it is internally consistent.

Invoice (as received):

```
              KESTREL OFFICE SUPPLY
             Invoice: INV-8842
             Vendor Tax ID: (see attached)
------------------------------------------------
DESCRIPTION                    QTY   UNIT PRICE
------------------------------------------------
Copy Paper, A4, 10-ream case    10       3.00
Toner Cartridge, Black HY        4      12.50
Standing Desk Riser              2      45.00
USB-C Cable 2m                   6       1.75
------------------------------------------------
SUBTOTAL ..................... 185.00
TAX (10%) ......................18.50
TOTAL ........................ 203.50
------------------------------------------------
Payment due net 30.
```

(No attachment accompanied this invoice.)

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
- `tax` — number: 10% of the correct `subtotal`.
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
