---
id: agent-07b-fixture-tree-greet
category: agentic-coding
title: "Find a bug in a multi-file greet fixture"
deliverables:
  - text/join.js
  - text/index.js
  - app.js
  - BUGREPORT.md
---

## Task

Copy this fixture tree, then fix the bug. Entrypoint looks fine.

**app.js**
```js
const { greet } = require('./text');
const s = greet('Ada');
if (s !== 'Hello, Ada') {
  console.log('FAIL', s);
  process.exit(1);
}
console.log('PASS greet');
process.exit(0);
```

**text/index.js**
```js
const { join } = require('./join');
function greet(name) {
  return join('Hello,', name);
}
module.exports = { greet };
```

**text/join.js**
```js
// BUG: forgets the space
function join(a, b) {
  return a + b;
}
module.exports = { join };
```

Required: `node app.js` prints `PASS greet`. Write `BUGREPORT.md`
naming the file and defect.

## Deliverables

- `text/join.js`, `text/index.js`, `app.js`, `BUGREPORT.md`

## Constraints

- No dependencies. Prefer fixing only the defective file.
- BUGREPORT.md ≤ 120 words.

