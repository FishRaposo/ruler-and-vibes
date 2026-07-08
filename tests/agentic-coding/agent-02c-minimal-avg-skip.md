---
id: agent-02c-minimal-avg-skip
category: agentic-coding
title: Minimal patch: average skipping nulls
deliverables:
  - avg.js
---

## Task

`avg.js`:
```js
function avg(nums) {
  let s = 0, n = 0;
  for (const x of nums) {
    if (x === null || x === undefined) continue;
    s += x; n++;
  }
  return s / n; // BUG: n===0 should return null, not NaN
}
module.exports = { avg };
```

Fix so empty-after-skip returns null. Self-tests: [1,2,3]→2; [null,4,null]→4; []→null; [null]→null.

## Deliverables

- `avg.js`.

## Constraints

- ≤ 35 lines.
