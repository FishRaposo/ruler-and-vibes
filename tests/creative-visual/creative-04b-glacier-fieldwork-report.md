---
id: creative-04b-glacier-fieldwork-report
category: creative-visual
title: Hand-Coded SVG Data Infographic (Glacier Field-Station Season Report)
deliverables:
  - infographic.svg
---

## Task

Hand-code a single static SVG infographic presenting the following
fictional end-of-season report from the **Halwitz Glacier Field
Station**. The piece must be visually polished AND geometrically
exact — every angle and bar height must be computed, not eyeballed.

**Dataset A — field-time allocation** (620 field-hours total, present
as a donut chart with a percentage label on each segment):

| Activity | Hours | Percent |
|---|---|---|
| Drilling | 372 | 60% |
| Core logging | 124 | 20% |
| Radar survey | 62 | 10% |
| Weather standby | 31 | 5% |
| Camp logistics | 31 | 5% |

**Dataset B — ice-core meters recovered per field week** (present as a
bar chart):

| Field week | Meters |
|---|---|
| W1 | 15 |
| W2 | 27 |
| W3 | 45 |
| W4 | 33 |
| W5 | 21 |
| W6 | 12 |

## Geometry contract (required, so your work can be verified)

- Canvas: `viewBox="0 0 800 1000"`.
- Donut: centered at **(400, 360)**, outer radius **180**, inner
  radius **110**. Segments start at 12 o'clock and proceed
  **clockwise** in the table order above (Drilling first, Camp
  logistics last).
- Each donut segment is a single `<path>` with `id="seg-1"` through
  `id="seg-5"` (in table order), built from **absolute `A` (arc)
  commands**, with **no `transform` attribute** on the path or any
  ancestor element.
- Each bar is a single `<rect>` with `id="bar-1"` through `id="bar-6"`
  (in table order W1..W6), with **no `transform` attribute** on the
  rect or any ancestor. Bar height must be linearly proportional to
  its meter count.

## Deliverables

- `infographic.svg` — a complete, self-contained SVG file including a
  title, a legend, the donut chart with percentage labels on all five
  segments, the bar chart, and a fictional source caption. Layout,
  palette, and typography beyond the geometry contract above are your
  choice.

## Constraints

- Single file, no `<script>`, no `<image>`, no `<foreignObject>`, no
  `@import`. Every `href`/`xlink:href` and every `url(...)` target must
  begin with `#` (internal references only, e.g. gradient or filter
  defs) — no external resources of any kind.
- All five percentage labels (60%, 20%, 10%, 5%, 5%) and all five
  category names must appear as text content.
- Must render correctly in a standard browser when opened as a file.

Note: `REASONING.md` is also required per the standard run protocol,
at most 250 words, and must state the five computed segment angles.
