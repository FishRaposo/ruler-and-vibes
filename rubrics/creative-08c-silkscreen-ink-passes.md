---
test: creative-08c-silkscreen-ink-passes
canary: "monsoon flint"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "answers.json is valid JSON (node JSON.parse succeeds) with exactly the eight probe-point keys given in the task (as the exact string keys the task lists) and, for each, a value drawn from the allowed token set {teal, gold, purple, crimson, background}"
    - id: obj-2
      check: "Isolated probes: (90,70) = teal and (30,30) = background"
    - id: obj-3
      check: "P2 probes correct: (180,130) = gold and the far-right (310,150) = gold (NOT crimson)"
    - id: obj-4
      check: "Boundary-excluded overlap probe: (128,185) = purple (covered by P1 and P3; P3 is later in document order and wins)"
    - id: obj-5
      check: "P4-on-top probes: (250,250), (365,325), and (215,285) all = crimson"
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

If the phrase "monsoon flint" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key — independently re-derived

Passes in document order (later paints on top): P1 teal
(x60,y40,w190,h210 -> covers x in [60,250], y in [40,250]); P2 gold
(x140,y110,w210,h180 -> x in [140,350], y in [110,290]); P3 purple
(x110,y160,w90,h110 -> x in [110,200], y in [160,270]); P4 crimson
(x210,y210,w170,h130 -> x in [210,380], y in [210,340]).

Re-derived with an independent node script (AABB point-in-rect over
the fixed document order):

- `(90,70)` -> covered by [teal] only -> **teal**
- `(30,30)` -> covered by none -> **background**
- `(180,130)` -> covered by [teal, gold]; gold is later -> **gold**
- `(310,150)` -> covered by [gold] only -> **gold** (NOT crimson —
  P4's y-range starts at 210, and 150<210, so P4 does not cover this
  point at all; a model guessing "far right = last pass = crimson"
  fails here)
- `(128,185)` -> covered by **[teal, purple] only** — NOTE: P2 (gold)
  does NOT cover this point (P2's x-range starts at 140, and 128<140),
  so the covering set is {P1, P3}, not {P1, P2, P3}. The answer is
  still **purple** (P3 is later than P1), but judges must not cite P2
  as part of the covering set when evaluating a model's explanation.
- `(250,250)` -> covered by [teal, gold, crimson] — precisely: P1 (teal)
  covers (x=250 is the right edge of [60,250] inclusive, y=250 is the
  bottom edge of [40,250] inclusive), P2 (gold) covers (x=250 in
  [140,350], y=250 in [110,290]), P4 (crimson) covers (x=250 in
  [210,380], y=250 in [210,340]); P4 is last -> **crimson**
- `(365,325)` -> covered by [crimson] only -> **crimson**
- `(215,285)` -> covered by [gold, crimson]; crimson is later ->
  **crimson**

Full verification script used (`verify-probes.js`):

```js
const rects = [
  { name: 'teal', x: 60, y: 40, w: 190, h: 210 },     // P1
  { name: 'gold', x: 140, y: 110, w: 210, h: 180 },   // P2
  { name: 'purple', x: 110, y: 160, w: 90, h: 110 },  // P3
  { name: 'crimson', x: 210, y: 210, w: 170, h: 130 } // P4
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
const probes = [[90,70],[30,30],[180,130],[310,150],[128,185],[250,250],[365,325],[215,285]];
for (const [x, y] of probes) {
  const { top, coveringNames } = topColorAt(x, y);
  console.log(`(${x},${y}) covered by [${coveringNames.join(',') || 'none'}] -> top = ${top}`);
}
```

Run output (author-verified, node v24.16.0):
```
(90,70) covered by [teal] -> top = teal
(30,30) covered by [none] -> top = background
(180,130) covered by [teal,gold] -> top = gold
(310,150) covered by [gold] -> top = gold
(128,185) covered by [teal,purple] -> top = purple
(250,250) covered by [teal,gold,crimson] -> top = crimson
(365,325) covered by [crimson] -> top = crimson
(215,285) covered by [gold,crimson] -> top = crimson
```

This matches every objective check above exactly; the full answer key
is: `{"(90,70)":"teal","(30,30)":"background","(180,130)":"gold",
"(310,150)":"gold","(128,185)":"purple","(250,250)":"crimson",
"(365,325)":"crimson","(215,285)":"crimson"}`.

- Seeded traps this test catches: (a) `(310,150)` tempts a "rightmost
  = last-pulled = crimson" heuristic, but P4 does not reach y=150 at all
  (P4's y-range is [210,340]); the correct answer is gold. (b)
  `(128,185)` tempts counting P2 (gold) as a covering pass because the
  point looks central, but P2's x-range starts at 140 and 128<140
  excludes it — the real covering set is {P1, P3} and the answer is
  purple via P3's later document position, not via any three-way
  tie-break.

- **obj-1**: `node -e "JSON.parse(require('fs').readFileSync('answers.json','utf8'))"`
  must not throw; confirm exactly the eight listed keys are present
  (no extras, no renamed keys) and every value is one of the five
  allowed lowercase tokens.
  PASS examples: all eight task keys present with values only from
  {teal, gold, purple, crimson, background}; keys quoted exactly as
  `"(90,70)"` etc.; a flat object with no ninth key.
  FAIL examples: a value of `"white"` or `"paper"` for `(30,30)`
  instead of `"background"`; an extra key such as `"(99,99)"` added;
  a key renamed to `"90,70"` (parentheses dropped) so a listed key is
  missing.
- **obj-2 through obj-5**: compare each submitted value against the
  run output above; any mismatch on a listed point fails that specific
  check.
- **obj-2 (isolated probes)**: PASS — `(90,70)`→teal and
  `(30,30)`→background; PASS — both single-coverage points named
  correctly with no over-claim of a covering pass at `(30,30)`.
  FAIL — `(30,30)`→teal (treating the point as inside P1 though
  30<60 on x and 30<40 on y); FAIL — `(90,70)`→background (missing
  that P1 covers it).
- **obj-3 (P2 far-right trap)**: PASS — `(310,150)`→gold with the point
  correctly outside P4's y-range; PASS — `(180,130)`→gold via P2
  later than P1. FAIL — `(310,150)`→crimson (the "rightmost pass wins"
  error); FAIL — `(180,130)`→teal (ignoring that P2 is later in
  document order).
- **obj-4 (boundary-excluded overlap)**: PASS — `(128,185)`→purple;
  PASS — purple reached via covering set {P1, P3} with gold correctly
  excluded. FAIL — `(128,185)`→gold (wrongly counting P2 as covering
  and treating it as topmost); FAIL — `(128,185)`→teal (taking P1 as
  the top instead of the later P3).
- **obj-5 (P4-on-top probes)**: PASS — all three of `(250,250)`,
  `(365,325)`, `(215,285)`→crimson; PASS — `(250,250)`→crimson with
  the inclusive right/bottom edges of P1 handled correctly (still
  crimson because P4 is last). FAIL — `(215,285)`→gold (stopping at P2
  and missing that P4 also covers and is later); FAIL — `(365,325)`→
  background (missing that P4 alone covers the far corner).
- **Answer correctness completeness**: beyond the five grouped checks,
  does every one of the eight values match the key exactly? Full
  marks only if all eight are correct; partial credit for 6-7 correct
  with the two hardest traps (`(310,150)`, `(128,185)`) weighted most
  heavily since they distinguish real reasoning from guessing.
- **Explanation of paint-order reasoning**: if the submission includes
  any accompanying reasoning (comments in the JSON are disallowed, but
  a model may describe its method in its final message), does it
  correctly state the painter's-algorithm rule (last covering pass in
  document order wins) rather than a wrong heuristic like "largest
  pass wins" or "rightmost pass wins"?
  PASS examples: "the last pass in document order that covers the
  point wins"; "P4 is drawn last so it wins wherever it overlaps, but
  only where it actually covers the point". FAIL examples: "the
  widest ink pass shows through"; "the most recently added pass
  always wins everywhere on the poster".
- **Reasoning quality**: does the model's approach (if visible outside
  the JSON) show it checked coverage per-pass-boundary (using the
  actual x/y/width/height ranges) rather than eyeballing position on a
  mental sketch?
  PASS examples: explicit interval checks like "128 < 140 so P2 does
  not cover" or "150 < 210 so P4 does not reach this row". FAIL
  examples: "it's near the middle so all three overlap"; "it's in the
  bottom-right so crimson" with no boundary arithmetic.
