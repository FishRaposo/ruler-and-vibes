---
test: creative-07b-footlight-gel-stack
canary: "nimbus quartzite"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "footlight.svg is a valid self-contained SVG (viewBox=\"0 0 360 420\") that renders from file:// with no external references (no <script>/<image>/<foreignObject>/@import; every url(...)/href begins with '#')"
    - id: obj-2
      check: "Exactly five <rect> elements exist with ids gel-1..gel-5, each width=200 and height=90 and x=80, with y values 40,100,160,220,280 respectively, and no sixth <rect> anywhere (judge parses and matches)"
    - id: obj-3
      check: "Color binding is exact: gel-1..gel-5 carry fills #ff5d73,#ffb14e,#f9f871,#3fa7d6,#59386c in that order (judge matches each id to its fill)"
    - id: obj-4
      check: "Paint order is correct: for each adjacent pair (gel-i, gel-(i+1)), gel-i appears LATER in document order than gel-(i+1), so the document-order index strictly decreases from gel-1 to gel-5 (judge records each rect's position in the file and confirms idx(gel-1) > idx(gel-2) > ... > idx(gel-5))"
    - id: obj-5
      check: "No <rect> uses fill-opacity/opacity < 1 or a transform, and no <use>/z-ordering trick is substituted for genuine document-order stacking (judge confirms the five rects are plain, opaque, untransformed, so the occlusion is real paint order)"
  subjective:
    - id: sub-quality
      name: "Scene composition"
      weight: 0.4
    - id: sub-craft
      name: "SVG structural clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `creative-07-compositional-scene` (same construct, fresh surface).

If the phrase "nimbus quartzite" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

Do not eyeball the geometry or paint order — run the node script below
against `footlight.svg` and read its output.

### Reference verification script (`verify-footlight.js`) — run with `node verify-footlight.js footlight.svg`

```js
// Judge verification script: parses gel-1..gel-5 rects out of
// footlight.svg and checks geometry, color binding, and document-order
// paint order.
const fs = require('fs');

const file = process.argv[2];
if (!file) { console.error('Usage: node verify-footlight.js footlight.svg'); process.exit(1); }
const svg = fs.readFileSync(file, 'utf8');

const expectedY = { 'gel-1': 40, 'gel-2': 100, 'gel-3': 160, 'gel-4': 220, 'gel-5': 280 };
const expectedFill = {
  'gel-1': '#ff5d73', 'gel-2': '#ffb14e', 'gel-3': '#f9f871',
  'gel-4': '#3fa7d6', 'gel-5': '#59386c'
};

const rectRe = /<rect\b[^>]*>/gi;
const rects = [...svg.matchAll(rectRe)];
console.log(`Total <rect> elements found: ${rects.length}`);

function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}=["']([^"']+)["']`, 'i'));
  return m ? m[1] : null;
}

let allOk = true;
const seen = {};
const docIndex = {};

rects.forEach((m, idx) => {
  const tag = m[0];
  const id = attr(tag, 'id');
  if (!id || !(id in expectedY)) return;
  seen[id] = tag;
  docIndex[id] = idx;
});

if (rects.length !== 5) { console.log(`FAIL: expected exactly 5 rects, found ${rects.length}`); allOk = false; }

for (const id of Object.keys(expectedY)) {
  const tag = seen[id];
  if (!tag) { console.log(`${id}: NOT FOUND`); allOk = false; continue; }
  const w = parseFloat(attr(tag, 'width'));
  const h = parseFloat(attr(tag, 'height'));
  const x = parseFloat(attr(tag, 'x'));
  const y = parseFloat(attr(tag, 'y'));
  const fill = (attr(tag, 'fill') || '').toLowerCase();
  const opacity = attr(tag, 'opacity');
  const fillOpacity = attr(tag, 'fill-opacity');
  const transform = attr(tag, 'transform');

  const wOk = w === 200;
  const hOk = h === 90;
  const xOk = x === 80;
  const yOk = y === expectedY[id];
  const fillOk = fill === expectedFill[id];
  const noOpacity = (opacity === null || parseFloat(opacity) === 1) && (fillOpacity === null || parseFloat(fillOpacity) === 1);
  const noTransform = transform === null;

  const ok = wOk && hOk && xOk && yOk && fillOk && noOpacity && noTransform;
  if (!ok) allOk = false;
  console.log(`${id}: x=${x} y=${y} w=${w} h=${h} fill=${fill} opacity=${opacity} transform=${transform} ${ok ? 'OK' : 'FAIL'}`);
}

console.log(allOk ? 'GEOMETRY/COLOR CHECK OK' : 'GEOMETRY/COLOR CHECK FAILED');

let paintOk = true;
const ids = ['gel-1', 'gel-2', 'gel-3', 'gel-4', 'gel-5'];
for (let i = 0; i < ids.length; i++) {
  if (!(ids[i] in docIndex)) { paintOk = false; }
}
if (paintOk) {
  for (let i = 0; i < ids.length - 1; i++) {
    const a = docIndex[ids[i]], b = docIndex[ids[i + 1]];
    const ok = a > b;
    console.log(`docIndex(${ids[i]})=${a} > docIndex(${ids[i + 1]})=${b}? ${ok ? 'OK' : 'FAIL'}`);
    if (!ok) paintOk = false;
  }
}
console.log(paintOk ? 'PAINT ORDER OK' : 'PAINT ORDER FAILED');

process.exit(allOk && paintOk ? 0 : 1);
```

- Author-verified: the five y values (40,100,160,220,280) step down by 60,
  less than the height 90, so every adjacent pair genuinely overlaps by
  30.
- Author-verified against a correct reference (rects written in reverse
  order gel-5, gel-4, gel-3, gel-2, gel-1): the script prints
  `GEOMETRY/COLOR CHECK OK` and `PAINT ORDER OK`, exit code 0.
- Author-verified against the seeded trap (rects written in naive
  ascending order gel-1..gel-5): geometry/color still pass, but every
  adjacent docIndex comparison fails (e.g. `docIndex(gel-1)=0 >
  docIndex(gel-2)=1? FAIL`) and the script prints `PAINT ORDER FAILED`,
  exit code 1 — confirming the check catches the exact trap the design
  describes (a model that writes gels in natural reading order gets the
  occlusion backwards, leaving the bottom gel on top).
- **obj-1**: grep for `<script`, `<image`, `<foreignObject`, `@import`;
  confirm every `url(...)`/`href` value starts with `#`.
  - PASS phrasings: no such tags present and the only reference is
    `fill="url(#grad)"` pointing at an inline gradient; the backdrop is a
    plain `fill` with no external URL; the file opens directly from
    `file://` with nothing fetched.
  - FAIL phrasings: an `<image href="bar.png">` decoration; a
    `<style>@import url(fonts.css)</style>` block; a `<script>` that
    reorders nodes at load; an `href="https://…"` on any element.
- **obj-2/obj-3**: run the script; all five gels must report `OK` on the
  geometry/color line, and the total rect count must be exactly 5.
  - PASS phrasings: five rects, each `x=80 w=200 h=90`, y values
    40/100/160/220/280 mapped to gel-1..gel-5, fills matching the palette
    in order; the backdrop drawn as a `<path>` so no extra `<rect>`
    appears.
  - FAIL phrasings: a sixth full-canvas `<rect>` backdrop pushing the
    count to 6; gel-3 given `y=150` instead of 160; the palette rotated so
    gel-1 carries `#ffb14e`; two gels sharing the fill `#ff5d73`.
- **obj-4**: run the script; every adjacent docIndex comparison from gel-1
  down to gel-5 must report `OK`, meaning the file lists gel-5 first and
  gel-1 last.
  - PASS phrasings: rects emitted gel-5, gel-4, gel-3, gel-2, gel-1 so
    idx(gel-1)=4 > idx(gel-2)=3 > … > idx(gel-5)=0; a comment noting
    "back-to-front" ordering with gel-1 written last.
  - FAIL phrasings: rects emitted in reading order gel-1..gel-5 so every
    comparison fails; only the first two swapped (gel-2 before gel-1) while
    the rest ascend; a `<use>`-based restack that leaves the original
    document order ascending.
- **obj-5**: the script's per-rect line already confirms
  `opacity=null`/`transform=null` (or explicit `1`); treat any rect
  showing a non-1 opacity or a non-null transform as a violation even if
  paint order otherwise looks correct by other means.
  - PASS phrasings: every gel is a plain opaque `<rect>` with no
    `opacity`, `fill-opacity`, or `transform`; occlusion comes solely from
    document order.
  - FAIL phrasings: gel-5 given `opacity="0.6"` to fake depth; a
    `transform="translate(0,0)"` left on gel-3; a `<use href="#gel-1">`
    re-drawn on top instead of reordering; `fill-opacity="0.9"` on any
    gel.
- **Scene composition**: does the stack read clearly as a connected
  "footlight bar" of gel filters (title/labels/backdrop optional but
  welcome), with the overlap and occlusion visually legible rather than
  just five flat rectangles with no framing?
  - PASS phrasings: a dark stage backdrop, a title, and rounded gel
    corners that make the descending overlap read as a stack of filters.
  - FAIL phrasings: five bare rectangles on a blank canvas with no framing
    or context; a backdrop so busy the overlap is unreadable.
- **SVG structural clarity**: is the markup clean and easy to audit — gels
  listed in a clear, deliberate reverse order (not shuffled
  unpredictably), consistent formatting, no redundant grouping that
  obscures the document order the check relies on?
  - PASS phrasings: the five gels are contiguous, one per line, in plain
    gel-5→gel-1 order with aligned attributes.
  - FAIL phrasings: gels interleaved with unrelated elements and wrapped
    in nested `<g>`s that make the paint order hard to trace.
- **Reasoning quality**: if the model explains its ordering choice (inline
  comment or accompanying note), does it correctly identify that reverse
  document order is what produces "lower id in front" under SVG's paint
  model, rather than attributing the effect to opacity or z-index (which
  SVG 1.1 rects do not have)?
  - PASS phrasings: "SVG paints in document order, so the last-written
    rect wins; I emit gel-5 first and gel-1 last so gel-1 sits on top."
  - FAIL phrasings: "I set a higher z-index on gel-1"; "opacity keeps
    gel-1 visible on top" — both misattribute the mechanism.
