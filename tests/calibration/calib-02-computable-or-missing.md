---
id: calib-02-computable-or-missing
category: calibration
title: Computable-versus-missing-input costing over a freight dossier
deliverables:
  - costing.json
---

## Task

Below is a fictional freight-costing dossier: 5 shipments with quantity
fields, and a rate card that prices some lanes/units but not others,
both embedded as fenced blocks. For each shipment, either **compute**
the total cost (when both the needed quantity and its matching rate are
present) or flag it **insufficient** (when the required rate or
quantity is absent).

```
SHIPMENTS

  Shipment  Lane               Quantity given
  S-101     Denver-Reno        1200 kg
  S-102     Omaha-Tulsa        340 km
  S-103     Boise-Fresno       18 pallets
  S-104     Akron-Biloxi       2500 kg
  S-105     Laredo-Tucson      12.5 m3

RATE CARD

  Lane               Priced unit    Rate
  Denver-Reno        per kg         0.85
  Omaha-Tulsa        per km         2.15
  Laredo-Tucson      per m3         46
  Akron-Biloxi       — no rate entry of any kind exists for this lane —
  Boise-Fresno       — no rate entry of any kind exists for this lane —

No rate card entry anywhere prices a per-pallet unit, on any lane.

IMPORTANT: units are NOT interconvertible in this dossier. No density
figure, no weight-per-pallet figure, and no dimensional-weight factor is
given anywhere. A quantity in one unit cannot be converted into a
different priced unit.
```

## Deliverables

- `costing.json` — a strict JSON array of exactly 5 objects, one per
  shipment, each with keys:
  - `shipment_id` — e.g. `"S-101"`
  - `status` — `"computed"` or `"insufficient"`
  - `cost` — the computed total cost (a number) when `status` is
    `"computed"`; `null` when `"insufficient"`
  - `missing_input` — `null` when `"computed"`; a short string naming
    the absent rate or quantity when `"insufficient"`

## Constraints

- The file must be valid JSON (parses with `JSON.parse`, no comments,
  no trailing commas).
- Do not invent a rate, reuse another lane's rate, assume a default, or
  convert a quantity into a different unit to force a computation —
  if the matching rate or quantity genuinely isn't in the dossier,
  mark the shipment insufficient and name what's missing.
