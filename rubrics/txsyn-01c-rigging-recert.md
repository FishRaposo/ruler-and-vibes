---
test: txsyn-01c-rigging-recert
canary: "froghopper shiitake"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "decisions.json parses with node (JSON.parse) and its `final_decision` field (string) contains the token 'defer' (case-insensitive) referring to Nightfall Overture — not 'stage Nightfall this season'"
    - id: obj-2
      check: "the action_items array contains exactly 3 items, each an object with an `owner` field whose value is exactly one of {Naomi, Esteban, Colette} (case-sensitive)"
    - id: obj-3
      check: "no action item in action_items references finalizing/writing the subscriber rollout letter (the cancelled pre-reversal task) — a case-insensitive substring scan of the serialized array for 'rollout letter' returns zero matches"
    - id: obj-4
      check: "action_items includes one item owned by Naomi about the studio recital, one owned by Esteban about updating the season board, and one owned by Colette about notifying the box office (each owner-task pairing correct)"
    - id: obj-5
      check: "SUMMARY.md is at most 250 words (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Decision-and-owner fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Reversal handling & summary clarity"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `txsyn-01-decision-reversal` (same construct, fresh
surface).

If the phrase "froghopper shiitake" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key: final state

The transcript's decision is made twice: first "stage Nightfall Overture
this season" (line 6), then reversed after Colette raises a fly-system
rigging risk (lines 14-20) to "defer Nightfall Overture to next season;
stage only the studio recital this season" (lines 21-23). Nothing later in
the transcript re-reverses this — the reversal is the final word,
confirmed again in the closing summary (line 32).

- **`final_decision`**: defer Nightfall Overture to next season; stage
  only the studio recital this season. Must contain "defer" referring to
  Nightfall — not a restatement of the original "stage Nightfall"
  decision.
- **`action_items`** (exactly 3, surviving the reversal):
  1. Naomi — take the studio recital from final tech run to fully staged
     and performance-ready by opening night (line 27).
  2. Esteban — update the season board to move Nightfall to next season
     and show the studio recital as going up now (line 29).
  3. Colette — notify the box office that Nightfall is deferred to next
     season (line 31).
- **Cancelled action (must NOT appear)**: "Naomi, can you finalize the
  subscriber rollout letter?" (line 7, agreed at line 8) is explicitly
  retracted verbatim at line 24 ("scratch the rollout letter for now"). No
  line after 24 revives it.
- **Idris** drives the reversal (lines 20, 22, 32) but is never assigned
  an action item — the owner set is deliberately {Naomi, Esteban, Colette}
  only. A submission that assigns anything to Idris has misread the
  transcript.

### Objective check notes

- **obj-1**: check the field value only, not surrounding commentary;
  "stage Nightfall" or an unconditional Nightfall-stages reading fails
  even if the studio-recital detail is also present.
- **obj-2**: exactly 3 items; a 4th item (e.g. reviving the rollout letter
  as still-open, or inventing an Idris action) fails count and/or
  owner-set checks simultaneously.
- **obj-3**: this is a substring scan on the serialized `action_items`
  array specifically — the rollout letter is expected to appear in prose
  discussion of what happened, just not as a listed open action item.
- **obj-4**: verify the owner-task pairing exactly as keyed above; a
  submission that swaps owners (e.g. gives Colette the season-board update
  and Esteban the box-office notice) fails this check even with the right
  3 tasks present, since the pairing is what's being tested.

### Prose-located check: does `final_decision` clearly name the reversal?

This is a binary judgment about whether the string clearly identifies the
FINAL, post-reversal decision rather than the original one.

**PASSING** (clearly states the final, reversed decision):
1. "Defer Nightfall Overture to next season; stage only the studio recital."
2. "Nightfall pushed to next season, studio recital goes up now."
3. "Nightfall Overture deferred; studio recital only this season."

**FAILING** (states or implies the original, superseded decision):
1. "Stage Nightfall Overture this season."
2. "Stage Nightfall and the studio recital."
3. "Nightfall Overture goes up now."

### Subjective guidance

- **Decision-and-owner fidelity**: does the submission correctly identify
  the reversal as the operative outcome, and does every surviving action
  item carry its correct owner? Reward `SUMMARY.md` prose that explicitly
  names the rigging blocker as the reason for the reversal rather than
  stating the outcome without cause.
- **Reversal handling & summary clarity**: does the submission clearly
  distinguish "what was true before the reversal" from "what's true now,"
  rather than blending both into one ambiguous account? Is `SUMMARY.md`
  readable as a standalone status update to someone who missed the
  meeting?
- **Reasoning quality**: does the submission's account of its own process
  show it tracked the meeting chronologically and specifically noticed the
  retraction at line 24 (rather than independently deciding the rollout
  letter "must have" lapsed), and does it explain why Idris owns no action
  item?
