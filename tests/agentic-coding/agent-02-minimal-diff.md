---
id: agent-02-minimal-diff
category: agentic-coding
title: Minimal patch: off-by-one in clamp
deliverables:
  - clamp.js
---

## Task

File `clamp.js` is almost right. Change as little as possible.

```js
function clamp(n, lo, hi) {
  if (n < lo) return lo;
  if (n > hi) return hi;
  return n;
}
function clampRange(n, lo, hi) {
  // BUG: should swap when lo > hi, then clamp; currently ignores order
  return clamp(n, lo, hi);
}
module.exports = { clamp, clampRange };
```

Required behavior for `clampRange`: if `lo > hi`, swap them, then clamp.
Self-tests must run under `node clamp.js`.

Add a self-test block (when `require.main === module`) that prints PASS/FAIL
for at least: clampRange(5,0,10)→5, clampRange(-1,0,10)→0, clampRange(5,10,0)→5.

## Deliverables

- `clamp.js` — fixed function + self-tests.

## Constraints

- Single file, ≤ 45 lines, no deps.
- Do not rename exports. Prefer a 1–5 line fix over a rewrite.
