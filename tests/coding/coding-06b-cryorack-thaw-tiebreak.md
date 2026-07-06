---
id: coding-06b-cryorack-thaw-tiebreak
category: coding
title: CryoRack class with a non-LRU discard tie-break
deliverables:
  - cryorack.js
---

## Task

Implement a `CryoRack` class in a single file: a capacity-bounded
biobank rack where every cassette carries its own thaw deadline. Time
is never read from the wall clock — every call that needs "now" takes it
as an explicit argument, so the whole rack is deterministic and
testable.

### Contract

- `new CryoRack(capacity)` — `capacity` is the maximum number of
  cassettes the rack may hold at once.
- `store(slot, sample, hold, now)` — loads or overwrites `slot`. The
  cassette's `thawBy` is `now + hold`. If `slot` already holds a
  cassette, this is a plain overwrite (does not itself trigger discard
  logic beyond normal capacity accounting). If loading a NEW slot would
  exceed capacity, discard exactly one existing cassette first, chosen
  by this exact policy:
  1. If any existing cassette is already lapsed (`thawBy <= now`),
     discard one such lapsed cassette (any one, if several are lapsed).
  2. Otherwise, discard the cassette with the EARLIEST `thawBy`. If two
     or more cassettes tie on `thawBy`, discard whichever of them was
     LOADED EARLIEST (load order) — this is NOT least-recently-used;
     there is no recency tracking in this rack at all.
- `inspect(slot, now)` — returns the stored sample if the cassette
  exists and is unlapsed (`thawBy > now`); returns `undefined` if the
  slot is empty or the cassette is lapsed. Calling `inspect` must NEVER
  affect discard order — there is no recency concept to refresh.

The trap to avoid: this is deliberately NOT an LRU rack. Do not track
last-inspection time, and do not let `inspect` calls change which
cassette gets discarded later.

## Deliverables

- `cryorack.js` — exports `CryoRack` via `module.exports`. When run with
  `node cryorack.js`, it must execute a self-test block driving at least
  the operation sequence below and printing one `PASS`/`FAIL` line per
  assertion. Every printed line must say `PASS`.

Include at least this pinned sequence in your self-test (capacity 3):

```js
const r = new CryoRack(3);
r.store('q7', 71, 120, 0);   // thawBy 120
r.store('r3', 33, 60, 0);    // thawBy 60
r.store('s1', 88, 120, 0);   // thawBy 120
r.store('t9', 46, 260, 20);  // triggers discard
r.store('u4', 59, 260, 20);  // triggers discard
```

## Constraints

- Plain JavaScript, no dependencies, single file, at most 110 lines.
- No reliance on `Date.now()` or any wall-clock source — all timing must
  flow through the explicit `now` argument.
- `module.exports = { CryoRack }` (or equivalent that makes
  `require('./cryorack.js').CryoRack` work).
