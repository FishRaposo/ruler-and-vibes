---
id: data-08b-weighbridge-normalizer
category: data-analysis
title: Normalizing a legacy weighbridge export
deliverables:
  - normalize.js
  - normalize.json
---

## Task

A load-ticket export from an old truck-scale (weighbridge) terminal is a
mess: inconsistent whitespace, mixed weight formatting (thousands commas
and a tonne unit suffix), inconsistent commodity codes, a duplicated
row, a row missing its weight, and a row missing its ticket ID. Write a
normalizing script that turns it into a clean JSON array.

`tickets.csv` (embedded exactly as exported — whitespace is significant
and shown with quotes where it matters):

```csv
ticket_id,weighed_at,net_weight,commodity
"  4401 ","2025-03-11"," 18,450 t ","FE "
"4402","03/12/2025","9,730T"," fe"
"4403","2025-03-13","640 t","GRAVEL"
"4401","2025-03-11","18,450 t","FE"
"4404","2025-03-14","","FE"
"","2025-03-15","5,000 t","GRAVEL"
"4405","03/16/2025","27,300t","sand"
```

## Rules (apply exactly, in this order)

1. Trim leading/trailing whitespace from every field.
2. Strip thousands commas and a trailing tonne unit (`t` or `T`, with
   any spacing) from `net_weight` and parse it as a number.
3. Drop any row where `ticket_id` is empty after trimming, OR where
   `net_weight` is empty/unparseable after trimming and stripping.
4. Deduplicate by `ticket_id`, keeping the first occurrence
   (input-order, top to bottom) and discarding later rows with the
   same `ticket_id`.
5. Uppercase `commodity` after trimming, then map `FE` -> `FERROUS`.
6. Emit the surviving rows as a JSON array of `{ticket_id, net_weight,
   commodity}` objects, preserving first-seen input order. `weighed_at`
   is not part of the output.

## Deliverables

- `normalize.js`: a Node script, no external dependencies (Node
  built-ins or plain JS only), that reads the `tickets.csv` content
  above (embed it in the script or reproduce it verbatim as a literal —
  do not read an external file) and writes `normalize.json` implementing
  the rules exactly.
- `normalize.json`: the output of running `normalize.js`.

## Constraints

- Running `node normalize.js` in the deliverables directory must execute
  without error and (re)produce `normalize.json` from scratch.
- `normalize.js` must not `require()` or `import` any non-built-in
  module.
