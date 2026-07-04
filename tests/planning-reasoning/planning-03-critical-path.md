---
id: planning-03-critical-path
category: planning-reasoning
title: Pop-up bakery launch schedule
deliverables:
  - PLAN.md
  - REASONING.md
---

## Task

A pop-up bakery stall is planning its launch. Below is the full list of
setup tasks, each with a duration in working days and the other tasks
it depends on (a task cannot start until every task it depends on has
finished).

| Task | Name              | Duration (days) | Depends on |
|------|-------------------|------------------|------------|
| A    | Obtain permit     | 3                | none       |
| B    | Order oven        | 8                | none       |
| C    | Build stall frame | 4                | A          |
| D    | Paint stall       | 2                | C          |
| E    | Install oven      | 1                | B, C       |
| F    | Hire staff        | 5                | none       |
| G    | Train staff       | 2                | F, E       |
| H    | Opening prep      | 1                | D, G       |

**Time-point convention (pinned):** the project starts at time point 0.
A task's earliest start (ES) is the earliest time point at which every
task it depends on has finished; its earliest finish (EF) equals its
earliest start plus its duration. A task with no dependencies has
ES = 0. Worked example: Task A has no dependencies, so ES = 0 and
EF = 0 + 3 = 3.

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
- `REASONING.md` (at most 300 words) — explain the method used to
  compute the schedule and identify the critical path.

## Constraints

- Use exactly the time-point convention pinned above. Show ES and EF
  for every task, not just the critical ones.
