---
id: planning-04b-cascade-ridge-trail-race
category: planning-reasoning
title: Cascade Ridge Trail Race plan audit
deliverables:
  - AUDIT.md
  - REVISED-PLAN.md
---

## Task

The Cascade Ridge Trail Race organizing crew has drafted a task plan
and asked you to check it before locking it in publicly. The plan
promises a public **starting-gun** milestone on day 26.

**Time-point convention (pinned):** the project starts at time point 0.
A task's listed finish should equal its listed start plus its
duration. Worked example: if a task starts on day 5 with a duration of
4 days, its finish should be listed as day 9.

The four-person crew is Soraya, Otis, Kwame, and Farrah. Below is the
plan as drafted, with each task's duration, the other tasks it depends
on, its owner, and its listed start/finish days.

| Task | Name                                 | Duration (days) | Depends on   | Owner  | Listed start | Listed finish |
|------|----------------------------------------|------------------|--------------|--------|--------------|---------------|
| R1   | Secure course-use permit               | 4                | (none listed)| Soraya | 4            | 8             |
| R2   | Finalize sponsor list                  | 4                | (none listed)| Otis   | 0            | 4             |
| R3   | Map race route                         | 6                | R1           | Otis   | 8            | 14            |
| R4   | Order finish-line arches               | 5                | R3, R8       | Otis   | 14           | 19            |
| R5   | Assemble arch trusses                  | 3                | R4           | Otis   | 19           | 22            |
| R6   | Recruit trail marshals                 | 6                | (none listed)| Kwame  | 0            | 6             |
| R7   | Train trail marshals                   | 4                | R6           | Kwame  | 6            | 10            |
| R8   | Install timing mats                    | 5                | R5           | Otis   | 22           | 27            |
| R9   | Print race-day maps                    | 5                | R2           | Farrah | 4            | 9             |
| R10  | Place mile-marker signage              | 4                | R1           | Farrah | 8            | 12            |
| R11  | Rehearse starting-line announcement    | 4                | R7, R10      | Kwame  | 12           | 21            |
| R12  | Starting-line readiness check          | 2                | R9, R11, R8  | Soraya | 27           | 29            |

Additional context from the planning notes (prose):

- The sponsor list (R2) is the document whose confirmed names must be
  listed on the course-use permit application, so the permit (R1)
  cannot logically be secured until the sponsor list has been
  finalized.
- Ordering the finish-line arches (R4) is a procurement step with no
  logical dependency on the timing mats being physically installed
  (R8); nothing about R4 requires R8 to have happened first.
- Soraya has no other commitments outside the two tasks listed for her
  above.

The plan contains multiple defects. You are not told how many. Find
all of them, and produce a corrected plan.

## Deliverables

- `AUDIT.md` — list every defect you find. For each one, name the
  exact task(s) involved and explain why it is a defect, citing the
  table and/or prose above.
- `REVISED-PLAN.md` — a corrected dependency table and a recomputed
  schedule as a markdown table with exact columns
  `Task | ES | EF | Slack`, plus the corrected project completion day
  and critical path. State explicitly whether the promised day-26
  starting-gun milestone is feasible, and if not, the earliest
  feasible day.

## Constraints

- Use exactly the time-point convention pinned above.
- Any repair to a resource conflict must not change the recomputed
  project completion day.
