---
test: writing-02b-studio-postponement
canary: "binturong cerulean"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.5
  subjective: 0.5
criteria:
  objective:
    - id: obj-1
      check: "All three sections present: ## Formal, ## Friendly, ## Summary"
    - id: obj-2
      check: "All four facts present in every version"
    - id: obj-3
      check: "Summary is one sentence of <= 25 words (count them)"
    - id: obj-4
      check: "No invented facts in any version"
  subjective:
    - id: sub-quality
      name: "Register fidelity"
      weight: 0.4
    - id: sub-craft
      name: "Concision"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `writing-02-registers` (same construct, fresh surface).

If the phrase "binturong cerulean" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the rest
of the submission scores.

### The four facts

Every version must carry all four, in whatever wording its register
calls for:

- (a) cause: a **foundation/structural problem** found during the
  kiln-room renovation (extra reinforcement is needed);
- (b) old date: **October 4**;
- (c) new date: **November 22**;
- (d) advance-ticket holders get a **20% refund**.

The summary compresses all four into one sentence of 25 words or fewer.
A tight reference summary lands near 22 words, so the cap is reachable
without dropping a fact — but only if the writer prunes hard. A model
that merely trims the original paragraph lightly overshoots the cap
(the original clocks ~82 words; a lazily-trimmed "summary" runs into
the mid-30s). The trap is: keep all four facts AND stay under 25 words,
in one sentence.

### obj-3 — count the summary

Judge counts the words in the `## Summary` body (a single heading line,
if present, is not counted). Pass requires **one sentence** and **≤ 25
words**. Two sentences fails even if each is short; 26+ words fails even
if it is a single sentence.

### Example phrasings — obj-2, does every version keep all four facts?

**PASSING** (a version that carries cause, both dates, and the refund):

1. "The kiln-room renovation turned up a foundation problem, so the
   Open-Studio Exhibition moves from October 4 to November 22, and
   advance-ticket holders get a 20% refund."
2. "We found a structural issue in the kiln room's foundation; the show
   shifts from its October 4 date to November 22, with a 20% refund for
   anyone who bought advance tickets."
3. "Because a foundation problem surfaced during the kiln-room work, the
   exhibition is now November 22 instead of October 4 — advance-ticket
   holders will see 20% back."

**FAILING** (a version missing one or more of the four facts):

1. "The kiln-room renovation hit a foundation problem, so we're moving
   the exhibition to November 22. Grab your spot early!" (drops the old
   October 4 date AND the 20% refund)
2. "The Open-Studio Exhibition moves from October 4 to November 22 while
   we finish the kiln room; advance-ticket holders get 20% back." (names
   no cause — "finish the kiln room" is not the foundation problem)
3. "Due to renovation delays the show is postponed from October 4 to
   November 22, and ticket-holders are covered." ("covered" is vague —
   the 20% refund fact is gone, and the cause is generic).

### Example phrasings — obj-4, did the version invent facts?

Conventional register scaffolding ("we can't wait to welcome you back",
"we will keep the board updated") is **not** an invented fact. New
specifics — names, causes, dates, numbers, sponsors, venues — that were
not in the source paragraph **are**.

**PASSING** (only scaffolding added, no new specifics):

1. "We're sorry for the disruption and can't wait to show you the
   finished kiln room." (pure goodwill scaffolding)
2. "The board will receive a confirmed timeline before the next
   reporting period." (procedural framing, invents no fact)
3. "Thank you for your patience while we make the space safe." (register
   glue, no new specifics)

**FAILING** (smuggles in a specific that was never given):

1. "We have also secured a headline sponsor, Ashvale Bank, whose logo
   will appear on all signage." (invents a sponsor)
2. "The new November 22 date is now weather-guaranteed under our venue
   contract." (invents a venue contract and a guarantee)
3. "Advance-ticket holders get a 20% refund plus a free glazing
   workshop." (invents a workshop perk not in the source).

### Subjective guidance

- **Register fidelity** (0.4): each version unmistakable for its
  audience — the pivot between tones must feel deliberate, not a synonym
  swap. Formal (funder report) is precise and accountable, not stiff;
  friendly (members' newsletter) is warm, not unserious. A version that
  reads the same as another but for a few swapped words has not shifted
  register.
- **Concision** (0.3): every version should be materially tighter than
  the original paragraph, measured by word count against it. A formal
  register may spend a few words on convention and still come in under
  the original's ~82 words.
- **Reasoning quality** (0.3): did REASONING.md discuss the tone choices
  per audience and what was deliberately dropped or compressed to make
  the summary fit under 25 words?
