---
id: debug-08-cache-leak-from-logs
category: debugging
title: Diagnose a cache leak from telemetry alone
deliverables:
  - fix.js
  - DIAGNOSIS.md
---

## Task

**Tidewell API**, a fictional service, has been slowly consuming more
memory over a 20-minute window. There is no crash and no stack trace —
only telemetry. You do not have access to a running repro; diagnose
from the signals below plus a partial code excerpt.

**Telemetry (one line per minute):**

```
2026-07-04T10:10:00Z cache_entries=500 rss_mb=120 req_rate_per_s=42 gc_pause_ms=4
2026-07-04T10:11:00Z cache_entries=750 rss_mb=128 req_rate_per_s=42 gc_pause_ms=10
2026-07-04T10:12:00Z cache_entries=1000 rss_mb=136 req_rate_per_s=42 gc_pause_ms=16
2026-07-04T10:13:00Z cache_entries=1250 rss_mb=144 req_rate_per_s=42 gc_pause_ms=22
2026-07-04T10:14:00Z cache_entries=1500 rss_mb=152 req_rate_per_s=42 gc_pause_ms=28
2026-07-04T10:15:00Z cache_entries=1750 rss_mb=160 req_rate_per_s=42 gc_pause_ms=4
2026-07-04T10:16:00Z cache_entries=2000 rss_mb=168 req_rate_per_s=42 gc_pause_ms=10
2026-07-04T10:17:00Z cache_entries=2250 rss_mb=176 req_rate_per_s=42 gc_pause_ms=16
2026-07-04T10:18:00Z cache_entries=2500 rss_mb=184 req_rate_per_s=42 gc_pause_ms=22
2026-07-04T10:19:00Z cache_entries=2750 rss_mb=192 req_rate_per_s=42 gc_pause_ms=28
2026-07-04T10:20:00Z cache_entries=3000 rss_mb=200 req_rate_per_s=42 gc_pause_ms=4
2026-07-04T10:21:00Z cache_entries=3250 rss_mb=208 req_rate_per_s=42 gc_pause_ms=10
2026-07-04T10:22:00Z cache_entries=3500 rss_mb=216 req_rate_per_s=42 gc_pause_ms=16
2026-07-04T10:23:00Z cache_entries=3750 rss_mb=224 req_rate_per_s=42 gc_pause_ms=22
2026-07-04T10:24:00Z cache_entries=4000 rss_mb=232 req_rate_per_s=42 gc_pause_ms=28
2026-07-04T10:25:00Z cache_entries=4250 rss_mb=240 req_rate_per_s=42 gc_pause_ms=4
2026-07-04T10:26:00Z cache_entries=4500 rss_mb=248 req_rate_per_s=42 gc_pause_ms=10
2026-07-04T10:27:00Z cache_entries=4750 rss_mb=256 req_rate_per_s=42 gc_pause_ms=16
2026-07-04T10:28:00Z cache_entries=5000 rss_mb=264 req_rate_per_s=42 gc_pause_ms=22
2026-07-04T10:29:00Z cache_entries=5250 rss_mb=272 req_rate_per_s=42 gc_pause_ms=28
```

**Partial code excerpt (memoization + eviction):**

```js
// Tidewell API request memoization
var cache = new Map();
var hits = 0, misses = 0;

function memoize(req) {
  var key = JSON.stringify(req); // req includes: path, params, timestamp
  if (cache.has(key)) {
    hits++;
    evictIfNeeded();
    return cache.get(key);
  }
  misses++;
  var val = { path: req.path, computedAt: Date.now() };
  cache.set(key, val);
  return val;
}

function evictIfNeeded() {
  if (cache.size > 50) {
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
  1. after feeding 100 distinct requests (differing only in
     `timestamp`) through the cache, the cache holds at most 50 entries
  2. two requests identical except for `timestamp` produce a cache
     hit (a single stored entry, not two)
- `DIAGNOSIS.md` — explain the root cause using only the telemetry and
  excerpt above, and state which specific log signal confirms it.

## Constraints

- Plain JavaScript, no dependencies, `fix.js` at most 90 lines.
- The cache must remain a general-purpose memoization cache (bounded
  size, hits still possible on repeated logical requests) rather than
  a special case for the two listed self-test scenarios.
