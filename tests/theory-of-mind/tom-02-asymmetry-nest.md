---
id: tom-02-asymmetry-nest
category: theory-of-mind
title: Red ledger three-agent knowledge grid
deliverables:
  - beliefs.md
---

## Task

Read the short narrative below. Then fill in a fixed belief table in
`beliefs.md`, and trace each agent's observation window in
`REASONING.md`.

### Narrative

Ada, Bo, and Cy share a small archive room. In the room are three
storage spots: a SHELF, a DRAWER, and a CRATE. A single item, the
RED_LEDGER, is kept in one of these spots at all times.

1. All three of them are present together in the room, and all three
   watch as the RED_LEDGER sits on the SHELF. This starting location is
   plainly visible to everyone.
2. Cy leaves the archive room to run an errand elsewhere in the
   building. Once Cy steps out, Cy cannot see, hear, or otherwise learn
   anything about what happens inside the archive room until Cy
   physically returns to it. No one contacts Cy while she is away.
3. With Cy gone, Ada moves the RED_LEDGER from the SHELF into the
   DRAWER. Ada and Bo are both present in the room and both clearly
   see this move happen.
4. Bo then leaves the archive room for a separate errand. Once Bo steps
   out, Bo cannot see, hear, or otherwise learn anything about what
   happens inside the archive room until Bo physically returns to it.
   No one contacts Bo while he is away.
5. With both Bo and Cy gone, and only Ada present in the room, Ada
   moves the RED_LEDGER a second time, from the DRAWER into the CRATE.
   No one else witnesses this second move.
6. Bo then returns to the archive room. Ada is present when Bo returns,
   but Ada says nothing to Bo about the RED_LEDGER or either move. Bo
   does not open the DRAWER, look in the CRATE, or otherwise check any
   storage spot before the scene ends. Cy has not yet returned when the
   scene ends.

The scene ends at this point.

### Table to fill in

Produce exactly the following nine rows in `beliefs.md`, each with an
answer drawn strictly from the token set `{SHELF, DRAWER, CRATE}`:

**First-order beliefs**
1. **Reality** — Where is the RED_LEDGER actually located at the end
   of the scene?
2. **Ada's belief** — Where does Ada believe it is?
3. **Bo's belief** — Where does Bo believe it is?
4. **Cy's belief** — Where does Cy believe it is?

**Nested (second-order) beliefs**
5. **Ada-thinks-Bo** — Where does Ada believe Bo currently believes it is?
6. **Ada-thinks-Cy** — Where does Ada believe Cy currently believes it is?
7. **Bo-thinks-Cy** — Where does Bo believe Cy currently believes it is?
8. **Cy-thinks-Bo** — Where does Cy believe Bo currently believes it is?

**Third-order belief**
9. **Bo-thinks-Ada-thinks-Cy** — Where does Bo believe that Ada
   believes Cy currently believes it is?

## Deliverables

- `beliefs.md`: exactly nine labeled rows as listed above. The answer
  portion of each row must contain exactly one verbatim token from
  `{SHELF, DRAWER, CRATE}` and nothing else — no parentheticals,
  hedges, or explanatory clauses in the answer itself.
- `REASONING.md`: for each agent, state the window during which they
  could observe events in the room (entry/exit times) and show how
  that window determines each answer above. At most 450 words (whole
  file, `wc -w`).

## Constraints

- Every answer cell must be exactly one token from `{SHELF, DRAWER,
  CRATE}` — no other wording, no combined answers, no qualifiers.
- An agent's belief updates only from what that agent personally
  observed while physically present, or was explicitly told. Being in
  the same room as someone who knows more does not transfer knowledge
  by itself — the narrative is explicit about who spoke and who stayed
  silent.
- Do not collapse all beliefs to the final reality; the three agents'
  first-order beliefs are not all the same at the end of the scene.
- `REASONING.md` must be at most 450 words.
