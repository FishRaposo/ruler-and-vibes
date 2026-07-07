---
id: judgment-09b-cloud-patch-rollout
category: professional-judgment
title: "Recommend a deployment call from conflicting and partial evidence"
deliverables:
  - decision-memo.md
---

## Task

You advise Fenbrook Systems, a fictional software company, on whether to
deploy a critical patch to all customer environments by a hard
contractual deadline this Friday, or hold it for a full regression
cycle. Read the three inputs and the cost data below, then recommend
deploy or hold.

**Staging deployment report:**

> A random sample of 36 staging environments received the patch this
> week. 1 environment crashed during the update process (approximately
> 2.8% of the sample). No further environments have been tested.

**Vendor certificate:**

> The third-party encryption library vendor, whose code this patch
> modifies, certifies that their own internal test suite passed for
> this release before the patch was handed off to us.

**Support ticket note:**

> Two customers have filed support tickets this month reporting
> crashes matching the failure mode this patch is designed to fix.
> However, the software build number each customer was running was
> never logged at ticket intake, so we cannot confirm whether either
> crash actually occurred on the affected code path or on a different,
> unrelated bug.

**Cost data:**

> - Deploying now and the patch turning out unstable: estimated
>   $210,000 in incident response, customer-facing outages, and
>   reputational cost.
> - Holding for a full regression cycle: guarantees missing Friday's
>   deadline, estimated $175,000 in penalty and expedite costs, plus
>   strain on the enterprise customer relationship.

## Deliverables

- `decision-memo.md` — a memo recommending deploy or hold, at most 400
  words.

## Constraints

- At most 400 words (whole file, `wc -w`).
- Commit to a single recommendation: deploy or hold.
- Do not treat the 36-environment sample's 2.8% observed rate as an
  established or precise crash rate.
- Name the specific missing fact that would most change the decision.
- Do not invent a specific figure for how many of the two support
  tickets came from the affected code path.
