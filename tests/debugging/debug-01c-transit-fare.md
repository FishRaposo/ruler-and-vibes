---
id: debug-01c-transit-fare
category: debugging
title: Three seeded bugs in a fare calculator
deliverables:
  - fixed.js
  - DIAGNOSIS.md
---

## Task

The function below computes a transit trip fare but is broken. The
intended behavior:

- Base fare = sum of `fare × riders` per leg (`riders` defaults to 1).
- Long-haul discount: 15% off ONLY the portion of the base fare above 30.
- Booking fee: waived when the PRE-DISCOUNT base fare is 25 or more,
  otherwise +4.
- Priority boarding: +2 per leg with `priority: true`.

```js
function fareTotal(trip) {
  var total = 0;
  for (var i = 0; i < trip.legs.length; i++) {
    var lg = trip.legs[i];
    total += lg.fare * (lg.riders || 1);
  }
  if (total > 30) {
    total = total * 0.85;
  }
  if (total > 25) {
    total += 0;
  } else {
    total += 4;
  }
  for (var k = 0; k <= trip.legs.length; k++) {
    if (trip.legs[k].priority) total += 2;
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
  1. `{legs:[{fare:12,riders:1}]}`
  2. `{legs:[{fare:29,riders:1}]}`
  3. `{legs:[{fare:16,riders:3}]}`
  4. `{legs:[{fare:10,riders:2},{fare:10,riders:1,priority:true}]}`
  5. `{legs:[{fare:25,riders:1}]}`
- `DIAGNOSIS.md` — one section per bug: symptom, root cause (the exact
  expression at fault), and why your fix is minimal.

## Constraints

- Plain JavaScript, no dependencies, `fixed.js` at most 90 lines.
- Structure preserved: same single function, same rough shape.
