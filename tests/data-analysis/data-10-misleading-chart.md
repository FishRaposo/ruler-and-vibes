---
id: data-10-misleading-chart
category: data-analysis
title: Rebuilding a chart that lies
deliverables:
  - CRITIQUE.md
  - chart.svg
---

## Task

A colleague pulled quarterly revenue for the year and made a bar
chart to present to leadership.

`revenue.csv` (in $M):

```csv
quarter,revenue
Q1,100
Q2,102
Q3,101
Q4,105
```

Here is how the chart was built: the bars are drawn on a y-axis that
starts at 95 instead of 0 (so a value of 100 gets a bar of height
5, a value of 105 gets a bar of height 10, and so on — each bar's
height is `value - 95`). The chart was captioned "Q4 revenue nearly
DOUBLE Q1 — huge quarter!"

## Deliverables

- `CRITIQUE.md` (max 400 words) that:
  - Identifies exactly what makes the chart misleading (name the
    specific construction choice, not just "it's misleading").
  - States the true Q1-to-Q4 growth rate, with arithmetic.
  - Quantifies how much the chart's truncated axis exaggerates the
    visual impression relative to the true change — give a number
    for the exaggeration, with arithmetic (e.g. compare the bar-height
    ratio the truncated chart produces to the true value ratio).

- `chart.svg`: an honest rebuild of the same four data points as a
  bar chart, with bar heights proportional to the actual values from
  a zero baseline. To keep this mechanically checkable, you MUST
  build it this way:
  - Exactly four bars, one per quarter, each drawn as a single plain
    `<rect>` element with a numeric `height` attribute (a literal
    number, not a formula, transform, or path).
  - All four bars share the same baseline (i.e. they are drawn from
    a common y-coordinate, however you orient the axis).
  - Do not apply any `transform`, scaling, or `<path>` trickery to
    the bars — the `height` attribute values themselves must be
    directly proportional to 100, 102, 101, and 105.
  - The SVG must be self-contained (no external assets or fonts).

## Constraints

- `CRITIQUE.md` is at most 400 words (`wc -w` on the whole file).
- `chart.svg` must be valid, openable SVG with exactly four `<rect>`
  bars meeting the rules above.
