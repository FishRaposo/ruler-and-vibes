---
id: creative-08-svg-comprehension
category: creative-visual
title: Visible-paint reasoning from SVG source
deliverables:
  - answers.json
---

## Task

Below is a complete, static SVG (`viewBox="0 0 400 400"`) containing a
white background and four overlapping, fully opaque rectangles, listed
here in their exact document order:

```svg
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="400" height="400" fill="#ffffff"/>
  <rect id="R1" x="50" y="50" width="200" height="200" fill="red"/>
  <rect id="R2" x="150" y="100" width="200" height="200" fill="green"/>
  <rect id="R3" x="100" y="150" width="100" height="100" fill="blue"/>
  <rect id="R4" x="200" y="200" width="180" height="120" fill="orange"/>
</svg>
```

None of the rectangles use `opacity`, `fill-opacity`, or a `transform`,
and there is no `z-index` in SVG — **later elements in document order
paint on top of earlier ones**. So the visible color at any point is
whichever rectangle covering that point appears **last** in the
document (R1, R2, R3, R4 in that order; R4 is last and therefore always
wins where it applies), or the white background if no rectangle covers
the point.

Without rendering the file, work out — by checking, for each probe
point, which rectangle(s) cover it and which of those is last in
document order — the single visible top color at each of these eight
probe points:

- `(70,70)`
- `(40,40)`
- `(160,120)`
- `(300,120)`
- `(130,180)`
- `(250,250)`
- `(370,310)`
- `(210,270)`

## Deliverables

- `answers.json` — a JSON object mapping each of the eight probe-point
  keys above (as exact strings, e.g. `"(70,70)"`) to its visible top
  color, where each value is drawn **exactly** from this token set:
  `"red"`, `"green"`, `"blue"`, `"orange"`, `"background"` (the white
  base counts as `"background"`, not `"white"`).

## Constraints

- Valid JSON, no extra keys, no explanatory prose inside the JSON file
  — one flat object with exactly the eight keys and one token value
  each.
