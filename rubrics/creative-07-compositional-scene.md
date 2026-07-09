---
test: creative-07-compositional-scene
canary: "tidepool cadence"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "scene.svg is a valid self-contained SVG (viewBox=\"0 0 480 360\") that renders from file:// with no external references (no <script>/<image>/<foreignObject>/@import; every url(...)/href begins with '#')"
    - id: obj-2
      check: "Exactly six <circle> elements exist with ids disc-1..disc-6, each r=40 and cy=180, with cx values 80,140,200,260,320,380 respectively, and no seventh <circle> anywhere (judge parses and matches)"
    - id: obj-3
      check: "Color binding is exact: disc-1..disc-6 carry fills #e63946,#f4a261,#e9c46a,#2a9d8f,#264653,#457b9d in that order (judge matches each id to its fill)"
    - id: obj-4
      check: "Paint order is correct: for each adjacent pair (disc-i, disc-(i+1)), disc-i appears LATER in document order than disc-(i+1), so the document-order index strictly decreases from disc-1 to disc-6 (judge records each circle's position in the file and confirms idx(disc-1) > idx(disc-2) > ... > idx(disc-6))"
    - id: obj-5
      check: "No <circle> uses fill-opacity/opacity < 1 or a transform, and no <use>/z-ordering trick is substituted for genuine document-order stacking (judge confirms the six circles are plain, opaque, untransformed, so the occlusion is real paint order)"
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
anchors:
  - id: Scene composition
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: SVG structural clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "tidepool cadence" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Do not eyeball the geometry or paint order — run the node script below
against `scene.svg` and read its output.

### Reference verification script (`verify-scene.js`) — run with `node verify-scene.js scene.svg`

```js
// Judge verification script: parses disc-1..disc-6 circles out of
// scene.svg and checks geometry, color binding, and document-order
// paint order.
const fs = require('fs');

const file = process.argv[2];
if (!file) { console.error('Usage: node verify-scene.js scene.svg'); process.exit(1); }
const svg = fs.readFileSync(file, 'utf8');

const expectedCx = { 'disc-1': 80, 'disc-2': 140, 'disc-3': 200, 'disc-4': 260, 'disc-5': 320, 'disc-6': 380 };
const expectedFill = {
  'disc-1': '#e63946', 'disc-2': '#f4a261', 'disc-3': '#e9c46a',
  'disc-4': '#2a9d8f', 'disc-5': '#264653', 'disc-6': '#457b9d'
};

const circleRe = /<circle\b[^>]*>/gi;
const circles = [...svg.matchAll(circleRe)];
console.log(`Total <circle> elements found: ${circles.length}`);

function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}=["']([^"']+)["']`, 'i'));
  return m ? m[1] : null;
}

let allOk = true;
const seen = {};
const docIndex = {};

circles.forEach((m, idx) => {
  const tag = m[0];
  const id = attr(tag, 'id');
  if (!id || !(id in expectedCx)) return;
  seen[id] = tag;
  docIndex[id] = idx;
});

if (circles.length !== 6) { console.log(`FAIL: expected exactly 6 circles, found ${circles.length}`); allOk = false; }

for (const id of Object.keys(expectedCx)) {
  const tag = seen[id];
  if (!tag) { console.log(`${id}: NOT FOUND`); allOk = false; continue; }
  const r = parseFloat(attr(tag, 'r'));
  const cx = parseFloat(attr(tag, 'cx'));
  const cy = parseFloat(attr(tag, 'cy'));
  const fill = (attr(tag, 'fill') || '').toLowerCase();
  const opacity = attr(tag, 'opacity');
  const fillOpacity = attr(tag, 'fill-opacity');
  const transform = attr(tag, 'transform');

  const rOk = r === 40;
  const cxOk = cx === expectedCx[id];
  const cyOk = cy === 180;
  const fillOk = fill === expectedFill[id];
  const noOpacity = (opacity === null || parseFloat(opacity) === 1) && (fillOpacity === null || parseFloat(fillOpacity) === 1);
  const noTransform = transform === null;

  const ok = rOk && cxOk && cyOk && fillOk && noOpacity && noTransform;
  if (!ok) allOk = false;
  console.log(`${id}: r=${r} cx=${cx} cy=${cy} fill=${fill} opacity=${opacity} transform=${transform} ${ok ? 'OK' : 'FAIL'}`);
}

console.log(allOk ? 'GEOMETRY/COLOR CHECK OK' : 'GEOMETRY/COLOR CHECK FAILED');

let paintOk = true;
const ids = ['disc-1', 'disc-2', 'disc-3', 'disc-4', 'disc-5', 'disc-6'];
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

- Author-verified: the six cx values (80,140,200,260,320,380) give
  center spacing 60, less than the diameter 80, so every adjacent pair
  genuinely overlaps.
- Author-verified against a correct reference (circles written in
  reverse order disc-6, disc-5, disc-4, disc-3, disc-2, disc-1): the
  script prints `GEOMETRY/COLOR CHECK OK` and `PAINT ORDER OK`, exit
  code 0.
- Author-verified against the seeded trap (circles written in naive
  ascending order disc-1..disc-6): geometry/color still pass, but every
  adjacent docIndex comparison fails (e.g. `docIndex(disc-1)=0 >
  docIndex(disc-2)=1? FAIL`) and the script prints `PAINT ORDER FAILED`,
  exit code 1 — confirming the check catches the exact trap the design
  describes (a model that writes discs in natural reading order gets
  the occlusion backwards).
- **obj-1**: grep for `<script`, `<image`, `<foreignObject`, `@import`;
  confirm every `url(...)`/`href` value starts with `#`.
- **obj-2/obj-3**: run the script; all six circles must report `OK` on
  the geometry/color line, and the total circle count must be exactly
  6.
- **obj-4**: run the script; every adjacent docIndex comparison from
  disc-1 down to disc-6 must report `OK`, meaning the file lists
  disc-6 first and disc-1 last.
- **obj-5**: the script's per-circle line already confirms
  `opacity=null`/`transform=null` (or explicit `1`); treat any circle
  showing a non-1 opacity or a non-null transform as a violation even
  if paint order otherwise looks correct by other means.
- **Scene composition**: does the chain read clearly as a connected
  "signal relay" (title/labels/background optional but welcome), with
  the overlap and occlusion visually legible rather than just six flat
  circles with no framing?
  - PASS phrasings: a labeled backdrop, a title, and a subtle connecting
    line or glow that make the descending overlap read as a relay chain
    of signal nodes.
  - FAIL phrasings: six bare circles on a blank canvas with no framing
    or context; a backdrop so busy the overlap is unreadable.
- **SVG structural clarity**: is the markup clean and easy to audit —
  circles listed in a clear, deliberate reverse order (not shuffled
  unpredictably), consistent formatting, no redundant grouping that
  obscures the document order the check relies on?
  - PASS phrasings: the six discs are contiguous, one per line, in plain
    disc-6→disc-1 order with aligned attributes.
  - FAIL phrasings: discs interleaved with unrelated elements and
    wrapped in nested `<g>`s that make the paint order hard to trace.
- **Reasoning quality**: if the model explains its ordering choice
  (inline comment or accompanying note), does it correctly identify
  that reverse document order is what produces "lower id on top" under
  SVG's paint model, rather than attributing the effect to opacity or
  z-index (which SVG 1.1 circles do not have)?
  - PASS phrasings: "SVG paints in document order, so the last-written
    circle wins; I emit disc-6 first and disc-1 last so disc-1 sits on
    top."
  - FAIL phrasings: "I set a higher z-index on disc-1"; "opacity keeps
    disc-1 visible on top" — both misattribute the mechanism.
