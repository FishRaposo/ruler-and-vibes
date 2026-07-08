---
test: txsyn-02b-curtain-call-crew
canary: "javelin tapestry"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "commitments.json parses with node (JSON.parse) and the `commitments` array has exactly 4 entries"
    - id: obj-2
      check: "every entry has an `owner` field whose value is exactly one of {Dash, Junko, Teo, Brynn} (case-sensitive), and the multiset of owners across the 4 entries is exactly {Dash, Junko, Teo, Brynn} — each commits exactly once, and no entry is owned by the stage manager Imogen"
    - id: obj-3
      check: "no entry's `deliverable` text contains the hedge tokens 'maybe', 'might', 'someday', 'eventually', 'probably', or \"we'll see\" (case-insensitive)"
    - id: obj-4
      check: "the ripped-hem fix (owner Teo, due 'today') IS present as a commitment, and the repaint/costume-resize musings are absent (case-insensitive substring scan of the serialized array for 'repaint' and 'resize the ensemble' returns zero matches)"
    - id: obj-5
      check: "RATIONALE.md is at most 300 words (whole file, wc -w)"
  subjective:
    - id: sub-quality
      name: "Commitment discrimination accuracy"
      weight: 0.4
    - id: sub-craft
      name: "Owner attribution & exclusion rationale"
      weight: 0.3
    - id: sub-reasoning
      name: "Reasoning quality"
      weight: 0.3
---

## Judge guidance

Parallel form of `txsyn-02-commitment-discrimination` (same construct,
fresh surface).

If the phrase "javelin tapestry" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key: the 4 firm commitments

1. **Dash** — finalize (fully lock) the lighting cues by Thursday (line
   2: "I will have the lighting cues fully locked by Thursday").
2. **Junko** — deliver the prop inventory checklist by end of day, the
   day the lighting cues lock (line 7).
3. **Teo** — fix the ripped hem on the lead actor's costume today (line
   13, a buried aside: "nearly slipped my mind ... I'll get that patched
   today").
4. **Brynn** — run the full sound check the same day Dash's cues land
   (line 15).

Each of the four crew members commits exactly once; the stage manager
Imogen commits to nothing (she only asks status questions throughout).

### Answer key: the excluded musings (must NOT appear)

1. **Dash's gel-swatch aside** (line 5): "I'll probably circle back and
   relabel the gel swatches at some point, we'll see how the week shakes
   out" — hedged with "probably" and "we'll see"; must NOT be counted as
   a second Dash commitment.
2. **Junko's repaint aside** (line 8): "maybe we repaint the backstage
   flats someday if a slow week ever comes along" — hedged with "maybe"
   and "someday"; must NOT be counted as a second Junko commitment.
3. **Teo's costume-resize aside** (line 10): "It might be worth trying to
   resize the ensemble costumes eventually" — hedged with "might" and
   "eventually"; must NOT be counted as a commitment.

### Objective check notes

- **obj-1/obj-2**: exactly 4 entries, owner multiset exactly {Dash,
  Junko, Teo, Brynn} — each exactly once. A submission that double-counts
  Dash (both the gel-swatch hedge and the lighting cues) or Junko (both
  the repaint aside and the prop checklist) fails the multiset check even
  if it also correctly includes the real commitment, because the
  multiset would then have 5 or more entries or a duplicate owner.
- **obj-3**: this is a substring scan restricted to the `deliverable`
  field text of the 4 INCLUDED entries — the hedge tokens are expected
  to appear in the transcript's excluded musings, just not inside the
  4 kept entries.
- **obj-4**: the ripped-hem fix is the "buried aside, looks incidental"
  trap that must be caught despite being introduced with "Oh — nearly
  slipped my mind"; the repaint and costume-resize musings are the
  "sounds confident but is hedged" trap that must be excluded despite
  superficially resembling commitments.

### Prose-located check: is this line a firm commitment or a musing?

This determination is binary but requires reading past surface
confidence to check for the hedge tokens and for concrete
owner+deliverable+deadline structure.

**PASSING** (correctly included as firm commitments):
1. "I'll get the ripped hem patched today."
2. "I will have the lighting cues fully locked by Thursday."
3. "I'll hand off the complete prop inventory checklist by end of day."

**FAILING** (musings incorrectly treated as commitments):
1. "Maybe we repaint the backstage flats someday if a slow week ever
   comes along." (hedged with "maybe"/"someday" — not a commitment.)
2. "I'll probably circle back and relabel the gel swatches at some
   point, we'll see how the week shakes out." (hedged with
   "probably"/"we'll see" despite first-person future phrasing — not a
   commitment.)
3. "It might be worth trying to resize the ensemble costumes eventually,
   but it's not where my attention is this week." (hedged with
   "might"/"eventually," and the speaker explicitly says it isn't a
   priority — not a commitment.)

### Subjective guidance

- **Commitment discrimination accuracy**: does the submission correctly
  separate the 4 firm commitments from the 3 seeded musings, including
  the two directional traps (a musing dressed up as a commitment, and a
  real commitment buried in a throwaway aside)?
- **Owner attribution & exclusion rationale**: is each commitment
  attributed to the correct single speaker, and does `RATIONALE.md`
  explain — for each excluded line — which specific hedge token
  triggered the exclusion, rather than a vague "this seemed uncertain"?
- **Reasoning quality**: does `RATIONALE.md` show a line-by-line pass
  applying the stated commitment test (unhedged first-person future +
  concrete deliverable + deadline) rather than an impressionistic read,
  and does it explicitly flag both directional traps by name?
