---
id: debug-05-lost-update-async
category: debugging
title: Lost update across concurrent deposits
deliverables:
  - fixed.js
  - RACE.md
---

## Task

**Kelptide Bank**, a fictional ledger service, has an in-memory account
store whose reads and writes are asynchronous (each genuinely awaits a
pinned zero-delay tick — this is a single-threaded event-loop
interleaving, not real multithreading). Here is the file as currently
shipped:

```js
// Kelptide Bank in-memory account store
function tick() {
  return new Promise(function (resolve) { setTimeout(resolve, 0); });
}

function makeStore(startBalance) {
  var state = { balance: startBalance };
  return {
    get: async function () {
      await tick();
      return state.balance;
    },
    set: async function (v) {
      await tick();
      state.balance = v;
    }
  };
}

async function deposit(store, amt) {
  var bal = await store.get();
  await tick();
  bal = bal + amt;
  await store.set(bal);
}

async function run(startBalance, amt, n) {
  var store = makeStore(startBalance);
  var deposits = [];
  for (var i = 0; i < n; i++) deposits.push(deposit(store, amt));
  await Promise.all(deposits);
  return await store.get();
}

module.exports = { makeStore, deposit, run };
```

A driver calls `run(100, 10, 5)` — five concurrent deposits of 10 onto
a starting balance of 100 via `Promise.all`. The intended final balance
is 150. Instead it prints 110.

Diagnose the bug and fix `deposit` (and/or its use of the store) so
concurrent deposits serialize correctly, while keeping `get`/`set`
genuinely `async` with their own internal `await` (do not turn them
into synchronous functions, and do not just delete the internal
`await tick()` calls — a real fix must still work against a store whose
`get`/`set` truly yield to the event loop).

## Deliverables

- `fixed.js` — the corrected module plus a self-test block runnable
  with `node fixed.js`, printing a PASS/FAIL line for at least:
  1. five concurrent deposits of 10 onto a starting balance of 100
     (expected final balance 150)
  2. ten concurrent deposits of 5 onto a starting balance of 200
     (expected final balance 250)
- `RACE.md` — name the exact interleaving that causes the lost update
  (which operations run before which), and explain why your fix
  prevents it.

## Constraints

- Plain JavaScript, no dependencies, `fixed.js` at most 90 lines.
- `get` and `set` must remain `async` functions that each internally
  `await` something (no converting the store to a synchronous object).
- `run`'s signature and its use of `Promise.all` to launch concurrent
  deposits must be preserved — fix the serialization, not the
  concurrency launch.
