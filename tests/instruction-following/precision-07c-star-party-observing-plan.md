---
id: precision-07c-star-party-observing-plan
category: instruction-following
title: Twelve-target observing plan with a persistent per-target contract
deliverables:
  - observing-plan.txt
---

## Task

Build `observing-plan.txt`: a backyard star-party observing plan covering
all 12 targets in the table below. Every entry must follow the exact
template that follows the table, with NO exceptions — the contract is
unconditional across all 12 entries, even where a raw description seems
too plain to warrant a warning.

### Target table (id, name, raw description, altitude)

```
1, kestrel loop, a bright compact knot of stars low in the east, forty degrees
2, amberkite, a warm-toned double star split by a small scope, twenty degrees
3, hollow crown, a wide ring of faint stars near the zenith, seventy degrees
4, driftlow, a long sprawling star chain skimming the horizon, ten degrees
5, pale lantern, a soft round glow best seen with averted vision, fifty degrees
6, windvane cluster, a scattered open cluster with an arrowlike shape, thirty degrees
7, sable notch, a dark rift cutting across a pale star field, sixty degrees
8, thistle veil, a wispy nebular patch beside a naked-eye star, forty degrees
9, lowmarsh, a dim smudge just above the tree line, ten degrees
10, greywisp, a faint streak of haze, twenty degrees
11, faint span, a thin pale arc, fifty degrees
12, quiet ridge, a low even row of stars, thirty degrees
```

### Per-entry template (identical for all 12 entries)

Each entry is exactly 5 lines, in this fixed order, with no other
lines inside an entry:

```
TARGET n: NAME
Sky: <one sentence>
Altitude: <the table's altitude value, restated verbatim>
Optics: <one sentence>
Warning: <text starting with the literal token "Warning:" and ending with a period>
```

- `n` is the target id; `NAME` is the target name in FULL UPPERCASE.
- Write original, specific `Sky:`, `Optics:`, and `Warning:` text for
  every entry (do not copy the raw description verbatim into Sky —
  expand on it).
- Entries are separated by exactly one blank line. No blank line
  appears anywhere else.

## Deliverables

- `observing-plan.txt` — all 12 entries, in target-id order 1 through
  12, each following the template exactly.

## Constraints

- The four field labels (Sky, Altitude, Optics, Warning) must appear
  exactly once each, in that exact order, in EVERY entry including the
  last three — the template is unconditional regardless of how plain a
  target's raw description looks.
- No entry may omit, merge, or reorder any of the four fields.
- No commentary, heading, or text exists in the file outside the 12
  templated entries and their blank-line separators.
