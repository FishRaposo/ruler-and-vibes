---
id: extr-02b-nursery-invoice
category: structured-extraction
title: Nursery invoice to nested schema with a wrong printed subtotal
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
           COPPERLEAF GARDEN & NURSERY SUPPLY
             Invoice: INV-3067
             Vendor Tax ID: (on file with accounting)
------------------------------------------------
DESCRIPTION                    QTY   UNIT PRICE
------------------------------------------------
Potting Soil, 40lb Bag           8       4.25
Ceramic Planter, 12in            6      15.50
Drip Irrigation Kit              3      22.00
Fertilizer Spikes, 20-pack       5       3.30
------------------------------------------------
SUBTOTAL ..................... 214.00
TAX (12%) ......................25.68
TOTAL ........................ 239.68
------------------------------------------------
Payment due net 45.
```

(No accounting file accompanied this shipment.)

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
- `tax` — number: 12% of the correct `subtotal`.
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
