---
id: coding-05-booking-ledger-bug
category: coding
title: Booking-ledger occupancy — find and fix the seeded bug
deliverables:
  - fixed.js
  - BUGREPORT.md
---

## Task

A fictional guesthouse tracks room bookings and wants a per-day
occupancy count. Below is the current `occupancy(bookings)` module.
Each booking is `{room, checkIn, checkOut}` where `checkIn` and
`checkOut` are integer day-indices, and a stay is supposed to occupy
the room from the check-in night through the night BEFORE check-out
(the checkout day itself is a departure day, not an occupied night —
a guest who checks in on day 3 the same day another guest checks out
should not both be counted as occupying the room that night).

There is exactly one bug in this module. Find it and fix it with a
minimal edit — do not restructure the function, change its signature,
or alter any other behavior.

```js
// occupancy.js (buggy — fix this)
function occupancy(bookings) {
  const days = {};
  for (const b of bookings) {
    for (let d = b.checkIn; d <= b.checkOut; d++) {
      days[d] = (days[d] || 0) + 1;
    }
  }
  return days;
}

module.exports = { occupancy };
```

## Deliverables

- `fixed.js` — the corrected module. Must still export `occupancy` via
  `module.exports` with the same call signature. When run with
  `node fixed.js`, it must execute a self-test block that prints one
  `PASS`/`FAIL` line per case (at minimum: the three-booking set below,
  and a case that specifically exposes peak concurrency). Every
  printed line must say `PASS`.
- `BUGREPORT.md` — a short prose write-up (no fixed template required)
  that names the exact defect and states the corrected occupancy
  semantics (i.e. that the checkout night is not occupied).

## Constraints

- Plain JavaScript, no dependencies, single file for `fixed.js`, at
  most 90 lines.
- Preserve the module's export surface: `occupancy` must still be the
  exported name.
- Do not change anything about the module other than what's needed to
  fix the bug (e.g. do not add sorting, do not clamp results, do not
  change the data shape).

For reference, here is the three-booking set your self-test should
include:

```js
const bookings = [
  { room: 'r1', checkIn: 1, checkOut: 4 },
  { room: 'r2', checkIn: 3, checkOut: 6 },
  { room: 'r3', checkIn: 4, checkOut: 5 },
];
```
