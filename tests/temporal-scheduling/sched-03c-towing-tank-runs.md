---
id: sched-03c-towing-tank-runs
category: temporal-scheduling
title: Makespan under two-towing-tank contention
deliverables:
  - tow-schedule.md
---

## Task

Seven fictional hull-model tow-test runs (H1-H7) must be conducted
using exactly TWO identical towing tanks at a naval architecture test
facility. Each run uses exactly one towing tank, non-preemptively
(once a carriage tow begins, it runs the full test course to
completion without stopping), and each towing tank tows only one run
at a time. Fixture-reuse constraints additionally restrict start
order: a run cannot begin until every run it depends on has finished
and its hull model has been demounted from the instrumented tow
carriage, regardless of which tank that prerequisite run used.

Because there are only two towing tanks (not unlimited test capacity),
runs that are all "ready" to start at the same time may still have to
wait for a tank to free up — this is a different mechanic from an
unlimited-parallelism test schedule.

**Scheduling rule (pinned, deterministic):** simulate discrete events
in time order. Whenever a towing tank becomes free, start on it the
highest-priority run (by the priority list order below) whose
prerequisite runs are ALL finished by that moment. If, at that
instant, no remaining run is ready (every remaining run is still
waiting on a prerequisite currently underway in the other tank), the
freed tank idle-waits and is reconsidered at the next run-completion
event. Ties in "tank becomes free" time break to the lower-indexed
tank (tank 0 before tank 1); if both tanks are free at the same
instant, the highest-priority ready run is started in the
lower-indexed tank first, then the next-highest-priority ready run (if
any) goes into the other free tank.

Embedded data:

| Run | Duration (min) | Depends on |
|-----|-----------------|------------|
| H1  | 6               | none       |
| H2  | 4               | none       |
| H3  | 10              | H1         |
| H4  | 3               | H2         |
| H5  | 7               | H2         |
| H6  | 6               | H3, H4     |
| H7  | 9               | H5         |

Priority list order (for the "highest-priority ready run" rule above):
H1, H2, H3, H4, H5, H6, H7.

Both towing tanks (call them t0 and t1) are free and idle at t = 0
(minutes).

Simulate this rule exactly and produce the full per-run assignment
(which tank, start time, end time) and the makespan (the latest end
time across all seven runs).

## Deliverables

- `tow-schedule.md` — must contain:
  - A table with exact columns `Run | Tank | Start | End`, one row per
    run, all seven runs.
  - The makespan stated as a single number.

## Constraints

- Follow the pinned scheduling rule exactly: priority-list order
  breaks ties among ready runs, lower-indexed tank breaks ties among
  free tanks, and a freed tank with no ready run idle-waits until the
  next completion event rather than being started on an unready run.
- Respect the fixture dependency: a run's start must be at or after
  the finish time of every run it depends on.
- Respect the two-tank capacity: no two runs may occupy the same tank
  at overlapping times.
- Do not treat this as unlimited-parallelism scheduling — the two-tank
  cap can force a run to wait even when its own prerequisite runs are
  already finished.
