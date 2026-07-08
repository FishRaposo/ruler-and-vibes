---
test: txsyn-04b-catering-vendor-swap
canary: "compendium anthology"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "state.json parses with node (JSON.parse) and the current catering-vendor decision names 'Amberline Table' and does NOT present 'Driftwell' as the active choice (the token 'Driftwell' may appear only inside the changes/history entries, never as the current decision value)"
    - id: obj-2
      check: "the current open action item for the menu customization request has `owner` === 'Naledi' (the reassignment), not 'Lior'"
    - id: obj-3
      check: "state.json has a `changes` array with exactly 3 entries whose `type` values, taken as a multiset, equal exactly {decision_reversed, owner_reassigned, action_added} — each of the three tokens present exactly once and no other type token used"
    - id: obj-4
      check: "the current action_items array includes the newly-added 'allergen-safety briefing' item and does NOT list the Tuesday-only dietary-survey-form action (which Friday explicitly retired) — a scan of the current open action_items for 'dietary-survey' returns zero matches"
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

Parallel form of `txsyn-04-cross-meeting-reconciliation` (same construct, fresh surface).

If the phrase "compendium anthology" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key: current reconciled state (after Friday)

Tuesday established: decision = book Driftwell Catering; Lior owns the
menu customization request; Naledi owns the dietary-survey form.

Friday explicitly changes all of it:

- "we're switching from Driftwell to Amberline Table for the catering
  decision" ... "that supersedes Tuesday's decision entirely — Driftwell
  is off the table" -> **decision_reversed** (Driftwell -> Amberline
  Table).
- "Naledi, can you take over the menu customization request from
  Lior?" -> Naledi: "Got it, I'll take over the menu customization
  request from Lior" -> **owner_reassigned** (menu customization: Lior
  -> Naledi).
- "I'll take the allergen-safety briefing myself, then — that's a new
  item" -> **action_added** (allergen-safety briefing, owner Deshawn).
- "let's drop the dietary-survey form entirely — it's moot now... Don't
  replace it with an Amberline version either" -> the dietary-survey
  form is **retired**, represented ONLY by its absence from the current
  open `action_items` — this is NOT one of the 3 typed changes.

**Current state:**
- `current_decisions.catering_vendor` = Amberline Table (Driftwell must
  not appear as the active value).
- `action_items` = exactly {Naledi: menu customization request (against
  Amberline's tasting menu), Deshawn: allergen-safety briefing}. The
  dietary-survey-form item is absent.
- `changes` = exactly 3 entries, types = {decision_reversed,
  owner_reassigned, action_added}, each exactly once. `action_removed`
  is not a permitted type — a 4th entry of any type fails obj-3.

### Objective check notes

- **obj-1**: this is a value-position check — "Driftwell" appearing in
  a `changes` entry's `description` (e.g. "reversed from Driftwell to
  Amberline Table") is expected and fine; "Driftwell" appearing as the
  value of `current_decisions.catering_vendor`, or the decision being
  presented as still-contested, fails.
- **obj-2**: exact single-owner check on the current menu customization
  item; a submission that lists Lior as owner (stale from Tuesday) or
  lists both Lior and Naledi fails.
- **obj-3**: exactly 3, no more, no fewer. A submission that adds a 4th
  delta (commonly `action_removed` for the dietary-survey-form
  retirement) fails this check even though the retirement itself is
  real — the task explicitly states retirement is represented by
  absence, not by a typed delta.
- **obj-4**: substring scan restricted to the CURRENT open
  `action_items` array — "dietary-survey" may appear in `changes`
  history/description text, just not as a current open item.

### Prose-located check: is the current catering decision stated correctly?

This is a binary judgment about whether the submission's prose
(`RECONCILIATION.md` and any narrative around `state.json`) presents
Amberline Table, not Driftwell, as the active choice.

**PASSING** (correctly presents Amberline Table as current):
1. "Current decision: book Amberline Table."
2. "Amberline Table selected (reversed from Driftwell on Friday)."
3. "Active choice: Amberline Table."

**FAILING** (presents Driftwell as current, or as still open):
1. "Book Driftwell Catering."
2. "Driftwell and Amberline Table are both still under consideration."
3. "Driftwell Catering (pending switch to Amberline Table)."

### Subjective guidance

- **Current-state accuracy**: does the submission cleanly present only
  the post-Friday state as current, without letting any stale Tuesday
  fact (Driftwell as decision, Lior as menu-customization owner,
  dietary-survey form as an open item) leak into the current-state
  view?
- **Change-delta typing & audit trail**: are the 3 changes typed
  correctly and described specifically enough that a reader could
  reconstruct what changed and why, and does the submission correctly
  resist inventing a 4th delta type for the retirement?
- **Reasoning quality**: does the submission explain that later
  (Friday) statements supersede earlier (Tuesday) ones by design, name
  the closed change-type vocabulary explicitly, and give a clear reason
  the dietary-survey-form retirement is absence-only rather than a
  typed change?
