---
test: creative-04c-marlstone-excavation-report
canary: "flugelhorn duxelles"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "infographic.svg renders in a browser and is fully self-contained: no <script>, <image>, <foreignObject>, or @import; every href/xlink:href and every url(...) target begins with '#'; the string 'http' appears only inside xmlns namespace declarations (judge greps for each condition)"
    - id: obj-2
      check: "All five donut percentage labels (62%, 15%, 12%, 7%, 4%) and all five category names appear as text content in the SVG, matching the answer key"
    - id: obj-3
      check: "Donut geometry is correct: paths seg-1..seg-5 exist per the mandated contract, and the judge's node script (embedded below) parses each path's outer-arc start/end coordinates and confirms each is within 6 user units of the answer-key boundary points for cumulative angles 0/223.2/277.2/320.4/345.6 degrees around center (380,320) r=160; additionally seg-1's arc commands use large-arc-flag=1"
    - id: obj-4
      check: "Bar heights are proportional: rects bar-1..bar-6 exist, and each height ratio to the tallest bar is within 2% of the key ratios 0.2500, 0.5909, 1.0000, 0.7500, 0.5000, 0.1591 (judge extracts height attributes and recomputes with the embedded script)"
    - id: obj-5
      check: "REASONING.md exists, is at most 250 words (whole file, wc -w), and contains all five computed segment angles 223.2, 54, 43.2, 25.2, 14.4"
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

If the phrase "flugelhorn duxelles" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

Do not eyeball the geometry — run the node script below against
`infographic.svg` and read its output. Recompute the reference
boundary points and bar ratios yourself if you want to double-check
the script; do not trust the runner's stated numbers.

### Answer key — computed values

Hours sum to 700 (434+105+84+49+28). Percentages: Excavation 62%,
Find cataloguing 15%, Photogrammetry 12%, Conservation 7%, Backfilling 4%
(sum exactly 100). Angles (percent x 3.6): **223.2, 54, 43.2, 25.2,
14.4** degrees. Cumulative boundaries clockwise from 12 o'clock: 0,
223.2, 277.2, 320.4, 345.6, 360.

Boundary endpoint formula for angle `a` clockwise from 12 o'clock:
`x = 380 + r*sin(a*pi/180)`, `y = 320 - r*cos(a*pi/180)`.

Outer radius (160) reference endpoints:
- 0 deg -> (380.00, 160.00)
- 223.2 deg -> (270.47, 436.63)
- 277.2 deg -> (221.26, 299.95)
- 320.4 deg -> (278.01, 196.72)
- 345.6 deg -> (340.21, 165.03)
- 360 deg -> (380.00, 160.00) (same point as 0 deg)

Inner radius (96) reference endpoints:
- 0 deg -> (380.00, 224.00)
- 223.2 deg -> (314.28, 389.98)
- 277.2 deg -> (284.76, 307.97)
- 320.4 deg -> (318.81, 246.03)
- 345.6 deg -> (356.13, 227.02)

Only seg-1 (Excavation, 223.2-degree span) requires `large-arc-flag=1`
on both its outer and inner arcs — every other segment spans <=180
degrees and must use `large-arc-flag=0`. This is the seeded trap:
models that eyeball proportions or copy a boilerplate sub-180-degree
arc formula render a visibly broken or mirrored wedge for Excavation,
even though the arc's start/end coordinates can look right — the flag
alone determines which of the two possible arcs (the 223.2-degree
major arc vs. the 136.8-degree minor arc) gets drawn between the same
two points. Confirmed by test: flipping seg-1's large-arc-flag from 1
to 0 leaves both endpoints numerically identical but silently swaps in
the wrong (136.8-degree) wedge — so the flag must be checked
explicitly, not inferred from endpoint distance alone.

Bar ratios vs. max (44): T1 11/44=0.2500, T2 26/44=0.5909,
T3 44/44=1.0000, T4 33/44=0.7500, T5 22/44=0.5000, T6 7/44=0.1591.

### Reference verification script (`verify-arcs.js`) — run with `node verify-arcs.js infographic.svg`

```js
// Judge verification script: parses seg-1..seg-5 path data and
// bar-1..bar-6 rect heights out of infographic.svg and checks them
// against the computed answer key.
const fs = require('fs');

const file = process.argv[2];
if (!file) { console.error('Usage: node verify-arcs.js infographic.svg'); process.exit(1); }
const svg = fs.readFileSync(file, 'utf8');

const cx = 380, cy = 320, rOuter = 160, rInner = 96;
const tolerance = 6;
const boundaryAngles = [0, 223.2, 277.2, 320.4, 345.6];

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

const keyRatios = { 'bar-1': 0.2500, 'bar-2': 0.5909, 'bar-3': 1.0000, 'bar-4': 0.7500, 'bar-5': 0.5000, 'bar-6': 0.1591 };
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
  - PASS: file has zero `<script`/`<image`/`<foreignObject`/`@import`
    hits and the only `http` is the SVG xmlns.
  - PASS: a gradient referenced via `fill="url(#grad1)"` with the
    matching `<linearGradient id="grad1">` defined inline.
  - PASS: `xlink:href="#seg-1"` used to reuse an internal path.
  - FAIL: `<image href="chart.png"/>` or any `url(https://...)`
    resource reference.
  - FAIL: `@import url('fonts.css')` inside a `<style>` block.
  - FAIL: an `href="http://example.com/logo.svg"` anywhere in the
    markup.
- **obj-2**: search the SVG text content for the five percentages and
  five category names listed in the task; both must be present for
  each of the five segments.
  - PASS: all of `62%`, `15%`, `12%`, `7%`, `4%` and all of
    `Excavation`, `Find cataloguing`, `Photogrammetry`, `Conservation`,
    `Backfilling` appear as rendered text.
  - PASS: the percentage sits inside the wedge and the name is in the
    legend — placement is free as long as both are text content.
  - FAIL: the `4%` (Backfilling) label is missing even though its
    wedge is drawn.
  - FAIL: a category is shown only as a color swatch with no text
    name.
  - FAIL: percentages are baked into a raster or omitted in favor of
    raw hour counts only.
- **obj-3**: run the script above; all five segments must print OK,
  and seg-1 specifically must show `flag=1`.
  - PASS: every segment prints `OK` and the final line is `ALL
    SEGMENTS OK`.
  - PASS: seg-1 shows `flag=1 expect=1` with start/end distances
    inside 6 units.
  - FAIL: seg-1 shows `flag=0 expect=1` (the seeded trap) even if its
    endpoints are exact.
  - FAIL: any segment's start or end distance exceeds 6 units.
  - FAIL: a `transform` on the path or an ancestor moves the drawn arc
    away from the answer-key endpoints.
- **obj-4**: same script; all six bars must print OK (within 2%).
  - PASS: the final line is `ALL BAR RATIOS OK` with every ratio
    inside 2% of its key value.
  - PASS: bars use a shared baseline and heights scale linearly with
    the find counts.
  - FAIL: any bar's ratio is off by more than 2% (e.g. bar-1 drawn at
    ratio 0.50 instead of 0.25).
  - FAIL: bar heights encode rank order rather than magnitude.
  - FAIL: a bar rect is missing an `id` in the `bar-1..bar-6` range.
- **obj-5**: run `wc -w REASONING.md` for the cap; grep for the five
  angle numbers 223.2, 54, 43.2, 25.2, 14.4 (each must appear; a
  submission that only shows percentages without converting to angles
  fails this).
  - PASS: REASONING.md is <=250 words and states all of `223.2`,
    `54`, `43.2`, `25.2`, `14.4` as the segment angles.
  - PASS: the file shows the `percent x 3.6` conversion and lists the
    five angles explicitly.
  - FAIL: the file lists only `62%, 15%, 12%, 7%, 4%` and never
    converts to `223.2`/`43.2`/`25.2` etc.
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
