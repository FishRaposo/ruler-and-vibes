---
id: agent-04c-pr-review-cache
category: agentic-coding
title: Review cache TTL diff
deliverables:
  - REVIEW.md
---

## Task

```diff
-function get(key) {
-  const e = map.get(key);
-  if (!e) return null;
-  if (Date.now() > e.exp) { map.delete(key); return null; }
-  return e.val;
-}
+function get(key) {
+  const e = map.get(key);
+  if (!e) return null;
+  if (Date.now() > e.exp) return e.val; // BUG: returns stale instead of delete
+  return e.val;
+}
```

Blockers to catch:
1. Expired entries returned instead of null (stale read).
2. Expired entries never deleted (leak) — may combine with (1).

Count as two distinct issues if both named, or one combined blocker that
covers stale+no-delete.

Decoy nit: could use Map.prototype — not a blocker.

REVIEW.md with ## Blockers / ## Nits.

## Deliverables

- `REVIEW.md`.

## Constraints

- ≤ 300 words.
