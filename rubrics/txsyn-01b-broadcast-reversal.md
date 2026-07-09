---
test: txsyn-01b-broadcast-reversal
canary: "caddisfly enoki"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "decisions.json parses with node (JSON.parse) and its `final_decision` field (string) contains the token 'defer' (case-insensitive) referring to the live outdoor broadcast — not 'run the live outdoor broadcast this fair'"
    - id: obj-2
      check: "the action_items array contains exactly 3 items, each an object with an `owner` field whose value is exactly one of {Tamsin, Ojo, Petronella} (case-sensitive)"
    - id: obj-3
      check: "no action item in action_items references drafting/finalizing the outdoor site or stage-layout plan (the cancelled pre-reversal task) — a case-insensitive substring scan of the serialized array for 'layout plan' returns zero matches"
    - id: obj-4
      check: "action_items includes one item owned by Tamsin about finalizing the interview segment (Voices of Aldergate), one owned by Ojo about updating the run-of-show board, and one owned by Petronella about notifying the venue-and-volunteer coordinator (each owner-task pairing correct)"
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

Parallel form of `txsyn-01-decision-reversal` (same construct, fresh
surface).

If the phrase "caddisfly enoki" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
scores.

### Answer key: final state

The transcript's decision is made twice: first "run the live outdoor
broadcast from the riverside meadow this fair" (line 6), then reversed
after Petronella raises a site-safety/flood risk (lines 14-20) to "defer
the live outdoor broadcast to next year; air only the interview segment
this fair" (lines 21-23). Nothing later in the transcript re-reverses
this — the reversal is the final word, confirmed again in the closing
summary (line 32).

- **`final_decision`**: defer the live outdoor riverside broadcast to
  next year's fair; air only the pre-recorded "Voices of Aldergate"
  interview segment this fair. Must contain "defer" referring to the
  outdoor broadcast — not a restatement of the original "run the live
  outdoor broadcast this fair" decision.
- **`action_items`** (exactly 3, surviving the reversal):
  1. Tamsin — finalize the "Voices of Aldergate" interview segment and
     get it broadcast-ready by fair day (line 27).
  2. Ojo — update the run-of-show board to move the live outdoor
     broadcast to next year and mark the interview segment as this fair's
     slot (line 29).
  3. Petronella — notify the venue-and-volunteer coordinator that the
     live outdoor broadcast is off for this fair (line 31).
- **Cancelled action (must NOT appear)**: "Tamsin, can you draft the
  outdoor site plan? … the stage-layout plan and cable routing" (line 7,
  agreed at line 8) is explicitly retracted at line 24 ("scratch the site
  and stage-layout plan for now"). No line after 24 revives it.
- **Farhat** drives the reversal (lines 20, 22, 32) but is never assigned
  an action item — the owner set is deliberately {Tamsin, Ojo,
  Petronella} only. A submission that assigns anything to Farhat has
  misread the transcript.

### Objective check notes

- **obj-1**: check the field value only, not surrounding commentary;
  "run the live outdoor broadcast this fair" or an unconditional
  broadcast-runs reading fails even if the interview-segment detail is
  also present.
- **obj-2**: exactly 3 items; a 4th item (e.g. reviving the site plan as
  still-open, or inventing a Farhat action) fails count and/or owner-set
  checks simultaneously.
- **obj-3**: this is a substring scan on the serialized `action_items`
  array specifically — the site/stage-layout plan is expected to appear
  in prose discussion of what happened, just not as a listed open action
  item.
- **obj-4**: verify the owner-task pairing exactly as keyed above; a
  submission that swaps owners (e.g. gives Petronella the run-of-show
  board update and Ojo the coordinator notice) fails this check even with
  the right 3 tasks present, since the pairing is what's being tested.

### Runnable objective check

Save the submission's `decisions.json` and `SUMMARY.md` in the current
directory and run, from that directory:

```bash
node -e '
const fs = require("fs");
const d = JSON.parse(fs.readFileSync("decisions.json", "utf8"));
const items = d.action_items;
const ser = JSON.stringify(items);
const out = {};

// obj-1
const fd = d.final_decision;
const fl = typeof fd === "string" ? fd.toLowerCase() : "";
const hasDefer = /\bdefer(red|ring|s)?\b/.test(fl) || /next year|next fair/.test(fl);
const assertsOrig = /(run|running|air(ing)?|broadcast(ing)?)[^.]*live outdoor[^.]*(this fair|this year|harvest fair)/.test(fl) && !hasDefer;
out["obj-1"] = typeof fd === "string" && hasDefer && !assertsOrig;

// obj-2
const allowed = new Set(["Tamsin", "Ojo", "Petronella"]);
out["obj-2"] = Array.isArray(items) && items.length === 3 &&
  items.every(it => it && typeof it.owner === "string" && allowed.has(it.owner) &&
    typeof it.task === "string" && Object.keys(it).sort().join(",") === "owner,task");

// obj-3
out["obj-3"] = !/layout plan/i.test(ser);

// obj-4
const find = o => (items || []).find(it => it.owner === o);
const t = find("Tamsin"), o = find("Ojo"), p = find("Petronella");
const tOk = t && /interview segment|voices of aldergate/i.test(t.task) && /(final|broadcast-ready|ready)/i.test(t.task);
const oOk = o && /run-of-show|board/i.test(o.task) && /(move|update)/i.test(o.task);
const pOk = p && /notify|tell|inform|let .*know/i.test(p.task) && /coordinator|venue|volunteer/i.test(p.task);
out["obj-4"] = Boolean(tOk && oOk && pOk);

console.log(out);
'
# obj-5: word count of SUMMARY.md (must be <= 250)
wc -w < SUMMARY.md
```

A correct submission prints `obj-1..obj-4` all `true` and a word count of
250 or fewer.

### Prose-located check: does `final_decision` clearly name the reversal?

This is a binary judgment about whether the string clearly identifies the
FINAL, post-reversal decision rather than the original one.

**PASSING** (clearly states the final, reversed decision):
1. "Defer the live outdoor broadcast to next year; air only the interview segment."
2. "Live outdoor broadcast pushed to next year's fair, interview segment airs now."
3. "Outdoor broadcast deferred; Voices of Aldergate segment only this fair."

**FAILING** (states or implies the original, superseded decision):
1. "Run the live outdoor broadcast from the riverside meadow this fair."
2. "Air the live outdoor broadcast and the interview segment."
3. "The live outdoor broadcast goes ahead this fair."

### Subjective guidance

- **Decision-and-owner fidelity**: does the submission correctly identify
  the reversal as the operative outcome, and does every surviving action
  item carry its correct owner? Reward `SUMMARY.md` prose that explicitly
  names the site-safety/flood blocker as the reason for the reversal
  rather than stating the outcome without cause.
- **Reversal handling & summary clarity**: does the submission clearly
  distinguish "what was true before the reversal" from "what's true now,"
  rather than blending both into one ambiguous account? Is `SUMMARY.md`
  readable as a standalone status update to someone who missed the
  meeting?
- **Reasoning quality**: does the submission's account of its own process
  show it tracked the meeting chronologically and specifically noticed
  the retraction at line 24 (rather than independently deciding the site
  plan "must have" lapsed), and does it explain why Farhat owns no action
  item?
