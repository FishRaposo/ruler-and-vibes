---
id: debug-05b-telemetry-running-total
category: debugging
title: Lost update across concurrent sensor records
deliverables:
  - fixed.js
  - RACE.md
---

## Task

**Gullwatch Observatory**, a fictional telemetry service, keeps an
in-memory running total of sensor deltas in an aggregator whose reads
and writes are asynchronous (each genuinely awaits a pinned zero-delay
tick — this is a single-threaded event-loop interleaving, not real
multithreading). Here is the file as currently shipped:

```js
// Gullwatch Observatory in-memory reading aggregator
function tick() {
  return new Promise(function (resolve) { setTimeout(resolve, 0); });
}

function makeAggregator(startTotal) {
  var state = { total: startTotal };
  return {
    read: async function () {
      await tick();
      return state.total;
    },
    write: async function (v) {
      await tick();
      state.total = v;
    }
  };
}

async function record(agg, delta) {
  var cur = await agg.read();
  await tick();
  cur = cur + delta;
  await agg.write(cur);
}

async function run(startTotal, delta, n) {
  var agg = makeAggregator(startTotal);
  var records = [];
  for (var i = 0; i < n; i++) records.push(record(agg, delta));
  await Promise.all(records);
  return await agg.read();
}

module.exports = { makeAggregator, record, run };
```

A driver calls `run(50, 4, 7)` — seven concurrent records of 4 onto a
starting total of 50 via `Promise.all`. The intended final total is 78.
Instead it prints 54.

Diagnose the bug and fix `record` (and/or its use of the aggregator) so
concurrent records serialize correctly, while keeping `read`/`write`
genuinely `async` with their own internal `await` (do not turn them into
synchronous functions, and do not just delete the internal `await tick()`
calls — a real fix must still work against an aggregator whose
`read`/`write` truly yield to the event loop).

## Deliverables

- `fixed.js` — the corrected module plus a self-test block runnable
  with `node fixed.js`, printing a PASS/FAIL line for at least:
  1. seven concurrent records of 4 onto a starting total of 50
     (expected final total 78)
  2. six concurrent records of 8 onto a starting total of 120
     (expected final total 168)
- `RACE.md` — name the exact interleaving that causes the lost update
  (which operations run before which), and explain why your fix
  prevents it.

## Constraints

- Plain JavaScript, no dependencies, `fixed.js` at most 90 lines.
- `read` and `write` must remain `async` functions that each internally
  `await` something (no converting the aggregator to a synchronous
  object).
- `run`'s signature and its use of `Promise.all` to launch concurrent
  records must be preserved — fix the serialization, not the concurrency
  launch.
