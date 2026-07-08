---
id: creative-06b-pantry-shift-signup
category: creative-visual
title: Contrast-compliant accessible volunteer-shift card
deliverables:
  - card.html
---

## Task

Below is a starter "volunteer shift" card component for a fictional
community food bank shift titled **Harborview Food Pantry**, scheduled
**Sat 9-12**. It looks fine at a glance, but it fails accessibility in
ways you must fix.

```html
<!DOCTYPE html>
<html>
<head>
<style>
  .shift-card { font-family: sans-serif; width: 340px; padding: 24px; background: #ffffff; border: 1px solid #eeeeee; }
  .shift-title { color: #33c9bd; font-size: 20px; margin: 0; }
  .schedule { color: #33c9bd; font-size: 26px; font-weight: bold; }
  .duties { color: #33c9bd; font-size: 14px; }
  .signup-btn { background: #33c9bd; color: #ffffff; padding: 12px 20px; text-align: center; cursor: pointer; }
</style>
</head>
<body>
  <div class="shift-card">
    <div class="shift-title">Harborview Food Pantry</div>
    <div class="schedule">Sat 9-12</div>
    <div class="duties">
      <div>Sort donated produce</div>
      <div>Restock shelf bins</div>
      <div>Greet pantry guests</div>
    </div>
    <div class="signup-btn" onclick="alert('Signed up')">Sign up for this shift</div>
  </div>
</body>
</html>
```

Problems: the brand teal `#33c9bd` on the white card background is only
2.05:1 contrast (WCAG AA requires >= 4.5:1 for normal text), and the
"button" is a `<div onclick>` with no semantic meaning.

Produce `card.html`: a corrected, single self-contained volunteer-shift
card component that keeps the same content (shift title "Harborview Food
Pantry", schedule "Sat 9-12", the same 3-item duty list, one primary
action button) but:

1. Fixes every text/background color pair to meet **WCAG 2.1 AA**:
   normal-size text >= 4.5:1 (this includes the button label, since it
   has no specified font-size and is therefore normal-size text under
   SC 1.4.3), and the schedule heading (>=24px) >= 3:1.
2. Uses correct semantic/ARIA markup: a real `<button>` element (not a
   clickable `<div>`), the shift title in a heading element (`<h1>`-
   `<h6>`), the three duties as `<li>` items inside a `<ul>` or `<ol>`,
   and a non-empty accessible name on the button.

**Color constraint (required for a decidable check):** use only flat,
explicit solid hex or `rgb()` colors everywhere text appears against a
background. No gradients, no `rgba()`/`hsla()`/alpha channels, no
`opacity < 1`, and no `background-image` anywhere behind text. Every
text run's foreground color and its single solid background must be
unambiguous literals.

## Deliverables

- `card.html` — one self-contained file (inline CSS only) implementing
  the corrected, accessible volunteer-shift card described above.

## Constraints

- Single file, no external resources of any kind (no CDN, `<link>`
  stylesheet, remote font, or `<img src>` to a URL). Inline CSS/SVG
  only. Must render from `file://`.
- Flat solid colors only behind any text (see color constraint above) —
  this is required so contrast can be verified exactly; do not use
  gradients or alpha anywhere text is involved.
- Do not keep `#33c9bd` (or any other color) on white or any background
  for normal-size text if the resulting ratio is below 4.5:1.
