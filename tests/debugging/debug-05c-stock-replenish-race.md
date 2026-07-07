---
id: debug-05c-stock-replenish-race
category: debugging
title: Lost replenishment across concurrent stock updates
deliverables:
  - fixed.js
  - RACE.md
---

## Task

**Brambleworth Depot**, a fictional warehouse tool, keeps an in-memory
stock counter whose reads and writes are asynchronous (each genuinely
awaits a pinned zero-delay tick — this is a single-threaded event-loop
interleaving, not real multithreading). Here is the file as currently
shipped:

```js
// Brambleworth Depot in-memory stock counter
function tick() {
  return new Promise(function (resolve) { setTimeout(resolve, 0); });
}

function makeCounter(startUnits) {
  var state = { units: startUnits };
  return {
    read: async function () {
      await tick();
      return state.units;
    },
    write: async function (v) {
      await tick();
      state.units = v;
    }
  };
}

async function replenish(counter, qty) {
  var have = await counter.read();
  await tick();
  have = have + qty;
  await counter.write(have);
}

async function run(startUnits, qty, n) {
  var counter = makeCounter(startUnits);
  var jobs = [];
  for (var i = 0; i < n; i++) jobs.push(replenish(counter, qty));
  await Promise.all(jobs);
  return await counter.read();
}

module.exports = { makeCounter, replenish, run };
```

A driver calls `run(40, 6, 4)` — four concurrent replenishments of 6
onto a starting stock of 40 via `Promise.all`. The intended final stock
is 64. Instead it prints 46.

Diagnose the bug and fix `replenish` (and/or its use of the counter) so
concurrent replenishments serialize correctly, while keeping
`read`/`write` genuinely `async` with their own internal `await` (do not
turn them into synchronous functions, and do not just delete the
internal `await tick()` calls — a real fix must still work against a
counter whose `read`/`write` truly yield to the event loop).

## Deliverables

- `fixed.js` — the corrected module plus a self-test block runnable
  with `node fixed.js`, printing a PASS/FAIL line for at least:
  1. four concurrent replenishments of 6 onto a starting stock of 40
     (expected final stock 64)
  2. six concurrent replenishments of 8 onto a starting stock of 300
     (expected final stock 348)
- `RACE.md` — name the exact interleaving that causes the lost
  replenishment (which operations run before which), and explain why
  your fix prevents it.

## Constraints

- Plain JavaScript, no dependencies, `fixed.js` at most 90 lines.
- `read` and `write` must remain `async` functions that each internally
  `await` something (no converting the counter to a synchronous object).
- `run`'s signature and its use of `Promise.all` to launch concurrent
  replenishments must be preserved — fix the serialization, not the
  concurrency launch.
