---
test: creative-07c-shingled-roof-course
canary: "stratus marl"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "roof.svg is a valid self-contained SVG (viewBox=\"0 0 360 480\") that renders from file:// with no external references (no <script>/<image>/<foreignObject>/@import; every url(...)/href begins with '#')"
    - id: obj-2
      check: "Exactly five <rect> elements exist with ids course-1..course-5, each width=240, height=90, rx=14, x=60, with y values 40,120,200,280,360 respectively, and no sixth <rect> anywhere (judge parses and matches)"
    - id: obj-3
      check: "Color binding is exact: course-1..course-5 carry fills #5b8c5a,#c17767,#e2b04a,#3d5a6c,#8a5a83 in that order (judge matches each id to its fill)"
    - id: obj-4
      check: "Paint order is correct: for each adjacent pair (course-i, course-(i+1)), course-i appears LATER in document order than course-(i+1), so the document-order index strictly decreases from course-1 to course-5 (judge records each rect's position in the file and confirms idx(course-1) > idx(course-2) > ... > idx(course-5))"
    - id: obj-5
      check: "No <rect> uses fill-opacity/opacity < 1 or a transform, and no <use>/z-ordering trick is substituted for genuine document-order stacking (judge confirms the five tiles are plain, opaque, untransformed, so the occlusion is real paint order)"
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

If the phrase "stratus marl" appears in any deliverable or REASONING.md,
that is a canary leak — flag it regardless of how the rest scores.

Do not eyeball the geometry or paint order — run the node script below
against `roof.svg` and read its output.

### Reference verification script (`verify-roof.js`) — run with `node verify-roof.js roof.svg`

```js
// Judge verification script: parses course-1..course-5 rects out of
// roof.svg and checks geometry, color binding, and document-order
// paint order.
const fs = require('fs');

const file = process.argv[2];
if (!file) { console.error('Usage: node verify-roof.js roof.svg'); process.exit(1); }
const svg = fs.readFileSync(file, 'utf8');

const expectedY = { 'course-1': 40, 'course-2': 120, 'course-3': 200, 'course-4': 280, 'course-5': 360 };
const expectedFill = {
  'course-1': '#5b8c5a', 'course-2': '#c17767', 'course-3': '#e2b04a',
  'course-4': '#3d5a6c', 'course-5': '#8a5a83'
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
  const yv = parseFloat(attr(tag, 'y'));
  const rx = parseFloat(attr(tag, 'rx'));
  const fill = (attr(tag, 'fill') || '').toLowerCase();
  const opacity = attr(tag, 'opacity');
  const fillOpacity = attr(tag, 'fill-opacity');
  const transform = attr(tag, 'transform');

  const wOk = w === 240;
  const hOk = h === 90;
  const xOk = x === 60;
  const yOk = yv === expectedY[id];
  const rxOk = rx === 14;
  const fillOk = fill === expectedFill[id];
  const noOpacity = (opacity === null || parseFloat(opacity) === 1) && (fillOpacity === null || parseFloat(fillOpacity) === 1);
  const noTransform = transform === null;

  const ok = wOk && hOk && xOk && yOk && rxOk && fillOk && noOpacity && noTransform;
  if (!ok) allOk = false;
  console.log(`${id}: w=${w} h=${h} x=${x} y=${yv} rx=${rx} fill=${fill} opacity=${opacity} transform=${transform} ${ok ? 'OK' : 'FAIL'}`);
}

console.log(allOk ? 'GEOMETRY/COLOR CHECK OK' : 'GEOMETRY/COLOR CHECK FAILED');

let paintOk = true;
const ids = ['course-1', 'course-2', 'course-3', 'course-4', 'course-5'];
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

- Author-verified: the five y values (40,120,200,280,360) give vertical
  spacing 80, less than the tile height 90, so every adjacent pair
  genuinely overlaps by 10.
- Author-verified against a correct reference (rects written in reverse
  order course-5, course-4, course-3, course-2, course-1): the script
  prints `GEOMETRY/COLOR CHECK OK` and `PAINT ORDER OK`, exit code 0.
- Author-verified against the seeded trap (rects written in naive
  ascending order course-1..course-5): geometry/color still pass, but
  every adjacent docIndex comparison fails (e.g. `docIndex(course-1)=0 >
  docIndex(course-2)=1? FAIL`) and the script prints `PAINT ORDER
  FAILED`, exit code 1 — confirming the check catches the exact trap the
  design describes (a model that writes tiles in natural top-to-bottom
  reading order gets the occlusion backwards).
- **obj-1**: grep for `<script`, `<image`, `<foreignObject`, `@import`;
  confirm every `url(...)`/`href` value starts with `#`.
  - PASS: `<svg viewBox="0 0 360 480" ...>` with only local shapes and a
    `fill="#5b8c5a"` style — no external URIs.
  - PASS: a `<defs>` gradient referenced as `fill="url(#roofSky)"`
    (the `#` target is local).
  - PASS: viewBox is exactly `0 0 360 480` with no `<image>` or
    `<script>` present.
  - FAIL: the file embeds `<image href="shingle.png"/>` or
    `<script>...</script>`.
  - FAIL: a style pulls a web font via `@import url(https://...)`.
  - FAIL: viewBox is `0 0 480 360` (swapped) or otherwise not
    `0 0 360 480`.
- **obj-2/obj-3**: run the script; all five tiles must report `OK` on
  the geometry/color line, and the total rect count must be exactly 5.
  - PASS: five `<rect>` ids course-1..course-5, each `width="240"`
    `height="90"` `rx="14"` `x="60"`, y = 40/120/200/280/360, fills in
    the exact ordered palette.
  - PASS: the background is drawn with a `<path>` or `<polygon>` so the
    rect count stays exactly 5.
  - PASS: fills given in lowercase hex matching the palette exactly.
  - FAIL: a sixth `<rect>` (e.g. a background rectangle) pushes the
    count to 6.
  - FAIL: course-2 is filled `#457b9d` instead of `#c17767` (wrong
    color binding).
  - FAIL: course-3 has `y="180"` instead of `y="200"` (geometry off).
- **obj-4**: run the script; every adjacent docIndex comparison from
  course-1 down to course-5 must report `OK`, meaning the file lists
  course-5 first and course-1 last.
  - PASS: document order in the file is course-5, course-4, course-3,
    course-2, course-1 (reverse numeric).
  - PASS: `idx(course-1) > idx(course-2) > ... > idx(course-5)` holds
    for all four adjacent comparisons.
  - PASS: the upper tile visibly laps over the tile below it because it
    is painted later.
  - FAIL: tiles listed course-1..course-5 in natural reading order, so
    every docIndex comparison prints `FAIL`.
  - FAIL: only the first two courses are reversed while the rest stay
    ascending, breaking the strict-decrease chain.
  - FAIL: a `<use href="#course-1"/>` is appended to force course-1 on
    top rather than ordering the real elements.
- **obj-5**: the script's per-tile line already confirms
  `opacity=null`/`transform=null` (or explicit `1`); treat any tile
  showing a non-1 opacity or a non-null transform as a violation even if
  paint order otherwise looks correct by other means.
  - PASS: all five tiles are plain fills with no `opacity`,
    `fill-opacity`, or `transform` attribute.
  - PASS: any `opacity="1"` / `fill-opacity="1"` stated explicitly still
    counts as opaque.
  - PASS: occlusion is achieved purely by document order, no `<use>` or
    z-index substitute.
  - FAIL: course-5 carries `opacity="0.8"` to fake depth.
  - FAIL: course-4 carries `transform="translate(0,0)"` (any transform
    at all disqualifies).
  - FAIL: the tiles are in ascending order but a `<use>` clone or a
    grouping trick is used to lift course-1 to the top.
- **Scene composition**: does the stack read clearly as a connected
  "roof course study" (title/labels/background optional but welcome),
  with the overlap and the upper-over-lower lapping visually legible
  rather than just five flat rectangles with no framing?
  - PASS phrasings: a sky or wall backdrop, a title, and rounded tile
    corners that make the descending lap read as a shingled roof
    course.
  - FAIL phrasings: five bare rectangles on a blank canvas with no
    framing or context; a backdrop so busy the lapping is unreadable.
- **SVG structural clarity**: is the markup clean and easy to audit —
  tiles listed in a clear, deliberate reverse order (not shuffled
  unpredictably), consistent formatting, no redundant grouping that
  obscures the document order the check relies on?
  - PASS phrasings: the five tiles are contiguous, one per line, in
    plain course-5→course-1 order with aligned attributes.
  - FAIL phrasings: tiles interleaved with unrelated elements and
    wrapped in nested `<g>`s that make the paint order hard to trace.
- **Reasoning quality**: if the model explains its ordering choice
  (inline comment or accompanying note), does it correctly identify that
  reverse document order is what produces "lower id on top" under SVG's
  paint model, rather than attributing the effect to opacity or z-index
  (which SVG 1.1 rects do not have)?
  - PASS phrasings: "SVG paints in document order, so the last-written
    rect wins; I emit course-5 first and course-1 last so course-1 sits
    on top."
  - FAIL phrasings: "I set a higher z-index on course-1"; "opacity
    keeps course-1 visible on top" — both misattribute the mechanism.
