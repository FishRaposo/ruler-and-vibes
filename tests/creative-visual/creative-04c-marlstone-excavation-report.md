---
id: creative-04c-marlstone-excavation-report
category: creative-visual
title: Hand-Coded SVG Data Infographic (Marlstone Hollow Excavation Report)
deliverables:
  - infographic.svg
---

## Task

Hand-code a single static SVG infographic presenting the following
fictional end-of-season report from the **Marlstone Hollow
Excavation**. The piece must be visually polished AND geometrically
exact — every angle and bar height must be computed, not eyeballed.

**Dataset A — crew-hour allocation** (700 crew-hours total, present as
a donut chart with a percentage label on each segment):

| Activity | Hours | Percent |
|---|---|---|
| Excavation | 434 | 62% |
| Find cataloguing | 105 | 15% |
| Photogrammetry | 84 | 12% |
| Conservation | 49 | 7% |
| Backfilling | 28 | 4% |

**Dataset B — catalogued finds per trench** (present as a bar chart):

| Trench | Finds |
|---|---|
| T1 | 11 |
| T2 | 26 |
| T3 | 44 |
| T4 | 33 |
| T5 | 22 |
| T6 | 7 |

## Geometry contract (required, so your work can be verified)

- Canvas: `viewBox="0 0 700 960"`.
- Donut: centered at **(380, 320)**, outer radius **160**, inner
  radius **96**. Segments start at 12 o'clock and proceed **clockwise**
  in the table order above (Excavation first, Backfilling last).
- Each donut segment is a single `<path>` with `id="seg-1"` through
  `id="seg-5"` (in table order), built from **absolute `A` (arc)
  commands**, with **no `transform` attribute** on the path or any
  ancestor element.
- Each bar is a single `<rect>` with `id="bar-1"` through `id="bar-6"`
  (in table order T1..T6), with **no `transform` attribute** on the
  rect or any ancestor. Bar height must be linearly proportional to
  its find count.

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
- All five percentage labels (62%, 15%, 12%, 7%, 4%) and all five
  category names must appear as text content.
- Must render correctly in a standard browser when opened as a file.

Note: `REASONING.md` is also required per the standard run protocol,
at most 250 words, and must state the five computed segment angles.
