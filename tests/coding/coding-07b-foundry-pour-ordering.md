---
id: coding-07b-foundry-pour-ordering
category: coding
title: Foundry pour sequencer with deterministic microtask ordering
deliverables:
  - caster.js
---

## Task

Implement `pourMolds(molds)` in a single file. Each mold is
`{id, needs, pour}` where `needs` is an array of mold ids that must
finish pouring before this mold starts, and `pour` is a function that
performs the pour and resolves via EXACTLY ONE microtask hop — every
mold's `pour` you are given (and every one your own test molds use)
is shaped as `() => Promise.resolve().then(fn)`. This constraint is
intentional: it keeps ordering fully determined by the JavaScript
microtask queue, with no dependence on timers or engine-specific
scheduling quirks.

Rules:

- A mold may only start pouring once ALL of its `needs` have finished.
- Among molds that are simultaneously ready to start, they must start
  in ascending `id` order.
- The sequencer must append the mold's id to a shared log array when
  the pour STARTS, and append `id + '*'` to the same log when the pour
  FINISHES (i.e. when its `pour`'s returned promise resolves).
- `pourMolds` returns a promise that resolves to the final log array
  once every mold has finished pouring.
- Ordering must rest ONLY on microtasks — `Promise` chaining and/or
  `queueMicrotask` — never on `setTimeout`/`setInterval` or any other
  timer, and never on wall-clock reads. This is a hard constraint, not
  a style preference: using timers makes ordering timing-dependent and
  therefore unjudgeable.

## Deliverables

- `caster.js` — exports `pourMolds` via `module.exports`. When run
  with `node caster.js`, it must build the embedded pour list below,
  call `pourMolds`, await the result, and print the final log array
  (e.g. via `console.log(JSON.stringify(log))`).

Embedded pour list to run:

```js
const molds = [
  { id: 'm1', needs: [],           pour: () => Promise.resolve().then(() => {}) },
  { id: 'm2', needs: ['m1'],       pour: () => Promise.resolve().then(() => {}) },
  { id: 'm3', needs: ['m1'],       pour: () => Promise.resolve().then(() => {}) },
  { id: 'm4', needs: ['m2', 'm3'], pour: () => Promise.resolve().then(() => {}) },
  { id: 'm5', needs: [],           pour: () => Promise.resolve().then(() => {}) },
];
```

## Constraints

- Plain JavaScript, no dependencies, single file, at most 120 lines.
- No `setTimeout`, no `setInterval`, no wall-clock reads anywhere in
  the file.
- Running `node caster.js` multiple times must produce byte-identical
  stdout every time.
- `module.exports = { pourMolds }` (or equivalent that makes
  `require('./caster.js').pourMolds` work).
