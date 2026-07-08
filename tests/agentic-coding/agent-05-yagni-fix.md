---
id: agent-05-yagni-fix
category: agentic-coding
title: Minimal fix only — do not gold-plate
deliverables:
  - util.js
  - verify.js
---

## Task

Broken function in `util.js`:

```js
// Should return n*n for finite numbers; null otherwise.
function square(n) {
  return n + n; // BUG: doubles instead of squares
}
module.exports = { square };
```

**verify.js** (do not change):
```js
const { square } = require('./util');
const cases = [[2,4],[0,0],[-3,9]];
let ok = true;
for (const [n,e] of cases) {
  const g = square(n);
  const p = g === e;
  console.log((p?'PASS':'FAIL')+' square('+n+')='+g);
  if (!p) ok = false;
}
// null case
const z = square('x');
const p2 = z === null;
console.log((p2?'PASS':'FAIL')+' non-number');
if (!p2) ok = false;
process.exit(ok?0:1);
```

Copy util.js + verify.js. Fix the bug with the **smallest correct change**.
Do **not** add classes, caching, CLI, TypeScript, or extra features beyond
making square() correct (including non-number → null).

## Deliverables

- `util.js` — fixed.
- `verify.js` — unchanged copy.

## Constraints

- util.js ≤ 20 lines.
- No dependencies.
- Gold-plating (frameworks, extra modules, >40 lines of helpers) fails craft.
