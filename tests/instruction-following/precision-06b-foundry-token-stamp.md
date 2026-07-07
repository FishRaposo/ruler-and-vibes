---
id: precision-06b-foundry-token-stamp
category: instruction-following
title: Part-token table from worked stamps only
deliverables:
  - tokens.tsv
---

## Task

A single deterministic rule maps each part name below to its stamped
token. The rule is NOT stated — induce it from the worked stamps, then
apply the exact same rule to the four new part names.

### Worked stamps (part -> token)

```
flange -> 6langef
strut -> 5truts
washer -> 6asherw
lug -> 3ugl
```

### New parts to stamp

```
grommet
rod
clevis
valve
```

## Deliverables

- `tokens.tsv` — a two-column, tab-separated file with one data row per
  new part, in the order given above: `part<TAB>token`. An optional
  single header row `part	token` is allowed.

## Constraints

- Exactly 4 data rows, no more, no fewer.
- No commentary, explanation, or extra columns anywhere in the file.
- None of the four worked-stamp parts (flange, strut, washer, lug) may
  appear as a data row.
- Apply the SAME rule used to produce all four worked stamps — it is a
  single rule, not a per-part special case.
