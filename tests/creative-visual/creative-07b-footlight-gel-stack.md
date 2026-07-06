---
id: creative-07b-footlight-gel-stack
category: creative-visual
title: Footlight gel stack under a binding contract
deliverables:
  - footlight.svg
---

## Task

Hand-code `footlight.svg` depicting a fictional theatre **footlight bar**:
a vertical stack of exactly five overlapping rectangular stage-light gel
filters. Every geometric and color detail below is a binding contract you
must follow exactly.

**Geometry contract (exact):**

- Canvas: `viewBox="0 0 360 420"`.
- Five `<rect>` elements, `id="gel-1"` through `id="gel-5"`, each with
  `width="200"` and `height="90"`, all sharing the same left edge
  `x="80"`.
- Top-edge y-coordinates (`y`), in id order: gel-1=40, gel-2=100,
  gel-3=160, gel-4=220, gel-5=280. (Successive tops step down by 60,
  which is less than the height of 90, so every adjacent pair overlaps by
  30.)

**Color contract (exact, in id order):** gel-1 through gel-5 get this
ordered 5-step palette, one color per gel: `#ff5d73`, `#ffb14e`,
`#f9f871`, `#3fa7d6`, `#59386c`.

**Paint-order (z-order) contract:** lower-numbered gels must appear **in
front of** (on top of) higher-numbered ones — gel-1 occludes gel-2, gel-2
occludes gel-3, and so on down the stack. SVG paints elements in document
order (later elements in the file appear on top of earlier ones), so
achieving "gel-1 in front" requires writing the `<rect>` elements in
**reverse numeric order** in the file (gel-5 first, gel-1 last). There is
no other correct way to get this occlusion — opacity tricks, transforms,
or `<use>` do not satisfy the contract; the stacking must come from
genuine document order.

## Deliverables

- `footlight.svg` — a complete, self-contained SVG satisfying every part
  of the geometry, color, and paint-order contracts above. Backdrop,
  labels, and decoration beyond the five gels are your choice.

## Constraints

- Single file, no `<script>`, `<image>`, `<foreignObject>`, or `@import`.
  Every `url(...)`/`href` target must begin with `#`. Must render from
  `file://`.
- The five gel rects must be plain and opaque: no `opacity` or
  `fill-opacity` below 1, and no `transform` attribute on any gel or its
  ancestors. The occlusion must come from real document-order stacking,
  not a substitute mechanism.
- Exactly five `<rect>` elements total — the five gels and no others. Draw
  any backdrop or framing with non-`<rect>` elements (for example a
  `<path>`, `<polygon>`, or the SVG background); do not add a sixth
  `<rect>`.
