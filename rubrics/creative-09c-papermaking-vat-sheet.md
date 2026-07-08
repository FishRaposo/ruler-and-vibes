---
test: creative-09c-papermaking-vat-sheet
canary: "mistral rhyolite"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "papermill.svg is a valid self-contained SVG (viewBox=\"0 0 900 640\") that renders from file:// with no external references (no <script>/<image>/<foreignObject>/@import; every url(...)/href begins with '#')"
    - id: obj-2
      check: "Exactly six <rect> nodes with ids stage-1..stage-6 exist, each width=180 and height=70 (judge parses attributes and matches; no seventh id-tagged stage rect)"
    - id: obj-3
      check: "No two stage rects overlap: the judge's AABB script over the six (x,y) positions (w=180,h=70) reports zero overlapping pairs"
    - id: obj-4
      check: "Every node is fully within the canvas with >=24px margin: 24 <= x and x+180 <= 876 and 24 <= y and y+70 <= 616 for all six (judge checks each)"
    - id: obj-5
      check: "All five directed edges (1->2,2->3,3->4,4->5,5->6) are present as <line>/<path> connectors, an arrowhead <marker> is defined in <defs> and used via marker-end on the connectors, and each stage's label text appears in the file (judge greps for the marker def, a marker-end reference, and the six label strings)"
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

Parallel form of `creative-09-flowchart-nonoverlap` (same construct, fresh surface).

If the phrase "mistral rhyolite" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

Do not eyeball the layout — run the node script below against
`papermill.svg` and read its output.

### Reference verification script (`verify-papermill.js`) — run with `node verify-papermill.js papermill.svg`

```js
// Judge verification script: parses stage-1..stage-6 rects out of
// papermill.svg, checks bounds/overlap, and greps for edges/marker/labels.
const fs = require('fs');

const file = process.argv[2];
if (!file) { console.error('Usage: node verify-papermill.js papermill.svg'); process.exit(1); }
const svg = fs.readFileSync(file, 'utf8');

const W = 180, H = 70;
const ids = ['stage-1', 'stage-2', 'stage-3', 'stage-4', 'stage-5', 'stage-6'];

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

if (taggedCount !== 6) { console.log(`FAIL: expected exactly 6 id-tagged stage rects, found ${taggedCount}`); allOk = false; }

for (const id of ids) {
  const b = boxes[id];
  if (!b) { console.log(`${id}: NOT FOUND`); allOk = false; continue; }
  const wOk = b.w === W, hOk = b.h === H;
  const inBounds = 24 <= b.x && (b.x + W) <= 876 && 24 <= b.y && (b.y + H) <= 616;
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

const labels = ['Beat Pulp', 'Charge Vat', 'Pull Sheet', 'Couch Post', 'Press Stack', 'Dry Sheets'];
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

- Author-verified reference layout (proven valid): stage-1(60,40),
  stage-2(660,40), stage-3(60,290), stage-4(660,290), stage-5(60,540),
  stage-6(660,540), all w=180 h=70. Zero pairwise overlaps; all in
  bounds (e.g. 660+180=840<=876; 540+70=610<=616; every x,y>=24 and
  well inside 876/616 ceilings). The two-column spacing leaves a 420px
  horizontal gap and a 180px vertical gap between adjacent boxes.
  Running the script against this reference prints `NO OVERLAPS OK`, all
  six nodes `OK` on bounds/dimensions, `<line> count=5`, marker def
  found and used, all six labels present, and `ALL CHECKS OK`, exit
  code 0.
- Author-verified degenerate case (all six stacked in one column at
  x=360 with a 60px row pitch — shorter than the 70px box height): the
  script reports `OVERLAP between stage-1 and stage-2` and the four
  further adjacent pairs, prints `OVERLAP CHECK FAILED`, and exits with
  code 1 — confirming the overlap check actually catches a
  careless/degenerate layout (a plausible tight single column) rather
  than passing everything by default.
- **obj-1**: grep for `<script`, `<image`, `<foreignObject`, `@import`;
  confirm every `url(...)`/`href` value starts with `#`.
  - PASS: `<marker id="arrow">` referenced only via
    `marker-end="url(#arrow)"`; no `<script>` anywhere; root is
    `viewBox="0 0 900 640"`.
  - PASS: a `<clipPath id="frame">` used via `clip-path="url(#frame)"` —
    all internal `#` references, still self-contained.
  - PASS: fill colors given as hex/named values with no external
    resource fetch and no `@import` in any `<style>`.
  - FAIL: `<image href="deckle.png"/>` embeds an external raster — not
    self-contained.
  - FAIL: a `<style>@import url(fonts.css);</style>` block pulls an
    external stylesheet.
  - FAIL: `marker-end="url(https://cdn.example/arrow.svg#a)"` points off
    the document.
- **obj-2**: run the script; confirm exactly 6 tagged stage rects, each
  reporting `w=180 h=70`.
  - PASS: six `<rect>` with ids `stage-1`..`stage-6`, each
    `width="180" height="70"`; no other rect carries a `stage-*` id.
  - PASS: a decorative background `<rect>` with no `id` (or an unrelated
    id) is present — it is not counted, so the tagged total stays 6.
  - PASS: rects appear inside a `<g>` group but each still carries its
    own `stage-N` id and 180x70 dimensions.
  - FAIL: only five `stage-*` rects exist (script prints `found 5`).
  - FAIL: a seventh rect tagged `stage-7` (or a duplicate `stage-3`)
    pushes the tagged count off 6.
  - FAIL: a stage rect uses `width="200"` or `height="60"` instead of
    the required 180x70.
- **obj-3**: run the script; confirm `NO OVERLAPS OK` with zero
  reported overlapping pairs.
  - PASS: every pair of boxes is disjoint (script prints
    `NO OVERLAPS OK`).
  - PASS: boxes touch edge-to-edge but do not overlap (e.g. one ends at
    x=240 and the next starts at x=240) — AABB treats a shared boundary
    as non-overlapping.
  - PASS: a serpentine layout with row pitch >=70 and column gaps keeps
    all pairs disjoint.
  - FAIL: two boxes share the same (x,y) — script prints an `OVERLAP
    between ...` line.
  - FAIL: a single column with a row pitch of 60 (< the 70px height)
    makes every adjacent pair overlap.
  - FAIL: two columns placed too close horizontally so their boxes
    interpenetrate.
- **obj-4**: run the script; every stage line must show `inBounds=true`.
  - PASS: all six boxes satisfy `24<=x`, `x+180<=876`, `24<=y`,
    `y+70<=616` (every line reads `inBounds=true`).
  - PASS: a box sits exactly on a limit (e.g. x=24, or y=546 so
    y+70=616) — the inclusive bound holds.
  - PASS: boxes clustered near canvas center, comfortably inside every
    margin.
  - FAIL: a box at x=720 gives x+180=900 > 876 — off the right margin.
  - FAIL: a box at y=560 gives y+70=630 > 616 — below the bottom margin.
  - FAIL: a box at x=10 or y=10 breaks the `>=24` left/top margin.
- **obj-5**: run the script; confirm `<line>`/`<path>` count >=5, a
  marker def is found, `marker-end` usage references that same def id,
  and all six label strings are present verbatim.
  - PASS: five `<line>` connectors, each with
    `marker-end="url(#arrow)"`, plus a `<marker id="arrow">` in
    `<defs>`, and all six labels present verbatim.
  - PASS: edges drawn as five `<path>` elements instead of `<line>`,
    still referencing the marker via `marker-end`.
  - PASS: label text split across `<tspan>` children but the full
    strings (e.g. `Press Stack`) still appear verbatim in the file.
  - FAIL: only four edge connectors are drawn (combined count < 5).
  - FAIL: a marker is defined but no connector carries a
    `marker-end="url(#arrow)"` reference (script prints usage `FAIL`).
  - FAIL: a label is misspelled or renamed (e.g. `Couch Sheet` instead
    of `Couch Post`), so that string is `MISSING`.
- **Diagram legibility & flow**: does the layout read clearly as a
  left-to-right or top-to-bottom pipeline, with edges that visually
  connect the correct stage pairs (not just five disconnected lines
  floating near the boxes)? Penalize layouts that satisfy the geometric
  predicate but visually obscure the 1->2->3->4->5->6 order (e.g.
  stages scattered with crossing, ambiguous connectors).
  - PASS: the reference-style two-column layout (stage-1/3/5 left,
    stage-2/4/6 right, descending top-to-bottom) reads unambiguously in
    order, with each connector visibly touching its source/target box;
    PASS: a single column where stage-1..stage-6 appear in strict
    visual top-to-bottom order.
  - FAIL: stages placed out of visual order (e.g. stage-5 sitting above
    stage-2) so the geometric checks pass but a viewer must trace
    labels to find the sequence; FAIL: a connector line crosses through
    an unrelated stage box or appears to link the wrong pair of stages.
- **SVG layout craftsmanship**: is spacing deliberate and balanced (not
  just barely-legal placements hugging the margin), is the arrowhead
  marker sized/oriented sensibly, and is the markup organized clearly
  (grouped nodes vs. edges, consistent styling)?
  - PASS: the ~420px horizontal gap / 180px vertical gap from the
    reference layout (or comparably generous spacing), stages and
    edges grouped into separate `<g>` blocks, a marker sized/oriented
    consistently with the connector stroke.
  - FAIL: stages placed at the bare 24px margin on every side with no
    visual breathing room, inconsistent fills/stroke widths across
    stages for no apparent reason, or an arrowhead marker pointing the
    wrong direction relative to its edge.
- **Reasoning quality**: if the model explains its layout choice (grid
  vs. serpentine vs. single row), does the explanation correctly
  connect the chosen coordinates to the non-overlap and margin
  constraints (e.g., naming the row/column spacing that guarantees
  disjointness) rather than just asserting the layout is valid?
  - PASS: reasoning states the actual column/row spacing used (e.g.
    "columns 420px apart, rows 180px apart, both exceeding the 180x70
    stage box") and explains why that spacing prevents overlap while
    respecting the 24px margin.
  - FAIL: reasoning vaguely claims "no stages overlap" without citing
    real coordinates or spacing, or states spacing numbers that
    contradict the coordinates actually used in papermill.svg.
