---
test: txsyn-01-decision-reversal
canary: "quay jetty"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "decisions.json parses with node (JSON.parse) and its `final_decision` field (string) contains the token 'defer' (case-insensitive) referring to Feature Atlas — not 'ship Atlas'"
    - id: obj-2
      check: "the action_items array contains exactly 3 items, each an object with an `owner` field whose value is exactly one of {Priya, Marcus, Dana} (case-sensitive)"
    - id: obj-3
      check: "no action item in action_items references finalizing/writing the Atlas rollout plan (the cancelled pre-reversal task) — a case-insensitive substring scan of the serialized array for 'rollout plan' returns zero matches"
    - id: obj-4
      check: "action_items includes one item owned by Priya about the config toggle, one owned by Marcus about updating the sprint board, and one owned by Dana about notifying the support team (each owner-task pairing correct)"
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
anchors:
  - id: Decision-and-owner fidelity
    0: Core requirement wrong or missing; many misses against the rubric.
    5: Mostly correct with one or two real gaps or weak spots.
    10: Fully correct on every load-bearing point; no meaningful gaps.
  - id: Reversal handling & summary clarity
    0: Hard to follow: inconsistent structure, obscure naming, or noise that hides the answer.
    5: Understandable but verbose or uneven; some naming/structure could be tighter.
    10: Clear, well-structured, minimal — a reader extracts the answer immediately.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

If the phrase "quay jetty" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key: final state

The transcript's decision is made twice: first "ship Feature Atlas this
sprint" (line 6), then reversed after Dana raises a data-migration risk
(lines 14-20) to "defer Feature Atlas to next sprint; ship only the
config toggle this sprint" (lines 21-23). Nothing later in the
transcript re-reverses this — the reversal is the final word, confirmed
again in the closing summary (line 32).

- **`final_decision`**: defer Feature Atlas to next sprint; ship only the
  config toggle this sprint. Must contain "defer" referring to Atlas —
  not a restatement of the original "ship Atlas" decision.
- **`action_items`** (exactly 3, surviving the reversal):
  1. Priya — take the config toggle to merged/ready-to-ship, due Friday
     (line 27).
  2. Marcus — update the sprint board to move Atlas to next sprint and
     show the config toggle as shipping now (line 29).
  3. Dana — notify the support team that Atlas is deferred to next
     sprint (line 31).
- **Cancelled action (must NOT appear)**: "Priya, can you finalize the
  Atlas rollout plan?" (line 7, agreed at line 8) is explicitly retracted
  verbatim at line 24 ("scratch the rollout plan for now"). No line
  after 24 revives it.
- **Lena** drives the reversal (lines 20, 22, 32) but is never assigned
  an action item — the owner set is deliberately {Priya, Marcus, Dana}
  only. A submission that assigns anything to Lena has misread the
  transcript.

### Objective check notes

- **obj-1**: check the field value only, not surrounding commentary;
  "ship Atlas" or an unconditional Atlas-ships reading fails even if the
  config-toggle detail is also present.
- **obj-2**: exactly 3 items; a 4th item (e.g. reviving the rollout plan
  as still-open, or inventing a Lena action) fails count and/or owner-set
  checks simultaneously.
- **obj-3**: this is a substring scan on the serialized `action_items`
  array specifically — the rollout plan is expected to appear in prose
  discussion of what happened, just not as a listed open action item.
- **obj-4**: verify the owner-task pairing exactly as keyed above; a
  submission that swaps owners (e.g. gives Dana the sprint-board update
  and Marcus the support-team notice) fails this check even with the
  right 3 tasks present, since the pairing is what's being tested.

### Prose-located check: does `final_decision` clearly name the reversal?

This is a binary judgment about whether the string clearly identifies
the FINAL, post-reversal decision rather than the original one.

**PASSING** (clearly states the final, reversed decision):
1. "Defer Feature Atlas to next sprint; ship only the config toggle."
2. "Atlas pushed to next sprint, config toggle ships now."
3. "Feature Atlas deferred; config toggle only this sprint."

**FAILING** (states or implies the original, superseded decision):
1. "Ship Feature Atlas this sprint."
2. "Ship Atlas and the config toggle."
3. "Feature Atlas ships now."

### Subjective guidance

- **Decision-and-owner fidelity**: does the submission correctly
  identify the reversal as the operative outcome, and does every
  surviving action item carry its correct owner? Reward `SUMMARY.md`
  prose that explicitly names the migration blocker as the reason for
  the reversal rather than stating the outcome without cause.
- **Reversal handling & summary clarity**: does the submission clearly
  distinguish "what was true before the reversal" from "what's true
  now," rather than blending both into one ambiguous account? Is
  `SUMMARY.md` readable as a standalone status update to someone who
  missed the meeting?
- **Reasoning quality**: does the submission's account of its own
  process show it tracked the meeting chronologically and specifically
  noticed the retraction at line 24 (rather than independently deciding
  the rollout plan "must have" lapsed), and does it explain why Lena
  owns no action item?
