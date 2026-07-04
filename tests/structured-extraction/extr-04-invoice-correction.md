---
id: extr-04-invoice-correction
category: structured-extraction
title: Invoice reconciled against a correction email
deliverables:
  - reconciled.json
---

## Task

Reconcile the invoice below against the follow-up correction email
into ONE authoritative JSON record matching the schema EXACTLY. The
email overrides parts of the invoice; the printed invoice total is
NOT the correct answer once the overrides are applied.

Original invoice (as printed):

```
              GEARWORKS INDUSTRIAL SUPPLY
              Invoice: INV-5521
------------------------------------------------
SKU     DESCRIPTION              QTY   UNIT PRICE
------------------------------------------------
AX-1    Widget Bracket             6       9.00
AX-2    Widget Panel               4      25.00
BX-9    Conveyor Roller            3      15.00
CX-7    Mounting Clip             12       1.50
DX-4    Servo Motor                1     120.00
------------------------------------------------
SUBTOTAL ..................... 337.00
TAX (8%) .......................26.96
TOTAL ......................... 363.96
------------------------------------------------
Payment due net 30.
```

Follow-up correction email (received after the invoice):

```
From: billing@gearworks-industrial.example
Subject: RE: INV-5521 — corrections before payment

Hi — three corrections to INV-5521 before you pay it:

1. Line BX-9 (Conveyor Roller) was mis-keyed. The correct quantity is
   30 units, not 3. Unit price is unchanged.

2. Line DX-4 (Servo Motor) shipped defective and is being fully
   credited — please remove it from the invoice entirely.

3. As a goodwill gesture for the mix-up, we're applying a flat $25.00
   discount. Apply the discount to the corrected subtotal BEFORE
   calculating tax, not after.

Recompute the subtotal from the corrected lines, apply the $25.00
discount, then apply the invoice's original 8% tax rate to the
discounted amount to get the new total. Sorry for the hassle.

— Gearworks Billing
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
- `tax` — number: 8% of `(subtotal - discount)`.
- `total` — number: `(subtotal - discount) + tax`.

## Deliverables

- `reconciled.json` — the object described above.

## Constraints

- `reconciled.json` must parse with `JSON.parse`. No trailing commas,
  no comments, no extra keys.
- Apply all three corrections from the email: the corrected BX-9
  quantity, the removal of DX-4, and the discount applied before tax
  (not after).
- The removed line's SKU must not appear anywhere in the file.
- `total` must be your correct, recomputed figure — not the invoice's
  original printed total, and not a figure produced by taxing before
  discounting.
