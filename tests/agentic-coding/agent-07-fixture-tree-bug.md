---
id: agent-07-fixture-tree-bug
category: agentic-coding
title: "Find a bug in a small multi-file fixture tree"
deliverables:
  - math/add.js
  - math/index.js
  - app.js
  - BUGREPORT.md
---

## Task

Copy this **fixture tree** into your run folder (exact relative paths),
then fix the bug. The entrypoint looks fine; the defect is elsewhere.

**app.js**
```js
const { sum } = require('./math');
const n = sum(2, 3);
if (n !== 5) {
  console.log('FAIL sum', n);
  process.exit(1);
}
console.log('PASS sum');
process.exit(0);
```

**math/index.js**
```js
const { add } = require('./add');
function sum(a, b) {
  return add(a, b);
}
module.exports = { sum };
```

**math/add.js**
```js
// BUG: subtracts instead of adds
function add(a, b) {
  return a - b;
}
module.exports = { add };
```

Required: `node app.js` prints `PASS sum` and exits 0.
Also write `BUGREPORT.md` naming the file and the one-line defect.

## Deliverables

- `math/add.js`, `math/index.js`, `app.js` (fixed tree)
- `BUGREPORT.md`

## Constraints

- Do not add dependencies.
- Prefer fixing only the defective file; no drive-by renames.
- BUGREPORT.md ≤ 120 words.

