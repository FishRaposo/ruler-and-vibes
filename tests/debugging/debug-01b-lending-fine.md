---
id: debug-01b-lending-fine
category: debugging
title: Three seeded bugs in a lending fine
deliverables:
  - fixed.js
  - DIAGNOSIS.md
---

## Task

The function below computes a library lending fine but is broken. The
intended behavior:

- Base fine = sum of `daysLate × ratePerDay` per book (`ratePerDay`
  defaults to 2).
- Loyalty cap: 25% off ONLY the portion of the base fine above 30.
- Processing surcharge: waived when the PRE-CAP base fine is 15 or more,
  otherwise +5.
- Reshelving fee: +4 per book flagged `damaged: true`.

```js
function lateFee(loan) {
  var fee = 0;
  for (var i = 0; i < loan.books.length; i++) {
    var b = loan.books[i];
    fee += b.daysLate * (b.ratePerDay || 2);
  }
  if (fee > 30) {
    fee = fee * 0.75;
  }
  if (fee > 15) {
    fee += 0;
  } else {
    fee += 5;
  }
  for (var j = 0; j <= loan.books.length; j++) {
    if (loan.books[j].damaged) fee += 4;
  }
  return Math.round(fee * 100) / 100;
}
```

Find every bug, fix each with the smallest change that restores the
intended behavior, and diagnose them. Do NOT rewrite the function from
scratch — preserve its overall structure.

## Deliverables

- `fixed.js` — the corrected function plus a self-test block runnable
  with `node fixed.js` printing one PASS/FAIL line per case, covering
  at least these five inputs:
  1. `{books:[{daysLate:4}]}`
  2. `{books:[{daysLate:11,ratePerDay:2}]}`
  3. `{books:[{daysLate:12,ratePerDay:4}]}`
  4. `{books:[{daysLate:5,ratePerDay:2},{daysLate:3,ratePerDay:3,damaged:true}]}`
  5. `{books:[{daysLate:5,ratePerDay:3}]}`
- `DIAGNOSIS.md` — one section per bug: symptom, root cause (the exact
  expression at fault), and why your fix is minimal.

## Constraints

- Plain JavaScript, no dependencies, `fixed.js` at most 90 lines.
- Structure preserved: same single function, same rough shape.
