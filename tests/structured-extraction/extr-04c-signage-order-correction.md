---
id: extr-04c-signage-order-correction
category: structured-extraction
title: Print shop order reconciled against a correction email
deliverables:
  - reconciled.json
---

## Task

Reconcile the invoice below against the follow-up correction email into
ONE authoritative JSON record matching the schema EXACTLY. The email
overrides parts of the invoice; the printed invoice total is NOT the
correct answer once the overrides are applied.

Original invoice (as printed):

```
              BLUE RIDGE PRINT & SIGNAGE
              Invoice: INV-8834
------------------------------------------------
SKU     DESCRIPTION              QTY   UNIT PRICE
------------------------------------------------
PS-1    Vinyl Banner                5      42.00
PS-2    Yard Sign                   8      15.00
PS-3    Foam Board Poster           4      22.00
PS-4    Business Card Box          20       3.50
PS-5    Retractable Banner Stand    1      95.00
------------------------------------------------
SUBTOTAL ..................... 583.00
TAX (9%) .......................52.47
TOTAL ......................... 635.47
------------------------------------------------
Payment due net 30.
```

Follow-up correction email (received after the invoice):

```
From: billing@blueridgeprint.example
Subject: RE: INV-8834 — corrections before payment

Hi — three corrections to INV-8834 before you pay it:

1. Line PS-3 (Foam Board Poster) was mis-keyed. The correct quantity is
   40 units, not 4. Unit price is unchanged.

2. Line PS-5 (Retractable Banner Stand) shipped defective and is being
   fully credited — please remove it from the invoice entirely.

3. As a goodwill gesture for the mix-up, we're applying a flat $28.00
   discount. Apply the discount to the corrected subtotal BEFORE
   calculating tax, not after.

Recompute the subtotal from the corrected lines, apply the $28.00
discount, then apply the invoice's original 9% tax rate to the
discounted amount to get the new total. Sorry for the hassle.

— Blue Ridge Billing
```

## Schema

A single JSON object with EXACTLY these keys:

- `invoice_number` — string.
- `line_items` — array of objects, one per SURVIVING corrected line,
  each with EXACTLY `{sku, description, qty, unit_price, extended}`,
  where `extended = qty * unit_price`.
- `discount` — number: the flat discount applied.
- `subtotal` — number: the sum of `extended` across the surviving,
  corrected line items (before the discount).
- `tax` — number: 9% of `(subtotal - discount)`.
- `total` — number: `(subtotal - discount) + tax`.

## Deliverables

- `reconciled.json` — the object described above.

## Constraints

- `reconciled.json` must parse with `JSON.parse`. No trailing commas,
  no comments, no extra keys.
- Apply all three corrections from the email: the corrected PS-3
  quantity, the removal of PS-5, and the discount applied before tax
  (not after).
- The removed line's SKU must not appear anywhere in the file.
- `total` must be your correct, recomputed figure — not the invoice's
  original printed total, and not a figure produced by taxing before
  discounting.
