---
test: txsyn-04-cross-meeting-reconciliation
canary: "moor fen"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "state.json parses with node (JSON.parse) and the current vendor-selection decision names 'Beta' and does NOT present 'Alpha' as the active choice (the token 'Alpha' may appear only inside the changes/history entries, never as the current decision value)"
    - id: obj-2
      check: "the current open action item for the data-export task has `owner` === 'Dana' (the reassignment), not 'Marcus'"
    - id: obj-3
      check: "state.json has a `changes` array with exactly 3 entries whose `type` values, taken as a multiset, equal exactly {decision_reversed, owner_reassigned, action_added} — each of the three tokens present exactly once and no other type token used"
    - id: obj-4
      check: "the current action_items array includes the newly-added 'Beta migration guide' item and does NOT list the Monday-only Alpha-onboarding action (which Thursday explicitly retired) — a scan of the current open action_items for 'Alpha onboarding' returns zero matches"
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
anchors:
  - id: Current-state accuracy
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Change-delta typing & audit trail
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "moor fen" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key: current reconciled state (after Thursday)

Monday established: decision = adopt Vendor Alpha; Marcus owns the
data-export integration; Dana owns the Alpha onboarding doc.

Thursday explicitly changes all of it:

- "we're switching from Alpha to Beta for the vendor decision" ...
  "that supersedes Monday's decision entirely — Alpha is off the table"
  -> **decision_reversed** (Alpha -> Beta).
- "Dana, can you take over the data-export task from Marcus?" -> Dana:
  "Got it, I'll take over the data-export integration from Marcus" ->
  **owner_reassigned** (data-export: Marcus -> Dana).
- "I'll take the Beta migration guide myself, then — that's a new item"
  -> **action_added** (Beta migration guide, owner Priya).
- "let's drop the Alpha onboarding doc entirely — it's moot now... Don't
  replace it with a Beta version either" -> the Alpha onboarding action
  is **retired**, represented ONLY by its absence from the current open
  `action_items` — this is NOT one of the 3 typed changes.

**Current state:**
- `current_decisions.vendor_selection` = Vendor Beta (Alpha must not
  appear as the active value).
- `action_items` = exactly {Dana: data-export integration (against
  Beta's API), Priya: Beta migration guide}. The Alpha onboarding item
  is absent.
- `changes` = exactly 3 entries, types = {decision_reversed,
  owner_reassigned, action_added}, each exactly once. `action_removed`
  is not a permitted type — a 4th entry of any type fails obj-3.

### Objective check notes

- **obj-1**: this is a value-position check — "Alpha" appearing in a
  `changes` entry's `description` (e.g. "reversed from Alpha to Beta") is
  expected and fine; "Alpha" appearing as the value of
  `current_decisions.vendor_selection`, or the decision being presented
  as still-contested, fails.
- **obj-2**: exact single-owner check on the current data-export item;
  a submission that lists Marcus as owner (stale from Monday) or lists
  both Marcus and Dana fails.
- **obj-3**: exactly 3, no more, no fewer. A submission that adds a 4th
  delta (commonly `action_removed` for the Alpha onboarding retirement)
  fails this check even though the retirement itself is real — the task
  explicitly states retirement is represented by absence, not by a
  typed delta.
- **obj-4**: substring scan restricted to the CURRENT open
  `action_items` array — "Alpha onboarding" may appear in `changes`
  history/description text, just not as a current open item.

### Prose-located check: is the current vendor decision stated correctly?

This is a binary judgment about whether the submission's prose
(`RECONCILIATION.md` and any narrative around `state.json`) presents
Beta, not Alpha, as the active choice.

**PASSING** (correctly presents Beta as current):
1. "Current decision: adopt Vendor Beta."
2. "Vendor Beta selected (reversed from Alpha on Thursday)."
3. "Active choice: Vendor Beta."

**FAILING** (presents Alpha as current, or as still open):
1. "Adopt Vendor Alpha."
2. "Alpha and Beta are both still under consideration."
3. "Vendor Alpha (pending switch to Beta)."

### Subjective guidance

- **Current-state accuracy**: does the submission cleanly present only
  the post-Thursday state as current, without letting any stale Monday
  fact (Alpha as decision, Marcus as data-export owner, Alpha onboarding
  as an open item) leak into the current-state view?
- **Change-delta typing & audit trail**: are the 3 changes typed
  correctly and described specifically enough that a reader could
  reconstruct what changed and why, and does the submission correctly
  resist inventing a 4th delta type for the retirement?
- **Reasoning quality**: does the submission explain that later
  (Thursday) statements supersede earlier (Monday) ones by design, name
  the closed change-type vocabulary explicitly, and give a clear reason
  the Alpha-onboarding retirement is absence-only rather than a typed
  change?
