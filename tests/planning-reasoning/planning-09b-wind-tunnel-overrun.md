---
id: planning-09b-wind-tunnel-overrun
category: planning-reasoning
title: Four wind tunnels and an unschedulable day
deliverables:
  - SCHEDULE.md
---

## Task

An aerospace research lab has exactly **four wind tunnels** (W1, W2,
W3, W4) available for test runs. Each test run occupies a half-open
time interval `[start, end)` (it occupies every moment from `start`
up to but not including `end`). Two test runs may share the same
tunnel only if their intervals do **not** overlap.

There are two independent scheduling instances below. Solve each one.

**Instance 1** — 9 test runs:

| Run | Start | End |
|-----|-------|-----|
| C1  | 8     | 12  |
| C2  | 8     | 9   |
| C3  | 8     | 10  |
| C4  | 8     | 11  |
| C5  | 9     | 13  |
| C6  | 11    | 14  |
| C7  | 13    | 16  |
| C8  | 15    | 17  |
| C9  | 16    | 18  |

Assign every one of these 9 test runs to a tunnel (W1, W2, W3, or W4)
such that no two runs sharing a tunnel overlap.

**Instance 2** — 11 test runs:

| Run | Start | End |
|-----|-------|-----|
| D1  | 9     | 14  |
| D2  | 10    | 13  |
| D3  | 10    | 14  |
| D4  | 11    | 12  |
| D5  | 11    | 15  |
| D6  | 8     | 9   |
| D7  | 9     | 10  |
| D8  | 13    | 16  |
| D9  | 15    | 17  |
| D10 | 16    | 18  |
| D11 | 8     | 10  |

Attempt the same task for these 11 test runs. If no valid assignment
to four wind tunnels exists, do not force one — say so, and explain
why, citing the specific runs and time window responsible.

## Deliverables

- `SCHEDULE.md` — must report, for **each** instance separately:
  - Instance 1: a full tunnel assignment (which tunnel each of the 9
    test runs is in).
  - Instance 2: either a full tunnel assignment for all 11 test runs,
    OR an explicit declaration that no valid 4-tunnel assignment
    exists, naming the specific overlapping runs and time window that
    make it impossible.

## Constraints

- Do not drop, merge, or truncate any test run from either instance.
- Do not invent a fifth wind tunnel.
