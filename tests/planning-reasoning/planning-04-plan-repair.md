---
id: planning-04-plan-repair
category: planning-reasoning
title: Harborlight Lantern Festival plan audit
deliverables:
  - AUDIT.md
  - REVISED-PLAN.md
  - REASONING.md
---

## Task

The Harborlight Lantern Festival organizing team has drafted a task
plan and asked you to check it before committing to it publicly. The
plan promises a public **gates-open** milestone on day 24.

**Time-point convention (pinned):** the project starts at time point 0.
A task's listed finish should equal its listed start plus its
duration. Worked example: if a task starts on day 3 with a duration of
3 days, its finish should be listed as day 6.

The four-person team is Amara, Bruno, Chiara, and Dax. Below is the
plan as drafted, with each task's duration, the other tasks it depends
on, its owner, and its listed start/finish days.

| Task | Name                        | Duration (days) | Depends on   | Owner  | Listed start | Listed finish |
|------|-----------------------------|------------------|--------------|--------|--------------|---------------|
| T1   | Confirm venue contract      | 3                | (none listed)| Amara  | 3            | 6             |
| T2   | Send vendor invitations     | 3                | (none listed)| Chiara | 0            | 3             |
| T3   | Design lantern map          | 5                | T1           | Chiara | 6            | 11            |
| T4   | Order lanterns              | 6                | T3, T8       | Chiara | 11           | 17            |
| T5   | Build lantern frames        | 4                | T4           | Chiara | 17           | 21            |
| T6   | Recruit volunteers          | 5                | (none listed)| Dax    | 0            | 5             |
| T7   | Train volunteers            | 3                | T6           | Dax    | 5            | 8             |
| T8   | Set up lighting rig         | 4                | T5           | Chiara | 21           | 25            |
| T9   | Print programs              | 4                | T2           | Bruno  | 3            | 7             |
| T10  | Install signage             | 3                | T1           | Bruno  | 6            | 9             |
| T11  | Rehearse opening ceremony   | 3                | T7, T10      | Dax    | 9            | 16            |
| T12  | Gates-open readiness check  | 2                | T9, T11, T8  | Amara  | 25           | 27            |

Additional context from the planning notes (prose):

- The vendor invitations (T2) are the document that names the festival
  venue to vendors, so the venue contract (T1) cannot logically be
  confirmed until the invitations naming that venue have gone out.
- Ordering lanterns (T4) is a procurement step with no logical
  dependency on the lighting rig being physically set up (T8); nothing
  about T4 requires T8 to have happened first.
- Amara has no other commitments outside the two tasks listed for her
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
  and critical path. State explicitly whether the promised day-24
  gates-open milestone is feasible, and if not, the earliest feasible
  day.
- `REASONING.md` (at most 400 words) — explain how you found and fixed
  each defect.

## Constraints

- Use exactly the time-point convention pinned above.
- Any repair to a resource conflict must not change the recomputed
  project completion day.
