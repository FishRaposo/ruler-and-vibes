---
test: txsyn-02c-summer-reading-prep
canary: "fresco mural"
reviewed: "pass 2026-07-04 (independent gate)"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "commitments.json parses with node (JSON.parse) and the `commitments` array has exactly 4 entries"
    - id: obj-2
      check: "every entry has an `owner` field whose value is exactly one of {Odette, Soraya, Devon, Naledi} (case-sensitive), and the multiset of owners across the 4 entries is exactly {Odette, Soraya, Devon, Naledi} — each commits exactly once, and no entry is owned by the branch coordinator Bridget"
    - id: obj-3
      check: "no entry's `deliverable` text contains the hedge tokens 'maybe', 'might', 'someday', 'eventually', 'probably', or \"we'll see\" (case-insensitive)"
    - id: obj-4
      check: "the projector fix (owner Devon, due 'today') IS present as a commitment, and the badge-program/PA-system musings are absent (case-insensitive substring scan of the serialized array for 'badge program' and 'pa system' returns zero matches)"
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
anchors:
  - id: Commitment discrimination accuracy
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Owner attribution & exclusion rationale
    0: Fails the criterion: the relevant quality is absent or actively wrong.
    5: Partially meets the criterion: present but inconsistent or weak.
    10: Fully meets the criterion: strong and consistent throughout.
  - id: Reasoning quality
    0: REASONING.md missing, or restates the task with no real decisions/limitations.
    5: States an approach and one decision, but limitations are vague or generic.
    10: Names a concrete decision and a concrete limitation with honest trade-offs.

---

## Judge guidance

Parallel form of `txsyn-02-commitment-discrimination` (same construct,
fresh surface).

If the phrase "fresco mural" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key: the 4 firm commitments

1. **Odette** — finalize the summer reading program schedule by Friday
   (line 2: "I will have the summer reading program schedule finalized by
   Friday").
2. **Soraya** — send the volunteer shift assignments by EOD, the day the
   program schedule locks (line 7).
3. **Devon** — fix the flickering projector in the community room today
   (line 13, a buried aside: "I'll fix the projector today, no question").
4. **Naledi** — post the summer reading flyers and social graphics the
   same day Odette's schedule locks (line 15).

Each of the four staff members commits exactly once; the branch
coordinator Bridget commits to nothing (she only asks status questions
throughout).

### Answer key: the excluded musings (must NOT appear)

1. **Odette's shelving aside** (line 5): "I'm thinking I'll probably get
   to redoing the picture-book display shelves at some point, we'll see"
   — hedged with "probably" and "we'll see"; must NOT be counted as a
   second Odette commitment.
2. **Soraya's badge-program aside** (line 8): "we could maybe start a
   teen volunteer badge program someday" — hedged with "maybe" and
   "someday"; must NOT be counted as a second Soraya commitment.
3. **Devon's PA-system aside** (line 10): "It might be nice to upgrade
   the whole PA system eventually" — hedged with "might" and
   "eventually"; must NOT be counted as a commitment.

### Objective check notes

- **obj-1/obj-2**: exactly 4 entries, owner multiset exactly {Odette,
  Soraya, Devon, Naledi} — each exactly once. A submission that
  double-counts Odette (both the shelving hedge and the program schedule)
  or Soraya (both the badge-program aside and the shift assignments)
  fails the multiset check even if it also correctly includes the real
  commitment, because the multiset would then have 5 or more entries or a
  duplicate owner.
- **obj-3**: this is a substring scan restricted to the `deliverable`
  field text of the 4 INCLUDED entries — the hedge tokens are expected to
  appear in the transcript's excluded musings, just not inside the 4 kept
  entries.
- **obj-4**: the projector fix is the "buried aside, looks incidental"
  trap that must be caught despite being introduced with "Oh, and yeah —
  almost forgot to mention it"; the badge-program and PA-system musings
  are the "sounds confident but is hedged" trap that must be excluded
  despite superficially resembling commitments.

### Prose-located check: is this line a firm commitment or a musing?

This determination is binary but requires reading past surface
confidence to check for the hedge tokens and for concrete
owner+deliverable+deadline structure.

**PASSING** (correctly included as firm commitments):
1. "I'll fix the projector today, no question."
2. "I will have the summer reading program schedule finalized by Friday."
3. "I'll send the volunteer shift assignments by EOD."

**FAILING** (musings incorrectly treated as commitments):
1. "We could maybe start a teen volunteer badge program someday if we
   ever have a quiet month." (hedged with "maybe"/"someday" — not a
   commitment.)
2. "I'm thinking I'll probably get to redoing the shelves, we'll see, no
   promises on timing there." (hedged with "probably"/"we'll see" despite
   first-person future phrasing — not a commitment.)
3. "It might be nice to upgrade the whole PA system eventually, but
   that's not where my head's at this week." (hedged with
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
