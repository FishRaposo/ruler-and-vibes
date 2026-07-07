---
id: extr-03b-lab-sample-intake
category: structured-extraction
title: Messy lab sample intake log to typed record array
deliverables:
  - samples.json
---

## Task

Parse the lab sample intake log below into a JSON array matching the
schema EXACTLY. The log is a raw plain-text dump from a genomics lab's
intake terminal; formatting is inconsistent line to line, and one line
is a stray reprint that should not become a second record.

Intake log (as printed):

```
SAMPLE BIO-201 | mass: 3.2 g | bay: BAY-12 | note: soil core sample, routine agronomy batch
--
bio-202; mass 650 mg; bay: ; note: calibration bead vial, factory sealed standard
--
BIO-203 -- 1.4g -- BAY-9 -- note: infectious agent culture, BSL-2 handling required
--
BIO-204 | 9 G | BAY-3 | note: replacement pipette tips, restock order
--
BIO-201 | mass: 3.2 g | bay: BAY-12 | note: soil core sample, routine agronomy batch    (dup scan - disregard, same sample rescanned)
```

## Schema

A JSON array. Each element is an object with EXACTLY these keys:

- `sample_id` — string, e.g. `"BIO-201"`.
- `mass_g` — number, always in grams (convert milligrams to grams
  where needed).
- `storage_bay` — string, or `null` if the source line left the bay
  blank. Never invent a bay.
- `biohazard` — boolean (`true`/`false`, never a string, never
  omitted): `true` only if the sample's note mentions a
  biohazard-indicating keyword (e.g. an infectious-agent reference),
  `false` otherwise.

## Deliverables

- `samples.json` — the array described above.

## Constraints

- `samples.json` must parse with `JSON.parse`. No trailing commas,
  no comments, no extra keys.
- The reprinted/duplicate scan line refers to the same sample as an
  earlier line and must NOT produce a second record — each sample id
  appears exactly once in the output.
- Preserving first-appearance order is a nice-to-have, not a
  requirement.
