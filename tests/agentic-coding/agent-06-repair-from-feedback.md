---
id: agent-06-repair-from-feedback
category: agentic-coding
title: "Repair a near-miss clamp from failing feedback"
deliverables:
  - clamp.js
---

## Task

A previous attempt left this `clamp.js` in your run folder context.
**Copy it as the starting point**, then repair it.

```js
function clamp(n, lo, hi) {
  if (n < lo) return lo;
  if (n > hi) return hi;
  return n;
}
function clampRange(n, lo, hi) {
  // BUG still present: ignores lo > hi
  return clamp(n, lo, hi);
}
module.exports = { clamp, clampRange };

if (require.main === module) {
  const cases = [
    [5, 0, 10, 5],
    [-1, 0, 10, 0],
    [5, 10, 0, 5],
  ];
  let ok = true;
  for (const [n, lo, hi, exp] of cases) {
    const g = clampRange(n, lo, hi);
    const p = g === exp;
    console.log((p ? 'PASS' : 'FAIL') + ' clampRange(' + n + ',' + lo + ',' + hi + ')=' + g);
    if (!p) ok = false;
  }
  process.exit(ok ? 0 : 1);
}
```

**Feedback from review (must address):**

1. `clampRange(5, 10, 0)` should return `5` after swapping lo/hi when lo > hi.
2. Keep exports named `clamp` and `clampRange`.
3. Prefer a **small** fix (≤ 8 lines changed relative to the seed).

## Deliverables

- `clamp.js` — fixed file with self-tests that print PASS/FAIL.

## Constraints

- Single file, no deps, ≤ 40 lines.
- Do not rename exports.

