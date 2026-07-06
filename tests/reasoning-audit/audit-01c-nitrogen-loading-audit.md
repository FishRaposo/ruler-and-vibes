---
id: audit-01c-nitrogen-loading-audit
category: reasoning-audit
title: Nitrogen Loading Calculation Audit
deliverables:
  - AUDIT.md
---

## Task

A fictional agronomy service is reviewing annual nitrogen-loading
estimates for two invented fields. Each derivation below computes the
**annual nitrogen mass taken up by the crop** from the field area, the
per-area application rate of nitrogen, and an uptake fraction (the
fraction of applied nitrogen the crop actually assimilates), using the
formula:

```
Nitrogen Uptake (kg) = Area (m^2) x Application Rate (kg/m^2) x Uptake Fraction
```

Every step is labeled. Audit each derivation independently.

### Derivation A — Field "Marrowgate Furlong"

- **Step A1**: Field area is given as 58.0 ha.
- **Step A2**: Convert area to square metres: 58.0 ha = 5.80 x 10^4 m^2.
- **Step A3**: Application rate is given as 0.640 kg/m^2.
- **Step A4**: Uptake fraction (fraction of applied nitrogen the crop
  assimilates) is given as 0.35.
- **Step A5**: Multiply the application rate by the uptake fraction:
  0.640 x 0.35 = 0.224 kg/m^2 of effective assimilated loading.
- **Step A6**: Multiply the converted area (Step A2) by the effective
  loading (Step A5): 5.80 x 10^4 m^2 x 0.224 kg/m^2 = 12,992 kg.
- **Step A7**: Conclusion: Marrowgate Furlong's annual nitrogen uptake
  is 12,992 kg (12.992 t).

### Derivation B — Field "Thornwick Leas"

- **Step B1**: Field area is given as 34.0 ha.
- **Step B2**: Convert area to square metres: 34.0 ha = 3.40 x 10^5 m^2.
- **Step B3**: Application rate is given as 0.480 kg/m^2.
- **Step B4**: Uptake fraction is given as 0.28.
- **Step B5**: Multiply the converted area (Step B2) by the application
  rate (Step B3): 3.40 x 10^5 m^2 x 0.480 kg/m^2 = 163,200 kg of total
  nitrogen applied across the field.
- **Step B6**: Multiply the total applied nitrogen (Step B5) by the
  uptake fraction (Step B4): 163,200 kg x 0.28 = 45,696 kg.
- **Step B7**: Conclusion: Thornwick Leas' annual nitrogen uptake is
  45,696 kg (45.696 t).

## Deliverables

- `AUDIT.md` containing, for **each** derivation (A and B) in order:
  - A verdict: either "ERROR FOUND" or "NO ERROR FOUND".
  - If ERROR FOUND: the exact step label (e.g. "Step A2") of the
    **first** step at which the derivation goes wrong, a one-sentence
    explanation of why that step is wrong, and the corrected final
    nitrogen uptake in kg (and optionally t).
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
