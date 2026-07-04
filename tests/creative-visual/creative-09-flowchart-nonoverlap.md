---
id: creative-09-flowchart-nonoverlap
category: creative-visual
title: Layout-constrained flowchart with non-overlapping nodes
deliverables:
  - flowchart.svg
---

## Task

Hand-code `flowchart.svg` laying out a fictional 6-step **onboarding
pipeline** as a directed flowchart. The six steps, in order, are:

1. Sign Up
2. Verify Email
3. Set Password
4. Add Profile
5. Connect Team
6. First Task

## Node contract (exact)

- Canvas: `viewBox="0 0 800 600"`.
- Exactly six node boxes, each a `<rect>` with `id="node-1"` through
  `id="node-6"` (in the step order above), each with `width="160"` and
  `height="60"`, with its step label rendered as adjacent `<text>`.
- You choose each node's `x`/`y` position, subject to the layout
  constraints below.

## Layout constraints (exact, judge-checkable)

- **Margin:** every node rect lies fully inside the canvas with at
  least 20px of margin: `20 <= x`, `x + 160 <= 780`, `20 <= y`,
  `y + 60 <= 580`.
- **Non-overlap:** no two node rects may overlap — treat each as an
  axis-aligned bounding box and ensure every pair is disjoint.
- **Edges:** the five directed edges `node-1->node-2`, `node-2->node-3`,
  `node-3->node-4`, `node-4->node-5`, `node-5->node-6` must each be
  drawn as a `<line>` or `<path>`.
- **Arrowhead:** define an arrowhead `<marker>` in `<defs>` and
  reference it via `marker-end` on each of the five edge connectors.

## Deliverables

- `flowchart.svg` — a complete, self-contained SVG satisfying the node
  contract and every layout constraint above, with all six step labels
  present as text and a legible directed flow from step 1 to step 6.

## Constraints

- Single file, no `<script>`, `<image>`, `<foreignObject>`, or
  `@import`. Every `url(...)`/`href` target must begin with `#`. Must
  render from `file://`.
- Exactly six node rects (no extras), each exactly 160x60.
- Colors, connector routing style, and overall visual theme beyond the
  contract above are your choice.
