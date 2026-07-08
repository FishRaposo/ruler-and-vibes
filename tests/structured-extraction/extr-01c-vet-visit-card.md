---
id: extr-01c-vet-visit-card
category: structured-extraction
title: Vet visit card to fixed schema with an unreadable field
deliverables:
  - visit.json
---

## Task

Transcribe the veterinary visit card below into ONE flat JSON object
matching the schema EXACTLY. The card is a raw plain-text dump — read it
carefully; some of it is faint or smudged.

Visit card (as scanned):

```
      BRIGHTPAW VETERINARY CLINIC
       26 Willowmere Lane, Suite 4
------------------------------
Visit: 2025-06-24        Room B
Patient: Biscuit (canine)

  Wellness Exam .............. 12.00
  Bordetella Vaccine ......... 26.00
  Nail Trim & Ear Clean ...... 19.00
------------------------------
VISIT SUBTOTAL ............... 57.00
DISPENSING FEE (20%) ......... 11.40
TOTAL ........................ 68.40
------------------------------
MICROCHIP: 985-1*24-7**9
   (sticker crimped in the tray)
      GET WELL SOON, BISCUIT
```

## Schema

A single JSON object with EXACTLY these keys:

- `clinic_name` — string, the clinic's name in standard capitalization (the printed header is in ALL CAPS as a stylistic banner — e.g. transcribe "BRIGHTPAW VETERINARY CLINIC" as "Brightpaw Veterinary Clinic").
- `visit_date` — string, `YYYY-MM-DD`.
- `treatments` — array of the three treatment description strings, in the
  order printed (descriptions only, not amounts).
- `visit_subtotal` — number.
- `dispensing_fee` — number.
- `total` — number.
- `microchip_id` — string, or `null` if it cannot be read in full.

## Deliverables

- `visit.json` — the object described above, matching the schema
  exactly: no missing keys, no extra keys.

## Constraints

- `visit.json` must parse with `JSON.parse`. No trailing commas, no
  comments, no extra keys, no extra top-level fields.
- Do not guess, partially reconstruct, or invent any characters for a
  field you cannot read in full — use `null` instead.
