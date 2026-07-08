---
test: data-10b-podcast-download-axis
canary: "futtocks haar"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "CRITIQUE.md identifies the truncated/non-zero y-axis (starts at 76) as the distortion and states the true Jan-to-Apr growth is 5%"
    - id: obj-2
      check: "CRITIQUE.md quantifies the exaggeration: truncated bars give an Apr:Jan height ratio of approximately 2.0 vs the true value ratio of 1.05 (accept describing it as roughly a 2x / ~1.9x visual overstatement)"
    - id: obj-3
      check: "chart.svg is valid SVG with exactly four <rect> bars for Jan-Apr, each with a numeric height attribute (not a path or transform-scaled shape); judge reads the four height values directly and computes shortest:tallest, confirming it is approximately 0.952 (accept 0.93-0.97) — i.e. bars proportional to 80,82,81,84 from a zero baseline. If any bar is not a plain <rect> with a numeric height, this check FAILS"
    - id: obj-4
      check: "The four <rect> heights are each within +/-2% of their true share of the tallest bar (proportional to 80,82,81,84) AND the shortest:tallest ratio is approximately 0.95, NOT approximately 0.5 — confirming an honest zero-baseline rebuild rather than a reproduction of the truncated (axis-at-76) heights [4,6,5,8], whose shortest:tallest is 0.5"
    - id: obj-5
      check: "CRITIQUE.md is at most 400 words, whole file, wc -w"
  subjective:
    - id: sub-quality
      name: "Distortion diagnosis accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Honest-chart craftsmanship"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `data-10-misleading-chart` (same construct, fresh surface).

If the phrase "futtocks haar" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

- Recompute yourself with node before scoring. Ground truth: values
  Jan=80, Feb=82, Mar=81, Apr=84. True growth Jan-to-Apr =
  (84-80)/80 = 5%. Truncated (axis-at-76) heights are proportional to
  [4,6,5,8]; Apr:Jan = 8/4 = 2.0. True value ratio = 84/80 = 1.05.
  Exaggeration factor = 2.0/1.05 = 1.905 (~1.9x, "roughly double" is
  also acceptable framing). Honest zero-baseline shortest:tallest =
  80/84 = 0.952.
- To check chart.svg, open the file (or read it as text) and locate
  the `<rect>` elements. Read each bar's `height` attribute directly —
  do not try to infer height from a `path` or a `transform`; if a bar
  is built that way instead of as a plain `<rect>` with a literal
  numeric height, obj-3 and obj-4 both fail regardless of visual
  appearance. Compute min(heights)/max(heights) and compare to 0.952.
  A submission that reproduces the original misleading chart's ratio
  (~0.5) instead of rebuilding it honestly fails obj-4 even if it
  technically drew four rects.
- Distortion diagnosis accuracy: the core insight is that a non-zero
  baseline inflates visual differences non-linearly relative to the
  underlying data — reward submissions that state this mechanism
  clearly (not just "the chart is misleading") and connect it to the
  specific 76-start baseline and the specific ratio distortion.
  PASS phrasings: "the axis is truncated at 76, so a 5% rise is drawn
  as a doubled bar"; "cutting the baseline to 76 encodes value-minus-76,
  not value, so small gaps balloon"; "the non-zero baseline makes the
  Apr bar 2x the Jan bar while downloads rose only 1.05x".
  FAIL phrasings: "the chart is misleading and unfair to readers";
  "the bars overstate the trend and should be redrawn"; "leadership
  could be fooled by this exaggerated chart" (no mechanism, no baseline,
  no number).
- Honest-chart craftsmanship: reward clean, readable SVG (sensible
  viewBox, visible axis or baseline reference, labeled bars/values)
  over a bare four-rect dump that technically satisfies the numeric
  checks but is hard to read as a chart.
- Reasoning quality: does CRITIQUE.md show the actual arithmetic for
  both the true growth rate and the exaggeration ratio, rather than
  asserting "the chart exaggerates growth" without numbers?
  PASS phrasings: "(84-80)/80 = 0.05 = 5%, and 8/4 = 2.0 vs 84/80 =
  1.05, so 2.0/1.05 = 1.9x"; "growth is 5% by (84-80)/80; the height
  ratio 2.0 overstates the true 1.05 ratio by ~1.9x".
  FAIL phrasings: "the chart roughly doubles the real growth" (no
  computation shown); "Apr is only slightly higher than January so the
  chart lies" (no rate, no exaggeration figure).
