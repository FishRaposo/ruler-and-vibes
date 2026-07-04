---
id: tom-03-deception-override
category: theory-of-mind
title: Brass coin lie belief divergence
deliverables:
  - beliefs.md
---

## Task

Read the short narrative below. Then fill in a fixed belief table in
`beliefs.md`, and trace the divergence and override in `REASONING.md`.

### Narrative

Wren and Vale share a small study. In the study are three containers: a
TIN, a JAR, and a POUCH. A single item, the BRASS_COIN, is kept in one
of these containers at all times.

1. While Wren and Vale both watch, the BRASS_COIN sits in the TIN.
   Wren says out loud, truthfully, "it's in the TIN" — this matches
   what both of them can see with their own eyes at that moment.
2. Vale leaves the study to run an errand. Once Vale steps out, Vale
   cannot see, hear, or otherwise learn anything about what happens
   inside the study until Vale physically returns to it. No one
   contacts Vale while she is away.
3. With Vale gone, Wren — acting alone, with no one else present —
   moves the BRASS_COIN out of the TIN and into the JAR. Vale is never
   told about this move, before or after it happens, and has no way to
   learn it occurred through any means other than being told.
4. Vale returns to the study.
5. Vale asks Wren where the BRASS_COIN is right now. Wren answers
   "it's in the POUCH" — this is a deliberate lie; Wren knows perfectly
   well the coin is actually in the JAR, since Wren moved it there.
   Vale has no reason to doubt Wren, believes the answer completely,
   and does not open the TIN, JAR, or POUCH to check for herself.

The scene ends at this point.

### Table to fill in

Produce exactly the following six rows in `beliefs.md`, each with an
answer drawn strictly from the token set `{TIN, JAR, POUCH}`:

**First-order beliefs**
1. **Reality** — Where is the BRASS_COIN actually located at the end
   of the scene?
2. **Wren's belief** — Where does Wren believe it is?
3. **Vale's belief** — Where does Vale believe it is?

**Action**
4. **Vale-looks-first** — If Vale were to search for the BRASS_COIN
   right now, which container would she look in first?

**Nested (second-order) beliefs**
5. **Wren-thinks-Vale** — Where does Wren believe Vale currently
   believes it is?
6. **Vale-thinks-Wren** — Where does Vale believe Wren currently
   believes it is?

## Deliverables

- `beliefs.md`: exactly six labeled rows as listed above. The answer
  portion of each row must contain exactly one verbatim token from
  `{TIN, JAR, POUCH}` and nothing else — no parentheticals, hedges, or
  explanatory clauses in the answer itself.
- `REASONING.md`: trace how Vale's belief moves from the initial true
  statement, through the unseen move, to the final lie, and explain why
  the lie — not the earlier true statement and not the current reality
  — determines Vale's final belief. Also explain why Wren's own belief
  is unaffected by the lie Wren told. At most 400 words (whole file,
  `wc -w`).

## Constraints

- Every answer cell must be exactly one token from `{TIN, JAR, POUCH}`
  — no other wording, no combined answers, no qualifiers.
- A liar does not come to believe their own lie merely by telling it;
  Wren's belief tracks what Wren actually did, not what Wren said.
- The listener's belief tracks the most recent information they
  received, even when that information is false and even when it
  contradicts something true they were told earlier — the narrative is
  explicit that Vale never learns of the move and never verifies
  anything herself.
- `REASONING.md` must be at most 400 words.
