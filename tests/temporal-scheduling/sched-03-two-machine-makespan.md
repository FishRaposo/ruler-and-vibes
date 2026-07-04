---
id: sched-03-two-machine-makespan
category: temporal-scheduling
title: Makespan under two-machine resource contention
deliverables:
  - schedule.md
---

## Task

Seven fictional jobs (J1-J7) must run on exactly TWO identical
machines. Each job runs on exactly one machine, non-preemptively (once
started it runs to completion without pausing), and each machine
processes only one job at a time. Precedence edges additionally
constrain start order: a job cannot start until every job it depends on
has finished, regardless of which machine that predecessor ran on.

Because there are only two machines (not unlimited workers), jobs that
are all "ready" at the same time may still have to wait for a machine
to free up — this is a different mechanic from an unlimited-parallelism
schedule.

**Scheduling rule (pinned, deterministic):** simulate discrete events
in time order. Whenever a machine becomes free, assign it the
highest-priority job (by the priority list order below) whose
predecessors are ALL finished by that moment. If, at that instant, no
remaining job is ready (every remaining job is still waiting on a
predecessor that is running on the other machine), the freed machine
idle-waits and is reconsidered at the next job-completion event. Ties
in "machine becomes free" time break to the lower-indexed machine
(machine 0 before machine 1); if both machines are free at the same
instant, the highest-priority ready job is placed on the lower-indexed
machine first, then the next-highest-priority ready job (if any) goes
to the other free machine.

Embedded data:

| Job | Duration | Depends on |
|-----|----------|------------|
| J1  | 5        | none       |
| J2  | 3        | none       |
| J3  | 8        | J1         |
| J4  | 2        | J2         |
| J5  | 6        | J2         |
| J6  | 4        | J3, J4     |
| J7  | 7        | J5         |

Priority list order (for the "highest-priority ready job" rule above):
J1, J2, J3, J4, J5, J6, J7.

Both machines (call them m0 and m1) are free and idle at t = 0.

Simulate this rule exactly and produce the full per-job assignment
(which machine, start time, end time) and the makespan (the latest end
time across all seven jobs).

## Deliverables

- `schedule.md` — must contain:
  - A table with exact columns `Job | Machine | Start | End`, one row
    per job, all seven jobs.
  - The makespan stated as a single number.

## Constraints

- Follow the pinned scheduling rule exactly: priority-list order breaks
  ties among ready jobs, lower-indexed machine breaks ties among free
  machines, and a freed machine with no ready job idle-waits until the
  next completion event rather than being assigned an unready job.
- Respect precedence: a job's start must be at or after the finish time
  of every job it depends on.
- Respect the two-machine capacity: no two jobs may occupy the same
  machine at overlapping times.
- Do not treat this as unlimited-parallelism scheduling — the
  two-machine cap can force a job to wait even when its own
  predecessors are already finished.
