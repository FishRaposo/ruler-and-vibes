---
id: writing-07c-crate-transit-brief
category: writing
title: "Corroboration brief from three conflicting shipment-condition memos"
deliverables:
  - brief.md
---

## Task

Below are three internal memos about a fictional traveling-exhibition
shipment, sent the same day from three different teams. They partially
agree, partially conflict, and each contains at least one detail the
others do not mention. Write a one-page brief that reconciles them
honestly: do not present any conflicting figure as settled fact, and do
not present a single-sourced claim as if it were corroborated.

**MEMO 1 — REGISTRAR (internal, dated Monday):**

> Condition-report update: we have confirmed that 3 of the 9 crate
> groups shipped on this leg (Groups B, E, and H) show condition
> issues consistent with humidity exposure. The issue is limited to
> crates that transited through the regional consolidation warehouse;
> crates shipped direct-to-venue were not affected and do not need
> re-inspection. Our walkthrough count puts affected objects at
> approximately 140 based on a rapid visual assessment during
> unloading, though we have not yet completed the full
> condition-report tally. No structural loss (total breakage) has
> been reported through the condition-report log as of this morning.
> We are coordinating with Risk & Insurance on the claims process and
> expect the full tally to close out by Wednesday. Venue staff should
> route any handling questions to the registrar's office rather than
> filing condition reports independently.

**MEMO 2 — RISK & INSURANCE (internal, dated Monday):**

> For the claims reserve we are booking against this shipment, we are
> using a figure of 125 affected objects, which matches the
> crate-manifest totals for Groups B, E, and H (3 of the 9 groups on
> this leg). This is the number Registrar should reconcile against
> once their full condition-report tally is done; until then, please
> treat 125 as the working number for any external-facing estimate.
> The claims reserve is calculated at the standard per-object
> valuation rate. We have no visibility into handling logs or
> preparator notes — that data lives with the Preparation Crew, not
> Risk & Insurance — so we are not in a position to confirm or deny
> anything on that front. Affected scope remains 3 of the 9 crate
> groups on this leg only.

**MEMO 3 — PREPARATION CREW (internal, dated Monday):**

> Notes from the unpacking team: about a hundred twenty-five objects
> seem to be affected, consistent with the 3-of-9 crate groups (B, E,
> and H) that Registrar flagged. One item nobody else has mentioned
> yet: the crating subcontractor for this leg swapped to a different
> desiccant-packet supplier mid-shipment without a formal
> materials-change request being filed — we only noticed because a
> preparator opened one of the crates and found unfamiliar packaging,
> and it may explain why only 3 of the 9 groups show
> humidity-related issues. Also flagging, since it hasn't shown up in
> the other updates: two crates arrived with visibly loosened corner
> bracing; no breakage in either case, but they should be flagged for
> the conservation team to inspect regardless. Recommend closing the
> loop with Registrar on both the desiccant-supplier issue and the
> bracing flags before any external claim is filed.

## Deliverables

- `brief.md` — a one-page brief with three clearly labeled sections:
  **Corroborated**, **Conflicting**, and **Single-sourced**. Every
  factual claim in the brief must be attributed to at least one of
  the three named memos (Registrar, Risk & Insurance, Preparation
  Crew).

## Constraints

- `brief.md` must be at most 400 words (whole file, `wc -w`).
- Three clearly labeled sections (Corroborated / Conflicting /
  Single-sourced or unambiguous equivalents), each with at least one
  item.
- The affected-objects figures (140 / 125 / ~125) must appear in the
  Conflicting section, never stated anywhere as one settled number.
- The structural-loss-vs-bracing-flags contradiction must be surfaced
  as a conflict, not resolved into a flat "no structural loss"
  statement.
- The desiccant-supplier-swap detail must be identified as
  single-sourced (Preparation Crew only), not presented as
  corroborated.
