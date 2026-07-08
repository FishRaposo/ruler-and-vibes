---
id: creative-06-wcag-accessible-component
category: creative-visual
title: Contrast-compliant accessible card component
deliverables:
  - card.html
---

## Task

Below is a starter "pricing card" component for a fictional plan called
**Meridian** at **$29/mo**. It looks fine at a glance, but it fails
accessibility in ways you must fix.

```html
<!DOCTYPE html>
<html>
<head>
<style>
  .card { font-family: sans-serif; width: 320px; padding: 24px; background: #ffffff; border: 1px solid #eeeeee; }
  .plan-name { color: #f5a623; font-size: 20px; margin: 0; }
  .price { color: #f5a623; font-size: 28px; font-weight: bold; }
  .features { color: #f5a623; font-size: 14px; }
  .cta { background: #f5a623; color: #ffffff; padding: 10px 20px; text-align: center; cursor: pointer; }
</style>
</head>
<body>
  <div class="card">
    <p class="plan-name">Meridian</p>
    <div class="price">$29/mo</div>
    <div class="features">
      <div>Unlimited projects</div>
      <div>Priority support</div>
      <div>Custom domains</div>
    </div>
    <div class="cta" onclick="alert('Subscribed')">Choose Meridian</div>
  </div>
</body>
</html>
```

Problems: the brand orange `#f5a623` on white background is only
2.03:1 contrast (WCAG AA requires >= 4.5:1 for normal text), and the
"button" is a `<div onclick>` with no semantic meaning.

Produce `card.html`: a corrected, single self-contained pricing-card
component that keeps the same content (plan name "Meridian", price
"$29/mo", the same 3-item feature list, one primary action button) but:

1. Fixes every text/background color pair to meet **WCAG 2.1 AA**:
   normal-size text >= 4.5:1 (this includes the button label, since it
   has no specified font-size and is therefore normal-size text under
   SC 1.4.3), and the price heading (>=24px) >= 3:1.
2. Uses correct semantic/ARIA markup: a real `<button>` element (not a
   clickable `<div>`), the plan name in a heading element (`<h1>`-
   `<h6>`), the three features as `<li>` items inside a `<ul>` or
   `<ol>`, and a non-empty accessible name on the button.

**Color constraint (required for a decidable check):** use only flat,
explicit solid hex or `rgb()` colors everywhere text appears against a
background. No gradients, no `rgba()`/`hsla()`/alpha channels, no
`opacity < 1`, and no `background-image` anywhere behind text. Every
text run's foreground color and its single solid background must be
unambiguous literals.

## Deliverables

- `card.html` — one self-contained file (inline CSS only) implementing
  the corrected, accessible pricing card described above.

## Constraints

- Single file, no external resources of any kind (no CDN, `<link>`
  stylesheet, remote font, or `<img src>` to a URL). Inline CSS/SVG
  only. Must render from `file://`.
- Flat solid colors only behind any text (see color constraint above) —
  this is required so contrast can be verified exactly; do not use
  gradients or alpha anywhere text is involved.
- Do not keep `#f5a623` (or any other color) on white or any background
  for normal-size text if the resulting ratio is below 4.5:1.
