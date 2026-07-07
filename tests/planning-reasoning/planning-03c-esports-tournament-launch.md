---
id: planning-03c-esports-tournament-launch
category: planning-reasoning
title: Community esports tournament launch schedule
deliverables:
  - PLAN.md
---

## Task

A community center is organizing its first local esports tournament.
Below is the full list of setup tasks, each with a duration in working
days and the other tasks it depends on (a task cannot start until every
task it depends on has finished).

| Task | Name                                     | Duration (days) | Depends on |
|------|-------------------------------------------|------------------|------------|
| P    | Secure venue lease                         | 5                | none       |
| Q    | Order gaming PCs                           | 12               | none       |
| R    | Recruit volunteer referees                 | 7                | none       |
| S    | Build tournament stage                     | 6                | P          |
| T    | Decorate stage                             | 2                | S          |
| U    | Deploy gaming PCs to stage                 | 2                | Q, S       |
| V    | Certify referees on tournament software    | 4                | R, U       |
| W    | Final rehearsal                            | 2                | T, V       |

**Time-point convention (pinned):** the project starts at time point 0.
A task's earliest start (ES) is the earliest time point at which every
task it depends on has finished; its earliest finish (EF) equals its
earliest start plus its duration. A task with no dependencies has
ES = 0. Worked example: Task P has no dependencies, so ES = 0 and
EF = 0 + 5 = 5.

When a task depends on more than one other task, it cannot start until
**all** of them have finished.

Compute the full schedule and identify the critical path (the chain of
dependent tasks with zero slack that determines the minimum time to
finish the whole project).

## Deliverables

- `PLAN.md` — must contain a markdown table with exact columns
  `Task | ES | EF | Slack` (one row per task, using the time-point
  convention above), followed by a statement of the minimum project
  duration, the single critical path (as a chain of task letters), and
  the slack of every non-critical task.

## Constraints

- Use exactly the time-point convention pinned above. Show ES and EF
  for every task, not just the critical ones.
