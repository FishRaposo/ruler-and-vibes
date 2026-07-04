---
id: a11y-03-quillfen-contrast
category: accessibility
title: Color-contrast failures in the Quillfen dashboard palette
deliverables:
  - CONTRAST.md
  - fixed.html
---

## Task

Below is a complete, self-contained style-guide page for a fictional
product, the "Quillfen" analytics dashboard. It shows four text swatches,
each with its foreground/background hex colors and font size/weight
printed beside it. Some of these pairings fail WCAG 2.1 AA contrast
requirements; you need to work out which, and fix only those.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Quillfen Analytics — Style Guide</title>
<style>
  body { font-family: Arial, sans-serif; background: #ffffff; margin: 0; padding: 24px; }
  .guide { max-width: 480px; margin: 0 auto; }
  .swatch { padding: 16px; margin-bottom: 16px; border: 1px solid #eee; }
  .swatch-a { color: #777777; background: #ffffff; font-size: 16px; font-weight: normal; }
  .swatch-b { color: #8c8c8c; background: #ffffff; font-size: 28px; font-weight: bold; }
  .swatch-c { color: #ffffff; background: #5c940d; font-size: 15px; font-weight: normal; padding: 10px 16px; display: inline-block; }
  .swatch-d { color: #949494; background: #ffffff; font-size: 13px; font-weight: normal; }
  .label { font-family: monospace; font-size: 12px; color: #000; display: block; margin-top: 6px; }
</style>
</head>
<body>
  <div class="guide">
    <h1 style="color:#000;">Quillfen Style Guide</h1>

    <div class="swatch">
      <div class="swatch-a">The quick brown fox jumps over the lazy dog.</div>
      <span class="label">Body text: #777777 on #ffffff, 16px normal</span>
    </div>

    <div class="swatch">
      <div class="swatch-b">Quarterly Revenue Summary</div>
      <span class="label">Section heading: #8c8c8c on #ffffff, 28px bold</span>
    </div>

    <div class="swatch">
      <button class="swatch-c">Export Report</button>
      <span class="label">Primary button label: #ffffff on #5c940d, 15px normal</span>
    </div>

    <div class="swatch">
      <div class="swatch-d">Data refreshed nightly at 02:00 UTC.</div>
      <span class="label">Muted footnote: #949494 on #ffffff, 13px normal</span>
    </div>
  </div>
</body>
</html>
```

## Deliverables

- `CONTRAST.md` — for each of the four swatches (A-D): compute its
  contrast ratio using the WCAG 2.1 sRGB relative-luminance formula,
  report the ratio to two decimal places, state which threshold applies
  (4.5:1 for normal text, or 3.0:1 for WCAG-defined "large" text —
  >=24px, or >=18.66px/~14pt when bold), and give a PASS/FAIL verdict.
- `fixed.html` — the same style guide, with only the failing swatches'
  colors darkened/adjusted so each meets its threshold, and the swatch
  that already passes left completely unchanged. Update each swatch's
  printed hex label to match whatever color is actually applied.

## Constraints

- `fixed.html` must remain a single self-contained file that opens from
  `file://` and shows all four labeled swatches.
- Do not touch the colors of any swatch that already passes its
  threshold — only failing swatches should change.
- The hex values printed in each visible label must exactly match the
  hex values actually applied in the CSS for that swatch.
- Apply the correct threshold per swatch based on its actual font size
  and weight — do not apply 4.5:1 uniformly to everything, and do not
  assume large text always passes regardless of its actual ratio.
- Show your arithmetic in `CONTRAST.md`, not just the final verdicts.
