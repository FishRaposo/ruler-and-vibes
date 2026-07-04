---
id: extr-03-manifest-records
category: structured-extraction
title: Messy shipping manifest to typed record array
deliverables:
  - manifest.json
---

## Task

Parse the shipping manifest below into a JSON array matching the
schema EXACTLY. The manifest is a raw plain-text dump from a
warehouse terminal; formatting is inconsistent line to line, and one
line is a stray reprint that should not become a second record.

Manifest (as printed):

```
SHIPMENT SH-100 | weight: 12.5 kg | dest: ZONE-A | note: fragile, handle with care
--
shipment sh-101; weight 800 g; dest: ; note: small parts, gift wrapped
--
SH-102 -- 5kg -- ZONE-C -- note: contains lithium cells, ship upright
--
SH-103 | 20 KG | ZONE-B | note: bulk textiles, palletized
--
SH-100 | weight: 12.5 kg | dest: ZONE-A | note: fragile, handle with care    (reprint - ignore, duplicate scan)
```

## Schema

A JSON array. Each element is an object with EXACTLY these keys:

- `id` — string, e.g. `"SH-100"`.
- `weight_kg` — number, always in kilograms (convert grams to
  kilograms where needed).
- `destination_zone` — string, or `null` if the source line left the
  destination blank. Never invent a destination.
- `hazmat` — boolean (`true`/`false`, never a string, never omitted):
  `true` only if the shipment's note mentions a hazardous-material
  keyword (e.g. a lithium battery reference), `false` otherwise.

## Deliverables

- `manifest.json` — the array described above.

## Constraints

- `manifest.json` must parse with `JSON.parse`. No trailing commas,
  no comments, no extra keys.
- The reprinted/duplicate scan line refers to the same shipment as an
  earlier line and must NOT produce a second record — each shipment
  id appears exactly once in the output.
- Preserving first-appearance order is a nice-to-have, not a
  requirement.
