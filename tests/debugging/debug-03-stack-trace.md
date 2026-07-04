---
id: debug-03-stack-trace
category: debugging
title: Read the Trace, Fix the Crash
deliverables:
  - cart.js
---

## Task

The **Lumen Goods** storefront cart summary function below is
crashing in production. Here is the file as currently shipped:

```js
// Lumen Goods storefront cart summary
// count = number of line items (NOT summed qty); total = sum(qty*unitPriceCents), integer cents
function summarizeCart(items) {
  var count = 0;
  var total = 0;
  for (var i = 0; i <= items.length; i++) {
    var item = items[i];
    count += 1;
    total += item.qty * item.unitPriceCents;
  }
  return { count: count, total: total };
}

module.exports = { summarizeCart: summarizeCart };
```

Here is the crash log from the error tracker:

```
TypeError: Cannot read properties of undefined (reading 'qty')
    at summarizeCart (cart.js:9)
```

Each cart item has the shape `{name, qty, unitPriceCents}`. Per the
header comment, `count` must be the number of line items (NOT the sum
of `qty`), and `total` must be the sum of `qty * unitPriceCents` in
integer cents.

Fix the crash and ship a working `cart.js`.

## Deliverables

- `cart.js` — the fixed function, exporting `summarizeCart` the same
  way the original does. It must correctly handle these three cases
  (do not merely stop it from throwing — the totals must be correct):
  1. `[{name:'candle',qty:2,unitPriceCents:350},{name:'soap',qty:1,unitPriceCents:499}]`
  2. `[{name:'lamp',qty:3,unitPriceCents:1400}]`
  3. `[]` (the empty cart)
## Constraints

- Plain JavaScript, no dependencies, `cart.js` at most 40 lines.
- The file must end with `module.exports = { summarizeCart }`; the
  judge's harness requires it.
