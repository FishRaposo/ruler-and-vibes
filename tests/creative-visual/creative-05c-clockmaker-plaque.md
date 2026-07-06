---
id: creative-05c-clockmaker-plaque
category: creative-visual
title: Clockmaker guild plaque restyle and repair
deliverables:
  - plaque.svg
---

## Task

Below is a complete, self-contained SVG for a fictional clockmaker's guild
membership plaque. Open it mentally (or in a browser) and you will notice
its decorative compass rose does not render any color — that is a real,
seeded bug you must fix.

```svg
<svg viewBox="0 0 380 380" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="brass" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f4d47a"/>
      <stop offset="100%" stop-color="#b8860b"/>
    </linearGradient>
  </defs>
  <rect id="bg" x="0" y="0" width="380" height="380" fill="#f0efe9"/>
  <circle id="dial" cx="190" cy="207" r="103" fill="#1c2733"/>
  <path id="rose" fill="url(#compass)" d="M190,137 L203,183 L228,192 L205,209 L190,277 L175,209 L152,192 L177,183 Z"/>
  <text id="headline" x="190" y="317" font-size="30" text-anchor="middle" fill="#ffffff">PROOF</text>
</svg>
```

Reproduce this SVG into `plaque.svg`, applying exactly the following
ordered edits:

1. Change `#headline`'s text content from `PROOF` to `MERIDIAN`.
2. Change `#bg`'s `fill` from `#f0efe9` to `#101f38`.
3. Add `stroke="#c9a227"` and `stroke-width="4"` to `#dial`.

You must also fix the rendering bug: `#rose` has `fill="url(#compass)"`,
but the only gradient definition in `<defs>` has `id="brass"` — so as
shipped, the rose's fill resolves to nothing and it renders invisible.
Reconcile the id and the reference so the rose actually paints (rename
the gradient definition to `compass`, repoint the rose at `brass`, or add
a genuine `id="compass"` gradient with real stops — your choice, as long
as `#rose`'s `url(...)` target is a real gradient definition that carries
at least one `<stop>`).

## Deliverables

- `plaque.svg` — the edited plaque. Edit surgically: keep the four
  original element ids (`bg`, `headline`, `dial`, `rose`) intact, keep
  the overall structure, and apply only the changes above (plus
  whatever minimal gradient-id change the repair requires). Do not
  rebuild the plaque from scratch.

## Constraints

- Single self-contained SVG, no `<script>`, `<image>`, `<foreignObject>`,
  or `@import`. Every `href`/`xlink:href` and every `url(...)` target
  must begin with `#`. Must render correctly from `file://`.
