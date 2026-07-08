---
id: agent-05c-yagni-clamp
category: agentic-coding
title: Minimal fix: clamp without over-engineering
deliverables:
  - bound.js
---

## Task

`bound.js`: clamp(n, lo, hi) currently ignores hi.

```js
function clamp(n, lo, hi) {
  return n < lo ? lo : n;
}
module.exports = { clamp };
```

Fix only. Self-tests: clamp(5,0,10)→5, clamp(-1,0,10)→0, clamp(99,0,10)→10.
≤ 15 lines, no class hierarchy.

## Deliverables

- `bound.js`.

## Constraints

- ≤ 15 lines.
