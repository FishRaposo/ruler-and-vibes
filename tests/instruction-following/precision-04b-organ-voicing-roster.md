---
id: precision-04b-organ-voicing-roster
category: instruction-following
title: Pipe-organ voicing sheet with interacting conditional rules
deliverables:
  - voicing.txt
---

## Task

Build `voicing.txt` from the rank inventory below, following every rule
exactly. The rules interact — read all of them before writing anything.

Inventory (rank code, stop name, pipe count):

```
R-231 bourdon 121
R-118 celeste 0
R-905 dulciana 78
R-347 gamba 55
R-472 krummhorn 0
R-560 nazard 37
R-083 octave 102
R-629 salicional 190
R-214 viola 29
```

### Rules

1. Ranks with a pipe count of 0 have been decommissioned and are omitted
   from the file entirely — they appear in NEITHER section below. This
   rule takes precedence over every other rule.
2. Of the remaining ranks, any with a pipe count below 40 go in the
   REPAIR section, in the same order as the inventory above, one per
   line, formatted `CODE NAME COUNT` (space-separated). REPAIR ranks do
   NOT count toward TOTAL-PIPES.
3. Remaining ranks (count >= 40, not decommissioned) go in the VOICED
   section, one per line, formatted exactly `CODE|NAME|COUNT|CHECK`
   (pipe-separated), where `CHECK` = (count multiplied by the number of
   letters in NAME), mod 89.
4. Conditional sort: compute TOTAL-PIPES first (see below), then — IF
   TOTAL-PIPES exceeds 600, sort the VOICED section by count descending;
   OTHERWISE sort it alphabetically by name.
5. File layout is fixed: the line `VOICED:`, then the VOICED-section
   lines, then the line `REPAIR:`, then the REPAIR-section lines, then a
   footer of exactly two lines in this order: `TOTAL-PIPES: N` (N = the
   sum of count for VOICED-section ranks only) and `LINE-COUNT: M` (M =
   the true total number of lines in `voicing.txt`, including both footer
   lines). No blank lines anywhere. The file ends with a single trailing
   newline.
6. No commentary, headers, or any other text anywhere in the file beyond
   what the rules above specify.

## Deliverables

- `voicing.txt` — produced under the rules above.

## Constraints

- Follow the rule order and precedence exactly as stated, including the
  decommissioned-rank exclusion and the conditional sort.
