---
id: tom-02b-cobalt-seal-grid
category: theory-of-mind
title: Cobalt seal three-agent knowledge grid
deliverables:
  - beliefs.md
  - REASONING.md
---

## Task

Read the short narrative below. Then fill in a fixed belief table in
`beliefs.md`, and trace each agent's observation window in
`REASONING.md`.

### Narrative

Zora, Marek, and Talia share a small gallery's collections room. In the
room are three storage spots: a CABINET, a VAULT, and a LOCKER. A
single item, the COBALT_SEAL, is kept in one of these spots at all
times.

1. All three of them are present together in the room, and all three
   watch as the COBALT_SEAL sits in the CABINET. This starting location
   is plainly visible to everyone.
2. Talia leaves the collections room to run an errand elsewhere in the
   gallery. Once Talia steps out, Talia cannot see, hear, or otherwise
   learn anything about what happens inside the collections room until
   Talia physically returns to it. No one contacts Talia while she is
   away.
3. With Talia gone, Zora moves the COBALT_SEAL from the CABINET into
   the VAULT. Zora and Marek are both present in the room and both
   clearly see this move happen.
4. Marek then leaves the collections room for a separate errand. Once
   Marek steps out, Marek cannot see, hear, or otherwise learn anything
   about what happens inside the collections room until Marek
   physically returns to it. No one contacts Marek while he is away.
5. With both Marek and Talia gone, and only Zora present in the room,
   Zora moves the COBALT_SEAL a second time, from the VAULT into the
   LOCKER. No one else witnesses this second move.
6. Marek then returns to the collections room. Zora is present when
   Marek returns, but Zora says nothing to Marek about the COBALT_SEAL
   or either move. Marek does not open the VAULT, look in the LOCKER,
   or otherwise check any storage spot before the scene ends. Talia has
   not yet returned when the scene ends.

The scene ends at this point.

### Table to fill in

Produce exactly the following nine rows in `beliefs.md`, each with an
answer drawn strictly from the token set `{CABINET, VAULT, LOCKER}`:

**First-order beliefs**
1. **Reality** — Where is the COBALT_SEAL actually located at the end
   of the scene?
2. **Zora's belief** — Where does Zora believe it is?
3. **Marek's belief** — Where does Marek believe it is?
4. **Talia's belief** — Where does Talia believe it is?

**Nested (second-order) beliefs**
5. **Zora-thinks-Marek** — Where does Zora believe Marek currently
   believes it is?
6. **Zora-thinks-Talia** — Where does Zora believe Talia currently
   believes it is?
7. **Marek-thinks-Talia** — Where does Marek believe Talia currently
   believes it is?
8. **Talia-thinks-Marek** — Where does Talia believe Marek currently
   believes it is?

**Third-order belief**
9. **Marek-thinks-Zora-thinks-Talia** — Where does Marek believe that
   Zora believes Talia currently believes it is?

## Deliverables

- `beliefs.md`: exactly nine labeled rows as listed above. The answer
  portion of each row must contain exactly one verbatim token from
  `{CABINET, VAULT, LOCKER}` and nothing else — no parentheticals,
  hedges, or explanatory clauses in the answer itself.
- `REASONING.md`: for each agent, state the window during which they
  could observe events in the room (entry/exit times) and show how
  that window determines each answer above. At most 450 words (whole
  file, `wc -w`).

## Constraints

- Every answer cell must be exactly one token from `{CABINET, VAULT,
  LOCKER}` — no other wording, no combined answers, no qualifiers.
- An agent's belief updates only from what that agent personally
  observed while physically present, or was explicitly told. Being in
  the same room as someone who knows more does not transfer knowledge
  by itself — the narrative is explicit about who spoke and who stayed
  silent.
- Do not collapse all beliefs to the final reality; the three agents'
  first-order beliefs are not all the same at the end of the scene.
- `REASONING.md` must be at most 450 words.
