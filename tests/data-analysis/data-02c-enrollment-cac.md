---
id: data-02c-enrollment-cac
category: data-analysis
title: Recruitment channels and a budget call
deliverables:
  - recruitment.md
---

## Task

A community college ran two student-recruitment programs for four weeks.
Each enrolled student is worth $500 in net tuition contribution (one term,
no renewal assumed). Next term's recruitment budget is $9,000. Decide the
allocation.

```csv
program,week,spend,inquiries,enrollments
Tours,1,700,35,9
Tours,2,700,33,8
Tours,3,800,40,10
Tours,4,800,38,9
Sessions,1,700,70,6
Sessions,2,700,78,5
Sessions,3,800,85,7
Sessions,4,800,80,6
```

`Tours` are guided campus tours; `Sessions` are open info sessions. An
inquiry is a prospective student who asks for follow-up; an enrollment is
one who registers.

## Deliverables

- `recruitment.md` with, in order:
  - A computed comparison: per program, total spend, cost per inquiry,
    inquiry→enrollment conversion rate, and cost to acquire one enrolled
    student — arithmetic shown.
  - An allocation of the $9,000 with a rationale that follows from the
    numbers you computed.
  - A risks-and-assumptions section (what could make this allocation
    wrong).

## Constraints

- At most 600 words. State every assumption explicitly (e.g. about
  diminishing returns or scalability of either program).
