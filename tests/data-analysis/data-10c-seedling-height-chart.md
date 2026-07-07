---
id: data-10c-seedling-height-chart
category: data-analysis
title: Rebuilding a seedling-growth chart that lies
deliverables:
  - CRITIQUE.md
  - chart.svg
---

## Task

A volunteer at the Elderfield Community Garden logged the average
height of the tomato seedlings on the propagation bench at the end of
each of the first four weeks, then made a bar chart for the garden
newsletter.

`heights.csv` (average seedling height in cm):

```csv
week,height_cm
Week 1,50
Week 2,52
Week 3,51
Week 4,53
```

Here is how the chart was built: the bars are drawn on a y-axis that
starts at 47 instead of 0 (so a value of 50 gets a bar of height 3, a
value of 53 gets a bar of height 6, and so on — each bar's height is
`value - 47`). The chart was captioned "Week 4 seedlings nearly TWICE
as tall as Week 1 — incredible growth!"

## Deliverables

- `CRITIQUE.md` (max 400 words) that:
  - Identifies exactly what makes the chart misleading (name the
    specific construction choice, not just "it's misleading").
  - States the true Week 1 to Week 4 growth rate, with arithmetic.
  - Quantifies how much the chart's truncated axis exaggerates the
    visual impression relative to the true change — give a number for
    the exaggeration, with arithmetic (e.g. compare the bar-height
    ratio the truncated chart produces to the true value ratio).

- `chart.svg`: an honest rebuild of the same four data points as a bar
  chart, with bar heights proportional to the actual values from a zero
  baseline. To keep this mechanically checkable, you MUST build it this
  way:
  - Exactly four bars, one per week, each drawn as a single plain
    `<rect>` element with a numeric `height` attribute (a literal
    number, not a formula, transform, or path).
  - All four bars share the same baseline (i.e. they are drawn from a
    common y-coordinate, however you orient the axis).
  - Do not apply any `transform`, scaling, or `<path>` trickery to the
    bars — the `height` attribute values themselves must be directly
    proportional to 50, 52, 51, and 53.
  - The SVG must be self-contained (no external assets or fonts).

## Constraints

- `CRITIQUE.md` is at most 400 words (`wc -w` on the whole file).
- `chart.svg` must be valid, openable SVG with exactly four `<rect>`
  bars meeting the rules above.
