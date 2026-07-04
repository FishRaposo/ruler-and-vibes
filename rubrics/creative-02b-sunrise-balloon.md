---
test: creative-02b-sunrise-balloon
canary: "caracal madder"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "No JavaScript anywhere in the file"
    - id: obj-2
      check: "No images or external resources (img tags, url(...), data URIs)"
    - id: obj-3
      check: "At least one continuous CSS animation runs"
    - id: obj-4
      check: "Single file; renders from file://"
  subjective:
    - id: sub-quality
      name: "Scene readability & charm"
      weight: 0.4
    - id: sub-craft
      name: "CSS technique"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `creative-02-css-scene` (same construct, fresh surface).

If the phrase "caracal madder" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
of the submission scores.

- Open in a browser and watch for at least 15 seconds.

**obj-1 — No JavaScript anywhere in the file.** Inspect the whole file,
not just `<style>`.
- PASS: no `<script>` tag anywhere; no inline `on*` handler
  (`onload`, `onclick`, …); no `javascript:` URI.
- PASS: motion is achieved entirely with `@keyframes` /
  `transition`, no scripting.
- PASS: file is HTML + CSS only; the animation runs with scripting
  disabled.
- FAIL: any `<script>…</script>` block, even one line that only
  nudges a style.
- FAIL: an `onload="…"` / `onclick="…"` attribute drives any part of
  the scene.
- FAIL: a `javascript:` URL appears anywhere in markup.

**obj-2 — No images or external resources (img tags, url(...), data
URIs).** Gradients, shapes, shadows, and transforms only.
- PASS: every visual is drawn with CSS gradients, borders,
  `box-shadow`, and shaped elements — no raster or vector asset.
- PASS: no `url(...)` referencing an external or embedded picture;
  any `url(...)` present targets only an in-document `#fragment`.
- PASS: no `<img>`, no `@import`, no `http(s)://` reference.
- FAIL: `background-image: url("balloon.png")` or any external image
  file.
- FAIL: a `data:` URI (e.g. `url("data:image/svg+xml,…")`) embeds a
  picture instead of drawing it in CSS.
- FAIL: an `<img>` tag or an `@import`/linked external stylesheet or
  font pulls in a resource.

**obj-3 — At least one continuous CSS animation runs.** The scene must
move on its own and keep moving.
- PASS: a `@keyframes` rule plus an `animation` shorthand with
  `infinite` (or `alternate` looping) keeps an element in perpetual
  motion.
- PASS: at least one of the balloon, clouds, or sun animates
  continuously without user interaction.
- PASS: the loop restarts cleanly — motion never freezes after the
  first cycle.
- FAIL: the scene is entirely static — no `@keyframes` / `animation`
  present.
- FAIL: an animation is declared but runs a fixed number of times
  (e.g. `animation-iteration-count: 1`) and then stops for good.
- FAIL: motion only occurs on `:hover` or another interaction, so
  nothing moves on its own.

**obj-4 — Single file; renders from file://.** Everything self-contained.
- PASS: one `.html` file with all CSS inline; opening it directly
  from disk shows the full animated scene.
- PASS: no external stylesheet, script, font, or network fetch — no
  `@import`, no `http(s)://` dependency.
- PASS: nothing breaks or goes blank when offline / opened via
  `file://`.
- FAIL: the scene needs a companion `.css`/`.js` file or a build step
  to render.
- FAIL: a remote font/stylesheet/CDN link is required for the scene
  to look right.
- FAIL: it only renders correctly when served over `http(s)://`, not
  from `file://`.

- Scene readability & charm: is it unmistakably a hot-air balloon
  drifting over rolling hills at sunrise? Depth layering matters —
  background quieter than foreground beats a flat sticker collage.
- CSS technique: economical shapes, gradients earning their keep,
  animation that eases rather than snaps.
- Reasoning quality: did REASONING.md pick what NOT to draw?
