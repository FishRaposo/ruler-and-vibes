---
id: a11y-03c-thistledown-palette
category: accessibility
title: Color-contrast failures in the Thistledown scheduler tag palette
deliverables:
  - CONTRAST.md
  - fixed.html
---

## Task

Below is a complete, self-contained style-card page for a fictional
product, the "Thistledown" community-radio scheduling app. It shows four
text chips, each with its foreground/background hex colors and font
size/weight printed beside it. Some of these pairings fail WCAG 2.1 AA
contrast requirements; you need to work out which, and fix only those.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Thistledown Scheduler — Tag Palette</title>
<style>
  body { font-family: Verdana, sans-serif; background: #ffffff; margin: 0; padding: 24px; }
  .card { max-width: 480px; margin: 0 auto; }
  .chip { padding: 16px; margin-bottom: 16px; border: 1px solid #eee; }
  .chip-1 { color: #8566c6; background: #ffffff; font-size: 16px; font-weight: normal; }
  .chip-2 { color: #5b93a8; background: #ffffff; font-size: 28px; font-weight: bold; }
  .chip-3 { color: #ffffff; background: #c66a4a; font-size: 15px; font-weight: normal; padding: 10px 16px; display: inline-block; }
  .chip-4 { color: #8f9a00; background: #ffffff; font-size: 13px; font-weight: normal; }
  .tag { font-family: monospace; font-size: 12px; color: #000; display: block; margin-top: 6px; }
</style>
</head>
<body>
  <div class="card">
    <h1 style="color:#000;">Thistledown Tag Palette</h1>

    <div class="chip">
      <div class="chip-1">Draft episode awaiting review.</div>
      <span class="tag">Status tag: #8566c6 on #ffffff, 16px normal</span>
    </div>

    <div class="chip">
      <div class="chip-2">This Week On Air</div>
      <span class="tag">Show heading: #5b93a8 on #ffffff, 28px bold</span>
    </div>

    <div class="chip">
      <button class="chip-3">Publish Slot</button>
      <span class="tag">Primary button label: #ffffff on #c66a4a, 15px normal</span>
    </div>

    <div class="chip">
      <div class="chip-4">Playlist synced hourly from the archive feed.</div>
      <span class="tag">Muted note: #8f9a00 on #ffffff, 13px normal</span>
    </div>
  </div>
</body>
</html>
```

## Deliverables

- `CONTRAST.md` — for each of the four chips (1-4): compute its contrast
  ratio using the WCAG 2.1 sRGB relative-luminance formula, report the
  ratio to two decimal places, state which threshold applies (4.5:1 for
  normal text, or 3.0:1 for WCAG-defined "large" text — >=24px, or
  >=18.66px/~14pt when bold), and give a PASS/FAIL verdict.
- `fixed.html` — the same style card, with only the failing chips' colors
  darkened/adjusted so each meets its threshold, and the chip that already
  passes left completely unchanged. Update each chip's printed hex tag to
  match whatever color is actually applied.

## Constraints

- `fixed.html` must remain a single self-contained file that opens from
  `file://` and shows all four labeled chips.
- Do not touch the colors of any chip that already passes its threshold —
  only failing chips should change.
- The hex values printed in each visible tag must exactly match the hex
  values actually applied in the CSS for that chip.
- Apply the correct threshold per chip based on its actual font size and
  weight — do not apply 4.5:1 uniformly to everything, and do not assume
  large text always passes regardless of its actual ratio.
- Show your arithmetic in `CONTRAST.md`, not just the final verdicts.
