---
id: agent-01c-discount-stack-bug
category: agentic-coding
title: Fix discount helper used by checkout
deliverables:
  - checkout.js
  - coupon.js
  - verify.js
---

## Task

**checkout.js**
```js
const { applyCoupon } = require('./coupon');
function checkout(subtotal, code) {
  return applyCoupon(subtotal, code);
}
module.exports = { checkout };
```

**coupon.js**
```js
// Intent: code "SAVE10" → 10% off; anything else → unchanged.
function applyCoupon(subtotal, code) {
  if (code === 'SAVE10') return subtotal - 10; // BUG: $10 off, not 10%
  return subtotal;
}
module.exports = { applyCoupon };
```

**verify.js**
```js
const { checkout } = require('./checkout');
const cases = [
  { s: 200, c: 'SAVE10', e: 180 },
  { s: 200, c: 'NOPE', e: 200 },
  { s: 50, c: 'SAVE10', e: 45 },
];
let ok = true;
for (const x of cases) {
  const g = checkout(x.s, x.c);
  const p = g === x.e;
  console.log((p ? 'PASS' : 'FAIL') + ' got=' + g + ' expect=' + x.e);
  if (!p) ok = false;
}
process.exit(ok ? 0 : 1);
```

Copy three files; minimal fix; verify green.

## Deliverables

- `checkout.js`, `coupon.js`, `verify.js`.

## Constraints

- checkout.js + coupon.js ≤ 35 lines. No deps.
