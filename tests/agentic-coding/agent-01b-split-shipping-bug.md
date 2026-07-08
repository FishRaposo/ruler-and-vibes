---
id: agent-01b-split-shipping-bug
category: agentic-coding
title: Fix shipping fee spanning modules
deliverables:
  - order.js
  - ship.js
  - verify.js
---

## Task

Tiny Node project: shipping fee is wrong. `node verify.js` fails.

**order.js**
```js
const { baseShip } = require('./ship');
function orderTotal(subtotalCents, remote) {
  return subtotalCents + baseShip(remote);
}
module.exports = { orderTotal };
```

**ship.js**
```js
// Intent: remote=true → 1200 cents flat; else 400.
function baseShip(remote) {
  return remote ? 12 : 4; // BUG: dollars, not cents
}
module.exports = { baseShip };
```

**verify.js**
```js
const { orderTotal } = require('./order');
const cases = [
  { s: 5000, r: false, e: 5400 },
  { s: 5000, r: true, e: 6200 },
  { s: 0, r: false, e: 400 },
];
let ok = true;
for (const c of cases) {
  const g = orderTotal(c.s, c.r);
  const p = g === c.e;
  console.log((p ? 'PASS' : 'FAIL') + ' got=' + g + ' expect=' + c.e);
  if (!p) ok = false;
}
process.exit(ok ? 0 : 1);
```

Copy all three files; fix with minimal change so verify exits 0.

## Deliverables

- `order.js`, `ship.js`, `verify.js` — working; verify.js unchanged.

## Constraints

- order.js + ship.js ≤ 35 lines total. No deps.
