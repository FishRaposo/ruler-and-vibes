---
id: agent-01-multi-file-fix
category: agentic-coding
title: Fix a bug spanning two modules
deliverables:
  - cart.js
  - tax.js
  - verify.js
---

## Task

You are given a tiny Node project (three source files below) that should
export a price calculator. Running `node verify.js` currently fails.

**cart.js**
```js
const { taxRate } = require('./tax');
function lineTotal(item) {
  return item.qty * item.unitCents;
}
function cartTotal(items) {
  let sum = 0;
  for (const it of items) sum += lineTotal(it);
  return Math.round(sum * (1 + taxRate()));
}
module.exports = { cartTotal, lineTotal };
```

**tax.js**
```js
// Intent: 8.5% sales tax as a fraction.
function taxRate() {
  return 8.5; // BUG: returns percent, not fraction
}
module.exports = { taxRate };
```

**verify.js** (do not change; judge runs this against your copies)
```js
const { cartTotal } = require('./cart');
const cases = [
  { items: [{ qty: 2, unitCents: 100 }], expect: 217 },
  { items: [], expect: 0 },
  { items: [{ qty: 1, unitCents: 200 }, { qty: 3, unitCents: 50 }], expect: 380 },
];
let ok = true;
for (const c of cases) {
  const got = cartTotal(c.items);
  const pass = got === c.expect;
  console.log((pass ? 'PASS' : 'FAIL') + ' got=' + got + ' expect=' + c.expect);
  if (!pass) ok = false;
}
process.exit(ok ? 0 : 1);
```

Copy `cart.js`, `tax.js`, and `verify.js` into your results folder. Fix the
bug with the **smallest correct change** so `node verify.js` exits 0. Do not
rewrite the project for style.

## Deliverables

- `cart.js`, `tax.js`, `verify.js` — working project; verify.js unchanged from the task.

## Constraints

- At most 40 lines total across cart.js + tax.js (excluding verify.js).
- No dependencies. Plain Node CommonJS only.
