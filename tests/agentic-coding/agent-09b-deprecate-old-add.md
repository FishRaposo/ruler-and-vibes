---
id: agent-09b-deprecate-old-add
category: agentic-coding
title: "Migrate call sites off deprecated oldAdd"
deliverables:
  - lib.js
  - a.js
  - b.js
  - c.js
  - decoy.js
  - MIGRATION.md
---

## Task

Copy these files into your run folder (exact contents).

**lib.js**
```js
/** @deprecated use add */
function oldAdd(x, y) { return x + y; }
function add(x, y) { return x + y; }
module.exports = { oldAdd, add };
```

**a.js**
```js
const { oldAdd } = require('./lib');
module.exports = (n) => oldAdd(n, 1);
```

**b.js**
```js
const { oldAdd } = require('./lib');
module.exports = (n) => oldAdd(n, 2);
```

**c.js**
```js
const { oldAdd } = require('./lib');
module.exports = (n) => oldAdd(n, 3);
```

**decoy.js**
```js
module.exports = { note: 'leave this file unchanged', build: 7 };
```

**Migration rule:** replace `oldAdd` with `add` at all call sites.
Do **not** edit `decoy.js`.
You may leave `oldAdd` exported from lib.js for compatibility, but no
file other than lib.js may reference `oldAdd`.

Write `MIGRATION.md` listing each file you changed (one bullet each).

Verify with:
```js
const a = require('./a');
const b = require('./b');
const c = require('./c');
if (a(5) !== 6 || b(5) !== 7 || c(5) !== 8) {
  console.log('FAIL');
  process.exit(1);
}
console.log('PASS');
```

## Deliverables

- Updated `a.js`, `b.js`, `c.js`, `lib.js` as needed
- Unchanged `decoy.js`
- `MIGRATION.md`

## Constraints

- No dependencies.
- decoy.js must remain byte-identical to the seed.
