---
id: data-08-export-cleaner
category: data-analysis
title: Cleaning a filthy order export
deliverables:
  - clean.js
  - clean.json
---

## Task

An order export from a legacy system is a mess: inconsistent
whitespace, mixed currency formatting, inconsistent country codes, a
duplicated row, a row missing its amount, and a row missing its order
ID. Write a cleaning script that turns it into a normalized JSON
array.

`orders.csv` (embedded exactly as exported — whitespace is
significant and shown with quotes where it matters):

```csv
order_id,date,amount,country
"  1001 ","2024-01-05"," $1,200.50 ","US "
"1002","01/06/2024","980.00"," usa"
"1003","2024-01-07","$75.00","CA"
"1001","2024-01-05","$1,200.50","US"
"1004","2024-01-08","","US"
"","2024-01-09","$50.00","US"
"1005","01/10/2024","2,000.00","gb"
```

## Rules (apply exactly, in this order)

1. Trim leading/trailing whitespace from every field.
2. Strip `$` and `,` from `amount` and parse it as a number.
3. Drop any row where `order_id` is empty after trimming, OR where
   `amount` is empty/unparseable after trimming and stripping.
4. Deduplicate by `order_id`, keeping the first occurrence
   (input-order, top to bottom) and discarding later rows with the
   same `order_id`.
5. Uppercase `country` after trimming, then map `USA` -> `US`.
6. Emit the surviving rows as a JSON array of `{order_id, amount,
country}` objects, preserving first-seen input order. `date` is not
   part of the output.

## Deliverables

- `clean.js`: a Node script, no external dependencies (Node built-ins
  or plain JS only), that reads the `orders.csv` content above
  (embed it in the script or reproduce it verbatim as a literal — do
  not read an external file) and writes `clean.json` implementing the
  rules exactly.
- `clean.json`: the output of running `clean.js`.

## Constraints

- Running `node clean.js` in the deliverables directory must execute
  without error and (re)produce `clean.json` from scratch.
- `clean.js` must not `require()` or `import` any non-built-in module.
