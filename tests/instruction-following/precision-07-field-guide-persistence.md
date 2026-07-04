---
id: precision-07-field-guide-persistence
category: instruction-following
title: Twelve-entry field guide with a persistent per-entry contract
deliverables:
  - field-guide.txt
---

## Task

Build `field-guide.txt`: a trail-marker field guide covering all 12
markers in the table below. Every entry must follow the exact template
that follows the table, with NO exceptions — the contract is
unconditional across all 12 entries, even where a raw description
seems to lack an obvious hazard.

### Marker table (id, name, raw description, distance)

```
1, cinder hollow, steep scree slope with loose rock underfoot, two km
2, willow crossing, shaded footbridge over a shallow creek, one km
3, granite shelf, exposed flat rock ledge with wide views, four km
4, foxglove meadow, open field with tall wildflowers in summer, three km
5, slate chimney, narrow rock gap requiring a short scramble, two km
6, harrow bend, sharp switchback above a loose gravel bank, five km
7, elder thicket, dense low brush crowding a narrow path, one km
8, quarry rim, old quarry edge with an unfenced drop, three km
9, birch landing, flat clearing beside a small pond, two km
10, mossback rise, gentle grassy rise with soft footing, one km
11, pinehollow flat, level pine-needle path through young trees, two km
12, cedar gate, short stretch between two old cedar posts, one km
```

### Per-entry template (identical for all 12 entries)

Each entry is exactly 5 lines, in this fixed order, with no other
lines inside an entry:

```
MARKER n: NAME
Terrain: <one sentence>
Distance: <the table's distance value, restated verbatim>
Visibility: <one sentence>
Caution: <text starting with the literal token "Caution:" and ending with a period>
```

- `n` is the marker id; `NAME` is the marker name in FULL UPPERCASE.
- Write original, specific `Terrain:`, `Visibility:`, and `Caution:`
  text for every entry (do not copy the raw description verbatim into
  Terrain — expand on it).
- Entries are separated by exactly one blank line. No blank line
  appears anywhere else.

## Deliverables

- `field-guide.txt` — all 12 entries, in marker-id order 1 through 12,
  each following the template exactly.

## Constraints

- The four field labels (Terrain, Distance, Visibility, Caution) must
  appear exactly once each, in that exact order, in EVERY entry
  including the last three — the template is unconditional regardless
  of how mundane a marker's raw description looks.
- No entry may omit, merge, or reorder any of the four fields.
- No commentary, heading, or text exists in the file outside the 12
  templated entries and their blank-line separators.
