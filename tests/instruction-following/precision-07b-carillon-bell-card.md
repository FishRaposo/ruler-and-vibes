---
id: precision-07b-carillon-bell-card
category: instruction-following
title: Twelve-bell carillon card with a persistent per-bell contract
deliverables:
  - bell-card.txt
---

## Task

Build `bell-card.txt`: a carillonneur's reference card covering all 12
bells in the table below. Every entry must follow the exact template
that follows the table, with NO exceptions — the contract is
unconditional across all 12 entries, even where a raw description
seems to name a bell too small or plain to matter.

### Bell table (id, name, raw description, weight)

```
1, great bourdon, massive bass bell cast in dark bronze, nine hundred kg
2, dawn tenor, deep-voiced bell rung to open each recital, six hundred kg
3, abbey second, broad-shouldered bell with a long sustain, four hundred kg
4, harvest third, warm mid-range bell used in slow hymns, three hundred kg
5, market bell, bright bell that once marked the noon hour, two hundred kg
6, vesper alto, resonant bell favoured for evening peals, one hundred kg
7, chapel treble, clear treble bell above the choir loft, seventy kg
8, garland bell, small ornamented bell in the upper frame, fifty kg
9, swift treble, quick-speaking bell for rapid passages, forty kg
10, lark bell, light high bell near the louvres, thirty kg
11, wren bell, the smallest treble in the tower, twenty kg
12, sparrow bell, a plain top-octave bell, fifteen kg
```

### Per-entry template (identical for all 12 entries)

Each entry is exactly 5 lines, in this fixed order, with no other
lines inside an entry:

```
BELL n: NAME
Tone: <one sentence>
Weight: <the table's weight value, restated verbatim>
Timbre: <one sentence>
Warning: <text starting with the literal token "Warning:" and ending with a period>
```

- `n` is the bell id; `NAME` is the bell name in FULL UPPERCASE.
- Write original, specific `Tone:`, `Timbre:`, and `Warning:` text
  for every entry (do not copy the raw description verbatim into
  Tone — expand on it).
- Entries are separated by exactly one blank line. No blank line
  appears anywhere else.

## Deliverables

- `bell-card.txt` — all 12 entries, in bell-id order 1 through 12,
  each following the template exactly.

## Constraints

- The four field labels (Tone, Weight, Timbre, Warning) must appear
  exactly once each, in that exact order, in EVERY entry including the
  last three — the template is unconditional regardless of how minor a
  bell's raw description looks.
- No entry may omit, merge, or reorder any of the four fields.
- No commentary, heading, or text exists in the file outside the 12
  templated entries and their blank-line separators.
