---
id: agent-08c-pr-body-clampint
category: agentic-coding
title: "PR body must match a clampInt patch"
deliverables:
  - int.js
  - PR.md
---

## Task

Implement `clampInt` in `int.js`:

```js
function clampInt(n, lo, hi) {
  n = Number(n);
  if (!Number.isFinite(n)) return lo;
  n = Math.trunc(n);
  if (n < lo) return lo;
  if (n > hi) return hi;
  return n;
}
module.exports = { clampInt };

if (require.main === module) {
  const assert = (c, m) => { if (!c) { console.log('FAIL ' + m); process.exit(1); } };
  assert(clampInt(3.9, 0, 10) === 3, 'trunc');
  assert(clampInt(-2, 0, 10) === 0, 'lo');
  assert(clampInt('x', 0, 10) === 0, 'nan');
  console.log('PASS');
}
```

Write `PR.md` (`## Title`, `## Summary`, `## Test plan`).

Must mention truncation and non-finite → lo.  
Must **not** claim: WebSocket server, Kubernetes, ML model, or payment SDK.

## Deliverables

- `int.js`, `PR.md`

## Constraints

- int.js ≤ 35 lines. PR.md 60–180 words.

