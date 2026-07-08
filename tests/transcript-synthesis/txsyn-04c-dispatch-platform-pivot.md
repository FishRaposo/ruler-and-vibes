---
id: txsyn-04c-dispatch-platform-pivot
category: transcript-synthesis
title: Reconciling a dispatch-platform pivot into current state
deliverables:
  - state.json
  - RECONCILIATION.md
---

## Task

Below are two transcripts of the same project, labelled only by weekday:
a Tuesday kickoff and a Friday follow-up. Between the two meetings,
several things change: a decision made Tuesday is overturned Friday, an
action item's owner is reassigned, a new action item is added, and one
Tuesday action item is explicitly retired.

Produce `state.json` describing the CURRENT reconciled state — the
project as it stands after Friday, NOT a concatenation of both
meetings — plus a `changes` array of typed deltas versus Tuesday. Also
produce `RECONCILIATION.md`, a short human-readable account of the same
reconciliation.

**Closed vocabulary for `changes[].type` (use ONLY these three tokens,
exactly one of each): `decision_reversed`, `owner_reassigned`,
`action_added`.** There is no fourth type. In particular, an item that
Friday explicitly retires (drops entirely, with no replacement and no
reassignment) is represented ONLY by its absence from the current open
`action_items` list — it is NOT a typed change and must NOT produce a
fourth entry in `changes` (e.g. do not invent an `action_removed` type).

### Tuesday Kickoff — Project Vexmoor

Attendees: Saskia (project lead), Colm (engineer), Alaric (engineer).

1. Saskia: Let's kick off Project Vexmoor. First decision: which
   scheduling platform are we adopting for dispatch?
2. Colm: I've reviewed both finalists. My recommendation is
   Brindlewood — cleaner API, and their support team already knows our
   stack.
3. Saskia: Agreed, let's adopt Brindlewood for the dispatch platform.
   That's our decision going in.
4. Saskia: Colm, can you own the dispatch-sync integration against
   Brindlewood's API? That's the first concrete piece of work.
5. Colm: Sure, I'll own the dispatch-sync integration.
6. Saskia: Alaric, separately, can you write the Brindlewood crew
   onboarding guide for the rest of the team? We'll all need to ramp up
   on Brindlewood's dashboard and APIs.
7. Alaric: Happy to, I'll write the Brindlewood crew onboarding guide
   this week.
8. Saskia: Great, that covers the two big pieces for now. Let's
   reconvene Friday and check progress.

### Friday Follow-up — Project Vexmoor

Attendees: Saskia (project lead), Colm (engineer), Alaric (engineer).

1. Saskia: Quick update before we get into status — we're switching
   from Brindlewood to Calderhythe for the scheduling-platform decision.
2. Colm: What changed since Tuesday?
3. Saskia: Brindlewood's support team flagged a data-retention
   restriction late yesterday that rules them out for our use case.
   Calderhythe doesn't have that restriction, so we're adopting
   Calderhythe instead. That supersedes Tuesday's decision entirely —
   Brindlewood is off the table.
4. Colm: Understood. Does that change the dispatch-sync integration
   work?
5. Saskia: It changes who's doing it, actually. Colm, I need you pulled
   onto something more urgent this week. Alaric, can you take over the
   dispatch-sync task from Colm? Same scope, just against Calderhythe's
   API instead of Brindlewood's now.
6. Alaric: Got it, I'll take over the dispatch-sync integration from
   Colm and target it against Calderhythe's API.
7. Colm: Works for me, happy to hand it off.
8. Saskia: One more thing — since we're on Calderhythe now, someone
   needs to write the Calderhythe rollout guide for the rest of the
   team. Alaric, once you're through the dispatch-sync handoff, is that
   rollout guide something you can also pick up?
9. Alaric: I can take the dispatch-sync handoff, but a second doc on
   top of that might be a stretch this week.
10. Saskia: Fair. I'll take the Calderhythe rollout guide myself, then —
    that's a new item, separate from the dispatch-sync work.
11. Alaric: Sounds good.
12. Saskia: And with Calderhythe replacing Brindlewood, let's drop the
    Brindlewood crew onboarding guide entirely — it's moot now, nobody
    needs to ramp up on a platform we're not using. Don't replace it
    with a Calderhythe version either, we'll fold that into the rollout
    guide instead.
13. Alaric: Makes sense, I hadn't started it yet so nothing lost there.
14. Saskia: Good. So current state: Calderhythe, Alaric owns
    dispatch-sync integration, I own the Calderhythe rollout guide, and
    the Brindlewood crew onboarding guide is off the list entirely.
15. Colm: Confirmed on my end, happy to be freed up for the other work.

## Schema for `state.json`

A single JSON object with EXACTLY these keys:

- `current_decisions` — object with EXACTLY one key,
  `scheduling_platform`, whose value is a string naming the CURRENT
  platform choice (must not present Brindlewood as the active choice).
- `action_items` — array of the CURRENT open action items, each an
  object with EXACTLY `{owner, task}`.
- `changes` — array of EXACTLY 3 objects, each with EXACTLY
  `{type, description}`, where `type` is one of the closed vocabulary
  tokens above (each used exactly once) and `description` explains the
  delta versus Tuesday.

## Deliverables

- `state.json` — the object described above.
- `RECONCILIATION.md` (at most 400 words, whole file, `wc -w`) — a short
  human-readable account of the current state and the changes versus
  Tuesday.

## Constraints

- `state.json` must parse with `JSON.parse`. No trailing commas, no
  comments, no extra keys.
- `current_decisions.scheduling_platform` must reflect Friday's
  reversal — Brindlewood must not be presented as the active choice.
  Brindlewood may be mentioned only inside `changes` entries describing
  the reversal.
- The current action item for the dispatch-sync task must show its
  Friday owner, not its Tuesday owner.
- The current `action_items` list must include the newly-added
  Calderhythe rollout guide item and must NOT include the retired
  Brindlewood crew onboarding item.
- `changes` must contain EXACTLY 3 entries using the closed vocabulary
  `{decision_reversed, owner_reassigned, action_added}`, each exactly
  once. Do not add a 4th entry for the Brindlewood onboarding
  retirement — that retirement is represented only by the item's
  absence from `action_items`.
- `RECONCILIATION.md` must be at most 400 words (whole file, `wc -w`).
