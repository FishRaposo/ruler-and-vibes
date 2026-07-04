---
id: planning-09-three-rooms
category: planning-reasoning
title: Three rooms and one impossible day
deliverables:
  - SCHEDULE.md
---

## Task

A company has exactly **three rooms** (R1, R2, R3) available for
meetings. Each meeting occupies a half-open time interval `[start,
end)` (it occupies every moment from `start` up to but not including
`end`). Two meetings may share the same room only if their intervals
do **not** overlap.

There are two independent scheduling instances below. Solve each one.

**Instance 1** — 7 meetings:

| Meeting | Start | End |
|---------|-------|-----|
| M1      | 9     | 10  |
| M2      | 9     | 11  |
| M3      | 10    | 12  |
| M4      | 11    | 13  |
| M5      | 9     | 10  |
| M6      | 12    | 14  |
| M7      | 13    | 15  |

Assign every one of these 7 meetings to a room (R1, R2, or R3) such
that no two meetings sharing a room overlap.

**Instance 2** — 8 meetings:

| Meeting | Start | End |
|---------|-------|-----|
| N1      | 9     | 12  |
| N2      | 10    | 13  |
| N3      | 10    | 11  |
| N4      | 10    | 14  |
| N5      | 13    | 15  |
| N6      | 12    | 14  |
| N7      | 9     | 10  |
| N8      | 14    | 16  |

Attempt the same task for these 8 meetings. If no valid assignment to
three rooms exists, do not force one — say so, and explain why, citing
the specific meetings and time window responsible.

## Deliverables

- `SCHEDULE.md` — must report, for **each** instance separately:
  - Instance 1: a full room assignment (which room each of the 7
    meetings is in).
  - Instance 2: either a full room assignment for all 8 meetings, OR
    an explicit declaration that no valid 3-room assignment exists,
    naming the specific overlapping meetings and time window that
    make it impossible.

## Constraints

- Do not drop, merge, or truncate any meeting from either instance.
- Do not invent a fourth room.
