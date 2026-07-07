---
id: sched-02b-ground-station-calibration-call
category: temporal-scheduling
title: Joint calibration window for four offset ground stations
deliverables:
  - calibration-window.md
---

## Task

Four ground stations in a fictional satellite-tracking network sit in
named offset zones, each defined by a fixed offset (in minutes) from a
reference clock called Grid Standard Time (GST). The relation is:

```
local = GST + offset       (equivalently:  GST = local - offset)
```

Each station reports its operator-availability window in ITS OWN local
clock, on the same GST-day. A 45-minute joint calibration call must be
scheduled so that it starts no earlier than a station's local window
start, and ENDS no later than that station's local window end. The
window start is inclusive (a call may begin exactly at it); the window
end is a hard cutoff (a call may end exactly at it, but may not cross
past it).

Embedded data:

| Station | Zone offset (min) | Local window   |
|---------|--------------------|----------------|
| Auk     | +180               | 10:00 - 18:00  |
| Lynx    | -60                | 07:00 - 11:00  |
| Ibex    | +240               | 14:00 - 22:00  |
| Tern    | +60                | 05:00 - 14:00  |

Convert every station's local window into GST using
`GST = local - offset`. Then find the GST interval during which all
four stations are simultaneously available (the intersection of the
four converted windows). Finally, determine the exact range of valid
GST start times for a single 45-minute calibration call: the call must
start at or after the intersection's start, and it must END at or
before the intersection's end, so the latest valid start is 45 minutes
before the intersection's end.

## Deliverables

- `calibration-window.md` — must contain:
  - A table or list giving each station's window converted to GST
    (e.g. `Auk: 07:00-15:00 GST`), showing all four.
  - The all-stations-available GST intersection, as a single interval
    (e.g. `GST 10:00-12:00`).
  - The valid range of GST start times for a 45-minute call, as a
    single interval with both endpoints stated (e.g. `GST 10:00 to
    11:15 inclusive`).

## Constraints

- Convert using `GST = local - offset` exactly as defined above; do
  not use a different sign convention.
- Treat the window start as inclusive and the window end as a hard
  cutoff a 45-minute call may reach but not exceed.
- State both the four-way intersection and the final call-start range
  as explicit clock times (not only minute counts), though minute
  counts may be shown alongside.
