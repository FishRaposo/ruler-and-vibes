---
id: data-10b-podcast-download-axis
category: data-analysis
title: Rebuilding a download chart that lies
deliverables:
  - CRITIQUE.md
  - chart.svg
---

## Task

Priya Nadkarni pulled the monthly download totals for the podcast
*Understory* and made a bar chart to show the team.

`downloads.csv` (in thousands):

```csv
month,downloads
Jan,80
Feb,82
Mar,81
Apr,84
```

Here is how the chart was built: the bars are drawn on a y-axis that
starts at 76 instead of 0 (so a value of 80 gets a bar of height 4, a
value of 84 gets a bar of height 8, and so on — each bar's height is
`value - 76`). The chart was captioned "Apr downloads nearly DOUBLE
January — breakout month!"

## Deliverables

- `CRITIQUE.md` (max 400 words) that:
  - Identifies exactly what makes the chart misleading (name the
    specific construction choice, not just "it's misleading").
  - States the true Jan-to-Apr growth rate, with arithmetic.
  - Quantifies how much the chart's truncated axis exaggerates the
    visual impression relative to the true change — give a number
    for the exaggeration, with arithmetic (e.g. compare the bar-height
    ratio the truncated chart produces to the true value ratio).

- `chart.svg`: an honest rebuild of the same four data points as a
  bar chart, with bar heights proportional to the actual values from
  a zero baseline. To keep this mechanically checkable, you MUST
  build it this way:
  - Exactly four bars, one per month, each drawn as a single plain
    `<rect>` element with a numeric `height` attribute (a literal
    number, not a formula, transform, or path).
  - All four bars share the same baseline (i.e. they are drawn from
    a common y-coordinate, however you orient the axis).
  - Do not apply any `transform`, scaling, or `<path>` trickery to
    the bars — the `height` attribute values themselves must be
    directly proportional to 80, 82, 81, and 84.
  - The SVG must be self-contained (no external assets or fonts).

## Constraints

- `CRITIQUE.md` is at most 400 words (`wc -w` on the whole file).
- `chart.svg` must be valid, openable SVG with exactly four `<rect>`
  bars meeting the rules above.
