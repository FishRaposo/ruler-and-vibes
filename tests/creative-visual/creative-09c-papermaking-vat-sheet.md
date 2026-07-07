---
id: creative-09c-papermaking-vat-sheet
category: creative-visual
title: Handmade-papermaking pipeline flowchart with non-overlapping stages
deliverables:
  - papermill.svg
---

## Task

Hand-code `papermill.svg` laying out a fictional 6-stage **hand
papermaking run** as a directed flowchart. The six stages, in order,
are:

1. Beat Pulp
2. Charge Vat
3. Pull Sheet
4. Couch Post
5. Press Stack
6. Dry Sheets

## Node contract (exact)

- Canvas: `viewBox="0 0 900 640"`.
- Exactly six stage boxes, each a `<rect>` with `id="stage-1"` through
  `id="stage-6"` (in the stage order above), each with `width="180"` and
  `height="70"`, with its stage label rendered as adjacent `<text>`.
- You choose each node's `x`/`y` position, subject to the layout
  constraints below.

## Layout constraints (exact, judge-checkable)

- **Margin:** every node rect lies fully inside the canvas with at
  least 24px of margin: `24 <= x`, `x + 180 <= 876`, `24 <= y`,
  `y + 70 <= 616`.
- **Non-overlap:** no two stage rects may overlap — treat each as an
  axis-aligned bounding box and ensure every pair is disjoint.
- **Edges:** the five directed edges `stage-1->stage-2`,
  `stage-2->stage-3`, `stage-3->stage-4`, `stage-4->stage-5`,
  `stage-5->stage-6` must each be drawn as a `<line>` or `<path>`.
- **Arrowhead:** define an arrowhead `<marker>` in `<defs>` and
  reference it via `marker-end` on each of the five edge connectors.

## Deliverables

- `papermill.svg` — a complete, self-contained SVG satisfying the node
  contract and every layout constraint above, with all six stage labels
  present as text and a legible directed flow from stage 1 to stage 6.

## Constraints

- Single file, no `<script>`, `<image>`, `<foreignObject>`, or
  `@import`. Every `url(...)`/`href` target must begin with `#`. Must
  render from `file://`.
- Exactly six stage rects (no extras), each exactly 180x70.
- Colors, connector routing style, and overall visual theme beyond the
  contract above are your choice.
