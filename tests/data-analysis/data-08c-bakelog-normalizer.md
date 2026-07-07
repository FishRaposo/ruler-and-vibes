---
id: data-08c-bakelog-normalizer
category: data-analysis
title: Normalizing a grimy production bake log
deliverables:
  - clean.js
  - clean.json
---

## Task

A production bake log dumped from an aging oven controller is filthy:
inconsistent whitespace, weights written with a `g` unit and comma
separators, mixed oven labels, a duplicated row, a row missing its
weight, and a row missing its batch ID. Write a cleaning script that
turns it into a normalized JSON array.

`bakelog.csv` (embedded exactly as dumped — whitespace is significant
and shown with quotes where it matters):

```csv
batch_id,baked_at,weight_g,oven
"  B12 ","2025-03-02"," 1,450 g ","DECK "
"B13","03/03/2025","890 g"," north"
"B14","2025-03-04","305g","R2"
"B12","2025-03-02","1,450 g","DECK"
"B15","2025-03-05","","DECK"
"","2025-03-06","500 g","DECK"
"B16","03/07/2025","2,120g","hearth"
```

## Rules (apply exactly, in this order)

1. Trim leading/trailing whitespace from every field.
2. Strip the trailing `g` unit and any `,` from `weight_g` and parse it
   as a number.
3. Drop any row where `batch_id` is empty after trimming, OR where
   `weight_g` is empty/unparseable after trimming and stripping.
4. Deduplicate by `batch_id`, keeping the first occurrence
   (input-order, top to bottom) and discarding later rows with the
   same `batch_id`.
5. Uppercase `oven` after trimming, then map `NORTH` -> `N1` and
   `HEARTH` -> `HR`.
6. Emit the surviving rows as a JSON array of `{batch_id, weight_g,
   oven}` objects, preserving first-seen input order. `baked_at` is
   not part of the output.

## Deliverables

- `clean.js`: a Node script, no external dependencies (Node built-ins
  or plain JS only), that reads the `bakelog.csv` content above (embed
  it in the script or reproduce it verbatim as a literal — do not read
  an external file) and writes `clean.json` implementing the rules
  exactly.
- `clean.json`: the output of running `clean.js`.

## Constraints

- Running `node clean.js` in the deliverables directory must execute
  without error and (re)produce `clean.json` from scratch.
- `clean.js` must not `require()` or `import` any non-built-in module.
