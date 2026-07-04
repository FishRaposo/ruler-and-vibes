---
id: audit-01-aquifer-recharge-calculation
category: reasoning-audit
title: Aquifer Recharge Calculation Audit
deliverables:
  - AUDIT.md
---

## Task

A fictional hydrology consultancy is reviewing groundwater recharge
estimates for two invented catchments. Each derivation below computes
the **annual groundwater recharge volume** from the catchment area, the
annual rainfall depth, and a recharge coefficient (the fraction of
rainfall that reaches the aquifer), using the formula:

```
Recharge Volume (m^3) = Area (m^2) x Rainfall Depth (m) x Recharge Coefficient
```

Every step is labeled. Audit each derivation independently.

### Derivation A — Catchment "Silvergrass Basin"

- **Step A1**: Catchment area is given as 4.20 km^2.
- **Step A2**: Convert area to square metres: 4.20 km^2 = 4.20 x 10^5 m^2.
- **Step A3**: Annual rainfall depth is given as 0.780 m.
- **Step A4**: Recharge coefficient (fraction of rainfall reaching the
  aquifer) is given as 0.15.
- **Step A5**: Multiply rainfall depth by the recharge coefficient:
  0.780 x 0.15 = 0.117 m of effective recharge depth.
- **Step A6**: Multiply the converted area (Step A2) by the effective
  recharge depth (Step A5): 4.20 x 10^5 m^2 x 0.117 m = 49,140 m^3.
- **Step A7**: Conclusion: Silvergrass Basin's annual recharge volume is
  49,140 m^3 (49.14 ML).

### Derivation B — Catchment "Copperreed Flats"

- **Step B1**: Catchment area is given as 2.60 km^2.
- **Step B2**: Convert area to square metres: 2.60 km^2 = 2.60 x 10^6 m^2.
- **Step B3**: Annual rainfall depth is given as 0.540 m.
- **Step B4**: Recharge coefficient is given as 0.22.
- **Step B5**: Multiply the converted area (Step B2) by the rainfall
  depth (Step B3): 2.60 x 10^6 m^2 x 0.540 m = 1,404,000 m^3 of total
  rainfall volume landing on the catchment.
- **Step B6**: Multiply the total rainfall volume (Step B5) by the
  recharge coefficient (Step B4): 1,404,000 m^3 x 0.22 = 308,880 m^3.
- **Step B7**: Conclusion: Copperreed Flats' annual recharge volume is
  308,880 m^3 (308.88 ML).

## Deliverables

- `AUDIT.md` containing, for **each** derivation (A and B) in order:
  - A verdict: either "ERROR FOUND" or "NO ERROR FOUND".
  - If ERROR FOUND: the exact step label (e.g. "Step A2") of the
    **first** step at which the derivation goes wrong, a one-sentence
    explanation of why that step is wrong, and the corrected final
    recharge volume in m^3 (and optionally ML).
  - If NO ERROR FOUND: a one-line confirmation restating the
    derivation's final value and that it is arithmetically correct.
  - Full re-derivation arithmetic showing how the corrected value (for
    whichever derivation has the error) was obtained.

## Constraints

- Exactly one of the two derivations contains a planted error; the
  other is fully correct. Do not flag both, and do not flag neither.
- The flagged step must be the **first** point of divergence, not a
  later step that merely carries the error forward — a later step that
  correctly uses an earlier (wrong) result is not itself an error.
- Show your corrected arithmetic; a bare corrected number without the
  recomputation shown is insufficient.
