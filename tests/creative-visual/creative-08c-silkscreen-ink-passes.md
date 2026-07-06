---
id: creative-08c-silkscreen-ink-passes
category: creative-visual
title: Ink-pass reasoning from SVG source
deliverables:
  - answers.json
---

## Task

A printmaker records each silkscreen poster as a static SVG
(`viewBox="0 0 400 400"`): an unprinted paper base, then four opaque
ink passes pulled one after another, each pass fully covering whatever
sits beneath it where the two overlap. The four passes are listed here
in the exact order they were pulled (which is their document order):

```svg
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="400" height="400" fill="#ffffff"/>
  <rect id="P1" x="60" y="40" width="190" height="210" fill="teal"/>
  <rect id="P2" x="140" y="110" width="210" height="180" fill="gold"/>
  <rect id="P3" x="110" y="160" width="90" height="110" fill="purple"/>
  <rect id="P4" x="210" y="210" width="170" height="130" fill="crimson"/>
</svg>
```

None of the passes use `opacity`, `fill-opacity`, or a `transform`, and
there is no `z-index` in SVG — **later elements in document order paint
on top of earlier ones**. So the visible color at any point is whichever
pass covering that point appears **last** in the document (P1, P2, P3,
P4 in that order; P4 is last and therefore wins wherever it applies), or
the paper base if no pass covers the point.

Without rendering the file, work out — by checking, for each probe
point, which pass(es) cover it and which of those is last in document
order — the single visible top color at each of these eight probe
points:

- `(90,70)`
- `(30,30)`
- `(180,130)`
- `(310,150)`
- `(128,185)`
- `(250,250)`
- `(365,325)`
- `(215,285)`

## Deliverables

- `answers.json` — a JSON object mapping each of the eight probe-point
  keys above (as exact strings, e.g. `"(90,70)"`) to its visible top
  color, where each value is drawn **exactly** from this token set:
  `"teal"`, `"gold"`, `"purple"`, `"crimson"`, `"background"` (the
  unprinted paper base counts as `"background"`, not `"white"` or
  `"paper"`).

## Constraints

- Valid JSON, no extra keys, no explanatory prose inside the JSON file
  — one flat object with exactly the eight keys and one token value
  each.
