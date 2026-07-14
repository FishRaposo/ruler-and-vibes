---
id: tom-01c-wardrobe-brooch
category: theory-of-mind
title: Jade brooch relocation belief table
deliverables:
  - beliefs.md
  - REASONING.md
---

## Task

Read the short narrative below. Then fill in a fixed belief table in
`beliefs.md`, and trace your reasoning event-by-event in `REASONING.md`.

### Narrative

Ondine and Teodora are working together in a theater wardrobe room. On
the counter in front of them are two storage containers: a VELVET_TRUNK
and a SLATE_CREDENZA. Both containers are empty except for whatever is
placed inside them during the events below.

1. While Ondine and Teodora both watch, Ondine picks up a jade_brooch
   and places it inside VELVET_TRUNK. Both of them clearly see this
   happen.
2. Ondine then leaves the wardrobe room to sign for a delivery in the
   corridor. Once she steps out, she cannot see or hear anything that
   happens inside the wardrobe room, and nothing about the room's
   contents is communicated to her while she is gone.
3. While Ondine is still out of the room, Teodora — acting alone, with
   no one else present — takes the jade_brooch out of VELVET_TRUNK and
   places it inside SLATE_CREDENZA instead.
4. A few minutes later, Ondine finishes signing for the delivery and
   walks back into the wardrobe room. She does not open, look inside,
   or otherwise inspect either container before the scene ends. No one
   tells her anything about what happened while she was away.

The scene ends at this point.

### Table to fill in

Produce exactly the following five rows in `beliefs.md`, each with an
answer drawn strictly from the token set `{VELVET_TRUNK,
SLATE_CREDENZA}`:

1. **Reality** — Where is the jade_brooch actually located at the end
   of the scene?
2. **Ondine's belief** — Where does Ondine believe the jade_brooch is,
   at the end of the scene?
3. **Teodora's belief** — Where does Teodora believe the jade_brooch
   is, at the end of the scene?
4. **Ondine-looks-first** — If Ondine were to search for the
   jade_brooch right now, which container would she look in first?
5. **Teodora-thinks-Ondine-looks** — Which container does Teodora
   predict Ondine will look in first?

## Deliverables

- `beliefs.md`: a table or list with exactly five rows, one per
  question above. Each row must clearly label which question it
  answers, and the answer portion of each row must contain exactly one
  verbatim token from `{VELVET_TRUNK, SLATE_CREDENZA}` — nothing else. Do
  not add parentheticals, hedges, punctuation beyond the token, or
  explanatory clauses inside the answer itself; any explanation belongs
  only in `REASONING.md`.
- `REASONING.md`: trace the belief state update at each numbered event
  above and show how each of the five answers follows. At most 300
  words (whole file, `wc -w`).

## Constraints

- Every answer cell must be exactly one token from `{VELVET_TRUNK,
  SLATE_CREDENZA}` — no other wording, no combined answers, no
  qualifiers.
- Do not assume Ondine updates her belief just because she is
  physically back in the room; she only updates on what she actually
  observes or is told, and the narrative is explicit that neither
  happens.
- `REASONING.md` must be at most 300 words.
