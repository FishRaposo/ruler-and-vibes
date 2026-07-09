---
test: creative-01c-windward-regatta
canary: "panpipe soffritto"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "Valid SVG that renders in a browser; viewBox is 0 0 640 960"
    - id: obj-2
      check: "Event name, dates, and venue all present as text"
    - id: obj-3
      check: "No external references (images, fonts, stylesheets, scripts)"
    - id: obj-4
      check: "<= 160 lines"
  subjective:
    - id: sub-quality
      name: "Composition & atmosphere"
      weight: 0.4
    - id: sub-craft
      name: "SVG craftsmanship"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
anchors:
  - id: Composition & atmosphere
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: SVG craftsmanship
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `creative-01-svg-poster` (same construct, fresh
surface).

If the phrase "panpipe soffritto" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
of the submission scores.

- Open the file in a browser; judge what you see, not the code alone.
- Do not eyeball the constraint checks — run the node script below
  against `poster.svg` and read its output, then confirm with your own
  eyes in the browser.

### Reference verification script (`verify-poster.js`) — run with `node verify-poster.js poster.svg`

```js
// Judge verification script for creative-01c-windward-regatta.
// Parses poster.svg and checks the four objective constraints.
const fs = require('fs');
const file = process.argv[2];
if (!file) { console.error('Usage: node verify-poster.js poster.svg'); process.exit(1); }
const raw = fs.readFileSync(file, 'utf8');

// Strip XML/HTML comments so commented-out markers don't create false hits.
const src = raw.replace(/<!--[\s\S]*?-->/g, '');
const results = {};

// obj-1: Valid SVG root that renders; viewBox is exactly 0 0 640 960.
const hasSvgRoot = /<svg[\s>]/i.test(src);
const vbMatch = src.match(/viewBox\s*=\s*["']\s*0\s+0\s+640\s+960\s*["']/i);
results['obj-1'] = hasSvgRoot && !!vbMatch;

// obj-2: Event name, dates, and venue all present as <text>/<tspan> content.
// Collect the concatenated text-node content only (not attribute values).
const textContent = [...src.matchAll(/<(?:text|tspan)\b[^>]*>([\s\S]*?)<\/(?:text|tspan)>/gi)]
  .map(m => m[1].replace(/<[^>]+>/g, ' '))   // drop nested tags, keep inner text
  .join(' ')
  .replace(/\s+/g, ' ')
  .toLowerCase();
const hasName = textContent.includes('windward cup');
const hasDates = /5\s*[–—-]\s*7 june 2028/.test(textContent) || textContent.includes('5–7 june 2028');
const hasVenue = textContent.includes('saltspray cove');
results['obj-2'] = hasName && hasDates && hasVenue;

// obj-3: No external references (images, fonts, stylesheets, scripts).
const hasScript = /<script[\s>]/i.test(src);
const hasEventAttr = /\son[a-z]+\s*=/i.test(src);            // onclick, onload, ...
const hasImageEl = /<image[\s>]/i.test(src);                 // SVG raster embed
const hasForeign = /<foreignObject[\s>]/i.test(src);
const urlRefs = [...src.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)]
  .map(m => m[1].trim())
  .filter(u => !u.startsWith('#'));                          // bare #id refs (gradients) are fine
const hasHref = [...src.matchAll(/\b(?:xlink:href|href|src)\s*=\s*["']([^"']*)["']/gi)]
  .map(m => m[1].trim())
  .filter(u => u && !u.startsWith('#'));                     // internal #id fragment refs are fine
const hasDataUri = /data:/i.test(src);
const hasExternalStyle = /<link\b[^>]*\brel\s*=\s*["']?stylesheet/i.test(src)
  || /@import/i.test(src);
const hasFontFace = /@font-face/i.test(src);
const hasHttpRef = /(?:href|src)\s*=\s*["']?\s*(?:https?:)?\/\//i.test(src);
results['obj-3'] = !hasScript && !hasEventAttr && !hasImageEl && !hasForeign
  && urlRefs.length === 0 && hasHref.length === 0 && !hasDataUri
  && !hasExternalStyle && !hasFontFace && !hasHttpRef;

// obj-4: At most 160 lines.
const lineCount = raw.split(/\r\n|\r|\n/).length;
results['obj-4'] = lineCount <= 160;

for (const k of ['obj-1', 'obj-2', 'obj-3', 'obj-4']) {
  console.log(`${k}: ${results[k] ? 'PASS' : 'FAIL'}`);
}
console.log(`(line count: ${raw.split(/\r\n|\r|\n/).length})`);
const allOk = Object.values(results).every(Boolean);
console.log(allOk ? 'ALL OBJECTIVE CHECKS PASS' : 'OBJECTIVE CHECKS FAILED');
process.exit(allOk ? 0 : 1);
```

- Author-verified against a correct hand-coded reference (gradient sky
  and sea bands, a `<pattern>` of water ripples, a sun `radialGradient`,
  two sailboats built from `<path>` hulls and sails, flag bunting, and
  the name/dates/venue in `<text>`): the script prints `obj-1..obj-4:
  PASS` and `ALL OBJECTIVE CHECKS PASS`, exit code 0.
- Author-verified against the seeded trap (the same poster but with the
  boats supplied as an `<image xlink:href="boats.png">`, the title set in
  an external `RegattaScript` web font pulled via `@import
  url("https://...")`, the source poster's `viewBox="0 0 600 900"` copied
  verbatim, and the venue line omitted): `obj-1`, `obj-2`, and `obj-3`
  report `FAIL` and the script exits 1 — confirming the checks catch the
  natural shortcuts of reaching for a raster asset and a web font,
  reusing a stock canvas size, and dropping a required text field.

- **obj-1** — Valid SVG whose `viewBox` is exactly `0 0 640 960`. Run
  the script; obj-1 must be PASS, then confirm the poster actually paints
  in the browser.
  - PASS phrasings: "the root `<svg>` declares `viewBox="0 0 640 960"`
    and the poster renders"; "portrait 640×960 canvas, opens cleanly in
    the browser"; "the viewBox matches the required 0 0 640 960 exactly."
  - FAIL phrasings: "the `viewBox` is `0 0 600 900`, not the required
    `0 0 640 960`"; "there is no `viewBox` attribute at all"; "the markup
    is malformed and the browser renders nothing."
- **obj-2** — Event name, dates, and venue all present as text. Run the
  script; obj-2 must be PASS, then read the three strings on screen.
  - PASS phrasings: "`Windward Cup`, `5–7 June 2028`, and `Saltspray
    Cove` all appear inside `<text>` elements"; "name, dates, and venue
    are live SVG text, not baked into a shape"; "all three required
    strings are selectable text in the poster."
  - FAIL phrasings: "the venue `Saltspray Cove` is missing entirely";
    "the dates never appear as text anywhere"; "the event name is drawn
    as outlined `<path>` glyphs, so no `<text>` node carries it."
- **obj-3** — No external references (images, fonts, stylesheets,
  scripts). Run the script; obj-3 must be PASS.
  - PASS phrasings: "everything is hand-drawn SVG — no `<image>`, no
    `@import`, no `<script>`, no `data:` URI"; "the only `url(...)` refs
    are bare `#id` gradient fragments, nothing external"; "no web font or
    `@font-face`; type uses system font families only."
  - FAIL phrasings: "the boats are an `<image xlink:href="boats.png">`
    raster embed"; "the title pulls a web font via `@import
    url("https://...")`"; "a `<script>` tag or an `onload="..."` handler
    is present."
- **obj-4** — At most 160 lines. Run the script; obj-4 must be PASS.
  - PASS phrasings: "the file is well under 160 lines"; "line count is
    within the 160-line budget"; "the source fits the cap comfortably."
  - FAIL phrasings: "the file runs to 190 lines, over the 160 cap"; "it
    exceeds the 160-line limit"; "the markup is padded past the allowed
    line budget."

- **Composition & atmosphere**: hierarchy (name dominates), a believable
  bright coastal-regatta mood, and palette discipline — strong posters
  commit to a restrained scheme (a crisp sea-and-sky blue with one warm
  accent, say) rather than scattering hues.
- **SVG craftsmanship**: sensible use of gradients/paths/patterns/groups
  vs. brute raster-thinking; clean coordinates.
- **Reasoning quality**: were composition and palette actual decisions in
  REASONING.md?
