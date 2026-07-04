---
id: coding-06-ttl-cache-tiebreak
category: coding
title: TtlCache class with a non-LRU eviction tie-break
deliverables:
  - ttlcache.js
---

## Task

Implement a `TtlCache` class in a single file: a capacity-bounded
cache where every entry carries its own time-to-live. Time is never
read from the wall clock — every call that needs "now" takes it as an
explicit argument, so the whole cache is deterministic and testable.

### Contract

- `new TtlCache(capacity)` — `capacity` is the maximum number of
  entries the cache may hold at once.
- `set(key, value, ttl, now)` — inserts or overwrites `key`. The
  entry's `expiry` is `now + ttl`. If `key` already exists, this is a
  plain overwrite (does not itself trigger eviction logic beyond normal
  capacity accounting). If inserting a NEW key would exceed capacity,
  evict exactly one existing entry first, chosen by this exact policy:
  1. If any existing entry is already expired (`expiry <= now`), evict
     one such expired entry (any one, if multiple are expired).
  2. Otherwise, evict the entry with the EARLIEST `expiry`. If two or
     more entries tie on `expiry`, evict whichever of them was
     INSERTED EARLIEST (insertion order) — this is NOT least-recently-used;
     there is no recency tracking in this cache at all.
- `get(key, now)` — returns the stored value if the entry exists and
  is unexpired (`expiry > now`); returns `undefined` if the key is
  absent or expired. Calling `get` must NEVER affect eviction order —
  there is no recency concept to refresh.

The trap to avoid: this is deliberately NOT an LRU cache. Do not track
last-access time, and do not let `get` calls change which entry gets
evicted later.

## Deliverables

- `ttlcache.js` — exports `TtlCache` via `module.exports`. When run
  with `node ttlcache.js`, it must execute a self-test block driving
  at least the operation sequence below and printing one `PASS`/`FAIL`
  line per assertion. Every printed line must say `PASS`.

Include at least this pinned sequence in your self-test (capacity 3):

```js
const c = new TtlCache(3);
c.set('a', 1, 100, 0);   // expiry 100
c.set('b', 2, 50, 0);    // expiry 50
c.set('c', 3, 100, 0);   // expiry 100
c.set('d', 4, 200, 10);  // triggers eviction
c.set('e', 5, 200, 10);  // triggers eviction
```

## Constraints

- Plain JavaScript, no dependencies, single file, at most 110 lines.
- No reliance on `Date.now()` or any wall-clock source — all timing
  must flow through the explicit `now` argument.
- `module.exports = { TtlCache }` (or equivalent that makes
  `require('./ttlcache.js').TtlCache` work).
