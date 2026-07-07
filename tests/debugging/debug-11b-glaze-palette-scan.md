---
id: debug-11b-glaze-palette-scan
category: debugging
title: Palette builder that slows to a crawl
deliverables:
  - fixed.js
  - PERF.md
---

## Task

**Vitraille Workshop**, a fictional stained-glass studio, cuts coloured
glass tiles for large window cartoons. Before a panel is soldered, a
`distinctColors(tiles, counter)` helper walks the ordered list of tile
colour codes and returns the list of *distinct* colours in the order
they first appear, so the studio can pull one sample chip per colour in
laying-in order. Here is the helper as currently shipped, instrumented
with an explicit operation counter:

```js
// buggy distinctColors: keeps first-appearance order but tests membership
// by SCANNING the growing palette array with an explicit inner loop.
function distinctColors(tiles, counter) {
  var palette = [];
  for (var i = 0; i < tiles.length; i++) {
    var color = tiles[i];
    var found = false;
    for (var j = 0; j < palette.length; j++) {
      counter.n++; // every membership decision is counted
      if (palette[j] === color) { found = true; break; }
    }
    if (!found) palette.push(color);
  }
  return palette;
}

module.exports = { distinctColors: distinctColors };
```

The palette it returns is correct — nobody disputes that. The complaint
is that the pre-soldering step gets steadily slower as cartoons grow,
far out of proportion to how many more tiles they contain. Here is the
embedded harness used to measure it. **Do not alter this harness** — it
is run unmodified against your submission:

```js
// Embedded instrumented harness (must remain unmodified). Drives a
// distinctColors implementation at n = 120, 240, 480, 960 on a
// worst-case cartoon (each colour appears exactly twice, n/2 distinct
// colours) and reports counter.n for each.
function makeInput(n) {
  var tiles = [];
  for (var i = 0; i < n / 2; i++) tiles.push(i);
  for (var i = 0; i < n / 2; i++) tiles.push(i); // each colour repeated once
  return tiles;
}

function run(distinctFn) {
  var results = [];
  [120, 240, 480, 960].forEach(function (n) {
    var input = makeInput(n);
    var counter = { n: 0 };
    var out = distinctFn(input, counter);
    results.push({ n: n, ops: counter.n, outLen: out.length });
  });
  return results;
}

module.exports = { makeInput: makeInput, run: run };
```

Running this harness against the buggy `distinctColors` above produces
`counter.n` values that quadruple every time `n` doubles. Your job:
rewrite `distinctColors` so it produces the exact same palette but its
operation count scales roughly linearly with `n` instead.

The counter contract is mandatory: **every membership decision** your
`distinctColors` makes must increment `counter.n` by exactly one. You
may not satisfy the harness by hiding comparison work inside a native
method that the counter can't see — for instance, swapping the inner
loop for `palette.includes(color)` or `palette.indexOf(color)` is still
a full scan under the hood (still O(n^2)) and also dodges the counter
entirely, which is disqualifying on both counts. A legitimate fix
performs one counted, O(1)-amortized membership probe per tile (e.g. via
a `Set` or equivalent hashed structure), not a scan of the growing
palette array.

## Deliverables

- `fixed.js` — a rewritten `distinctColors(tiles, counter)` that
  produces byte-identical output (same colour codes, same
  first-appearance order) to the buggy version above, but whose
  `counter.n` grows roughly linearly with `n` when driven by the
  embedded harness, and performs membership testing via a hashed
  structure rather than scanning the palette array or delegating to a
  native array-membership method.
- `PERF.md` — names the specific quadratic operation in the original
  code (the nested scan of the growing palette array) and states the
  fixed complexity (O(n)) along with the data structure used to achieve
  it.

## Constraints

- Plain JavaScript, no dependencies.
- `fixed.js` at most 80 lines.
- `fixed.js` must export `distinctColors` with the same
  `(tiles, counter)` signature, and must not modify or depend on changes
  to the embedded harness shown above.
- No use of `Array.prototype.includes` or `Array.prototype.indexOf` (or
  equivalent linear scans) to test membership against the growing
  palette.
