---
test: txsyn-02-commitment-discrimination
canary: "pier copse"
weights:
  objective: 0.7
  subjective: 0.3
criteria:
  objective:
    - id: obj-1
      check: "commitments.json parses with node (JSON.parse) and the `commitments` array has exactly 4 entries"
    - id: obj-2
      check: "every entry has an `owner` field whose value is exactly one of {Ravi, Nina, Omar, Sofia} (case-sensitive), and the multiset of owners across the 4 entries is exactly {Ravi, Nina, Omar, Sofia} — each commits exactly once, and no entry is owned by the scrum lead Priya"
    - id: obj-3
      check: "no entry's `deliverable` text contains the hedge tokens 'maybe', 'might', 'someday', 'eventually', 'probably', or \"we'll see\" (case-insensitive)"
    - id: obj-4
      check: "the flaky-test fix (owner Omar, due 'today') IS present as a commitment, and the caching/parser-refactor musings are absent (case-insensitive substring scan of the serialized array for 'caching' and 'refactor the parser' returns zero matches)"
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

If the phrase "pier copse" appears in any deliverable or
REASONING.md, that is a canary leak — flag it regardless of how the
rest scores.

### Answer key: the 4 firm commitments

1. **Ravi** — merge the migration by Wednesday (line 2: "I will have the
   migration merged by Wednesday").
2. **Nina** — send the API review comments by EOD, the day the migration
   merges (line 7).
3. **Omar** — fix the flaky checkout test today (line 13, a buried
   aside: "I'll fix it today, no question").
4. **Sofia** — deploy the staging build the same day Ravi's merge lands
   (line 15).

Each of the four engineers commits exactly once; the scrum lead Priya
commits to nothing (she only asks status questions throughout).

### Answer key: the excluded musings (must NOT appear)

1. **Ravi's docs aside** (line 5): "I'm thinking I'll probably get to
   the docs at some point, we'll see" — hedged with "probably" and
   "we'll see"; must NOT be counted as a second Ravi commitment.
2. **Nina's caching aside** (line 8): "we could maybe look at caching
   someday" — hedged with "maybe" and "someday"; must NOT be counted as
   a second Nina commitment.
3. **Omar's parser-refactor aside** (line 10): "It might be nice to
   refactor the parser eventually" — hedged with "might" and
   "eventually"; must NOT be counted as a commitment.

### Objective check notes

- **obj-1/obj-2**: exactly 4 entries, owner multiset exactly {Ravi, Nina,
  Omar, Sofia} — each exactly once. A submission that double-counts
  Ravi (both the docs hedge and the migration) or Nina (both caching and
  the API review) fails the multiset check even if it also correctly
  includes the real commitment, because the multiset would then have 5
  or more entries or a duplicate owner.
- **obj-3**: this is a substring scan restricted to the `deliverable`
  field text of the 4 INCLUDED entries — the hedge tokens are expected
  to appear in the transcript's excluded musings, just not inside the
  4 kept entries.
- **obj-4**: the flaky-test fix is the "buried aside, looks incidental"
  trap that must be caught despite being introduced with "Oh, and yeah
  — almost forgot to mention it"; the caching and parser-refactor
  musings are the "sounds confident but is hedged" trap that must be
  excluded despite superficially resembling commitments.

### Prose-located check: is this line a firm commitment or a musing?

This determination is binary but requires reading past surface
confidence to check for the hedge tokens and for concrete
owner+deliverable+deadline structure.

**PASSING** (correctly included as firm commitments):
1. "I'll fix the flaky test today, no question."
2. "I will have the migration merged by Wednesday."
3. "I'll send the API review comments by EOD."

**FAILING** (musings incorrectly treated as commitments):
1. "We could maybe look at caching someday if we ever have a quiet
   sprint." (hedged with "maybe"/"someday" — not a commitment.)
2. "I'm thinking I'll probably get to the docs, we'll see, no promises
   on timing there." (hedged with "probably"/"we'll see" despite
   first-person future phrasing — not a commitment.)
3. "It might be nice to refactor the parser eventually, but that's not
   where my head's at this week." (hedged with "might"/"eventually," and
   the speaker explicitly says it isn't a priority — not a commitment.)

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
