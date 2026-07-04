---
id: sched-01-earliest-finish-dag
category: temporal-scheduling
title: Earliest finish on a dependency DAG
deliverables:
  - schedule.md
---

## Task

Zenith Fabrication is a fictional build pipeline with 8 tasks (A-H), each
with a fixed duration in hours and a set of precedence edges. An edge
X -> Y means task Y cannot start until task X has FULLY finished. There
are unlimited workers, so any tasks whose predecessors are all finished
can run in parallel — the only constraint is precedence, never resource
contention.

**Time-point convention (pinned):** the project starts at time point 0.
A task starts as soon as ALL of its predecessors have finished, and then
runs uninterrupted for its full duration. A task's start time equals the
maximum of its predecessors' finish times (0 if it has no predecessors);
its finish time equals its start time plus its duration. Worked example:
task A has no predecessors, so start = 0 and finish = 0 + 4 = 4.

Durations (hours):

| Task | Duration | Depends on |
|------|----------|------------|
| A    | 4        | none       |
| B    | 3        | A          |
| C    | 6        | A          |
| D    | 2        | B          |
| E    | 5        | B, C       |
| F    | 1        | D          |
| G    | 4        | E, F       |
| H    | 2        | C          |

When a task depends on more than one other task, it cannot start until
**all** of them have finished — its start is the maximum, not the sum
and not a single predecessor's finish time, over all of its
predecessors' finish times.

Compute the full schedule, the project's earliest possible finish (the
maximum finish time over all 8 tasks), and the critical path — the
chain of tasks from a task with no predecessors to a task with no
successors whose total duration equals the project's earliest finish.

## Deliverables

- `schedule.md` — must contain:
  - A markdown table with exact columns `Task | Start | Finish`, one row
    per task, all 8 tasks (not just the critical-path ones).
  - A stated project earliest finish time (a single number, in hours).
  - The critical path, written as a chain of task letters joined by
    `->` (e.g. `A -> X -> Y`).

## Constraints

- Use exactly the time-point convention pinned above: start = max of
  predecessor finish times (0 if none), finish = start + duration.
- Show every task's start and finish, not only the tasks on the
  critical path.
- The critical path must be the actual chain of tasks whose durations
  sum to the project's earliest finish — not merely the visually
  shortest or most obvious chain in the table.
