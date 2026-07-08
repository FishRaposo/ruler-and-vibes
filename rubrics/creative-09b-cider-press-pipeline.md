---
test: creative-09b-cider-press-pipeline
canary: "typhoon scoria"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "cidermap.svg is a valid self-contained SVG (viewBox=\"0 0 900 520\") that renders from file:// with no external references (no <script>/<image>/<foreignObject>/@import; every url(...)/href begins with '#')"
    - id: obj-2
      check: "Exactly seven <rect> nodes with ids stage-1..stage-7 exist, each width=140 and height=70 (judge parses attributes and matches; no eighth id-tagged stage rect)"
    - id: obj-3
      check: "No two stage rects overlap: the judge's AABB script over the seven (x,y) positions (w=140,h=70) reports zero overlapping pairs"
    - id: obj-4
      check: "Every stage is fully within the canvas with >=24px margin: 24 <= x and x+140 <= 876 and 24 <= y and y+70 <= 496 for all seven (judge checks each)"
    - id: obj-5
      check: "All six directed edges (1->2,2->3,3->4,4->5,5->6,6->7) are present as <line>/<path> connectors, an arrowhead <marker> is defined in <defs> and used via marker-end on the connectors, and each stage's label text appears in the file (judge greps for the marker def, a marker-end reference, and the seven label strings)"
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

If the phrase "typhoon scoria" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

Do not eyeball the layout — run the node script below against
`cidermap.svg` and read its output.

### Reference verification script (`verify-cidermap.js`) — run with `node verify-cidermap.js cidermap.svg`

```js
// Judge verification script: parses stage-1..stage-7 rects out of
// cidermap.svg, checks bounds/overlap, and greps for edges/marker/labels.
const fs = require('fs');

const file = process.argv[2];
if (!file) { console.error('Usage: node verify-cidermap.js cidermap.svg'); process.exit(1); }
const svg = fs.readFileSync(file, 'utf8');

const W = 140, H = 70;
const ids = ['stage-1', 'stage-2', 'stage-3', 'stage-4', 'stage-5', 'stage-6', 'stage-7'];

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

if (taggedCount !== 7) { console.log(`FAIL: expected exactly 7 id-tagged stage rects, found ${taggedCount}`); allOk = false; }

for (const id of ids) {
  const b = boxes[id];
  if (!b) { console.log(`${id}: NOT FOUND`); allOk = false; continue; }
  const wOk = b.w === W, hOk = b.h === H;
  const inBounds = 24 <= b.x && (b.x + W) <= 876 && 24 <= b.y && (b.y + H) <= 496;
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
console.log(`<line> count=${lineCount} <path> count=${pathCount} (need >=6 combined for 6 edges)`);
const edgesOk = (lineCount + pathCount) >= 6;
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

const labels = ['Wash Fruit', 'Mill Pulp', 'Press Juice', 'Pitch Yeast', 'Ferment Vat', 'Rack Clear', 'Bottle Batch'];
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
  stage-2(620,40), stage-3(620,168), stage-4(60,168), stage-5(60,296),
  stage-6(620,296), stage-7(620,424), all w=140 h=70. Zero pairwise
  overlaps; all in bounds (e.g. 620+140=760<=876; 424+70=494<=496; every
  x,y>=24 and inside the 876/496 ceilings). Running the script against
  this reference prints `NO OVERLAPS OK`, all seven stages `OK` on
  bounds/dimensions, `<line> count=6`, marker def found and used, all
  seven labels present, and `ALL CHECKS OK`, exit code 0.
- Author-verified degenerate case (all seven stages stacked in one
  column at x=380 with a 40px vertical step — smaller than the 70px box
  height): the script reports `OVERLAP between stage-1 and stage-2`
  through `OVERLAP between stage-6 and stage-7` (six overlapping pairs),
  prints `OVERLAP CHECK FAILED`, and exits with code 1 — confirming the
  overlap check actually catches a careless/naive vertical-list layout
  rather than passing everything by default.
- **obj-1**: grep for `<script`, `<image`, `<foreignObject`, `@import`;
  confirm every `url(...)`/`href` value starts with `#`. PASS: a single
  self-contained `<svg viewBox="0 0 900 520">` whose only `url(...)` is
  `url(#tip)` for the marker; PASS: fills reference `#`-prefixed gradient
  ids defined in `<defs>`; PASS: no external namespaces beyond the SVG
  root. FAIL: an `<image href="apples.png">` or `@import` in a `<style>`;
  FAIL: a `<script>` block toggling classes; FAIL: `marker-end` pointing
  at `url(https://…)` rather than a `#` id.
- **obj-2**: run the script; confirm exactly 7 tagged stage rects, each
  reporting `w=140 h=70`. PASS: seven rects `id="stage-1"`..`"stage-7"`
  all `width="140" height="70"`; PASS: extra non-stage decorative rects
  (e.g. a background panel) that carry no `stage-N` id — the script
  ignores them; PASS: stage ids in any source order as long as all seven
  are present with correct dimensions. FAIL: only six stage rects (script
  prints `expected exactly 7 id-tagged stage rects, found 6`); FAIL: a
  stage rect at `width="150"` or `height="60"`; FAIL: an eighth
  `id="stage-8"` rect (over-count).
- **obj-3**: run the script; confirm `NO OVERLAPS OK` with zero reported
  overlapping pairs. PASS: the reference serpentine with 420px column gap
  and 128px row pitch; PASS: a single horizontal/vertical row spaced so
  adjacent boxes never share interior area; PASS: a 2x4-style grid with
  spacing exceeding the box dimensions. FAIL: two stages sharing the same
  `(x,y)`; FAIL: a stacked column with vertical step < 70; FAIL: columns
  spaced < 140 apart so left/right boxes intrude on each other.
- **obj-4**: run the script; every stage line must show `inBounds=true`.
  PASS: all seven boxes with `24 <= x`, `x+140 <= 876`, `24 <= y`,
  `y+70 <= 496`; PASS: a box exactly at `x=24` or `y=426` (boundary
  inclusive); PASS: interior placements well clear of all four edges.
  FAIL: `x=20` (margin < 24); FAIL: `y=430` so `y+70=500 > 496`; FAIL: a
  box at `x=740` so `x+140=880 > 876`.
- **obj-5**: run the script; confirm `<line>`/`<path>` count >=6, a
  marker def is found, `marker-end` usage references that same def id,
  and all seven label strings are present verbatim. PASS: six `<line>`
  connectors each with `marker-end="url(#tip)"` and a `<marker id="tip">`
  in `<defs>`; PASS: six `<path>` connectors plus an extra decorative
  `<path>` (count still >=6); PASS: labels rendered as `<text>` matching
  the seven strings exactly. FAIL: only five edge connectors drawn; FAIL:
  a marker defined but never referenced by any `marker-end`; FAIL: a
  label misspelled as "Ferment Tank" so `Ferment Vat` is MISSING.
- **Diagram legibility & flow**: does the layout read clearly as a
  left-to-right or top-to-bottom pipeline, with edges that visually
  connect the correct stage pairs (not just six disconnected lines
  floating near the boxes)? Penalize layouts that satisfy the geometric
  predicate but visually obscure the 1->2->3->4->5->6->7 order (e.g.
  stages scattered with crossing, ambiguous connectors).
  - PASS: the reference-style serpentine (column A/B alternating down
    the canvas) reads unambiguously top-to-bottom, with each connector
    visibly touching its source/target stage; PASS: a single column or
    single row where stage-1..stage-7 appear in strict visual order.
  - FAIL: stages placed out of visual order (e.g. stage-6 sitting above
    stage-3) so the geometric checks pass but a viewer must trace labels
    to find the sequence; FAIL: a connector's line crosses through an
    unrelated stage box or appears to link the wrong pair of stages.
- **SVG layout craftsmanship**: is spacing deliberate and balanced (not
  just barely-legal placements hugging the margin), is the arrowhead
  marker sized/oriented sensibly, and is the markup organized clearly
  (grouped stages vs. edges, consistent styling)?
  - PASS: the ~420px column gap / 128px row pitch from the reference
    layout (or comparably generous spacing), stages and edges grouped
    into separate `<g>` blocks, a marker sized/oriented consistently
    with the connector stroke.
  - FAIL: stages placed at the bare 24px margin on every side with no
    visual breathing room, inconsistent fills/stroke widths across
    stages for no apparent reason, or an arrowhead marker pointing the
    wrong direction relative to its edge.
- **Reasoning quality**: if the model explains its layout choice (grid
  vs. serpentine vs. single row), does the explanation correctly connect
  the chosen coordinates to the non-overlap and margin constraints (e.g.,
  naming the row/column spacing that guarantees disjointness) rather than
  just asserting the layout is valid?
  - PASS: reasoning states the actual column/row spacing used (e.g.
    "columns 420px apart, rows 128px apart, both exceeding the 140x70
    stage box") and explains why that spacing prevents overlap while
    respecting the 24px margin.
  - FAIL: reasoning vaguely claims "no stages overlap" without citing
    real coordinates or spacing, or states spacing numbers that
    contradict the coordinates actually used in cidermap.svg.
