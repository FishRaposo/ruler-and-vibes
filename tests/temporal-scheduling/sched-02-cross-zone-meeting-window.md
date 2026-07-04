---
id: sched-02-cross-zone-meeting-window
category: temporal-scheduling
title: Single feasible cross-zone meeting window
deliverables:
  - window.md
---

## Task

Four participants sit in fictional named time zones, each defined by a
fixed offset (in minutes) from a reference clock called Anchor Time
(AT). The relation is:

```
local = AT + offset       (equivalently:  AT = local - offset)
```

Each participant states their availability window in THEIR OWN local
clock, on the same AT-day. A 60-minute meeting must be scheduled so
that it starts no earlier than a participant's local window start, and
ENDS no later than that participant's local window end. The window
start is inclusive (a meeting may begin exactly at it); the window end
is a hard cutoff (a meeting may end exactly at it, but may not cross
past it).

Embedded data:

| Participant | Zone offset (min) | Local window   |
|-------------|--------------------|----------------|
| P1          | +120               | 09:00 - 17:00  |
| P2          | -180               | 08:00 - 12:00  |
| P3          | +300               | 13:00 - 21:00  |
| P4          | 0                  | 06:00 - 15:00  |

Convert every participant's local window into AT using
`AT = local - offset`. Then find the AT interval during which all four
participants are simultaneously available (the intersection of the
four converted windows). Finally, determine the exact range of valid
AT start times for a single 60-minute meeting: the meeting must start
at or after the intersection's start, and it must END at or before the
intersection's end, so the latest valid start is 60 minutes before the
intersection's end.

## Deliverables

- `window.md` — must contain:
  - A table or list giving each participant's window converted to AT
    (e.g. `P1: 07:00-15:00 AT`), showing all four.
  - The all-participants-available AT intersection, as a single
    interval (e.g. `AT 11:00-15:00`).
  - The valid range of AT start times for a 60-minute meeting, as a
    single interval with both endpoints stated (e.g. `AT 11:00 to
    14:00 inclusive`).

## Constraints

- Convert using `AT = local - offset` exactly as defined above; do not
  use a different sign convention.
- Treat the window start as inclusive and the window end as a hard
  cutoff a 60-minute meeting may reach but not exceed.
- State both the four-way intersection and the final meeting-start
  range as explicit clock times (not only minute counts), though
  minute counts may be shown alongside.
