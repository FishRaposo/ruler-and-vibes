---
id: tom-03c-tuning-fork-workshop
category: theory-of-mind
title: Tuning fork lie belief divergence
deliverables:
  - beliefs.md
  - REASONING.md
---

## Task

Read the short narrative below. Then fill in a fixed belief table in
`beliefs.md`, and trace the divergence and override in `REASONING.md`.

### Narrative

Silas and Odessa share a small violin-repair workshop. In the workshop
are three containers: a CANISTER, a NICHE, and a HUTCH. A single item,
the TUNING_FORK, is kept in one of these containers at all times.

1. While Silas and Odessa both watch, the TUNING_FORK sits in the
   CANISTER. Silas says out loud, truthfully, "it's in the CANISTER" —
   this matches what both of them can see with their own eyes at that
   moment.
2. Odessa leaves the workshop to deliver a repaired violin to a
   customer across town. Once Odessa steps out, Odessa cannot see,
   hear, or otherwise learn anything about what happens inside the
   workshop until Odessa physically returns to it. No one contacts
   Odessa while she is away.
3. With Odessa gone, Silas — acting alone, with no one else present —
   moves the TUNING_FORK out of the CANISTER and into the NICHE.
   Odessa is never told about this move, before or after it happens,
   and has no way to learn it occurred through any means other than
   being told.
4. Odessa returns to the workshop.
5. Odessa asks Silas where the TUNING_FORK is right now. Silas answers
   "it's in the HUTCH" — this is a deliberate lie; Silas knows
   perfectly well the fork is actually in the NICHE, since Silas moved
   it there. Odessa has no reason to doubt Silas, believes the answer
   completely, and does not open the CANISTER, NICHE, or HUTCH to
   check for herself.

The scene ends at this point.

### Table to fill in

Produce exactly the following six rows in `beliefs.md`, each with an
answer drawn strictly from the token set `{CANISTER, NICHE, HUTCH}`:

**First-order beliefs**
1. **Reality** — Where is the TUNING_FORK actually located at the end
   of the scene?
2. **Silas's belief** — Where does Silas believe it is?
3. **Odessa's belief** — Where does Odessa believe it is?

**Action**
4. **Odessa-looks-first** — If Odessa were to search for the
   TUNING_FORK right now, which container would she look in first?

**Nested (second-order) beliefs**
5. **Silas-thinks-Odessa** — Where does Silas believe Odessa currently
   believes it is?
6. **Odessa-thinks-Silas** — Where does Odessa believe Silas currently
   believes it is?

## Deliverables

- `beliefs.md`: exactly six labeled rows as listed above. The answer
  portion of each row must contain exactly one verbatim token from
  `{CANISTER, NICHE, HUTCH}` and nothing else — no parentheticals,
  hedges, or explanatory clauses in the answer itself.
- `REASONING.md`: trace how Odessa's belief moves from the initial
  true statement, through the unseen move, to the final lie, and
  explain why the lie — not the earlier true statement and not the
  current reality — determines Odessa's final belief. Also explain why
  Silas's own belief is unaffected by the lie Silas told. At most 400
  words (whole file, `wc -w`).

## Constraints

- Every answer cell must be exactly one token from
  `{CANISTER, NICHE, HUTCH}` — no other wording, no combined answers,
  no qualifiers.
- A liar does not come to believe their own lie merely by telling it;
  Silas's belief tracks what Silas actually did, not what Silas said.
- The listener's belief tracks the most recent information they
  received, even when that information is false and even when it
  contradicts something true they were told earlier — the narrative is
  explicit that Odessa never learns of the move and never verifies
  anything herself.
- `REASONING.md` must be at most 400 words.
