---
id: creative-05b-forecast-tile-repair
category: creative-visual
title: Restyle and repair a weather forecast tile
deliverables:
  - tile.svg
---

## Task

Below is a complete, self-contained SVG for a fictional weather forecast
tile. Open it mentally (or in a browser) and you will notice its
decorative lightning bolt does not render any color — that is a real,
seeded bug you must fix.

```svg
<svg viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="daybreak" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffd36b"/>
      <stop offset="100%" stop-color="#ff7a45"/>
    </linearGradient>
  </defs>
  <rect id="bg" x="0" y="0" width="360" height="360" fill="#e8e8e8"/>
  <circle id="disc" cx="180" cy="150" r="86" fill="#22304d"/>
  <path id="bolt" fill="url(#tempest)" d="M188,96 L150,182 L178,182 L166,258 L214,164 L184,164 Z"/>
  <text id="label" x="180" y="308" font-size="34" text-anchor="middle" fill="#ffffff">TODAY</text>
</svg>
```

Reproduce this SVG into `tile.svg`, applying exactly the following
ordered edits:

1. Change `#label`'s text content from `TODAY` to `FRIDAY`.
2. Change `#bg`'s `fill` from `#e8e8e8` to `#12233f`.
3. Add `stroke="#7fd4ff"` and `stroke-width="4"` to `#disc`.

You must also fix the rendering bug: `#bolt` has `fill="url(#tempest)"`,
but the only gradient definition in `<defs>` has `id="daybreak"` — so as
shipped, the bolt's fill resolves to nothing and it renders invisible.
Reconcile the id and the reference so the bolt actually paints (rename
the gradient definition to `tempest`, repoint the bolt at `daybreak`, or
add a genuine `id="tempest"` gradient with real stops — your choice, as
long as `#bolt`'s `url(...)` target is a real gradient definition that
carries at least one `<stop>`).

## Deliverables

- `tile.svg` — the edited tile. Edit surgically: keep the four original
  element ids (`bg`, `label`, `disc`, `bolt`) intact, keep the overall
  structure, and apply only the changes above (plus whatever minimal
  gradient-id change the repair requires). Do not rebuild the tile from
  scratch.

## Constraints

- Single self-contained SVG, no `<script>`, `<image>`, `<foreignObject>`,
  or `@import`. Every `href`/`xlink:href` and every `url(...)` target
  must begin with `#`. Must render correctly from `file://`.
