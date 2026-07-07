---
id: debug-08c-permit-memo-leak
category: debugging
title: Diagnose a permit-cache leak from telemetry alone
deliverables:
  - fix.js
  - DIAGNOSIS.md
---

## Task

**Fennmoor Permit Gateway**, a fictional service, has been slowly
consuming more heap over a 20-minute window. There is no crash and no
stack trace — only telemetry. You do not have access to a running
repro; diagnose from the signals below plus a partial code excerpt.

**Telemetry (one line per minute):**

```
2026-07-06T09:15:00Z memo_entries=600 heap_mb=96 submit_rate_per_s=37 flush_latency_ms=5
2026-07-06T09:16:00Z memo_entries=900 heap_mb=105 submit_rate_per_s=37 flush_latency_ms=11
2026-07-06T09:17:00Z memo_entries=1200 heap_mb=114 submit_rate_per_s=37 flush_latency_ms=17
2026-07-06T09:18:00Z memo_entries=1500 heap_mb=123 submit_rate_per_s=37 flush_latency_ms=23
2026-07-06T09:19:00Z memo_entries=1800 heap_mb=132 submit_rate_per_s=37 flush_latency_ms=5
2026-07-06T09:20:00Z memo_entries=2100 heap_mb=141 submit_rate_per_s=37 flush_latency_ms=11
2026-07-06T09:21:00Z memo_entries=2400 heap_mb=150 submit_rate_per_s=37 flush_latency_ms=17
2026-07-06T09:22:00Z memo_entries=2700 heap_mb=159 submit_rate_per_s=37 flush_latency_ms=23
2026-07-06T09:23:00Z memo_entries=3000 heap_mb=168 submit_rate_per_s=37 flush_latency_ms=5
2026-07-06T09:24:00Z memo_entries=3300 heap_mb=177 submit_rate_per_s=37 flush_latency_ms=11
2026-07-06T09:25:00Z memo_entries=3600 heap_mb=186 submit_rate_per_s=37 flush_latency_ms=17
2026-07-06T09:26:00Z memo_entries=3900 heap_mb=195 submit_rate_per_s=37 flush_latency_ms=23
2026-07-06T09:27:00Z memo_entries=4200 heap_mb=204 submit_rate_per_s=37 flush_latency_ms=5
2026-07-06T09:28:00Z memo_entries=4500 heap_mb=213 submit_rate_per_s=37 flush_latency_ms=11
2026-07-06T09:29:00Z memo_entries=4800 heap_mb=222 submit_rate_per_s=37 flush_latency_ms=17
2026-07-06T09:30:00Z memo_entries=5100 heap_mb=231 submit_rate_per_s=37 flush_latency_ms=23
2026-07-06T09:31:00Z memo_entries=5400 heap_mb=240 submit_rate_per_s=37 flush_latency_ms=5
2026-07-06T09:32:00Z memo_entries=5700 heap_mb=249 submit_rate_per_s=37 flush_latency_ms=11
2026-07-06T09:33:00Z memo_entries=6000 heap_mb=258 submit_rate_per_s=37 flush_latency_ms=17
2026-07-06T09:34:00Z memo_entries=6300 heap_mb=267 submit_rate_per_s=37 flush_latency_ms=23
```

**Partial code excerpt (validation memo + pruning):**

```js
// Fennmoor Permit Gateway validation memo
var memo = new Map();
var hits = 0, misses = 0;

function validate(app) {
  var key = JSON.stringify(app); // app includes: formType, fields, traceId
  if (memo.has(key)) {
    hits++;
    pruneIfFull();
    return memo.get(key);
  }
  misses++;
  var result = { formType: app.formType, validatedAt: Date.now() };
  memo.set(key, result);
  return result;
}

function pruneIfFull() {
  if (memo.size > 64) {
    var oldest = memo.keys().next().value;
    memo.delete(oldest);
  }
}
```

Diagnose the leak using ONLY the telemetry and this excerpt (there is
no runnable service to reproduce against), then fix it. Read the
excerpt carefully before concluding what runs on every request versus
only sometimes.

## Deliverables

- `fix.js` — a corrected validation-memo module (self-contained, does
  not need to reuse the excerpt's exact structure) plus a self-test
  block runnable with `node fix.js` printing a PASS/FAIL line for:
  1. after feeding 120 distinct requests (differing only in
     `traceId`) through the memo, the memo holds at most 64 entries
  2. two requests identical except for `traceId` produce a memo hit (a
     single stored entry, not two)
- `DIAGNOSIS.md` — explain the root cause using only the telemetry and
  excerpt above, and state which specific log signal confirms it.

## Constraints

- Plain JavaScript, no dependencies, `fix.js` at most 90 lines.
- The memo must remain a general-purpose validation cache (bounded
  size, hits still possible on repeated logical requests) rather than
  a special case for the two listed self-test scenarios.
