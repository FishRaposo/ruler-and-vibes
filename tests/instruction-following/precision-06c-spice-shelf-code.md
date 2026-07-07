---
id: precision-06c-spice-shelf-code
category: instruction-following
title: Shelf-code table from worked labels only
deliverables:
  - shelfcodes.tsv
---

## Task

A single deterministic rule maps each pantry item below to its shelf
code. The rule is NOT stated — induce it from the worked labels, then
apply the exact same rule to the four new items.

### Worked labels (item -> shelf code)

```
nutmeg -> utmegn6
sage -> ages4
walnut -> alnutw6
oat -> ato3
```

### New items to label

```
apricot
fig
custard
mint
```

## Deliverables

- `shelfcodes.tsv` — a two-column, tab-separated file with one data row
  per new item, in the order given above: `item<TAB>code`. An optional
  single header row `input	output` is allowed.

## Constraints

- Exactly 4 data rows, no more, no fewer.
- No commentary, explanation, or extra columns anywhere in the file.
- None of the four worked-label items (nutmeg, sage, walnut, oat) may
  appear as a data row.
- Apply the SAME rule used to produce all four worked labels — it is a
  single rule, not a per-item special case.
