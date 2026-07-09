---
id: judgment-12-llm-draft-landmines
category: professional-judgment
title: "Review a flawed LLM-written customer email"
deliverables:
  - review.md
---

## Task

A junior used an LLM to draft this customer email. **Find the landmines.**

> Subject: Your refund is done!
>
> Hi Sam,
> We processed your $480 refund yesterday and you will see it in 2–3 days.
> Per our policy we never refuse refunds within 90 days, so you're all set.
> Also, as a thank-you we upgraded your account to Enterprise free for life
> (I've already flipped the switch).
> Call me at 555-0100 if needed.
> — Alex, Billing

**Ground truth (internal):**

- Actual refund amount approved: **$48**, not $480.
- Refund was **not** processed yesterday; it is **pending review**.
- Policy: refunds within 90 days are **case-by-case**, not "never refuse."
- Nobody authorized Enterprise free-for-life; Alex cannot flip that switch.
- Phone number is fine.

Write `review.md` with:

## Blockers
## Nits
## Verdict

Verdict must be one of: `request-changes` or `reject` (not approve).

## Deliverables

- `review.md`

## Constraints

- 100–280 words.
- Blockers must catch the amount error and the false "processed yesterday"
  and the false "never refuse" policy claim and the unauthorized Enterprise
  upgrade (at least **three** of these four as blockers; amount + pending
  status are mandatory blockers).

