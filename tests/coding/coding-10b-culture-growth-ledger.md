---
id: coding-10b-culture-growth-ledger
category: coding
title: Exact-count hourly culture-growth ledger
deliverables:
  - culture.js
---

## Task

Implement `culture(seedCells, hourlyPtt, hours)` for a fictional
bioreactor where a viable-cell population grows every hour on an
integer cell count. `hourlyPtt` is the hourly growth rate in
per-ten-thousand units (e.g. `315` means the population grows by
315/10000 = 3.15% each hour).

The whole computation must stay in integer cells from start to finish
— never accumulate a floating-point fractional-cell population and
round only at the end; round every single hour, on the integer cell
count, using EXACTLY this expression for that hour's growth (in cells):

```js
Math.floor(count * hourlyPtt / 10000 + 0.5)
```

This is round-half-up applied every hour. Use this exact expression —
do not substitute a different rounding rule (e.g. banker's rounding),
even if you'd normally prefer one; the pinned expression is what's
graded. After computing an hour's growth, add it to the count (still an
integer) before moving to the next hour.

## Deliverables

- `culture.js` — exports `culture(seedCells, hourlyPtt, hours)`
  via `module.exports`. It must return an object
  `{ finalCells, schedule }` where `schedule` is an array of
  `hours` rows, each row `[hour, growthCells, countCells]` (1
  is the first hour), where `countCells` is the running population
  AFTER that hour's growth is added. `finalCells` equals the last
  row's `countCells`. When run with `node culture.js`, it must call
  `culture(3100000, 315, 12)` and print the final population and the
  full 12-row schedule.

## Constraints

- Plain JavaScript, no dependencies, single file, at most 80 lines.
- All arithmetic is on integer cells throughout — no step may compute
  or carry a fractional-cell or floating-population amount that later
  gets rounded down to whole cells. Every value in `schedule` must be
  an integer.
