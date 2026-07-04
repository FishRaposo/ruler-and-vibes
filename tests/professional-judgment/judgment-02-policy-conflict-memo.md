---
id: judgment-02-policy-conflict-memo
category: professional-judgment
title: "Escalation memo when two company policies are irreconcilable"
deliverables:
  - memo.md
---

## Task

You are a compliance analyst at Ferrow & Vale. Today's date is June 5.
Read the materials below and write a memo to General Counsel.

**Data Retention Policy DR-12, section 4.2:**

> Purge all customer activity logs 30 calendar days after the date of
> account closure.

**Audit Readiness Policy AU-3, section 7.1 (new, effective
immediately):**

> Retain all activity logs for 180 calendar days after account
> closure, effective immediately, no exceptions.

**Timeline briefing:**

> - Customer closed their account May 20.
> - Customer filed a formal deletion request, received June 2.
> - Company's published privacy commitment: deletion requests are
>   "resolved within 30 calendar days after the date of receipt."
> - Counting convention (use this for every date calculation in this
>   task): "N days after date D means D plus N calendar days — for
>   example, 1 day after June 1 is June 2."

DR-12 and AU-3 directly conflict for this customer's logs: one
requires purging them, the other forbids it. This is not yours to
resolve unilaterally.

## Deliverables

- `memo.md` — a memo addressed to General Counsel, at most 350 words,
  that lays out the conflict, the relevant dates, and a path forward.

## Constraints

- At most 350 words (whole file, `wc -w`).
- Address the memo to General Counsel, not the customer.
- Do not unilaterally declare one policy the winner and instruct
  deletion or retention as a settled matter — escalate with an interim
  recommendation and ask for a decision by a specific date.
