---
id: creative-05-instructed-svg-edit
category: creative-visual
title: Instructed SVG restyle and repair
deliverables:
  - badge.svg
---

## Task

Below is a complete, self-contained SVG for a fictional event badge. Open
it mentally (or in a browser) and you will notice its decorative star
does not render any color — that is a real, seeded bug you must fix.

```svg
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sunset" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ff9e4f"/>
      <stop offset="100%" stop-color="#ff4f81"/>
    </linearGradient>
  </defs>
  <rect id="bg" x="0" y="0" width="400" height="400" fill="#cccccc"/>
  <circle id="badge" cx="200" cy="220" r="110" fill="#1a1a2e"/>
  <path id="star" fill="url(#sky)" d="M200,140 L212,176 L250,176 L219,198 L231,234 L200,212 L169,234 L181,198 L150,176 L188,176 Z"/>
  <text id="headline" x="200" y="330" font-size="36" text-anchor="middle" fill="#ffffff">DRAFT</text>
</svg>
```

Reproduce this SVG into `badge.svg`, applying exactly the following
ordered edits:

1. Change `#headline`'s text content from `DRAFT` to `AURORA`.
2. Change `#bg`'s `fill` from `#cccccc` to `#0b1e3a`.
3. Add `stroke="#ffd166"` and `stroke-width="3"` to `#badge`.

You must also fix the rendering bug: `#star` has `fill="url(#sky)"`,
but the only gradient definition in `<defs>` has `id="sunset"` — so as
shipped, the star's fill resolves to nothing and it renders invisible.
Reconcile the id and the reference so the star actually paints (rename
the gradient definition to `sky`, repoint the star at `sunset`, or add
a genuine `id="sky"` gradient with real stops — your choice, as long as
`#star`'s `url(...)` target is a real gradient definition that carries
at least one `<stop>`).

## Deliverables

- `badge.svg` — the edited badge. Edit surgically: keep the four
  original element ids (`bg`, `headline`, `badge`, `star`) intact, keep
  the overall structure, and apply only the changes above (plus
  whatever minimal gradient-id change the repair requires). Do not
  rebuild the badge from scratch.

## Constraints

- Single self-contained SVG, no `<script>`, `<image>`, `<foreignObject>`,
  or `@import`. Every `href`/`xlink:href` and every `url(...)` target
  must begin with `#`. Must render correctly from `file://`.
