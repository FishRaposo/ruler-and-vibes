---
id: agent-09c-deprecate-old-max
category: agentic-coding
title: "Migrate call sites off deprecated oldMax"
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
/** @deprecated use max2 */
function oldMax(x, y) { return x > y ? x : y; }
function max2(x, y) { return x > y ? x : y; }
module.exports = { oldMax, max2 };
```

**a.js**
```js
const { oldMax } = require('./lib');
module.exports = (n) => oldMax(n, 10);
```

**b.js**
```js
const { oldMax } = require('./lib');
module.exports = (n) => oldMax(n, 0);
```

**c.js**
```js
const { oldMax } = require('./lib');
module.exports = (n) => oldMax(n, -1);
```

**decoy.js**
```js
module.exports = { keep: true, stamp: 99 };
```

**Migration rule:** replace `oldMax` with `max2` at all call sites.
Do **not** edit `decoy.js`.
You may leave `oldMax` exported from lib.js, but no file other than
lib.js may reference `oldMax`.

Write `MIGRATION.md` listing each file you changed (one bullet each).

Verify:
```js
const a = require('./a');
const b = require('./b');
const c = require('./c');
if (a(3) !== 10 || b(-2) !== 0 || c(5) !== 5) {
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
