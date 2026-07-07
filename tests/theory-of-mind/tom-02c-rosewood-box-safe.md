---
id: tom-02c-rosewood-box-safe
category: theory-of-mind
title: Rosewood box three-agent knowledge grid
deliverables:
  - beliefs.md
---

## Task

Read the short narrative below. Then fill in a fixed belief table in
`beliefs.md`, and trace each agent's observation window in
`REASONING.md`.

### Narrative

Mireille, Tobias, and Briony share a small furniture restoration
workshop. In the workshop are three storage spots: a BENCH, a SAFE, and
a TRUNK. A single item, the ROSEWOOD_BOX, is kept in one of these spots
at all times.

1. All three of them are present together in the workshop, and all
   three watch as the ROSEWOOD_BOX sits on the BENCH. This starting
   location is plainly visible to everyone.
2. Briony leaves the workshop to run an errand elsewhere in the
   building. Once Briony steps out, Briony cannot see, hear, or
   otherwise learn anything about what happens inside the workshop
   until Briony physically returns to it. No one contacts Briony while
   she is away.
3. With Briony gone, Mireille moves the ROSEWOOD_BOX from the BENCH
   into the SAFE. Mireille and Tobias are both present in the workshop
   and both clearly see this move happen.
4. Tobias then leaves the workshop for a separate errand. Once Tobias
   steps out, Tobias cannot see, hear, or otherwise learn anything
   about what happens inside the workshop until Tobias physically
   returns to it. No one contacts Tobias while he is away.
5. With both Tobias and Briony gone, and only Mireille present in the
   workshop, Mireille moves the ROSEWOOD_BOX a second time, from the
   SAFE into the TRUNK. No one else witnesses this second move.
6. Tobias then returns to the workshop. Mireille is present when Tobias
   returns, but Mireille says nothing to Tobias about the ROSEWOOD_BOX
   or either move. Tobias does not open the SAFE, look in the TRUNK, or
   otherwise check any storage spot before the scene ends. Briony has
   not yet returned when the scene ends.

The scene ends at this point.

### Table to fill in

Produce exactly the following nine rows in `beliefs.md`, each with an
answer drawn strictly from the token set `{BENCH, SAFE, TRUNK}`:

**First-order beliefs**
1. **Reality** — Where is the ROSEWOOD_BOX actually located at the end
   of the scene?
2. **Mireille's belief** — Where does Mireille believe it is?
3. **Tobias's belief** — Where does Tobias believe it is?
4. **Briony's belief** — Where does Briony believe it is?

**Nested (second-order) beliefs**
5. **Mireille-thinks-Tobias** — Where does Mireille believe Tobias
   currently believes it is?
6. **Mireille-thinks-Briony** — Where does Mireille believe Briony
   currently believes it is?
7. **Tobias-thinks-Briony** — Where does Tobias believe Briony
   currently believes it is?
8. **Briony-thinks-Tobias** — Where does Briony believe Tobias
   currently believes it is?

**Third-order belief**
9. **Tobias-thinks-Mireille-thinks-Briony** — Where does Tobias believe
   that Mireille believes Briony currently believes it is?

## Deliverables

- `beliefs.md`: exactly nine labeled rows as listed above. The answer
  portion of each row must contain exactly one verbatim token from
  `{BENCH, SAFE, TRUNK}` and nothing else — no parentheticals, hedges,
  or explanatory clauses in the answer itself.
- `REASONING.md`: for each agent, state the window during which they
  could observe events in the workshop (entry/exit times) and show how
  that window determines each answer above. At most 450 words (whole
  file, `wc -w`).

## Constraints

- Every answer cell must be exactly one token from `{BENCH, SAFE,
  TRUNK}` — no other wording, no combined answers, no qualifiers.
- An agent's belief updates only from what that agent personally
  observed while physically present, or was explicitly told. Being in
  the same room as someone who knows more does not transfer knowledge
  by itself — the narrative is explicit about who spoke and who stayed
  silent.
- Do not collapse all beliefs to the final reality; the three agents'
  first-order beliefs are not all the same at the end of the scene.
- `REASONING.md` must be at most 450 words.
