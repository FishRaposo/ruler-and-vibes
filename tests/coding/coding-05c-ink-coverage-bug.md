---
id: coding-05c-ink-coverage-bug
category: coding
title: Label-press ink coverage — find and fix the seeded bug
deliverables:
  - fixed.js
  - BUGREPORT.md
---

## Task

A fictional rotary label press lays down colors on a continuous web of
frames and wants a per-frame ink-layer count. Below is the current
`inkCoverage(passes)` module. Each pass is `{color, startFrame, stopFrame}`
where `startFrame` and `stopFrame` are integer frame-indices, and a pass
is supposed to ink the web from its start frame through the frame BEFORE
its stop frame (the stop frame itself is where the color lifts for the
registration cut, an unprinted margin frame — not an inked frame — so a
pass that starts on frame 5 the same frame another pass lifts off should
not both be counted as inking that frame).

There is exactly one bug in this module. Find it and fix it with a
minimal edit — do not restructure the function, change its signature,
or alter any other behavior.

```js
// inkcoverage.js (buggy — fix this)
function inkCoverage(passes) {
  const frames = {};
  for (const p of passes) {
    for (let f = p.startFrame; f <= p.stopFrame; f++) {
      frames[f] = (frames[f] || 0) + 1;
    }
  }
  return frames;
}

module.exports = { inkCoverage };
```

## Deliverables

- `fixed.js` — the corrected module. Must still export `inkCoverage` via
  `module.exports` with the same call signature. When run with
  `node fixed.js`, it must execute a self-test block that prints one
  `PASS`/`FAIL` line per case (at minimum: the four-pass set below, and a
  case that specifically exposes the peak ink-layer count). Every printed
  line must say `PASS`.
- `BUGREPORT.md` — a short prose write-up (no fixed template required)
  that names the exact defect and states the corrected coverage
  semantics (i.e. that the stop frame is not inked).

## Constraints

- Plain JavaScript, no dependencies, single file for `fixed.js`, at
  most 90 lines.
- Preserve the module's export surface: `inkCoverage` must still be the
  exported name.
- Do not change anything about the module other than what's needed to
  fix the bug (e.g. do not add sorting, do not clamp results, do not
  change the data shape).

For reference, here is the four-pass set your self-test should include:

```js
const passes = [
  { color: 'cyan',    startFrame: 2, stopFrame: 6 },
  { color: 'magenta', startFrame: 5, stopFrame: 9 },
  { color: 'yellow',  startFrame: 6, stopFrame: 7 },
  { color: 'black',   startFrame: 8, stopFrame: 10 },
];
```
