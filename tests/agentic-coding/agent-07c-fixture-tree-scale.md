---
id: agent-07c-fixture-tree-scale
category: agentic-coding
title: "Find a bug in a multi-file scale fixture"
deliverables:
  - num/scale.js
  - num/index.js
  - app.js
  - BUGREPORT.md
---

## Task

Copy this fixture tree, then fix the bug.

**app.js**
```js
const { percent } = require('./num');
const p = percent(25, 200);
if (p !== 12.5) {
  console.log('FAIL', p);
  process.exit(1);
}
console.log('PASS percent');
process.exit(0);
```

**num/index.js**
```js
const { scale } = require('./scale');
function percent(part, whole) {
  return scale(part, whole, 100);
}
module.exports = { percent };
```

**num/scale.js**
```js
// BUG: multiplies by factor incorrectly (divides instead)
function scale(part, whole, factor) {
  return (part / whole) / factor;
}
module.exports = { scale };
```

Required: `node app.js` → `PASS percent`. `BUGREPORT.md` names file + defect.

## Deliverables

- `num/scale.js`, `num/index.js`, `app.js`, `BUGREPORT.md`

## Constraints

- No deps. Prefer one-file fix. BUGREPORT ≤ 120 words.

