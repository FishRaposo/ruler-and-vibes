---
id: a11y-03b-marrowbell-planetarium
category: accessibility
title: Color-contrast failures in the Marrowbell Planetarium kiosk theme
deliverables:
  - CONTRAST.md
  - fixed.html
---

## Task

Below is a complete, self-contained theme-sheet page for a fictional
product, the "Marrowbell Planetarium" ticket kiosk. It shows four text
tokens, each with its foreground/background hex colors and font
size/weight printed beside it. Some of these pairings fail WCAG 2.1 AA
contrast requirements; you need to work out which, and fix only those.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Marrowbell Planetarium — Kiosk Theme</title>
<style>
  body { font-family: Verdana, sans-serif; background: #eef0f4; margin: 0; padding: 24px; }
  .sheet { max-width: 480px; margin: 0 auto; }
  .token { padding: 16px; margin-bottom: 16px; background: #faf6ee; border: 1px solid #ddd; }
  .token-a { color: #727272; background: #faf6ee; font-size: 17px; font-weight: normal; }
  .token-b { color: #888888; background: #faf6ee; font-size: 26px; font-weight: bold; }
  .token-c { color: #ffffff; background: #a07a55; font-size: 16px; font-weight: normal; padding: 10px 16px; display: inline-block; }
  .token-d { color: #909090; background: #faf6ee; font-size: 12px; font-weight: normal; }
  .tag { font-family: monospace; font-size: 12px; color: #000; display: block; margin-top: 6px; }
</style>
</head>
<body>
  <div class="sheet">
    <h1 style="color:#000;">Marrowbell Kiosk Theme</h1>

    <div class="token">
      <div class="token-a">Choose the number of tickets for tonight's show.</div>
      <span class="tag">Body copy: #727272 on #faf6ee, 17px normal</span>
    </div>

    <div class="token">
      <div class="token-b">Tonight Under the Dome</div>
      <span class="tag">Marquee heading: #888888 on #faf6ee, 26px bold</span>
    </div>

    <div class="token">
      <button class="token-c">Reserve Seats</button>
      <span class="tag">Primary button label: #ffffff on #a07a55, 16px normal</span>
    </div>

    <div class="token">
      <div class="token-d">Doors open 20 minutes before each screening.</div>
      <span class="tag">Muted footnote: #909090 on #faf6ee, 12px normal</span>
    </div>
  </div>
</body>
</html>
```

## Deliverables

- `CONTRAST.md` — for each of the four tokens (A-D): compute its contrast
  ratio using the WCAG 2.1 sRGB relative-luminance formula, report the
  ratio to two decimal places, state which threshold applies (4.5:1 for
  normal text, or 3.0:1 for WCAG-defined "large" text — >=24px, or
  >=18.66px/~14pt when bold), and give a PASS/FAIL verdict.
- `fixed.html` — the same theme sheet, with only the failing tokens'
  colors darkened/adjusted so each meets its threshold, and the token
  that already passes left completely unchanged. Update each token's
  printed hex tag to match whatever color is actually applied.

## Constraints

- `fixed.html` must remain a single self-contained file that opens from
  `file://` and shows all four labeled tokens.
- Do not touch the colors of any token that already passes its threshold
  — only failing tokens should change.
- The hex values printed in each visible tag must exactly match the hex
  values actually applied in the CSS for that token.
- Apply the correct threshold per token based on its actual font size and
  weight — do not apply 4.5:1 uniformly to everything, and do not assume
  large text always passes regardless of its actual ratio.
- Show your arithmetic in `CONTRAST.md`, not just the final verdicts.
