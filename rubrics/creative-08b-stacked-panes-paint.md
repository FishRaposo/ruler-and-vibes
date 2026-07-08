---
test: creative-08b-stacked-panes-paint
canary: "sirocco chert"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "answers.json is valid JSON (node JSON.parse succeeds) with exactly the eight probe-point keys given in the task (as the exact string keys the task lists) and, for each, a value drawn from the allowed token set {crimson, teal, gold, violet, background}"
    - id: obj-2
      check: "Isolated probes: (70,90) = crimson and (30,30) = background"
    - id: obj-3
      check: "S2 probes correct: (160,80) = teal and the far-right (280,90) = teal (NOT violet)"
    - id: obj-4
      check: "Three-plus-overlap probe: (110,190) = gold (covered by S1 and S3; S3 is later in document order and wins)"
    - id: obj-5
      check: "S4-on-top probes: (220,220), (320,280), and (210,200) all = violet"
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

Parallel form of `creative-08-svg-comprehension` (same construct, fresh
surface).

If the phrase "sirocco chert" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key — independently re-derived

Rects in document order (later paints on top): S1 crimson
(x40,y60,w180,h160 -> covers x in [40,220], y in [60,220]); S2 teal
(x130,y40,w170,h190 -> x in [130,300], y in [40,230]); S3 gold
(x90,y120,w90,h90 -> x in [90,180], y in [120,210]); S4 violet
(x190,y180,w150,h130 -> x in [190,340], y in [180,310]).

Re-derived with an independent node script (AABB point-in-rect over
the fixed document order):

- `(70,90)` -> covered by [crimson] only -> **crimson**
- `(30,30)` -> covered by none -> **background**
- `(160,80)` -> covered by [crimson, teal]; teal is later -> **teal**
- `(280,90)` -> covered by [teal] only -> **teal** (NOT violet —
  S4's y-range starts at 180, and 90<180, so S4 does not cover this
  point at all; a model guessing "far right = violet" fails here)
- `(110,190)` -> covered by **[crimson, gold] only** — IMPORTANT NOTE:
  S2 does NOT cover this point (S2's x-range starts at 130, and
  110<130), so the covering set is {S1, S3}, not {S1, S2, S3}. The
  answer is still **gold** (S3 is later than S1), but judges must not
  cite S2 as part of the covering set when evaluating a model's
  explanation.
- `(220,220)` -> covered by [crimson, teal, violet] — precisely: S1
  covers (x=220 is on its inclusive right edge 40+180=220, y=220 is on
  its inclusive bottom edge 60+160=220), S2 covers (x=220 in [130,300],
  y=220 in [40,230]), S4 covers (x=220 in [190,340], y=220 in
  [180,310]); S4 is last -> **violet**
- `(320,280)` -> covered by [violet] only -> **violet**
- `(210,200)` -> covered by [crimson, teal, violet]; violet is later ->
  **violet**

Full verification script used (`verify-probes.js`):

```js
const rects = [
  { name: 'crimson', x: 40,  y: 60,  w: 180, h: 160 }, // S1
  { name: 'teal',    x: 130, y: 40,  w: 170, h: 190 }, // S2
  { name: 'gold',    x: 90,  y: 120, w: 90,  h: 90  }, // S3
  { name: 'violet',  x: 190, y: 180, w: 150, h: 130 }  // S4
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
const probes = [[70,90],[30,30],[160,80],[280,90],[110,190],[220,220],[320,280],[210,200]];
for (const [x, y] of probes) {
  const { top, coveringNames } = topColorAt(x, y);
  console.log(`(${x},${y}) covered by [${coveringNames.join(',') || 'none'}] -> top = ${top}`);
}
```

Run output (author-verified, node v24.16.0):
```
(70,90) covered by [crimson] -> top = crimson
(30,30) covered by [none] -> top = background
(160,80) covered by [crimson,teal] -> top = teal
(280,90) covered by [teal] -> top = teal
(110,190) covered by [crimson,gold] -> top = gold
(220,220) covered by [crimson,teal,violet] -> top = violet
(320,280) covered by [violet] -> top = violet
(210,200) covered by [crimson,teal,violet] -> top = violet
```

This matches every objective check above exactly; the full answer key
is: `{"(70,90)":"crimson","(30,30)":"background","(160,80)":"teal",
"(280,90)":"teal","(110,190)":"gold","(220,220)":"violet",
"(320,280)":"violet","(210,200)":"violet"}`.

- Seeded traps this test catches: (a) `(280,90)` tempts a "rightmost
  = last-drawn = violet" heuristic, but S4 does not reach y=90 at all
  (S4's y-range is [180,310]); the correct answer is teal. (b)
  `(110,190)` tempts counting S2 as a covering rect because it looks
  central, but S2's x-range starts at 130 and 110<130 excludes it —
  the real covering set is {S1, S3} and the answer is gold via S3's
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
  with the two hardest traps (`(280,90)`, `(110,190)`) weighted most
  heavily since they distinguish real reasoning from guessing.
- **Explanation of paint-order reasoning**: if the submission includes
  any accompanying reasoning (comments in the JSON are disallowed, but
  a model may describe its method in its final message), does it
  correctly state the painter's-algorithm rule (last covering rect in
  document order wins) rather than a wrong heuristic like "largest
  rect wins" or "rightmost rect wins"?
  PASS examples: "the last covering rect in document order wins";
  "S4 is drawn last so it wins wherever it overlaps, but only where it
  actually covers the point". FAIL examples: "the largest rect shows
  through"; "the most recently added rect always wins everywhere on
  the canvas".
- **Reasoning quality**: does the model's approach (if visible outside
  the JSON) show it checked coverage per-rectangle-boundary (using the
  actual x/y/width/height ranges) rather than eyeballing position on a
  mental sketch?
  PASS examples: explicit interval checks like "110 < 130 so S2 does
  not cover" or "90 < 180 so S4 does not reach this row". FAIL
  examples: "it's near the middle so all three overlap"; "it's in the
  bottom-right so violet" with no boundary arithmetic.
