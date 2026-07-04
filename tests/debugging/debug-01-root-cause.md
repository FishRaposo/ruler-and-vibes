---
id: debug-01-root-cause
category: debugging
title: Three seeded bugs, minimal fixes
deliverables:
  - fixed.js
  - DIAGNOSIS.md
---

## Task

The function below computes an order total but is broken. The intended
behavior:

- Subtotal = sum of `price × qty` per item (`qty` defaults to 1).
- Volume discount: 10% off ONLY the portion of the subtotal above 200.
- Shipping: free when the PRE-DISCOUNT subtotal is 100 or more,
  otherwise +12.
- Gift wrap: +3 per line item with `wrap: true`.

```js
function orderTotal(order) {
  var total = 0;
  for (var i = 0; i < order.items.length; i++) {
    var it = order.items[i];
    total += it.price * (it.qty || 1);
  }
  if (total > 200) {
    total = total * 0.9;
  }
  if (total > 100) {
    total += 0;
  } else {
    total += 12;
  }
  for (var j = 0; j <= order.items.length; j++) {
    if (order.items[j].wrap) total += 3;
  }
  return Math.round(total * 100) / 100;
}
```

Find every bug, fix each with the smallest change that restores the
intended behavior, and diagnose them. Do NOT rewrite the function from
scratch — preserve its overall structure.

## Deliverables

- `fixed.js` — the corrected function plus a self-test block runnable
  with `node fixed.js` printing one PASS/FAIL line per case, covering
  at least these five inputs:
  1. `{items:[{price:50,qty:1}]}`
  2. `{items:[{price:120,qty:1}]}`
  3. `{items:[{price:150,qty:2}]}`
  4. `{items:[{price:100,qty:1},{price:20,qty:5,wrap:true}]}`
  5. `{items:[{price:100,qty:1}]}`
- `DIAGNOSIS.md` — one section per bug: symptom, root cause (the exact
  expression at fault), and why your fix is minimal.

## Constraints

- Plain JavaScript, no dependencies, `fixed.js` at most 90 lines.
- Structure preserved: same single function, same rough shape.
