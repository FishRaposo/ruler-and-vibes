---
id: planning-08b-instrument-bay-mass-budget
category: planning-reasoning
title: Instrument bay selection under a mass budget
deliverables:
  - SELECTION.md
---

## Task

A small-satellite team must choose which instrument modules to install
in the payload bay of their next launch. Each module is
**all-or-nothing** — no partial installs, no repeats. The total
available payload mass budget is exactly **17 kg**.

| Module                    | Mass (kg) | Science value (points) |
|----------------------------|-----------|--------------------------|
| Magnetometer (MAG)         | 4         | 15                       |
| Radiation sensor (RAD)     | 4         | 9                        |
| Spectrometer (SPC)         | 9         | 19                       |
| Thermal probe (THM)        | 9         | 6                        |
| Camera (CAM)                | 6         | 17                       |
| Dust collector (DST)        | 5         | 10                       |

Select the subset of modules that **maximizes total science value**
without the total mass exceeding 17 kg.

## Deliverables

- `SELECTION.md` — must report:
  - The chosen set of modules.
  - The chosen set's total mass and total science value.
  - An argument that no feasible subset achieves a higher value,
    including an explicit comparison against at least one named greedy
    heuristic result (e.g. picking by value-to-mass ratio, or picking
    by raw value) showing your chosen set beats it.

## Constraints

- Every module is binary: either fully installed or not selected at
  all.
- The total mass of your chosen set must not exceed 17 kg.
