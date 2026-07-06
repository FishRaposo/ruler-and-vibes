---
id: audit-01b-solar-array-yield-calculation
category: reasoning-audit
title: Solar Array Yield Calculation Audit
deliverables:
  - AUDIT.md
---

## Task

A fictional renewable-energy engineering firm is reviewing annual
energy-yield estimates for two invented photovoltaic installations. Each
derivation below computes the **annual energy yield** from the array's
ground area, the annual solar insolation (energy arriving per unit area
each year), and a system efficiency (the fraction of arriving solar
energy the array converts to delivered electricity), using the formula:

```
Annual Energy Yield (kWh) = Array Area (m^2) x Annual Insolation (kWh/m^2) x System Efficiency
```

Every step is labeled. Audit each derivation independently.

### Derivation A — Installation "Sunfell Array"

- **Step A1**: Array ground area is given as 3.60 ha.
- **Step A2**: Convert area to square metres: 3.60 ha = 3.60 x 10^3 m^2.
- **Step A3**: Annual solar insolation is given as 1,650 kWh/m^2.
- **Step A4**: System efficiency (fraction of arriving solar energy
  delivered as electricity) is given as 0.18.
- **Step A5**: Multiply the insolation by the system efficiency:
  1,650 x 0.18 = 297 kWh/m^2 of effective delivered energy per square
  metre.
- **Step A6**: Multiply the converted area (Step A2) by the effective
  delivered energy per square metre (Step A5): 3.60 x 10^3 m^2 x 297
  kWh/m^2 = 1,069,200 kWh.
- **Step A7**: Conclusion: Sunfell Array's annual energy yield is
  1,069,200 kWh (1,069.2 MWh).

### Derivation B — Installation "Brightmoor Array"

- **Step B1**: Array ground area is given as 5.40 ha.
- **Step B2**: Convert area to square metres: 5.40 ha = 5.40 x 10^4 m^2.
- **Step B3**: Annual solar insolation is given as 1,480 kWh/m^2.
- **Step B4**: System efficiency is given as 0.21.
- **Step B5**: Multiply the converted area (Step B2) by the insolation
  (Step B3): 5.40 x 10^4 m^2 x 1,480 kWh/m^2 = 79,920,000 kWh of gross
  solar energy arriving on the array.
- **Step B6**: Multiply the gross arriving energy (Step B5) by the
  system efficiency (Step B4): 79,920,000 kWh x 0.21 = 16,783,200 kWh.
- **Step B7**: Conclusion: Brightmoor Array's annual energy yield is
  16,783,200 kWh (16,783.2 MWh).

## Deliverables

- `AUDIT.md` containing, for **each** derivation (A and B) in order:
  - A verdict: either "ERROR FOUND" or "NO ERROR FOUND".
  - If ERROR FOUND: the exact step label (e.g. "Step A2") of the
    **first** step at which the derivation goes wrong, a one-sentence
    explanation of why that step is wrong, and the corrected final
    energy yield in kWh (and optionally MWh).
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
