---
id: coding-05b-airtime-handover
category: coding
title: Airtime-ledger concurrency — find and fix the seeded bug
deliverables:
  - fixed.js
  - BUGREPORT.md
---

## Task

A community radio station logs its broadcasts and wants a per-slot
concurrency count (how many channels are on air in each time-slot).
Below is the current `airtime(broadcasts)` module. Each broadcast is
`{channel, startSlot, endSlot}` where `startSlot` and `endSlot` are
integer slot-indices, and a broadcast is supposed to occupy the slot
from its start slot through the slot BEFORE its end slot (the end slot
itself is a handover slot where the next programme takes over, not an
on-air slot for the finishing broadcast — a channel that starts at
slot 4 the same slot another finishes should not both be counted as
on-air in that slot).

There is exactly one bug in this module. Find it and fix it with a
minimal edit — do not restructure the function, change its signature,
or alter any other behavior.

```js
// airtime.js (buggy — fix this)
function airtime(broadcasts) {
  const slots = {};
  for (const b of broadcasts) {
    for (let s = b.startSlot; s <= b.endSlot; s++) {
      slots[s] = (slots[s] || 0) + 1;
    }
  }
  return slots;
}

module.exports = { airtime };
```

## Deliverables

- `fixed.js` — the corrected module. Must still export `airtime` via
  `module.exports` with the same call signature. When run with
  `node fixed.js`, it must execute a self-test block that prints one
  `PASS`/`FAIL` line per case (at minimum: the three-broadcast set below,
  and a case that specifically exposes peak concurrency). Every
  printed line must say `PASS`.
- `BUGREPORT.md` — a short prose write-up (no fixed template required)
  that names the exact defect and states the corrected concurrency
  semantics (i.e. that the handover slot is not on-air).

## Constraints

- Plain JavaScript, no dependencies, single file for `fixed.js`, at
  most 90 lines.
- Preserve the module's export surface: `airtime` must still be the
  exported name.
- Do not change anything about the module other than what's needed to
  fix the bug (e.g. do not add sorting, do not clamp results, do not
  change the data shape).

For reference, here is the three-broadcast set your self-test should
include:

```js
const broadcasts = [
  { channel: 'ch1', startSlot: 2, endSlot: 5 },
  { channel: 'ch2', startSlot: 4, endSlot: 7 },
  { channel: 'ch3', startSlot: 5, endSlot: 6 },
];
```
