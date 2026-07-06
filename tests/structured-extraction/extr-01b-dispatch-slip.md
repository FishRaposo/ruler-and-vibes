---
id: extr-01b-dispatch-slip
category: structured-extraction
title: Dispatch slip to fixed schema with an unreadable field
deliverables:
  - dispatch.json
---

## Task

Transcribe the courier dispatch slip below into ONE flat JSON object
matching the schema EXACTLY. The slip is a raw plain-text dump — read it
carefully; some of it is faint or smudged.

Dispatch slip (as scanned):

```
      FERNBROOK FREIGHT DEPOT
     88 Alderway Sidings, Dock 5
------------------------------
Dispatched: 2025-03-19     Bay 7

  Padded Book Mailer x12 ...... 22.00
  Wardrobe Carton ............. 31.00
  Bubble Wrap Roll 50m ........ 14.00
------------------------------
DECLARED WT .................. 67.00
SURCHARGE (15%) .............. 10.05
TOTAL ........................ 77.05
------------------------------
HANDLING: HC-73*-*1*6
   (label scuffed on the belt)
      SAFE TRAVELS, PARCEL 5
```

## Schema

A single JSON object with EXACTLY these keys:

- `carrier_name` — string, exactly as printed.
- `dispatch_date` — string, `YYYY-MM-DD`.
- `parcels` — array of the three parcel description strings, in the
  order printed (descriptions only, not amounts).
- `declared_weight` — number.
- `surcharge` — number.
- `total` — number.
- `tracking_code` — string, or `null` if it cannot be read in full.

## Deliverables

- `dispatch.json` — the object described above, matching the schema
  exactly: no missing keys, no extra keys.

## Constraints

- `dispatch.json` must parse with `JSON.parse`. No trailing commas, no
  comments, no extra keys, no extra top-level fields.
- Do not guess, partially reconstruct, or invent any characters for a
  field you cannot read in full — use `null` instead.
