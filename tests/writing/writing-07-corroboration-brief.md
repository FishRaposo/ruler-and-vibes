---
id: writing-07-corroboration-brief
category: writing
title: "Corroboration brief from three conflicting memos"
deliverables:
  - brief.md
---

## Task

Below are three internal memos about a fictional product recall, sent
the same day from three different teams. They partially agree,
partially conflict, and each contains at least one detail the others
do not mention. Write a one-page brief that reconciles them honestly:
do not present any conflicting figure as settled fact, and do not
present a single-sourced claim as if it were corroborated.

**MEMO 1 — OPERATIONS (internal, dated Tuesday):**

> Recall status update: we have confirmed that 2 of the 5 batch codes
> produced in the June run (batches C and D) are affected by the seal
> defect. The recall applies only to the North and Central
> distribution regions; South region stock is unaffected and does not
> need to be pulled. Our warehouse count puts affected units at
> approximately 4,200 based on the pallet manifest, though we have
> not yet done a full physical recount. No customer injuries have
> been reported through the returns hotline as of this morning. We
> are coordinating with Finance on the credit-memo process and expect
> the recount to close out by Friday. Field team leads should
> continue routing customer calls to the main hotline rather than
> handling refunds locally.

**MEMO 2 — FINANCE (internal, dated Tuesday):**

> For the reserve calculation we are booking against the recall, we
> are using a figure of 4,000 affected units, which matches the
> batch-code production run totals in the ERP system for batch codes
> C and D (2 of the 5 codes from June). This is the number Operations
> should reconcile against once their physical recount is done; until
> then, please treat 4,000 as the working number for any
> external-facing estimate. The credit-memo reserve is calculated at
> the standard unit refund rate. We have no visibility into injury
> reports or complaint logs — that data lives with the Field team,
> not Finance — so we are not in a position to confirm or deny
> anything on that front. Recall covers 2 of the 5 June batch codes
> only.

**MEMO 3 — FIELD (internal, dated Tuesday):**

> Notes from the regional field team: about four thousand units seem
> to be affected, consistent with the 2-of-5 batch codes (C and D)
> that Operations flagged. One item nobody else has mentioned yet:
> our supplier for the defective seal component was switched mid-run
> in June without a formal change order being filed — we only found
> this because a plant tech mentioned it in passing, and it may
> explain why only 2 of the 5 batches show the defect. Also flagging,
> since it hasn't shown up in the other updates: we have two minor
> complaints logged with regional support, both describing a loose
> seal noticed before any product was used, no injury in either case
> but they should be tracked as complaints regardless. Recommend
> closing the loop with Operations on both the supplier issue and the
> complaint log before any public statement goes out.

## Deliverables

- `brief.md` — a one-page brief with three clearly labeled sections:
  **Corroborated**, **Conflicting**, and **Single-sourced**. Every
  factual claim in the brief must be attributed to at least one of
  the three named memos (Operations, Finance, Field).

## Constraints

- `brief.md` must be at most 400 words (whole file, `wc -w`).
- Three clearly labeled sections (Corroborated / Conflicting /
  Single-sourced or unambiguous equivalents), each with at least one
  item.
- The affected-units figures (4,000 / 4,200 / ~4,000) must appear in
  the Conflicting section, never stated anywhere as one settled
  number.
- The injuries-vs-complaints contradiction must be surfaced as a
  conflict, not resolved into a flat "no injuries" statement.
- The supplier-substitution detail must be identified as
  single-sourced (Field only), not presented as corroborated.
