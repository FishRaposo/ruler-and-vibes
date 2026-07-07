---
id: planning-09c-amberlane-sound-booths
category: planning-reasoning
title: Three sound booths and one overbooked day
deliverables:
  - BOOKINGS.md
---

## Task

Amberlane Sound has exactly **three isolation booths** (Booth 1, Booth
2, Booth 3) available for recording sessions. Each session occupies a
half-open time interval `[start, end)` (it occupies every moment from
`start` up to but not including `end`). Two sessions may share a
booth only if their intervals do **not** overlap.

There are two independent scheduling instances below. Solve each one.

**Instance 1** — 7 sessions:

| Session | Start | End |
|---------|-------|-----|
| S1      | 8     | 10  |
| S2      | 8     | 11  |
| S3      | 9     | 10  |
| S4      | 11    | 13  |
| S5      | 11    | 15  |
| S6      | 13    | 16  |
| S7      | 15    | 17  |

Assign every one of these 7 sessions to a booth (Booth 1, Booth 2, or
Booth 3) such that no two sessions sharing a booth overlap.

**Instance 2** — 8 sessions:

| Session | Start | End |
|---------|-------|-----|
| T1      | 8     | 12  |
| T2      | 9     | 13  |
| T3      | 9     | 11  |
| T4      | 9     | 14  |
| T5      | 13    | 16  |
| T6      | 12    | 15  |
| T7      | 8     | 9   |
| T8      | 15    | 18  |

Attempt the same task for these 8 sessions. If no valid assignment to
three booths exists, do not force one — say so, and explain why,
citing the specific sessions and time window responsible.

## Deliverables

- `BOOKINGS.md` — must report, for **each** instance separately:
  - Instance 1: a full booth assignment (which booth each of the 7
    sessions is in).
  - Instance 2: either a full booth assignment for all 8 sessions, OR
    an explicit declaration that no valid 3-booth assignment exists,
    naming the specific overlapping sessions and time window that
    make it impossible.

## Constraints

- Do not drop, merge, or truncate any session from either instance.
- Do not invent a fourth booth.
