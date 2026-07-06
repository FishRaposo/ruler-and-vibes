---
id: coding-07c-reagent-pour-plan
category: coding
title: Reagent pour plan with deterministic microtask ordering
deliverables:
  - pourplan.js
---

## Task

Implement `runPourPlan(steps)` in a single file. Each step is
`{id, feeds, pour}` where `feeds` is an array of step ids whose pours
must have finished before this step may begin, and `pour` is a function
that performs the transfer and resolves via EXACTLY ONE microtask hop —
every `pour` you are given (and every `pour` your own test steps use) is
shaped as `() => Promise.resolve().then(fn)`. This constraint is
intentional: it keeps ordering fully determined by the JavaScript
microtask queue, with no dependence on timers or engine-specific
scheduling quirks.

Rules:

- A step may only begin once ALL of its `feeds` have finished.
- Among steps that are simultaneously ready to begin, they must begin in
  ascending `id` order.
- The runner must append the step's id to a shared trace array when the
  step BEGINS, and append `id + '*'` to the same trace when the step
  FINISHES (i.e. when its `pour`'s returned promise resolves).
- `runPourPlan` returns a promise that resolves to the final trace array
  once every step has finished.
- Ordering must rest ONLY on microtasks — `Promise` chaining and/or
  `queueMicrotask` — never on `setTimeout`/`setInterval` or any other
  timer, and never on wall-clock reads. This is a hard constraint, not a
  style preference: using timers makes ordering timing-dependent and
  therefore unjudgeable.

## Deliverables

- `pourplan.js` — exports `runPourPlan` via `module.exports`. When run
  with `node pourplan.js`, it must build the embedded plan below, call
  `runPourPlan`, await the result, and print the final trace array (e.g.
  via `console.log(JSON.stringify(trace))`).

Embedded plan to run:

```js
const steps = [
  { id: 'r1', feeds: [], pour: () => Promise.resolve().then(() => {}) },
  { id: 'r2', feeds: ['r1'], pour: () => Promise.resolve().then(() => {}) },
  { id: 'r3', feeds: ['r1'], pour: () => Promise.resolve().then(() => {}) },
  { id: 'r4', feeds: ['r1'], pour: () => Promise.resolve().then(() => {}) },
  { id: 'r5', feeds: ['r2', 'r3', 'r4'], pour: () => Promise.resolve().then(() => {}) },
];
```

## Constraints

- Plain JavaScript, no dependencies, single file, at most 120 lines.
- No `setTimeout`, no `setInterval`, no wall-clock reads anywhere in the
  file.
- Running `node pourplan.js` multiple times must produce byte-identical
  stdout every time.
- `module.exports = { runPourPlan }` (or equivalent that makes
  `require('./pourplan.js').runPourPlan` work).
