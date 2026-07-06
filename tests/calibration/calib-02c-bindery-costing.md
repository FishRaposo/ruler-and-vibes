---
id: calib-02c-bindery-costing
category: calibration
title: Computable-versus-missing-input costing over a bindery job sheet
deliverables:
  - costing.json
---

## Task

Below is a fictional bindery costing sheet from the Redgrave Bindery: 5
jobs with quantity fields, and a service rate card that prices some
services/units but not others, both embedded as fenced blocks. For each job,
either **compute** the total cost (when both the needed quantity and its
matching rate are present) or flag it **insufficient** (when the
required rate or quantity is absent).

```
JOBS

  Job     Service           Quantity given
  J-401   edge-trimming     900 sheets
  J-402   thread-sewing     260 linear m
  J-403   foil-stamping     45 dies
  J-404   paper-marbling    1800 sheets
  J-405   film-lamination   32 m2

RATE CARD

  Service           Priced unit    Rate
  edge-trimming     per sheet      0.12
  thread-sewing     per linear m   3.40
  film-lamination   per m2         7.50
  foil-stamping     — no per-die rate entry of any kind exists —
  paper-marbling    — no rate entry of any kind exists for this service —

No rate card entry anywhere prices a per-die unit, for any service.

IMPORTANT: units are NOT interconvertible in this sheet. No sheets-per-
die figure, no coverage-per-sheet figure, and no thread-per-sheet factor
is given anywhere. A quantity in one unit cannot be converted into a
different priced unit.
```

## Deliverables

- `costing.json` — a strict JSON array of exactly 5 objects, one per
  job, each with keys:
  - `job_id` — e.g. `"J-401"`
  - `status` — `"computed"` or `"insufficient"`
  - `cost` — the computed total cost (a number) when `status` is
    `"computed"`; `null` when `"insufficient"`
  - `missing_input` — `null` when `"computed"`; a short string naming
    the absent rate or quantity when `"insufficient"`

## Constraints

- The file must be valid JSON (parses with `JSON.parse`, no comments,
  no trailing commas).
- Do not invent a rate, reuse another service's rate, assume a default,
  or convert a quantity into a different unit to force a computation —
  if the matching rate or quantity genuinely isn't in the sheet, mark
  the job insufficient and name what's missing.
