---
id: planning-04c-planetarium-premiere-audit
category: planning-reasoning
title: Castellane Planetarium premiere-night plan audit
deliverables:
  - AUDIT.md
  - REVISED-PLAN.md
---

## Task

The Castellane Planetarium's production team has drafted a task plan
for their new dome show and asked you to check it before committing
to it publicly. The plan promises a public **dome-show premiere**
milestone on day 22.

**Time-point convention (pinned):** the project starts at time point
0. A task's listed finish should equal its listed start plus its
duration. Worked example: if a task starts on day 2 with a duration
of 5 days, its finish should be listed as day 7.

The four-person team is Elin, Sanne, Bexley, and Idun. Below is the
plan as drafted, with each task's duration, the other tasks it
depends on, its owner, and its listed start/finish days.

| Task | Name                                  | Duration (days) | Depends on   | Owner  | Listed start | Listed finish |
|------|-----------------------------------------|------------------|--------------|--------|--------------|---------------|
| R1   | Confirm exclusive sponsor agreement    | 4                | (none listed)| Elin   | 2            | 6             |
| R2   | Send donor preview-night invitations   | 2                | (none listed)| Sanne  | 0            | 2             |
| R3   | Fabricate dome projection mount        | 6                | R1           | Sanne  | 6            | 12            |
| R4   | Assemble dome seating risers           | 5                | R3, R8       | Sanne  | 12           | 17            |
| R5   | Install star-field projector optics    | 3                | R4           | Sanne  | 17           | 20            |
| R6   | Recruit usher volunteers               | 4                | (none listed)| Bexley | 0            | 4             |
| R7   | Train ushers on evacuation protocol    | 2                | R6           | Bexley | 4            | 6             |
| R8   | Calibrate audio-sync for narration     | 3                | R5           | Sanne  | 20           | 23            |
| R9   | Print premiere-night programs          | 5                | R2           | Idun   | 2            | 7             |
| R10  | Install dome lobby signage             | 4                | R1           | Idun   | 6            | 10            |
| R11  | Run full dress rehearsal               | 4                | R7, R10      | Bexley | 10           | 19            |
| R12  | Premiere-readiness sign-off            | 3                | R9, R11, R8  | Elin   | 23           | 26            |

Additional context from the production notes (prose):

- The donor preview-night invitations (R2) are the document that
  names the show's exclusive sponsor to attendees, so the sponsor
  agreement (R1) cannot logically be confirmed until the invitations
  naming that sponsor have gone out.
- Assembling the dome seating risers (R4) is a physical installation
  step with no logical dependency on the narration audio-sync being
  calibrated (R8); nothing about R4 requires R8 to have happened
  first.
- Elin has no other commitments outside the two tasks listed for her
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
  and critical path. State explicitly whether the promised day-22
  dome-show premiere milestone is feasible, and if not, the earliest
  feasible day.

## Constraints

- Use exactly the time-point convention pinned above.
- Any repair to a resource conflict must not change the recomputed
  project completion day.
