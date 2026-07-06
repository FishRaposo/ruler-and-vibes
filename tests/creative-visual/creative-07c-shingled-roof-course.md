---
id: creative-07c-shingled-roof-course
category: creative-visual
title: Shingled roof course under a binding contract
deliverables:
  - roof.svg
---

## Task

Hand-code `roof.svg` depicting a fictional **roof course study**: a
vertical stack of exactly five overlapping shingle tiles. Every
geometric and color detail below is a binding contract you must follow
exactly.

**Geometry contract (exact):**

- Canvas: `viewBox="0 0 360 480"`.
- Five `<rect>` elements, `id="course-1"` through `id="course-5"`, each
  with `width="240"`, `height="90"`, `rx="14"`, all with `x="60"`.
- Top-edge y-coordinates (`y`), in id order: course-1=40, course-2=120,
  course-3=200, course-4=280, course-5=360. (Vertical spacing is 80,
  which is less than the tile height of 90, so every adjacent pair
  overlaps by 10.)

**Color contract (exact, in id order):** course-1 through course-5 get
this ordered 5-step palette, one color per tile: `#5b8c5a`, `#c17767`,
`#e2b04a`, `#3d5a6c`, `#8a5a83`.

**Paint-order (z-order) contract:** lower-numbered courses must appear
**on top of** higher-numbered ones — course-1 laps over course-2,
course-2 laps over course-3, and so on down the stack. SVG paints
elements in document order (later elements in the file appear on top of
earlier ones), so achieving "course-1 on top" requires writing the
`<rect>` elements in **reverse numeric order** in the file (course-5
first, course-1 last). There is no other correct way to get this
occlusion — opacity tricks, transforms, or `<use>` do not satisfy the
contract; the stacking must come from genuine document order.

## Deliverables

- `roof.svg` — a complete, self-contained SVG satisfying every part of
  the geometry, color, and paint-order contracts above. Background,
  labels, and decoration beyond the five shingle tiles are your choice.

## Constraints

- Single file, no `<script>`, `<image>`, `<foreignObject>`, or
  `@import`. Every `url(...)`/`href` target must begin with `#`. Must
  render from `file://`.
- The five shingle tiles must be plain and opaque: no `opacity` or
  `fill-opacity` below 1, and no `transform` attribute on any tile or
  its ancestors. The occlusion must come from real document-order
  stacking, not a substitute mechanism.
- Exactly five `<rect>` elements total — no extra rectangles. Draw any
  background or decoration with non-`<rect>` shapes.
