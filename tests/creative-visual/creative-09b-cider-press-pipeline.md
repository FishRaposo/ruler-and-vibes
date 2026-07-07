---
id: creative-09b-cider-press-pipeline
category: creative-visual
title: Layout-constrained cider-press pipeline with non-overlapping stages
deliverables:
  - cidermap.svg
---

## Task

Hand-code `cidermap.svg` laying out a fictional 7-stage **cider-press
pipeline** as a directed flowchart. The seven stages, in order, are:

1. Wash Fruit
2. Mill Pulp
3. Press Juice
4. Pitch Yeast
5. Ferment Vat
6. Rack Clear
7. Bottle Batch

## Node contract (exact)

- Canvas: `viewBox="0 0 900 520"`.
- Exactly seven stage boxes, each a `<rect>` with `id="stage-1"` through
  `id="stage-7"` (in the stage order above), each with `width="140"` and
  `height="70"`, with its stage label rendered as adjacent `<text>`.
- You choose each stage's `x`/`y` position, subject to the layout
  constraints below.

## Layout constraints (exact, judge-checkable)

- **Margin:** every stage rect lies fully inside the canvas with at
  least 24px of margin: `24 <= x`, `x + 140 <= 876`, `24 <= y`,
  `y + 70 <= 496`.
- **Non-overlap:** no two stage rects may overlap — treat each as an
  axis-aligned bounding box and ensure every pair is disjoint.
- **Edges:** the six directed edges `stage-1->stage-2`,
  `stage-2->stage-3`, `stage-3->stage-4`, `stage-4->stage-5`,
  `stage-5->stage-6`, `stage-6->stage-7` must each be drawn as a
  `<line>` or `<path>`.
- **Arrowhead:** define an arrowhead `<marker>` in `<defs>` and
  reference it via `marker-end` on each of the six edge connectors.

## Deliverables

- `cidermap.svg` — a complete, self-contained SVG satisfying the node
  contract and every layout constraint above, with all seven stage
  labels present as text and a legible directed flow from stage 1 to
  stage 7.

## Constraints

- Single file, no `<script>`, `<image>`, `<foreignObject>`, or
  `@import`. Every `url(...)`/`href` target must begin with `#`. Must
  render from `file://`.
- Exactly seven stage rects (no extras), each exactly 140x70.
- Colors, connector routing style, and overall visual theme beyond the
  contract above are your choice.
