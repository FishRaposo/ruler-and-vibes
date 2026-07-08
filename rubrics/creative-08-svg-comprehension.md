---
test: creative-08-svg-comprehension
canary: "riverbend almanac"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "answers.json is valid JSON (node JSON.parse succeeds) with exactly the eight probe-point keys given in the task (as the exact string keys the task lists) and, for each, a value drawn from the allowed token set {red, green, blue, orange, background}"
    - id: obj-2
      check: "Isolated probes: (70,70) = red and (40,40) = background"
    - id: obj-3
      check: "R2 probes correct: (160,120) = green and the far-right (300,120) = green (NOT orange)"
    - id: obj-4
      check: "Three-plus-overlap probe: (130,180) = blue (covered by R1 and R3; R3 is later in document order and wins)"
    - id: obj-5
      check: "R4-on-top probes: (250,250), (370,310), and (210,270) all = orange"
  subjective:
    - id: sub-quality
      name: "Answer correctness completeness"
      weight: 0.4
    - id: sub-craft
      name: "Explanation of paint-order reasoning"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

If the phrase "riverbend almanac" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key — independently re-derived

Rects in document order (later paints on top): R1 red
(x50,y50,w200,h200 -> covers x in [50,250], y in [50,250]); R2 green
(x150,y100,w200,h200 -> x in [150,350], y in [100,300]); R3 blue
(x100,y150,w100,h100 -> x in [100,200], y in [150,250]); R4 orange
(x200,y200,w180,h120 -> x in [200,380], y in [200,320]).

Re-derived with an independent node script (AABB point-in-rect over
the fixed document order):

- `(70,70)` -> covered by [red] only -> **red**
- `(40,40)` -> covered by none -> **background**
- `(160,120)` -> covered by [red, green]; green is later -> **green**
- `(300,120)` -> covered by [green] only -> **green** (NOT orange —
  R4's y-range starts at 200, and 120<200, so R4 does not cover this
  point at all; a model guessing "far right = orange" fails here)
- `(130,180)` -> covered by **[red, blue] only** — IMPORTANT CORRECTION:
  R2 does NOT cover this point (R2's x-range starts at 150, and
  130<150), so the covering set is {R1, R3}, not {R1, R2, R3}. The
  answer is still **blue** (R3 is later than R1), but judges must not
  cite R2 as part of the covering set when evaluating a model's
  explanation.
- `(250,250)` -> covered by [red? no: R1 y-range ends at 250, boundary
  inclusive -> included; green, orange] — precisely: R1 covers (y=250
  is within [50,250] inclusive), R2 covers (x=250 in [150,350], y=250
  in [100,300]), R4 covers (x=250 in [200,380], y=250 in [200,320]); R4
  is last -> **orange**
- `(370,310)` -> covered by [orange] only -> **orange**
- `(210,270)` -> covered by [green, orange]; orange is later ->
  **orange**

Full verification script used (`verify-probes.js`):

```js
const rects = [
  { name: 'red', x: 50, y: 50, w: 200, h: 200 },     // R1
  { name: 'green', x: 150, y: 100, w: 200, h: 200 }, // R2
  { name: 'blue', x: 100, y: 150, w: 100, h: 100 },  // R3
  { name: 'orange', x: 200, y: 200, w: 180, h: 120 } // R4
];
function covers(r, x, y) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}
function topColorAt(x, y) {
  let top = 'background';
  const coveringNames = [];
  for (const r of rects) {
    if (covers(r, x, y)) { top = r.name; coveringNames.push(r.name); }
  }
  return { top, coveringNames };
}
const probes = [[70,70],[40,40],[160,120],[300,120],[130,180],[250,250],[370,310],[210,270]];
for (const [x, y] of probes) {
  const { top, coveringNames } = topColorAt(x, y);
  console.log(`(${x},${y}) covered by [${coveringNames.join(',') || 'none'}] -> top = ${top}`);
}
```

Run output (author-verified, node v24.16.0):
```
(70,70) covered by [red] -> top = red
(40,40) covered by [none] -> top = background
(160,120) covered by [red,green] -> top = green
(300,120) covered by [green] -> top = green
(130,180) covered by [red,blue] -> top = blue
(250,250) covered by [red,green,orange] -> top = orange
(370,310) covered by [orange] -> top = orange
(210,270) covered by [green,orange] -> top = orange
```

This matches every objective check above exactly; the full answer key
is: `{"(70,70)":"red","(40,40)":"background","(160,120)":"green",
"(300,120)":"green","(130,180)":"blue","(250,250)":"orange",
"(370,310)":"orange","(210,270)":"orange"}`.

- Seeded traps this test catches: (a) `(300,120)` tempts a "rightmost
  = last-drawn = orange" heuristic, but R4 does not reach y=120 at all
  (R4's y-range is [200,320]); the correct answer is green. (b)
  `(130,180)` tempts counting R2 as a covering rect because it looks
  central, but R2's x-range starts at 150 and 130<150 excludes it —
  the real covering set is {R1, R3} and the answer is blue via R3's
  later document position, not via any three-way tie-break.
- **obj-1**: `node -e "JSON.parse(require('fs').readFileSync('answers.json','utf8'))"`
  must not throw; confirm exactly the eight listed keys are present
  (no extras, no renamed keys) and every value is one of the five
  allowed lowercase tokens.
- **obj-2 through obj-5**: compare each submitted value against the
  run output above; any mismatch on a listed point fails that specific
  check.
- **Answer correctness completeness**: beyond the five grouped checks,
  does every one of the eight values match the key exactly? Full
  marks only if all eight are correct; partial credit for 6-7 correct
  with the two hardest traps (`(300,120)`, `(130,180)`) weighted most
  heavily since they distinguish real reasoning from guessing.
- **Explanation of paint-order reasoning**: if the submission includes
  any accompanying reasoning (comments in the JSON are disallowed, but
  a model may describe its method in its final message), does it
  correctly state the painter's-algorithm rule (last covering rect in
  document order wins) rather than a wrong heuristic like "largest
  rect wins" or "rightmost rect wins"?
- **Reasoning quality**: does the model's approach (if visible outside
  the JSON) show it checked coverage per-rectangle-boundary (using the
  actual x/y/width/height ranges) rather than eyeballing position on a
  mental sketch?
