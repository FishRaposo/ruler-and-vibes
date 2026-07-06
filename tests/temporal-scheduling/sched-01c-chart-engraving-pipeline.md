---
id: sched-01c-chart-engraving-pipeline
category: temporal-scheduling
title: Earliest finish for a chart-engraving pipeline
deliverables:
  - schedule.md
---

## Task

Marlowe Cartography is a fictional nautical-chart engraving workshop with
8 stages (P-W), each with a fixed duration in hours and a set of
precedence edges. An edge X -> Y means stage Y cannot begin until stage X
has FULLY finished. The workshop has unlimited engravers, so any stages
whose predecessors are all finished can run in parallel — the only
constraint is precedence, never bench contention.

**Time-point convention (pinned):** the project starts at time point 0.
A stage starts as soon as ALL of its predecessors have finished, and then
runs uninterrupted for its full duration. A stage's start time equals the
maximum of its predecessors' finish times (0 if it has no predecessors);
its finish time equals its start time plus its duration. Worked example:
stage P has no predecessors, so start = 0 and finish = 0 + 5 = 5.

Durations (hours):

| Stage | Duration | Depends on |
|-------|----------|------------|
| P     | 5        | none       |
| Q     | 2        | P          |
| R     | 7        | P          |
| S     | 3        | Q          |
| T     | 6        | Q, R       |
| U     | 2        | S          |
| V     | 4        | T, U       |
| W     | 3        | R          |

When a stage depends on more than one other stage, it cannot begin until
**all** of them have finished — its start is the maximum, not the sum and
not a single predecessor's finish time, over all of its predecessors'
finish times.

Compute the full schedule, the project's earliest possible finish (the
maximum finish time over all 8 stages), and the critical path — the chain
of stages from a stage with no predecessors to a stage with no successors
whose total duration equals the project's earliest finish.

## Deliverables

- `schedule.md` — must contain:
  - A markdown table with exact columns `Task | Start | Finish`, one row
    per stage, all 8 stages (not just the critical-path ones).
  - A stated project earliest finish time (a single number, in hours).
  - The critical path, written as a chain of stage letters joined by
    `->` (e.g. `P -> X -> Y`).

## Constraints

- Use exactly the time-point convention pinned above: start = max of
  predecessor finish times (0 if none), finish = start + duration.
- Show every stage's start and finish, not only the stages on the
  critical path.
- The critical path must be the actual chain of stages whose durations
  sum to the project's earliest finish — not merely the visually shortest
  or most obvious chain in the table.
