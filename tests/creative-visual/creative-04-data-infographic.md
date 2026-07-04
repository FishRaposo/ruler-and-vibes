---
id: creative-04-data-infographic
category: creative-visual
title: Hand-Coded SVG Data Infographic (Deep-Sea Expedition Report)
deliverables:
  - infographic.svg
---

## Task

Hand-code a single static SVG infographic presenting the following
fictional end-of-season report from the **Meridian Trench
Expedition**. The piece must be visually polished AND geometrically
exact — every angle and bar height must be computed, not eyeballed.

**Dataset A — dive-time allocation** (480 minutes total, present as a
donut chart with a percentage label on each segment):

| Activity | Minutes | Percent |
|---|---|---|
| Survey | 264 | 55% |
| Sampling | 96 | 20% |
| Transit | 48 | 10% |
| Photography | 48 | 10% |
| Safety stops | 24 | 5% |

**Dataset B — dives per month** (present as a bar chart):

| Month | Dives |
|---|---|
| M1 | 14 |
| M2 | 22 |
| M3 | 35 |
| M4 | 28 |
| M5 | 18 |
| M6 | 9 |

## Geometry contract (required, so your work can be verified)

- Canvas: `viewBox="0 0 800 1000"`.
- Donut: centered at **(400, 340)**, outer radius **170**, inner
  radius **105**. Segments start at 12 o'clock and proceed **clockwise**
  in the table order above (Survey first, Safety stops last).
- Each donut segment is a single `<path>` with `id="seg-1"` through
  `id="seg-5"` (in table order), built from **absolute `A` (arc)
  commands**, with **no `transform` attribute** on the path or any
  ancestor element.
- Each bar is a single `<rect>` with `id="bar-1"` through `id="bar-6"`
  (in table order M1..M6), with **no `transform` attribute** on the
  rect or any ancestor. Bar height must be linearly proportional to
  its dive count.

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
- All five percentage labels (55%, 20%, 10%, 10%, 5%) and all five
  category names must appear as text content.
- Must render correctly in a standard browser when opened as a file.

Note: `REASONING.md` is also required per the standard run protocol,
at most 250 words, and must state the five computed segment angles.
