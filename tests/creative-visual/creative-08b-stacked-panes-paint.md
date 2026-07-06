---
id: creative-08b-stacked-panes-paint
category: creative-visual
title: Stacked-pane paint reasoning from SVG source
deliverables:
  - answers.json
---

## Task

Below is a complete, static SVG (`viewBox="0 0 360 360"`) containing a
white background and four overlapping, fully opaque rectangles (think of
them as tinted glass panes laid down one after another), listed here in
their exact document order:

```svg
<svg viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="360" height="360" fill="#ffffff"/>
  <rect id="S1" x="40" y="60" width="180" height="160" fill="crimson"/>
  <rect id="S2" x="130" y="40" width="170" height="190" fill="teal"/>
  <rect id="S3" x="90" y="120" width="90" height="90" fill="gold"/>
  <rect id="S4" x="190" y="180" width="150" height="130" fill="violet"/>
</svg>
```

None of the rectangles use `opacity`, `fill-opacity`, or a `transform`,
and there is no `z-index` in SVG — **later elements in document order
paint on top of earlier ones**. So the visible color at any point is
whichever rectangle covering that point appears **last** in the
document (S1, S2, S3, S4 in that order; S4 is last and therefore always
wins where it applies), or the white background if no rectangle covers
the point.

Without rendering the file, work out — by checking, for each probe
point, which rectangle(s) cover it and which of those is last in
document order — the single visible top color at each of these eight
probe points:

- `(70,90)`
- `(30,30)`
- `(160,80)`
- `(280,90)`
- `(110,190)`
- `(220,220)`
- `(320,280)`
- `(210,200)`

## Deliverables

- `answers.json` — a JSON object mapping each of the eight probe-point
  keys above (as exact strings, e.g. `"(70,90)"`) to its visible top
  color, where each value is drawn **exactly** from this token set:
  `"crimson"`, `"teal"`, `"gold"`, `"violet"`, `"background"` (the white
  base counts as `"background"`, not `"white"`).

## Constraints

- Valid JSON, no extra keys, no explanatory prose inside the JSON file
  — one flat object with exactly the eight keys and one token value
  each.
