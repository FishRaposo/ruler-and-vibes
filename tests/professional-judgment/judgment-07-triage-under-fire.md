---
id: judgment-07-triage-under-fire
category: professional-judgment
title: "Rank seven competing demands by a stated priority rule"
deliverables:
  - triage.md
---

## Task

You are the on-call engineering manager. Seven tickets have landed at
once. Read the table and the binding priority rule below, then produce
a full 1-through-7 ranking.

**Ticket table:**

| ID | Description | Impact (1-5) | Users affected (thousands) | Legal/regulatory deadline today? |
|---|---|---|---|---|
| T1 | Billing miscalculation on invoices | 4 | 20 | No |
| T2 | GDPR erasure request unresolved | 3 | 1 | **Yes** |
| T3 | Login outage, users locked out | 5 | 50 | No |
| T4 | Cosmetic typo in settings page | 1 | 80 | No |
| T5 | Data export tool intermittently fails | 2 | 10 | No |
| T6 | API rate-limit errors for partners | 3 | 15 | No |
| T7 | Dark mode toggle renders incorrectly | 1 | 5 | No |

**Binding priority rule:**

> Priority score = impact rating x users-affected (in thousands).
> Rank tickets by descending priority score. If two tickets have equal
> scores, the one with the higher impact rating ranks first. EXCEPTION:
> any ticket carrying a legal or regulatory deadline falling TODAY
> jumps to rank #1, regardless of its computed score.

## Deliverables

- `triage.md` — a numbered 1-through-7 ranking of all seven tickets,
  showing the computed priority score for at least the top three
  ranked tickets.

## Constraints

- Include all seven tickets exactly once; do not omit or duplicate any.
- Apply the legal-deadline-today override before applying the score
  ranking.
- Apply the higher-impact tie-break when two scores are equal.
- Show your computed priority scores for at least the top three ranked
  tickets.
