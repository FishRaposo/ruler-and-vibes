---
id: sched-01b-banquet-prep-critical-path
category: temporal-scheduling
title: Banquet prep critical path on a dependency DAG
deliverables:
  - prep-plan.md
---

## Task

Solstice Commissary is a fictional banquet kitchen with 8 prep stages
(P-W), each with a fixed hands-on duration in minutes and a set of
precedence edges. An edge X -> Y means stage Y cannot begin until stage
X has FULLY completed. Staffing is effectively unlimited, so any stages
whose prerequisites are all done can proceed at the same time — the only
constraint is precedence, never crew or bench contention.

**Time-point convention (pinned):** the shift starts at time point 0. A
stage begins as soon as ALL of its prerequisites have completed, and
then runs uninterrupted for its full duration. A stage's start time
equals the maximum of its prerequisites' completion times (0 if it has
no prerequisites); its completion time equals its start time plus its
duration. Worked example: stage P has no prerequisites, so start = 0 and
completion = 0 + 5 = 5.

Durations (minutes):

| Stage | Duration | Depends on |
|-------|----------|------------|
| P     | 5        | none       |
| Q     | 4        | P          |
| R     | 7        | P          |
| S     | 3        | Q          |
| T     | 6        | Q, R       |
| U     | 2        | S          |
| V     | 4        | T, U       |
| W     | 3        | R          |

When a stage depends on more than one other stage, it cannot begin until
**all** of them have completed — its start is the maximum, not the sum
and not a single prerequisite's completion time, over all of its
prerequisites' completion times.

Compute the full plan, the shift's earliest possible completion (the
maximum completion time over all 8 stages), and the critical path — the
chain of stages from a stage with no prerequisites to a stage with no
dependents whose total duration equals the shift's earliest completion.

## Deliverables

- `prep-plan.md` — must contain:
  - A markdown table with exact columns `Stage | Start | Completion`,
    one row per stage, all 8 stages (not just the critical-path ones).
  - A stated shift earliest completion time (a single number, in
    minutes).
  - The critical path, written as a chain of stage letters joined by
    `->` (e.g. `P -> X -> Y`).

## Constraints

- Use exactly the time-point convention pinned above: start = max of
  prerequisite completion times (0 if none), completion = start +
  duration.
- Show every stage's start and completion, not only the stages on the
  critical path.
- The critical path must be the actual chain of stages whose durations
  sum to the shift's earliest completion — not merely the visually
  shortest or most obvious chain in the table.
