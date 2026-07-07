---
id: extr-04b-book-order-correction
category: structured-extraction
title: Purchase order reconciled against a distributor's correction email
deliverables:
  - reconciled_order.json
---

## Task

Reconcile the purchase order below against the follow-up correction
email into ONE authoritative JSON record matching the schema EXACTLY.
The email overrides parts of the order; the printed order total is
NOT the correct answer once the overrides are applied.

Original purchase order (as printed):

```
              MILLBROOK WHOLESALE BOOKS
              Purchase Order: PO-8842
------------------------------------------------
SKU     DESCRIPTION              QTY   UNIT PRICE
------------------------------------------------
BK-102  Trail Maps Vol. 2          4       8.00
BK-118  Coastal Recipes            2      20.00
BK-127  Garden Almanac Deluxe      5      12.00
BK-140  Night Sky Atlas           10       1.20
BK-155  Vintage Ciphers            1      80.00
------------------------------------------------
SUBTOTAL ..................... 224.00
TAX (6%) .......................13.44
TOTAL ......................... 237.44
------------------------------------------------
Payment due net 30.
```

Follow-up correction email (received after the order):

```
From: returns@millbrook-books.example
Subject: RE: PO-8842 — corrections before payment

Hi — three corrections to PO-8842 before you pay it:

1. Line BK-127 (Garden Almanac Deluxe) was mis-keyed. The correct
   quantity is 35 units, not 5. Unit price is unchanged.

2. Line BK-155 (Vintage Ciphers) arrived water-damaged in transit and
   is being fully credited — please remove it from the order entirely.

3. As an apology for the mix-up, we're applying a flat $30.00
   discount. Apply the discount to the corrected subtotal BEFORE
   calculating tax, not after.

Recompute the subtotal from the corrected lines, apply the $30.00
discount, then apply the order's original 6% tax rate to the
discounted amount to get the new total. Sorry for the hassle.

— Millbrook Returns Desk
```

## Schema

A single JSON object with EXACTLY these keys:

- `order_number` — string.
- `line_items` — array of objects, one per SURVIVING corrected line,
  each with EXACTLY `{sku, description, qty, unit_price, extended}`,
  where `extended = qty * unit_price`.
- `discount` — number: the flat discount applied.
- `subtotal` — number: the sum of `extended` across the surviving,
  corrected line items (before the discount).
- `tax` — number: 6% of `(subtotal - discount)`.
- `total` — number: `(subtotal - discount) + tax`.

## Deliverables

- `reconciled_order.json` — the object described above.

## Constraints

- `reconciled_order.json` must parse with `JSON.parse`. No trailing
  commas, no comments, no extra keys.
- Apply all three corrections from the email: the corrected BK-127
  quantity, the removal of BK-155, and the discount applied before tax
  (not after).
- The removed line's SKU must not appear anywhere in the file.
- `total` must be your correct, recomputed figure — not the order's
  original printed total, and not a figure produced by taxing before
  discounting.
