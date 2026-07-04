---
id: coding-07-async-scheduler-ordering
category: coding
title: Async scheduler with deterministic event-loop ordering
deliverables:
  - scheduler.js
---

## Task

Implement `runSchedule(tasks)` in a single file. Each task is
`{id, deps, body}` where `deps` is an array of task ids that must
complete before this task starts, and `body` is a function that
performs its work and resolves via EXACTLY ONE microtask hop —
every task body you are given (and every body your own test tasks
use) is shaped as `() => Promise.resolve().then(fn)`. This constraint
is intentional: it keeps ordering fully determined by the JavaScript
microtask queue, with no dependency on timers or engine-specific
scheduling quirks.

Rules:

- A task may only start once ALL of its `deps` have completed.
- Among tasks that are simultaneously ready to start, they must start
  in ascending `id` order.
- The scheduler must append the task's id to a shared log array when
  the task STARTS, and append `id + '!'` to the same log when the
  task COMPLETES (i.e. when its body's returned promise resolves).
- `runSchedule` returns a promise that resolves to the final log array
  once every task has completed.
- Ordering must rest ONLY on microtasks — `Promise` chaining and/or
  `queueMicrotask` — never on `setTimeout`/`setInterval` or any other
  timer, and never on wall-clock reads. This is a hard constraint, not
  a style preference: using timers makes ordering timing-dependent and
  therefore unjudgeable.

## Deliverables

- `scheduler.js` — exports `runSchedule` via `module.exports`. When
  run with `node scheduler.js`, it must build the embedded DAG below,
  call `runSchedule`, await the result, and print the final log array
  (e.g. via `console.log(JSON.stringify(log))`).

Embedded DAG to run:

```js
const tasks = [
  { id: 't1', deps: [], body: () => Promise.resolve().then(() => {}) },
  { id: 't2', deps: ['t1'], body: () => Promise.resolve().then(() => {}) },
  { id: 't3', deps: ['t1'], body: () => Promise.resolve().then(() => {}) },
  { id: 't4', deps: ['t2', 't3'], body: () => Promise.resolve().then(() => {}) },
];
```

## Constraints

- Plain JavaScript, no dependencies, single file, at most 120 lines.
- No `setTimeout`, no `setInterval`, no wall-clock reads anywhere in
  the file.
- Running `node scheduler.js` multiple times must produce byte-identical
  stdout every time.
- `module.exports = { runSchedule }` (or equivalent that makes
  `require('./scheduler.js').runSchedule` work).
