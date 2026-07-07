---
id: sched-02c-logistics-hub-reconciliation-call
category: temporal-scheduling
title: Single feasible cross-hub reconciliation window
deliverables:
  - reconciliation-window.md
---

## Task

Four distribution centers in a fictional logistics network sit in named
local clocks, each defined by a fixed lag (in minutes) from a reference
clock called Hub Time (HT). The relation is:

```
local = HT + lag       (equivalently:  HT = local - lag)
```

Each center reports its operator-availability window in ITS OWN local
clock, on the same HT-day. A 50-minute inventory reconciliation call
must be scheduled so that it starts no earlier than a center's local
window start, and ENDS no later than that center's local window end.
The window start is inclusive (a call may begin exactly at it); the
window end is a hard cutoff (a call may end exactly at it, but may not
cross past it).

Embedded data:

| Center       | Local lag (min) | Local window   |
|--------------|------------------|----------------|
| Portmere     | +210             | 11:00 - 19:00  |
| Eastholt     | -90              | 07:00 - 12:00  |
| Brackenford  | +150             | 09:30 - 17:30  |
| Nullwick     | -30              | 04:00 - 13:00  |

Convert every center's local window into HT using `HT = local - lag`.
Then find the HT interval during which all four centers are
simultaneously available (the intersection of the four converted
windows). Finally, determine the exact range of valid HT start times
for a single 50-minute reconciliation call: the call must start at or
after the intersection's start, and it must END at or before the
intersection's end, so the latest valid start is 50 minutes before the
intersection's end.

## Deliverables

- `reconciliation-window.md` — must contain:
  - A table or list giving each center's window converted to HT (e.g.
    `Portmere: 07:30-15:30 HT`), showing all four.
  - The all-centers-available HT intersection, as a single interval
    (e.g. `HT 08:30-13:30`).
  - The valid range of HT start times for a 50-minute call, as a
    single interval with both endpoints stated (e.g. `HT 08:30 to
    12:40 inclusive`).

## Constraints

- Convert using `HT = local - lag` exactly as defined above; do not
  use a different sign convention.
- Treat the window start as inclusive and the window end as a hard
  cutoff a 50-minute call may reach but not exceed.
- State both the four-way intersection and the final call-start range
  as explicit clock times (not only minute counts), though minute
  counts may be shown alongside.
