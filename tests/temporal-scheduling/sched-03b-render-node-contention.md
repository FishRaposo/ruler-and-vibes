---
id: sched-03b-render-node-contention
category: temporal-scheduling
title: Makespan under two-node render-farm contention
deliverables:
  - render-schedule.md
---

## Task

Seven fictional shot-render jobs (R1-R7) must run on exactly TWO
identical GPU render nodes at the fictional Marrowlight Render Farm.
Each job runs on exactly one node, non-preemptively (once started it
renders straight through to completion without pausing), and each node
renders only one job at a time. Precedence edges additionally
constrain start order: a job cannot start until every job it depends on
has finished, regardless of which node that predecessor rendered on.

Because there are only two render nodes (not unlimited render
capacity), jobs that are all "ready" at the same time may still have to
wait for a node to free up — this is a different mechanic from an
unlimited-parallelism render queue.

**Scheduling rule (pinned, deterministic):** simulate discrete events
in time order. Whenever a node becomes free, assign it the
highest-priority job (by the priority list order below) whose
predecessors are ALL finished by that moment. If, at that instant, no
remaining job is ready (every remaining job is still waiting on a
predecessor that is rendering on the other node), the freed node
idle-waits and is reconsidered at the next job-completion event. Ties
in "node becomes free" time break to the lower-indexed node (node 0
before node 1); if both nodes are free at the same instant, the
highest-priority ready job is placed on the lower-indexed node first,
then the next-highest-priority ready job (if any) goes to the other
free node.

Embedded data:

| Job | Duration | Depends on |
|-----|----------|------------|
| R1  | 6        | none       |
| R2  | 4        | none       |
| R3  | 7        | R1         |
| R4  | 3        | R2         |
| R5  | 4        | R2         |
| R6  | 3        | R3, R4     |
| R7  | 6        | R5         |

Priority list order (for the "highest-priority ready job" rule above):
R1, R2, R3, R4, R5, R6, R7.

Both nodes (call them g0 and g1) are free and idle at t = 0.

Simulate this rule exactly and produce the full per-job assignment
(which node, start time, end time) and the makespan (the latest end
time across all seven jobs).

## Deliverables

- `render-schedule.md` — must contain:
  - A table with exact columns `Job | Node | Start | End`, one row per
    job, all seven jobs.
  - The makespan stated as a single number.

## Constraints

- Follow the pinned scheduling rule exactly: priority-list order
  breaks ties among ready jobs, lower-indexed node breaks ties among
  free nodes, and a freed node with no ready job idle-waits until the
  next completion event rather than being assigned an unready job.
- Respect precedence: a job's start must be at or after the finish
  time of every job it depends on.
- Respect the two-node capacity: no two jobs may occupy the same node
  at overlapping times.
- Do not treat this as unlimited-parallelism scheduling — the two-node
  cap can force a job to wait even when its own predecessors are
  already finished.
