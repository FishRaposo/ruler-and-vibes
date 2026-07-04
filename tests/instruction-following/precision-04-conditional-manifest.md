---
id: precision-04-conditional-manifest
category: instruction-following
title: Warehouse manifest with interacting conditional rules
deliverables:
  - manifest.txt
---

## Task

Build `manifest.txt` from the parts inventory below, following every rule
exactly. The rules interact — read all of them before writing anything.

Inventory (SKU, name, qty):

```
K-104 anvil 62
K-088 bellows 0
K-311 crucible 143
K-207 dowel 89
K-155 easel 0
K-402 flask 118
K-260 gimbal 75
K-019 hasp 57
```

### Rules

1. Items with qty 0 are discontinued and are omitted from the file
   entirely — they appear in NEITHER section below. This rule takes
   precedence over every other rule.
2. Of the remaining items, any with qty below 60 go in the BACKORDER
   section, one per line, formatted `SKU NAME QTY` (space-separated).
   Backorder items do NOT count toward TOTAL-UNITS.
3. Remaining items (qty >= 60, not discontinued) go in the MAIN section,
   one per line, formatted exactly `SKU|NAME|QTY|CHECK` (pipe-separated),
   where `CHECK` = (qty multiplied by the number of letters in NAME),
   mod 97.
4. Conditional sort: compute TOTAL-UNITS first (see below), then — IF
   TOTAL-UNITS exceeds 500, sort the MAIN section by qty descending;
   OTHERWISE sort it alphabetically by name.
5. File layout is fixed: the line `MAIN:`, then the MAIN-section lines,
   then the line `BACKORDER:`, then the BACKORDER-section lines, then a
   footer of exactly two lines in this order: `TOTAL-UNITS: N` (N = the
   sum of qty for MAIN-section items only) and `LINE-COUNT: M` (M = the
   true total number of lines in `manifest.txt`, including both footer
   lines). No blank lines anywhere. The file ends with a single trailing
   newline.
6. No commentary, headers, or any other text anywhere in the file beyond
   what the rules above specify.

## Deliverables

- `manifest.txt` — produced under the rules above.

## Constraints

- Follow the rule order and precedence exactly as stated, including the
  discontinued-item exclusion and the conditional sort.
