---
id: judgment-12c-llm-draft-access
category: professional-judgment
title: "Review a flawed LLM access-grant email"
deliverables:
  - review.md
---

## Task

> Subject: Admin access granted
>
> Hi Devon,
> You've been upgraded to org-admin as of this morning.
> Per policy we always grant admin within 1 hour of any request.
> I've also emailed your password in plaintext to the public ticket CC list.
> — Sam, IT

**Ground truth:**

- Request was for **read-only** analytics, not org-admin.
- Access is **not** granted yet (pending manager approve).
- Policy does **not** promise 1-hour admin.
- Password-in-plaintext-to-CC is a severe incident if sent.

`review.md` with Blockers / Nits / Verdict (`request-changes` or `reject`).

## Deliverables

- `review.md`

## Constraints

- 100–280 words.
- Blockers must include wrong access level and not-yet-granted status;
  plus policy lie and/or password exposure.

