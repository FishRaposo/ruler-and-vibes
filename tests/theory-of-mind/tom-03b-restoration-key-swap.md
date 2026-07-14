---
id: tom-03b-restoration-key-swap
category: theory-of-mind
title: Copper key deception belief divergence
deliverables:
  - beliefs.md
  - REASONING.md
---

## Task

Read the short narrative below. Then fill in a fixed belief table in
`beliefs.md`, and trace the divergence and override in `REASONING.md`.

### Narrative

Idris and Marlowe share a small restoration workshop. In the workshop
are three containers: a SATCHEL, a CUBBY, and a HAMPER. A single item,
the COPPER_KEY, is kept in one of these containers at all times.

1. While Idris and Marlowe both watch, the COPPER_KEY sits in the
   SATCHEL. Idris says out loud, truthfully, "it's in the SATCHEL" —
   this matches what both of them can see with their own eyes at that
   moment.
2. Marlowe leaves the workshop to run an errand. Once Marlowe steps
   out, Marlowe cannot see, hear, or otherwise learn anything about
   what happens inside the workshop until Marlowe physically returns
   to it. No one contacts Marlowe while she is away.
3. With Marlowe gone, Idris — acting alone, with no one else present —
   moves the COPPER_KEY out of the SATCHEL and into the CUBBY. Marlowe
   is never told about this move, before or after it happens, and has
   no way to learn it occurred through any means other than being
   told.
4. Marlowe returns to the workshop.
5. Marlowe asks Idris where the COPPER_KEY is right now. Idris answers
   "it's in the HAMPER" — this is a deliberate lie; Idris knows
   perfectly well the key is actually in the CUBBY, since Idris moved
   it there. Marlowe has no reason to doubt Idris, believes the answer
   completely, and does not open the SATCHEL, CUBBY, or HAMPER to
   check for herself.

The scene ends at this point.

### Table to fill in

Produce exactly the following six rows in `beliefs.md`, each with an
answer drawn strictly from the token set `{SATCHEL, CUBBY, HAMPER}`:

**First-order beliefs**
1. **Reality** — Where is the COPPER_KEY actually located at the end
   of the scene?
2. **Idris's belief** — Where does Idris believe it is?
3. **Marlowe's belief** — Where does Marlowe believe it is?

**Action**
4. **Marlowe-looks-first** — If Marlowe were to search for the
   COPPER_KEY right now, which container would she look in first?

**Nested (second-order) beliefs**
5. **Idris-thinks-Marlowe** — Where does Idris believe Marlowe
   currently believes it is?
6. **Marlowe-thinks-Idris** — Where does Marlowe believe Idris
   currently believes it is?

## Deliverables

- `beliefs.md`: exactly six labeled rows as listed above. The answer
  portion of each row must contain exactly one verbatim token from
  `{SATCHEL, CUBBY, HAMPER}` and nothing else — no parentheticals,
  hedges, or explanatory clauses in the answer itself.
- `REASONING.md`: trace how Marlowe's belief moves from the initial
  true statement, through the unseen move, to the final lie, and
  explain why the lie — not the earlier true statement and not the
  current reality — determines Marlowe's final belief. Also explain
  why Idris's own belief is unaffected by the lie Idris told. At most
  400 words (whole file, `wc -w`).

## Constraints

- Every answer cell must be exactly one token from
  `{SATCHEL, CUBBY, HAMPER}` — no other wording, no combined answers,
  no qualifiers.
- A liar does not come to believe their own lie merely by telling it;
  Idris's belief tracks what Idris actually did, not what Idris said.
- The listener's belief tracks the most recent information they
  received, even when that information is false and even when it
  contradicts something true they were told earlier — the narrative is
  explicit that Marlowe never learns of the move and never verifies
  anything herself.
- `REASONING.md` must be at most 400 words.
