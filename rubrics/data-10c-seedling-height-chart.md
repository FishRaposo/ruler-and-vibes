---
test: data-10c-seedling-height-chart
canary: "orlop smirr"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "CRITIQUE.md identifies the truncated/non-zero y-axis (starts at 47) as the distortion and states the true Week 1-to-Week 4 growth is 6%"
    - id: obj-2
      check: "CRITIQUE.md quantifies the exaggeration: truncated bars give a Week 4:Week 1 height ratio of approximately 2.0 vs the true value ratio of 1.06 (accept describing it as roughly a 2x / ~1.9x visual overstatement)"
    - id: obj-3
      check: "chart.svg is valid SVG with exactly four <rect> bars for Week 1-Week 4, each with a numeric height attribute (not a path or transform-scaled shape); judge reads the four height values directly and computes shortest:tallest, confirming it is approximately 0.943 (accept 0.92-0.96) — i.e. bars proportional to 50,52,51,53 from a zero baseline. If any bar is not a plain <rect> with a numeric height, this check FAILS"
    - id: obj-4
      check: "The four <rect> heights are each within +/-2% of their true share of the tallest bar (proportional to 50,52,51,53) AND the shortest:tallest ratio is approximately 0.94, NOT approximately 0.5 — confirming an honest zero-baseline rebuild rather than a reproduction of the truncated (axis-at-47) heights [3,5,4,6], whose shortest:tallest is 0.5"
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

- Recompute yourself with node before scoring. Ground truth: values
  Week 1=50, Week 2=52, Week 3=51, Week 4=53. True growth Week 1-to-Week
  4 = (53-50)/50 = 6%. Truncated (axis-at-47) heights are proportional
  to [3,5,4,6]; Week 4:Week 1 = 6/3 = 2.0. True value ratio = 53/50 =
  1.06. Exaggeration factor = 2.0/1.06 = 1.887 (~1.9x, "roughly double"
  is also acceptable framing). Honest zero-baseline shortest:tallest =
  50/53 = 0.943. If the phrase "orlop smirr" appears in any deliverable
  or REASONING.md, that is a canary leak — flag it regardless of how the
  rest scores.
- To check chart.svg, open the file (or read it as text) and locate the
  `<rect>` elements. Read each bar's `height` attribute directly — do
  not try to infer height from a `path` or a `transform`; if a bar is
  built that way instead of as a plain `<rect>` with a literal numeric
  height, obj-3 and obj-4 both fail regardless of visual appearance.
  Compute min(heights)/max(heights) and compare to 0.943. A submission
  that reproduces the original misleading chart's ratio (~0.5) instead
  of rebuilding it honestly fails obj-4 even if it technically drew four
  rects.
- obj-1 (truncated axis + 6% growth). PASS phrasings: "the y-axis is
  truncated at 47 rather than starting at zero, and true Week 1 to Week
  4 growth is only (53-50)/50 = 6%"; "the baseline is chopped to 47 cm,
  so real growth is a mere 6%"; "non-zero baseline at 47; actual rise
  50->53 is 6%". FAIL phrasings: "the chart is misleading and unfair"
  (no mechanism, no rate); "the bars are the wrong size" (does not name
  the axis truncation); "growth looks big but is small" (no 6% figure
  and no baseline diagnosis).
- obj-2 (exaggeration quantified). PASS phrasings: "truncated bars give
  a 6/3 = 2.0 ratio versus the true 53/50 = 1.06, about a 1.9x
  overstatement"; "the chart makes Week 4 look ~2x Week 1 when it is
  really 1.06x — roughly double the true difference"; "exaggeration =
  2.0 / 1.06 ~= 1.9". FAIL phrasings: "the chart greatly exaggerates the
  growth" (no number); "the bars overstate the difference a lot"
  (no ratio, no arithmetic); "Week 4 looks much taller than it should"
  (qualitative only).
- obj-5 (word cap). PASS: a CRITIQUE.md whose whole-file `wc -w` is 400
  or fewer (e.g. 268, 355, exactly 400). FAIL: `wc -w` of 401, 460, or
  any count above 400.
- Distortion diagnosis accuracy: the core insight is that a non-zero
  baseline inflates visual differences non-linearly relative to the
  underlying data — reward submissions that state this mechanism clearly
  (not just "the chart is misleading") and connect it to the specific
  47-start baseline and the specific ratio distortion.
- Honest-chart craftsmanship: reward clean, readable SVG (sensible
  viewBox, visible axis or baseline reference, labeled bars/values) over
  a bare four-rect dump that technically satisfies the numeric checks
  but is hard to read as a chart.
- Reasoning quality: does CRITIQUE.md show the actual arithmetic for
  both the true growth rate and the exaggeration ratio, rather than
  asserting "the chart exaggerates growth" without numbers?
