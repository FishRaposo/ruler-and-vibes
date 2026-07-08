---
id: writing-07b-billing-incident-brief
category: writing
title: "Corroboration brief from three conflicting billing-incident memos"
deliverables:
  - brief.md
---

## Task

Below are three internal memos about a fictional billing incident at a
software company, sent the same day from three different teams. They
partially agree, partially conflict, and each contains at least one
detail the others do not mention. Write a one-page brief that
reconciles them honestly: do not present any conflicting figure as
settled fact, and do not present a single-sourced claim as if it were
corroborated.

**MEMO 1 — ENGINEERING (internal, dated Wednesday):**

> Billing incident update: we have confirmed that 3 of the 6 pricing
> tiers in the March plan migration (Tiers B, D, and F) are affected
> by the proration miscalculation. The issue applies only to
> customers on the Growth and Scale plans; Starter-plan customers are
> unaffected and do not need a fee reversal. Our query-log analysis
> puts affected customers at approximately 5,700 based on
> event-stream sampling, though we have not yet completed a full
> ledger reconciliation. No failed payment attempts have been flagged
> in the fraud-monitoring dashboard as of this morning. We are
> coordinating with Billing on the refund-adjustment process and
> expect the reconciliation to close out by Thursday. Support agents
> should keep escalating billing questions to the incident channel
> instead of processing ad hoc credits.

**MEMO 2 — BILLING (internal, dated Wednesday):**

> For the reserve calculation we are booking against the billing
> incident, we are using a figure of 5,400 affected customers, which
> matches the tier-level revenue records in the ERP system for Tiers
> B, D, and F (3 of the 6 tiers from the March migration). This is
> the number Engineering should reconcile against once their full
> ledger reconciliation is done; until then, please treat 5,400 as
> the working number for any external-facing estimate. The
> refund-adjustment reserve is calculated at the standard proration
> rate. We have no visibility into support tickets or complaint logs
> — that data lives with the Support team, not Billing — so we are
> not in a position to confirm or deny anything on that front.
> Incident covers 3 of the 6 March-migration tiers only.

**MEMO 3 — SUPPORT (internal, dated Wednesday):**

> Notes from the support team: about fifty-four hundred customers
> seem to be affected, consistent with the 3-of-6 tiers (B, D, and F)
> that Engineering flagged. One item nobody else has mentioned yet:
> the third-party payment gateway's API version was upgraded
> mid-cycle without a formal change-management ticket being filed —
> we only found this because a support engineer noticed it in the
> deploy log, and it may explain why only 3 of the 6 tiers show the
> miscalculation. Also flagging, since it hasn't shown up in the
> other updates: we have logged three customer complaints about
> duplicate double-charges appearing on statements, all reported
> through the help desk, with no fraud-monitoring alerts triggered in
> any of the cases. Recommend closing the loop with Engineering on
> both the gateway-upgrade issue and the double-charge complaints
> before any public statement goes out.

## Deliverables

- `brief.md` — a one-page brief with three clearly labeled sections:
  **Corroborated**, **Conflicting**, and **Single-sourced**. Every
  factual claim in the brief must be attributed to at least one of
  the three named memos (Engineering, Billing, Support).

## Constraints

- `brief.md` must be at most 400 words (whole file, `wc -w`).
- Three clearly labeled sections (Corroborated / Conflicting /
  Single-sourced or unambiguous equivalents), each with at least one
  item.
- The affected-customer figures (5,700 / 5,400 / ~5,400) must appear
  in the Conflicting section, never stated anywhere as one settled
  number.
- The fraud-monitoring-vs-complaints contradiction must be surfaced
  as a conflict, not resolved into a flat "no issues detected"
  statement.
- The payment-gateway-upgrade detail must be identified as
  single-sourced (Support only), not presented as corroborated.
