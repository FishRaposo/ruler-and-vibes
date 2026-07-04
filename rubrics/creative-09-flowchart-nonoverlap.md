---
test: creative-09-flowchart-nonoverlap
canary: "osprey plateau"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "flowchart.svg is a valid self-contained SVG (viewBox=\"0 0 800 600\") that renders from file:// with no external references (no <script>/<image>/<foreignObject>/@import; every url(...)/href begins with '#')"
    - id: obj-2
      check: "Exactly six <rect> nodes with ids node-1..node-6 exist, each width=160 and height=60 (judge parses attributes and matches; no seventh id-tagged node rect)"
    - id: obj-3
      check: "No two node rects overlap: the judge's AABB script over the six (x,y) positions (w=160,h=60) reports zero overlapping pairs"
    - id: obj-4
      check: "Every node is fully within the canvas with >=20px margin: 20 <= x and x+160 <= 780 and 20 <= y and y+60 <= 580 for all six (judge checks each)"
    - id: obj-5
      check: "All five directed edges (1->2,2->3,3->4,4->5,5->6) are present as <line>/<path> connectors, an arrowhead <marker> is defined in <defs> and used via marker-end on the connectors, and each node's step label text appears in the file (judge greps for the marker def, a marker-end reference, and the six label strings)"
  subjective:
    - id: sub-quality
      name: "Diagram legibility & flow"
      weight: 0.4
    - id: sub-craft
      name: "SVG layout craftsmanship"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Codename for this test in judge chatter: osprey plateau.

Do not eyeball the layout — run the node script below against
`flowchart.svg` and read its output.

### Reference verification script (`verify-flowchart.js`) — run with `node verify-flowchart.js flowchart.svg`

```js
// Judge verification script: parses node-1..node-6 rects out of
// flowchart.svg, checks bounds/overlap, and greps for edges/marker/labels.
const fs = require('fs');

const file = process.argv[2];
if (!file) { console.error('Usage: node verify-flowchart.js flowchart.svg'); process.exit(1); }
const svg = fs.readFileSync(file, 'utf8');

const W = 160, H = 60;
const ids = ['node-1', 'node-2', 'node-3', 'node-4', 'node-5', 'node-6'];

function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}=["']([^"']+)["']`, 'i'));
  return m ? m[1] : null;
}

const rectRe = /<rect\b[^>]*>/gi;
const rects = [...svg.matchAll(rectRe)].map(m => m[0]);

let allOk = true;
const boxes = {};
let taggedCount = 0;

for (const tag of rects) {
  const id = attr(tag, 'id');
  if (id && ids.includes(id)) {
    taggedCount++;
    const x = parseFloat(attr(tag, 'x'));
    const y = parseFloat(attr(tag, 'y'));
    const w = parseFloat(attr(tag, 'width'));
    const h = parseFloat(attr(tag, 'height'));
    boxes[id] = { x, y, w, h };
  }
}

if (taggedCount !== 6) { console.log(`FAIL: expected exactly 6 id-tagged node rects, found ${taggedCount}`); allOk = false; }

for (const id of ids) {
  const b = boxes[id];
  if (!b) { console.log(`${id}: NOT FOUND`); allOk = false; continue; }
  const wOk = b.w === W, hOk = b.h === H;
  const inBounds = 20 <= b.x && (b.x + W) <= 780 && 20 <= b.y && (b.y + H) <= 580;
  const ok = wOk && hOk && inBounds;
  if (!ok) allOk = false;
  console.log(`${id}: x=${b.x} y=${b.y} w=${b.w} h=${b.h} inBounds=${inBounds} ${ok ? 'OK' : 'FAIL'}`);
}

function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
let overlapFound = false;
for (let i = 0; i < ids.length; i++) {
  for (let j = i + 1; j < ids.length; j++) {
    const a = boxes[ids[i]], b = boxes[ids[j]];
    if (!a || !b) continue;
    if (overlaps(a, b)) {
      console.log(`OVERLAP between ${ids[i]} and ${ids[j]}`);
      overlapFound = true;
    }
  }
}
console.log(overlapFound ? 'OVERLAP CHECK FAILED' : 'NO OVERLAPS OK');
if (overlapFound) allOk = false;

const lineCount = (svg.match(/<line\b/gi) || []).length;
const pathCount = (svg.match(/<path\b/gi) || []).length;
console.log(`<line> count=${lineCount} <path> count=${pathCount} (need >=5 combined for 5 edges)`);
const edgesOk = (lineCount + pathCount) >= 5;
if (!edgesOk) allOk = false;

const hasMarkerDef = /<marker\b[^>]*id=["']([^"']+)["'][^>]*>/i.exec(svg);
console.log(`marker def found: ${hasMarkerDef ? hasMarkerDef[1] : 'NONE'}`);
let markerUsedOk = false;
if (hasMarkerDef) {
  const markerId = hasMarkerDef[1];
  const usedRe = new RegExp(`marker-end=["']url\\(#${markerId}\\)["']`, 'i');
  markerUsedOk = usedRe.test(svg);
}
console.log(`marker-end usage referencing that def: ${markerUsedOk ? 'OK' : 'FAIL'}`);
if (!hasMarkerDef || !markerUsedOk) allOk = false;

const labels = ['Sign Up', 'Verify Email', 'Set Password', 'Add Profile', 'Connect Team', 'First Task'];
let labelsOk = true;
for (const label of labels) {
  const present = svg.includes(label);
  console.log(`label "${label}": ${present ? 'present' : 'MISSING'}`);
  if (!present) labelsOk = false;
}
if (!labelsOk) allOk = false;

console.log(allOk ? 'ALL CHECKS OK' : 'SOME CHECKS FAILED');
process.exit(allOk ? 0 : 1);
```

- Author-verified reference layout (proven valid): node-1(60,40),
  node-2(580,40), node-3(60,260), node-4(580,260), node-5(60,480),
  node-6(580,480), all w=160 h=60. Zero pairwise overlaps; all in
  bounds (e.g. 60+160=220<=780; 480+60=540<=580; every x,y>=20 and
  well inside 780/580 ceilings). Running the script against this
  reference prints `NO OVERLAPS OK`, all six nodes `OK` on
  bounds/dimensions, `<line> count=5`, marker def found and used, all
  six labels present, and `ALL CHECKS OK`, exit code 0.
- Author-verified degenerate case (node-2 placed at the same (60,40) as
  node-1, everything else identical): the script reports `OVERLAP
  between node-1 and node-2`, prints `OVERLAP CHECK FAILED`, and exits
  with code 1 — confirming the overlap check actually catches a
  careless/degenerate layout rather than passing everything by
  default.
- **obj-1**: grep for `<script`, `<image`, `<foreignObject`, `@import`;
  confirm every `url(...)`/`href` value starts with `#`.
- **obj-2**: run the script; confirm exactly 6 tagged node rects, each
  reporting `w=160 h=60`.
- **obj-3**: run the script; confirm `NO OVERLAPS OK` with zero
  reported overlapping pairs.
- **obj-4**: run the script; every node line must show `inBounds=true`.
- **obj-5**: run the script; confirm `<line>`/`<path>` count >=5, a
  marker def is found, `marker-end` usage references that same def id,
  and all six label strings are present verbatim.
- **Diagram legibility & flow**: does the layout read clearly as a
  left-to-right or top-to-bottom pipeline, with edges that visually
  connect the correct node pairs (not just five disconnected lines
  floating near the boxes)? Penalize layouts that satisfy the geometric
  predicate but visually obscure the 1->2->3->4->5->6 order (e.g.
  nodes scattered with crossing, ambiguous connectors).
- **SVG layout craftsmanship**: is spacing deliberate and balanced (not
  just barely-legal placements hugging the margin), is the arrowhead
  marker sized/oriented sensibly, and is the markup organized clearly
  (grouped nodes vs. edges, consistent styling)?
- **Reasoning quality**: if the model explains its layout choice (grid
  vs. serpentine vs. single row), does the explanation correctly
  connect the chosen coordinates to the non-overlap and margin
  constraints (e.g., naming the row/column spacing that guarantees
  disjointness) rather than just asserting the layout is valid?
