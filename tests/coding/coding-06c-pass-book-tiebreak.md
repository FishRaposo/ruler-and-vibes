---
id: coding-06c-pass-book-tiebreak
category: coding
title: PassBook class with a booking-order eviction tie-break
deliverables:
  - passbook.js
---

## Task

Implement a `PassBook` class in a single file: a ground station that
tracks scheduled satellite contact passes, bounded by how many passes
it can hold at once. Every pass carries its own contact window that
closes at a fixed time. Time is never read from the wall clock — every
call that needs "now" takes it as an explicit argument, so the whole
scheduler is deterministic and testable.

### Contract

- `new PassBook(capacity)` — `capacity` is the maximum number of passes
  the book may hold at once.
- `book(id, payload, duration, now)` — records or overwrites `id`. The
  pass's `windowEnd` is `now + duration`. If `id` already exists, this
  is a plain overwrite (it does not itself trigger eviction logic beyond
  normal capacity accounting). If recording a NEW `id` would exceed
  capacity, remove exactly one existing pass first, chosen by this exact
  policy:
  1. If any existing pass has already closed (`windowEnd <= now`),
     remove one such closed pass (any one, if several are closed).
  2. Otherwise, remove the pass with the EARLIEST `windowEnd`. If two or
     more passes tie on `windowEnd`, remove whichever of them was BOOKED
     EARLIEST (booking order) — this is NOT least-recently-used; there is
     no recency tracking in this scheduler at all.
- `check(id, now)` — returns the stored payload if the pass exists and
  its window is still open (`windowEnd > now`); returns `undefined` if
  the `id` is absent or its window has closed. Calling `check` must
  NEVER affect eviction order — there is no recency concept to refresh.

The trap to avoid: this is deliberately NOT a least-recently-used
scheduler. Do not track last-inspection time, and do not let `check`
calls change which pass gets removed later.

## Deliverables

- `passbook.js` — exports `PassBook` via `module.exports`. When run with
  `node passbook.js`, it must execute a self-test block driving at least
  the operation sequence below and printing one `PASS`/`FAIL` line per
  assertion. Every printed line must say `PASS`.

Include at least this pinned sequence in your self-test (capacity 3):

```js
const b = new PassBook(3);
b.book('r7', 'alpha', 300, 0);   // windowEnd 300
b.book('m2', 'bravo', 120, 0);   // windowEnd 120
b.book('k9', 'charlie', 300, 0); // windowEnd 300
b.book('t4', 'delta', 500, 40);  // triggers eviction
b.book('w1', 'echo', 500, 40);   // triggers eviction
```

## Constraints

- Plain JavaScript, no dependencies, single file, at most 110 lines.
- No reliance on `Date.now()` or any wall-clock source — all timing must
  flow through the explicit `now` argument.
- `module.exports = { PassBook }` (or equivalent that makes
  `require('./passbook.js').PassBook` work).
