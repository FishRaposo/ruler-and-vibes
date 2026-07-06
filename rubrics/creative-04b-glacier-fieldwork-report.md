---
test: creative-04b-glacier-fieldwork-report
canary: "mellophone tapenade"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "infographic.svg renders in a browser and is fully self-contained: no <script>, <image>, <foreignObject>, or @import; every href/xlink:href and every url(...) target begins with '#'; the string 'http' appears only inside xmlns namespace declarations (judge greps for each condition)"
    - id: obj-2
      check: "All five donut percentage labels (60%, 20%, 10%, 5%, 5%) and all five category names appear as text content in the SVG, matching the answer key"
    - id: obj-3
      check: "Donut geometry is correct: paths seg-1..seg-5 exist per the mandated contract, and the judge's node script (embedded below) parses each path's outer-arc start/end coordinates and confirms each is within 6 user units of the answer-key boundary points for cumulative angles 0/216/288/324/342 degrees around center (400,360) r=180; additionally seg-1's arc commands use large-arc-flag=1"
    - id: obj-4
      check: "Bar heights are proportional: rects bar-1..bar-6 exist, and each height ratio to the tallest bar is within 2% of the key ratios 0.3333, 0.6000, 1.0000, 0.7333, 0.4667, 0.2667 (judge extracts height attributes and recomputes with the embedded script)"
    - id: obj-5
      check: "REASONING.md exists, is at most 250 words (whole file, wc -w), and contains all five computed segment angles 216, 72, 36, 18, 18"
  subjective:
    - id: sub-quality
      name: "Editorial design & visual hierarchy"
      weight: 0.4
    - id: sub-craft
      name: "SVG craftsmanship & structural clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `creative-04-data-infographic` (same construct, fresh
surface).

If a submission's REASONING.md contains the phrase
"mellophone tapenade", that is a canary leak — flag it regardless of
how the rest of the checks score.

Do not eyeball the geometry — run the node script below against
`infographic.svg` and read its output. Recompute the reference
boundary points and bar ratios yourself if you want to double-check
the script; do not trust the runner's stated numbers.

### Answer key — computed values

Hours sum to 620 (372+124+62+31+31). Percentages: Drilling 60%,
Core logging 20%, Radar survey 10%, Weather standby 5%, Camp logistics
5% (sum exactly 100). Angles (percent x 3.6): **216, 72, 36, 18, 18**
degrees. Cumulative boundaries clockwise from 12 o'clock: 0, 216, 288,
324, 342, 360.

Boundary endpoint formula for angle `a` clockwise from 12 o'clock:
`x = 400 + r*sin(a*pi/180)`, `y = 360 - r*cos(a*pi/180)`.

Outer radius (180) reference endpoints:
- 0 deg -> (400.00, 180.00)
- 216 deg -> (294.20, 505.62)
- 288 deg -> (228.81, 304.38)
- 324 deg -> (294.20, 214.38)
- 342 deg -> (344.38, 188.81)
- 360 deg -> (400.00, 180.00) (same point as 0 deg)

Inner radius (110) reference endpoints:
- 0 deg -> (400.00, 250.00)
- 216 deg -> (335.34, 448.99)
- 288 deg -> (295.38, 326.01)
- 324 deg -> (335.34, 271.01)
- 342 deg -> (366.01, 255.38)

Only seg-1 (Drilling, 216-degree span) requires `large-arc-flag=1` on
both its outer and inner arcs — every other segment spans <=180
degrees and must use `large-arc-flag=0`. This is the seeded trap:
models that eyeball proportions or copy a boilerplate sub-180-degree
arc formula render a visibly broken or mirrored wedge for Drilling,
even though the arc's start/end coordinates can look right — the flag
alone determines which of the two possible arcs (the 216-degree major
arc vs. the 144-degree minor arc) gets drawn between the same two
points. Confirmed by test: flipping seg-1's large-arc-flag from 1 to 0
leaves both endpoints numerically identical but silently swaps in the
wrong (144-degree) wedge — so the flag must be checked explicitly, not
inferred from endpoint distance alone.

Bar ratios vs. max (45): W1 15/45=0.3333, W2 27/45=0.6000,
W3 45/45=1.0000, W4 33/45=0.7333, W5 21/45=0.4667, W6 12/45=0.2667.

### Reference verification script (`verify-arcs.js`) — run with `node verify-arcs.js infographic.svg`

```js
// Judge verification script: parses seg-1..seg-5 path data and
// bar-1..bar-6 rect heights out of infographic.svg and checks them
// against the computed answer key.
const fs = require('fs');

const file = process.argv[2];
if (!file) { console.error('Usage: node verify-arcs.js infographic.svg'); process.exit(1); }
const svg = fs.readFileSync(file, 'utf8');

const cx = 400, cy = 360, rOuter = 180, rInner = 110;
const tolerance = 6;
const boundaryAngles = [0, 216, 288, 324, 342];

function refPoint(angleDeg, r) {
  const rad = angleDeg * Math.PI / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}
function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

let allOk = true;
for (let i = 1; i <= 5; i++) {
  const id = `seg-${i}`;
  const re = new RegExp(`<path[^>]*id=["']${id}["'][^>]*d=["']([^"']+)["']`, 'i');
  const m = svg.match(re) || svg.match(new RegExp(`<path[^>]*d=["']([^"']+)["'][^>]*id=["']${id}["']`, 'i'));
  if (!m) { console.log(`${id}: NOT FOUND`); allOk = false; continue; }
  const d = m[1];

  const arcRe = /A\s*([\d.\-]+)[ ,]+([\d.\-]+)[ ,]+([\d.\-]+)[ ,]+([01])[ ,]+([01])[ ,]+([\d.\-]+)[ ,]+([\d.\-]+)/gi;
  const arcs = [...d.matchAll(arcRe)];
  if (arcs.length < 1) { console.log(`${id}: no A commands found`); allOk = false; continue; }

  const mMatch = d.match(/M\s*([\d.\-]+)[ ,]+([\d.\-]+)/);
  const startPt = mMatch ? { x: parseFloat(mMatch[1]), y: parseFloat(mMatch[2]) } : null;

  const outerArc = arcs[0];
  const largeArcFlag = outerArc[4];
  const outerEnd = { x: parseFloat(outerArc[6]), y: parseFloat(outerArc[7]) };

  const expectedStart = refPoint(boundaryAngles[i - 1], rOuter);
  const expectedEnd = refPoint(i < 5 ? boundaryAngles[i] : 360, rOuter);

  const startDist = startPt ? dist(startPt, expectedStart) : Infinity;
  const endDist = dist(outerEnd, expectedEnd);

  const expectedFlag = i === 1 ? '1' : '0';
  const flagOk = largeArcFlag === expectedFlag;

  const ok = startDist <= tolerance && endDist <= tolerance && flagOk;
  if (!ok) allOk = false;

  console.log(`${id}: start dist=${startDist.toFixed(2)} end dist=${endDist.toFixed(2)} flag=${largeArcFlag} expect=${expectedFlag} ${ok ? 'OK' : 'FAIL'}`);
}
console.log(allOk ? 'ALL SEGMENTS OK' : 'GEOMETRY CHECK FAILED');

const keyRatios = { 'bar-1': 0.3333, 'bar-2': 0.6000, 'bar-3': 1.0000, 'bar-4': 0.7333, 'bar-5': 0.4667, 'bar-6': 0.2667 };
const heights = {};
let barsOk = true;
for (const id of Object.keys(keyRatios)) {
  const re = new RegExp(`<rect[^>]*id=["']${id}["'][^>]*height=["']([\\d.\\-]+)["']`, 'i');
  const m = svg.match(re) || svg.match(new RegExp(`<rect[^>]*height=["']([\\d.\\-]+)["'][^>]*id=["']${id}["']`, 'i'));
  if (!m) { console.log(`${id}: NOT FOUND`); barsOk = false; continue; }
  heights[id] = parseFloat(m[1]);
}
if (barsOk) {
  const maxH = Math.max(...Object.values(heights));
  for (const [id, h] of Object.entries(heights)) {
    const ratio = h / maxH;
    const key = keyRatios[id];
    const ok = Math.abs(ratio - key) / key <= 0.02;
    if (!ok) barsOk = false;
    console.log(`${id}: ratio=${ratio.toFixed(4)} expect=${key.toFixed(4)} ${ok ? 'OK' : 'FAIL'}`);
  }
}
console.log(barsOk ? 'ALL BAR RATIOS OK' : 'BAR CHECK FAILED');
process.exit(allOk && barsOk ? 0 : 1);
```

Confirmed during review: running this script against a correct
reference SVG (built under the geometry contract) prints `ALL
SEGMENTS OK` / `ALL BAR RATIOS OK` with every start/end distance 0.00
and every bar ratio exactly matching the key; flipping seg-1's
large-arc-flag from 1 to 0 in that same file (leaving all coordinates
untouched) makes the script print `seg-1: ... flag=0 expect=1 FAIL`
and `GEOMETRY CHECK FAILED`, while seg-2..seg-5 and the bars still
report OK — proving the flag check catches a defect the endpoint
distances alone would miss.

### Per-check guidance

- **obj-1**: grep the file for `<script`, `<image`, `<foreignObject`,
  `@import`; confirm every `href="..."`/`xlink:href="..."`/`url(...)`
  value starts with `#`; confirm the literal string `http` appears
  only within `xmlns="http://www.w3.org/2000/svg"` (or similar
  namespace declarations), not in any resource reference.
  - PASS: file contains no `<script`/`<image`/`<foreignObject`/`@import`
    and only internal `#`-prefixed references.
  - PASS: the only `http` occurrences are inside `xmlns` attributes.
  - PASS: a gradient referenced as `fill="url(#coreGrad)"` — internal,
    so it is allowed.
  - FAIL: an `<image href="photo.png"/>` or `xlink:href="http://..."`
    pointing at an external resource.
  - FAIL: a `<style>@import url("fonts.css");</style>` block.
  - FAIL: any `url(https://...)` in a fill or filter reference.
- **obj-2**: search the SVG text content for the five percentages and
  five category names listed in the task; both must be present for
  each of the five segments.
  - PASS: the five `<text>` runs render `60%`, `20%`, `10%`, `5%`,
    `5%` and the names Drilling / Core logging / Radar survey /
    Weather standby / Camp logistics.
  - PASS: percentages appear as `60 %` or `60%` styled labels and every
    category name appears in the legend or on its slice.
  - FAIL: a slice shows a raw hour count (`372`) with no `60%` label.
  - FAIL: one category name (e.g. `Camp logistics`) is missing from
    both slice and legend.
  - FAIL: a percentage is wrong (`55%` instead of `60%`).
- **obj-3**: run the script above; all five segments must print OK,
  and seg-1 specifically must show `flag=1`.
  - PASS: script prints `ALL SEGMENTS OK` and `seg-1: ... flag=1
    expect=1 OK`.
  - PASS: every start/end distance is within 6 user units of the key.
  - FAIL: `seg-1: ... flag=0 expect=1 FAIL` (the seeded large-arc trap).
  - FAIL: `GEOMETRY CHECK FAILED` because a boundary endpoint is off by
    more than 6 units.
  - FAIL: a `seg-n: NOT FOUND` because the path is missing its id.
- **obj-4**: same script; all six bars must print OK (within 2%).
  - PASS: script prints `ALL BAR RATIOS OK` with every ratio matching
    the key.
  - PASS: heights scale linearly (e.g. W3=220px, W1=73.33px) so the
    ratios land within 2%.
  - FAIL: `bar-5: ratio=... FAIL` because W5 was drawn a fixed height
    instead of proportional.
  - FAIL: `BAR CHECK FAILED` because the bars encode rank order rather
    than magnitude.
  - FAIL: a `bar-n: NOT FOUND` because the rect is missing its id.
- **obj-5**: run `wc -w REASONING.md` for the cap; grep for the five
  angle numbers 216, 72, 36, 18, 18 (each distinct value 216, 72, 36,
  18 must appear; a submission that only shows percentages without
  converting to angles fails this).
  - PASS: REASONING.md is <=250 words and lists the angles `216, 72,
    36, 18, 18`.
  - PASS: the angles appear woven into a computation (`60% x 3.6 =
    216`).
  - FAIL: only percentages (`60%, 20%, ...`) appear, with no angle
    values 216/72/36/18.
  - FAIL: REASONING.md exceeds 250 words.
  - FAIL: REASONING.md is absent.

### Subjective guidance

- **Editorial design & visual hierarchy**: does this read as a
  finished editorial infographic (clear title, legend, source
  caption, a sensible reading order) rather than a bare chart? Reward
  a considered palette and typographic hierarchy; penalize a page that
  is just two default-styled charts side by side with no framing.
- **SVG craftsmanship & structural clarity**: is the markup clean and
  legible (sensible grouping, no redundant nesting, consistent
  formatting)? Does the piece make good use of the freedom left by the
  geometry contract (label placement, color coding between chart and
  legend, layout balance between the donut and bar sections)?
- **Reasoning quality**: does REASONING.md show genuine computation
  (percent -> angle -> endpoint) rather than restating the task, and
  does it note anything about the flag or arc-direction choice that
  shows the runner understood why it mattered?
