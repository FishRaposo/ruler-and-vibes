---
id: debug-08b-geocode-cache-leak
category: debugging
title: Diagnose a geocoder cache leak from telemetry alone
deliverables:
  - fix.js
  - DIAGNOSIS.md
---

## Task

**Fenmarrow Geocoder**, a fictional address-resolution service, has been
steadily using more heap over a 20-minute window. There is no crash and
no stack trace — only telemetry. You do not have access to a running
repro; diagnose from the signals below plus a partial code excerpt.

**Telemetry (one line per minute):**

```
2026-07-05T14:02:00Z lookup_cache_entries=640 heap_used_mb=96 lookups_per_s=58 compaction_ms=3
2026-07-05T14:03:00Z lookup_cache_entries=960 heap_used_mb=102 lookups_per_s=58 compaction_ms=9
2026-07-05T14:04:00Z lookup_cache_entries=1280 heap_used_mb=108 lookups_per_s=58 compaction_ms=15
2026-07-05T14:05:00Z lookup_cache_entries=1600 heap_used_mb=114 lookups_per_s=58 compaction_ms=21
2026-07-05T14:06:00Z lookup_cache_entries=1920 heap_used_mb=120 lookups_per_s=58 compaction_ms=3
2026-07-05T14:07:00Z lookup_cache_entries=2240 heap_used_mb=126 lookups_per_s=58 compaction_ms=9
2026-07-05T14:08:00Z lookup_cache_entries=2560 heap_used_mb=132 lookups_per_s=58 compaction_ms=15
2026-07-05T14:09:00Z lookup_cache_entries=2880 heap_used_mb=138 lookups_per_s=58 compaction_ms=21
2026-07-05T14:10:00Z lookup_cache_entries=3200 heap_used_mb=144 lookups_per_s=58 compaction_ms=3
2026-07-05T14:11:00Z lookup_cache_entries=3520 heap_used_mb=150 lookups_per_s=58 compaction_ms=9
2026-07-05T14:12:00Z lookup_cache_entries=3840 heap_used_mb=156 lookups_per_s=58 compaction_ms=15
2026-07-05T14:13:00Z lookup_cache_entries=4160 heap_used_mb=162 lookups_per_s=58 compaction_ms=21
2026-07-05T14:14:00Z lookup_cache_entries=4480 heap_used_mb=168 lookups_per_s=58 compaction_ms=3
2026-07-05T14:15:00Z lookup_cache_entries=4800 heap_used_mb=174 lookups_per_s=58 compaction_ms=9
2026-07-05T14:16:00Z lookup_cache_entries=5120 heap_used_mb=180 lookups_per_s=58 compaction_ms=15
2026-07-05T14:17:00Z lookup_cache_entries=5440 heap_used_mb=186 lookups_per_s=58 compaction_ms=21
2026-07-05T14:18:00Z lookup_cache_entries=5760 heap_used_mb=192 lookups_per_s=58 compaction_ms=3
2026-07-05T14:19:00Z lookup_cache_entries=6080 heap_used_mb=198 lookups_per_s=58 compaction_ms=9
2026-07-05T14:20:00Z lookup_cache_entries=6400 heap_used_mb=204 lookups_per_s=58 compaction_ms=15
2026-07-05T14:21:00Z lookup_cache_entries=6720 heap_used_mb=210 lookups_per_s=58 compaction_ms=21
```

**Partial code excerpt (lookup memoization + eviction):**

```js
// Fenmarrow Geocoder address-lookup memoization
var cache = new Map();
var hits = 0, misses = 0;

function lookup(req) {
  var key = JSON.stringify(req); // req includes: address, region, traceId
  if (cache.has(key)) {
    hits++;
    trimIfFull();
    return cache.get(key);
  }
  misses++;
  var val = { address: req.address, resolvedAt: Date.now() };
  cache.set(key, val);
  return val;
}

function trimIfFull() {
  if (cache.size > 64) {
    var oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
}
```

Diagnose the leak using ONLY the telemetry and this excerpt (there is
no runnable service to reproduce against), then fix it. Read the
excerpt carefully before concluding what runs on every request versus
only sometimes.

## Deliverables

- `fix.js` — a corrected memoization module (self-contained, does not
  need to reuse the excerpt's exact structure) plus a self-test block
  runnable with `node fix.js` printing a PASS/FAIL line for:
  1. after feeding 120 distinct requests (differing only in `traceId`)
     through the cache, the cache holds at most 64 entries
  2. two requests identical except for `traceId` produce a cache hit (a
     single stored entry, not two)
- `DIAGNOSIS.md` — explain the root cause using only the telemetry and
  excerpt above, and state which specific log signal confirms it.

## Constraints

- Plain JavaScript, no dependencies, `fix.js` at most 90 lines.
- The cache must remain a general-purpose memoization cache (bounded
  size, hits still possible on repeated logical requests) rather than a
  special case for the two listed self-test scenarios.
