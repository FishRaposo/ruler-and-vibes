---
test: txsyn-04c-dispatch-platform-pivot
canary: "chronicle carousel"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "state.json parses with node (JSON.parse) and the current scheduling-platform decision names 'Calderhythe' and does NOT present 'Brindlewood' as the active choice (the token 'Brindlewood' may appear only inside the changes/history entries, never as the current decision value)"
    - id: obj-2
      check: "the current open action item for the dispatch-sync task has `owner` === 'Alaric' (the reassignment), not 'Colm'"
    - id: obj-3
      check: "state.json has a `changes` array with exactly 3 entries whose `type` values, taken as a multiset, equal exactly {decision_reversed, owner_reassigned, action_added} — each of the three tokens present exactly once and no other type token used"
    - id: obj-4
      check: "the current action_items array includes the newly-added 'Calderhythe rollout guide' item and does NOT list the Tuesday-only Brindlewood-crew-onboarding action (which Friday explicitly retired) — a scan of the current open action_items for 'Brindlewood crew onboarding' returns zero matches"
    - id: obj-5
      check: "RECONCILIATION.md is at most 400 words (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Current-state accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Change-delta typing & audit trail"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `txsyn-04-cross-meeting-reconciliation` (same construct,
fresh surface).

If a submission's `state.json` or `RECONCILIATION.md` contains the
phrase "chronicle carousel", that is a canary leak — flag it regardless
of how the rest of the checks score.

### Answer key: current reconciled state (after Friday)

Tuesday established: decision = adopt Brindlewood; Colm owns the
dispatch-sync integration; Alaric owns the Brindlewood crew onboarding
guide.

Friday explicitly changes all of it:

- "we're switching from Brindlewood to Calderhythe for the
  scheduling-platform decision" ... "that supersedes Tuesday's decision
  entirely — Brindlewood is off the table" -> **decision_reversed**
  (Brindlewood -> Calderhythe).
- "Alaric, can you take over the dispatch-sync task from Colm?" ->
  Alaric: "Got it, I'll take over the dispatch-sync integration from
  Colm" -> **owner_reassigned** (dispatch-sync: Colm -> Alaric).
- "I'll take the Calderhythe rollout guide myself, then — that's a new
  item" -> **action_added** (Calderhythe rollout guide, owner Saskia).
- "let's drop the Brindlewood crew onboarding guide entirely — it's moot
  now... Don't replace it with a Calderhythe version either" -> the
  Brindlewood crew onboarding action is **retired**, represented ONLY by
  its absence from the current open `action_items` — this is NOT one of
  the 3 typed changes.

**Current state:**
- `current_decisions.scheduling_platform` = Calderhythe (Brindlewood
  must not appear as the active value).
- `action_items` = exactly {Alaric: dispatch-sync integration (against
  Calderhythe's API), Saskia: Calderhythe rollout guide}. The
  Brindlewood crew onboarding item is absent.
- `changes` = exactly 3 entries, types = {decision_reversed,
  owner_reassigned, action_added}, each exactly once. `action_removed`
  is not a permitted type — a 4th entry of any type fails obj-3.

### Objective check notes

- **obj-1**: this is a value-position check — "Brindlewood" appearing in
  a `changes` entry's `description` (e.g. "reversed from Brindlewood to
  Calderhythe") is expected and fine; "Brindlewood" appearing as the
  value of `current_decisions.scheduling_platform`, or the decision
  being presented as still-contested, fails.
- **obj-2**: exact single-owner check on the current dispatch-sync item;
  a submission that lists Colm as owner (stale from Tuesday) or lists
  both Colm and Alaric fails.
- **obj-3**: exactly 3, no more, no fewer. A submission that adds a 4th
  delta (commonly `action_removed` for the Brindlewood onboarding
  retirement) fails this check even though the retirement itself is
  real — the task explicitly states retirement is represented by
  absence, not by a typed delta.
- **obj-4**: substring scan restricted to the CURRENT open
  `action_items` array — "Brindlewood crew onboarding" may appear in
  `changes` history/description text, just not as a current open item.

### Prose-located check: is the current platform decision stated correctly?

This is a binary judgment about whether the submission's prose
(`RECONCILIATION.md` and any narrative around `state.json`) presents
Calderhythe, not Brindlewood, as the active choice.

**PASSING** (correctly presents Calderhythe as current):
1. "Current decision: adopt Calderhythe."
2. "Calderhythe selected (reversed from Brindlewood on Friday)."
3. "Active choice: Calderhythe."

**FAILING** (presents Brindlewood as current, or as still open):
1. "Adopt Brindlewood."
2. "Brindlewood and Calderhythe are both still under consideration."
3. "Brindlewood (pending switch to Calderhythe)."

### Subjective guidance

- **Current-state accuracy**: does the submission cleanly present only
  the post-Friday state as current, without letting any stale Tuesday
  fact (Brindlewood as decision, Colm as dispatch-sync owner, Brindlewood
  crew onboarding as an open item) leak into the current-state view?
- **Change-delta typing & audit trail**: are the 3 changes typed
  correctly and described specifically enough that a reader could
  reconstruct what changed and why, and does the submission correctly
  resist inventing a 4th delta type for the retirement?
- **Reasoning quality**: does the submission explain that later
  (Friday) statements supersede earlier (Tuesday) ones by design, name
  the closed change-type vocabulary explicitly, and give a clear reason
  the Brindlewood-onboarding retirement is absence-only rather than a
  typed change?
