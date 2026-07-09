---
id: agent-09-deprecate-api-call-sites
category: agentic-coding
title: "Migrate call sites off a deprecated helper"
deliverables:
  - lib.js
  - a.js
  - b.js
  - c.js
  - decoy.js
  - MIGRATION.md
---

## Task

Copy these files into your run folder.

**lib.js**
```js
/** @deprecated use mul */
function oldMul(x, y) { return x * y; }
function mul(x, y) { return x * y; }
module.exports = { oldMul, mul };
```

**a.js** — `const { oldMul } = require('./lib'); module.exports = (n) => oldMul(n, 2);`
**b.js** — `const { oldMul } = require('./lib'); module.exports = (n) => oldMul(n, 3);`
**c.js** — `const { oldMul } = require('./lib'); module.exports = (n) => oldMul(n, 4);`
**decoy.js** — `module.exports = { note: 'leave this file unchanged', version: 1 };`

**Migration rule:** replace `oldMul` with `mul` at all call sites.
Do **not** edit `decoy.js`.
You may leave `oldMul` exported from lib.js for compatibility, but no
file other than lib.js may reference `oldMul`.

Write `MIGRATION.md` listing each file you changed (one bullet each).

Verify with:
```js
// run as node -e or a small check.js you may add only if needed
const a = require('./a'); const b = require('./b'); const c = require('./c');
if (a(2) !== 4 || b(2) !== 6 || c(2) !== 8) { console.log('FAIL'); process.exit(1); }
console.log('PASS');
```

## Deliverables

- Updated `a.js`, `b.js`, `c.js`, `lib.js` as needed
- Unchanged `decoy.js`
- `MIGRATION.md`

## Constraints

- No dependencies.
- decoy.js must remain byte-identical to the seed.

