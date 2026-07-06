---
id: coding-10c-integer-glarn-dividend-wallet
category: coding
title: Integer-glarn monthly dividend wallet
deliverables:
  - wallet.js
---

## Task

Implement `settle(principalUnits, annualPips, months)` for a fictional
in-game wallet where a monthly loyalty dividend compounds on an
integer-glarn balance (glarn is the game's currency; balances are always
whole glarn). `annualPips` is the annual dividend rate in pips, where one
pip is one ten-thousandth (e.g. `700` means 7.00% per year).

The whole computation must stay in integer glarn from start to finish
— never accumulate a floating-point "fractional-glarn" balance and round
only at the end; round every single month, on the integer-glarn balance,
using EXACTLY this expression for that month's dividend (in glarn):

```js
Math.floor(balance * annualPips / 12 / 10000 + 0.5)
```

This is round-half-up applied every month. Use this exact expression —
do not substitute a different rounding rule (e.g. banker's rounding),
even if you'd normally prefer one; the pinned expression is what's
graded. After computing a month's dividend, add it to the balance
(still in integer glarn) before moving to the next month.

## Deliverables

- `wallet.js` — exports `settle(principalUnits, annualPips, months)`
  via `module.exports`. It must return an object
  `{ finalUnits, schedule }` where `schedule` is an array of
  `months` rows, each row `[month, dividendUnits, balanceUnits]` (1
  is the first month), where `balanceUnits` is the running balance
  AFTER that month's dividend is added. `finalUnits` equals the last
  row's `balanceUnits`. When run with `node wallet.js`, it must call
  `settle(590000, 700, 15)` and print the final balance and the full
  15-row schedule.

## Constraints

- Plain JavaScript, no dependencies, single file, at most 80 lines.
- All arithmetic is on integer glarn throughout — no step may compute
  or carry a fractional-glarn or floating "dollar" amount that later gets
  rounded down to whole glarn. Every value in `schedule` must be an integer.
