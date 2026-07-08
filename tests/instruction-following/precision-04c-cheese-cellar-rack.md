---
id: precision-04c-cheese-cellar-rack
category: instruction-following
title: Cheese-cellar rack list with interacting conditional rules
deliverables:
  - manifest.txt
---

## Task

Build `manifest.txt` from the aging log below, following every rule
exactly. The rules interact — read all of them before writing anything.

Aging log (LOT, variety, score):

```
W-137 cheddar 66
W-052 gouda 0
W-284 gruyere 134
W-176 edam 91
W-093 brie 0
W-421 havarti 112
W-308 comte 82
W-045 colby 53
```

### Rules

1. Wheels with score 0 are spoiled and are omitted from the file
   entirely — they appear in NEITHER section below. This rule takes
   precedence over every other rule.
2. Of the remaining wheels, any with score below 60 go in the CURING
   section, one per line, formatted `LOT VARIETY SCORE` (space-separated).
   Curing wheels do NOT count toward TOTAL-WHEELS.
3. Remaining wheels (score >= 60, not spoiled) go in the RACK section,
   one per line, formatted exactly `LOT|VARIETY|SCORE|SEAL`
   (pipe-separated), where `SEAL` = (score multiplied by the number of
   letters in VARIETY), mod 89.
4. Conditional sort: compute TOTAL-WHEELS first (see below), then — IF
   TOTAL-WHEELS exceeds 520, sort the RACK section by score descending;
   OTHERWISE sort it alphabetically by variety.
5. File layout is fixed: the line `RACK:`, then the RACK-section lines,
   then the line `CURING:`, then the CURING-section lines, then a footer
   of exactly two lines in this order: `TOTAL-WHEELS: N` (N = the sum of
   score for RACK-section wheels only) and `LINE-COUNT: M` (M = the true
   total number of lines in `manifest.txt`, including both footer lines).
   No blank lines anywhere. The file ends with a single trailing newline.
6. No commentary, headers, or any other text anywhere in the file beyond
   what the rules above specify.

## Deliverables

- `manifest.txt` — produced under the rules above.

## Constraints

- Follow the rule order and precedence exactly as stated, including the
  spoiled-wheel exclusion and the conditional sort.
