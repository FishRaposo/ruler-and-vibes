---
id: coding-10-exact-cents-interest-ledger
category: coding
title: Exact-cents monthly interest ledger
deliverables:
  - ledger.js
---

## Task

Implement `accrue(principalCents, annualBps, months)` for a fictional
savings product where interest compounds monthly on an integer-cent
balance. `annualBps` is the annual interest rate in basis points (e.g.
`500` means 5.00% per year).

The whole computation must stay in integer cents from start to finish
— never accumulate a floating-point dollar balance and round only at
the end; round every single month, on the integer-cent balance, using
EXACTLY this expression for that month's interest (in cents):

```js
Math.floor(balance * annualBps / 12 / 10000 + 0.5)
```

This is round-half-up applied every month. Use this exact expression —
do not substitute a different rounding rule (e.g. banker's rounding),
even if you'd normally prefer one; the pinned expression is what's
graded. After computing a month's interest, add it to the balance
(still in integer cents) before moving to the next month.

## Deliverables

- `ledger.js` — exports `accrue(principalCents, annualBps, months)`
  via `module.exports`. It must return an object
  `{ finalCents, schedule }` where `schedule` is an array of
  `months` rows, each row `[month, interestCents, balanceCents]` (1
  is the first month), where `balanceCents` is the running balance
  AFTER that month's interest is added. `finalCents` equals the last
  row's `balanceCents`. When run with `node ledger.js`, it must call
  `accrue(1000000, 500, 12)` and print the final balance and the full
  12-row schedule.

## Constraints

- Plain JavaScript, no dependencies, single file, at most 80 lines.
- All arithmetic is on integer cents throughout — no step may compute
  or carry a fractional-cent or floating-dollar amount that later gets
  rounded down to cents. Every value in `schedule` must be an integer.
