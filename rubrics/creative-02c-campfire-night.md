---
test: creative-02c-campfire-night
canary: "margay woad"
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

Parallel form of `creative-02-css-scene` (same construct, fresh
surface).

If the phrase "margay woad" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest of the
submission scores.

- Open in a browser and watch for at least 15 seconds.
- Do not eyeball the constraint checks — run the node script below
  against `scene.html` and read its output, then confirm with your own
  eyes in the browser.

### Reference verification script (`verify-scene.js`) — run with `node verify-scene.js scene.html`

```js
// Judge verification script for creative-02c-campfire-night.
// Parses scene.html and checks the four objective constraints.
const fs = require('fs');
const file = process.argv[2];
if (!file) { console.error('Usage: node verify-scene.js scene.html'); process.exit(1); }
const html = fs.readFileSync(file, 'utf8');

// Strip HTML comments so commented-out markers don't create false hits.
const src = html.replace(/<!--[\s\S]*?-->/g, '');
const results = {};

// obj-1: No JavaScript anywhere.
const hasScript = /<script[\s>]/i.test(src);
const hasEventAttr = /\son[a-z]+\s*=/i.test(src);            // onclick, onload, ...
const hasJsUri = /(?:href|src|action)\s*=\s*["']?\s*javascript:/i.test(src);
results['obj-1'] = !hasScript && !hasEventAttr && !hasJsUri;

// obj-2: No images or external resources.
const hasImg = /<img[\s>]/i.test(src);
const hasPicture = /<picture[\s>]|<source[\s>]/i.test(src);
const hasSvgImage = /<image[\s>]/i.test(src);
const urlMatches = [...src.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)]
  .map(m => m[1].trim())
  .filter(u => !u.startsWith('#'));                          // bare #id refs are fine
const hasDataUri = /data:/i.test(src);
const hasExternalLink = /<link\b[^>]*\brel\s*=\s*["']?stylesheet/i.test(src)
  || /@import/i.test(src);
const hasHttpRef = /(?:href|src)\s*=\s*["']?\s*(?:https?:)?\/\//i.test(src);
results['obj-2'] = !hasImg && !hasPicture && !hasSvgImage
  && urlMatches.length === 0 && !hasDataUri
  && !hasExternalLink && !hasHttpRef;

// obj-3: At least one continuous CSS animation.
const hasKeyframes = /@(?:-webkit-)?keyframes\b/i.test(src);
const hasInfinite = /animation[^;{}]*\binfinite\b/i.test(src)
  || /animation-iteration-count\s*:\s*infinite/i.test(src);
results['obj-3'] = hasKeyframes && hasInfinite;

// obj-4: Single file, self-contained (nothing fetched at load).
results['obj-4'] = !hasExternalLink && !hasHttpRef
  && urlMatches.length === 0 && !hasDataUri && !hasImg && !hasSvgImage;

for (const k of ['obj-1', 'obj-2', 'obj-3', 'obj-4']) {
  console.log(`${k}: ${results[k] ? 'PASS' : 'FAIL'}`);
}
const allOk = Object.values(results).every(Boolean);
console.log(allOk ? 'ALL OBJECTIVE CHECKS PASS' : 'OBJECTIVE CHECKS FAILED');
process.exit(allOk ? 0 : 1);
```

- Author-verified against a correct pure-CSS reference (a dark gradient
  night sky with small radial-gradient star dots, layered log shapes for
  the fire pit, and flame/smoke shapes built from radius-shaped `<div>`s
  with `@keyframes` flicker/rise/twinkle set to `infinite`): the script
  prints `obj-1..obj-4: PASS` and `ALL OBJECTIVE CHECKS PASS`, exit code
  0.
- Author-verified against the seeded trap (the same scene but with the
  fire supplied as an `<img src="campfire.png">` plus a
  `background-image: url("data:image/svg+xml;...")` and a JS
  `setInterval` flicker loop): `obj-1`, `obj-2`, and `obj-4` report
  `FAIL` and the script exits 1 — confirming the checks catch the
  natural shortcut of reaching for an image asset and a JS animation
  instead of building the motion in CSS.

- **obj-1** — No JavaScript anywhere. Run the script; obj-1 must be
  PASS, then confirm by grepping the file.
  - PASS phrasings: "the file contains no `<script>` tag and no inline
    event handlers"; "all motion comes from CSS `@keyframes`, zero
    JavaScript"; "no `onclick`/`onload` attributes and no
    `javascript:` URIs anywhere."
  - FAIL phrasings: "a `<script>` block drives the flames with
    `requestAnimationFrame`"; "an `onload="..."` handler kicks off the
    animation"; "a `setInterval` loop updates the flame's `height` in
    JavaScript."
- **obj-2** — No images or external resources. Run the script; obj-2
  must be PASS.
  - PASS phrasings: "every visual is a gradient, box-shadow, or
    border-radius shape — no `url(...)` pointing at a resource"; "no
    `<img>`, `<picture>`, or SVG `<image>` element and no `data:`
    URI"; "the only `url(...)` references, if any, are bare `#id`
    fragments, not files."
  - FAIL phrasings: "the campfire is an `<img src="campfire.png">`"; "the
    night sky uses `background-image: url("data:image/svg+xml;...")`";
    "a `<link rel="stylesheet" href="https://...">` or `@import` pulls
    in an external resource."
- **obj-3** — At least one continuous CSS animation runs. Run the
  script; obj-3 must be PASS, then confirm the motion actually loops in
  the browser.
  - PASS phrasings: "a `@keyframes flicker` animation on the flames is
    set to `infinite` and loops forever"; "the smoke curls upward via
    an `animation: rise 6s ease-in-out infinite`"; "the stars twinkle
    on a continuous, infinitely repeating keyframe cycle."
  - FAIL phrasings: "there are `@keyframes` but every `animation` runs a
    finite count and then freezes"; "the scene is entirely static — no
    `@keyframes` and no `animation` property at all"; "the only motion
    is a one-shot `transition` on hover, not a continuous animation."
- **obj-4** — Single file that renders from `file://`. Run the script;
  obj-4 must be PASS, then open the file directly from disk.
  - PASS phrasings: "one self-contained `.html` file with all CSS
    inline in a `<style>` block, nothing fetched over the network";
    "opening it from `file://` with no server shows the full scene";
    "no external stylesheet, font, or asset — it works fully offline."
  - FAIL phrasings: "it `@import`s or `<link>`s an external stylesheet,
    so `file://` renders unstyled"; "it references an `https://` font or
    image that fails to load offline"; "the CSS lives in a separate
    `styles.css` that must sit alongside the HTML."

- **Scene readability & charm**: is it unmistakably a campfire crackling
  under a starry night sky? Depth layering matters — a dark, quiet sky
  full of stars behind a glowing foreground fire beats a flat sticker
  collage.
- **CSS technique**: economical shapes, gradients earning their keep
  (the night sky, the glowing embers), animation that eases rather than
  snaps and loops seamlessly.
- **Reasoning quality**: did REASONING.md pick what NOT to draw — which
  details to abstract away or omit so the pure-CSS budget buys the most
  legible campfire-at-night read?
