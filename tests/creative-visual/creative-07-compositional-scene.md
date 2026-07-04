---
id: creative-07-compositional-scene
category: creative-visual
title: Compositional scene under a binding contract
deliverables:
  - scene.svg
---

## Task

Hand-code `scene.svg` depicting a fictional **signal relay**: a
horizontal chain of exactly six overlapping discs. Every geometric and
color detail below is a binding contract you must follow exactly.

**Geometry contract (exact):**

- Canvas: `viewBox="0 0 480 360"`.
- Six `<circle>` elements, `id="disc-1"` through `id="disc-6"`, each
  with `r="40"`, all centered on the line `cy="180"`.
- Center x-coordinates (`cx`), in id order: disc-1=80, disc-2=140,
  disc-3=200, disc-4=260, disc-5=320, disc-6=380. (Center spacing is
  60, which is less than the diameter of 80, so every adjacent pair
  overlaps.)

**Color contract (exact, in id order):** disc-1 through disc-6 get
this ordered 6-step palette, one color per disc: `#e63946`, `#f4a261`,
`#e9c46a`, `#2a9d8f`, `#264653`, `#457b9d`.

**Paint-order (z-order) contract:** lower-numbered discs must appear
**on top of** higher-numbered ones — disc-1 occludes disc-2, disc-2
occludes disc-3, and so on down the chain. SVG paints elements in
document order (later elements in the file appear on top of earlier
ones), so achieving "disc-1 on top" requires writing the `<circle>`
elements in **reverse numeric order** in the file (disc-6 first,
disc-1 last). There is no other correct way to get this occlusion —
opacity tricks, transforms, or `<use>` do not satisfy the contract; the
stacking must come from genuine document order.

## Deliverables

- `scene.svg` — a complete, self-contained SVG satisfying every part of
  the geometry, color, and paint-order contracts above. Background,
  labels, and decoration beyond the six discs are your choice.

## Constraints

- Single file, no `<script>`, `<image>`, `<foreignObject>`, or
  `@import`. Every `url(...)`/`href` target must begin with `#`. Must
  render from `file://`.
- The six disc circles must be plain and opaque: no `opacity` or
  `fill-opacity` below 1, and no `transform` attribute on any disc or
  its ancestors. The occlusion must come from real document-order
  stacking, not a substitute mechanism.
- Exactly six `<circle>` elements total — no extra circles.
