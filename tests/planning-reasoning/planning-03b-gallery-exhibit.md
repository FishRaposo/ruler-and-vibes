---
id: planning-03b-gallery-exhibit
category: planning-reasoning
title: Touring photography exhibit opening schedule
deliverables:
  - PLAN.md
---

## Task

A regional gallery is preparing to open a touring photography exhibit.
Below is the full list of setup tasks, each with a duration in working
days and the other tasks it depends on (a task cannot start until every
task it depends on has finished).

| Task | Name                          | Duration (days) | Depends on |
|------|-------------------------------|------------------|------------|
| A    | Confirm gallery booking       | 4                | none       |
| B    | Ship framed prints from archive | 9              | none       |
| C    | Build display wall panels     | 3                | A          |
| D    | Finish display wall panels    | 3                | C          |
| E    | Mount framed prints on walls  | 2                | B, C       |
| F    | Recruit gallery docents       | 6                | none       |
| G    | Train docents on the exhibit  | 3                | F, E       |
| H    | Run final press-preview walkthrough | 2          | D, G       |

**Time-point convention (pinned):** the project starts at time point 0.
A task's earliest start (ES) is the earliest time point at which every
task it depends on has finished; its earliest finish (EF) equals its
earliest start plus its duration. A task with no dependencies has
ES = 0. Worked example: Task A has no dependencies, so ES = 0 and
EF = 0 + 4 = 4.

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
