---
id: tom-04-room-gated-ledger
category: theory-of-mind
title: Two-room map and torch epistemic tracker
deliverables:
  - beliefs.md
---

## Task

Read the short narrative below. Then fill in a fixed belief table in
`beliefs.md`, applying the operative definition of KNOWS given below,
and trace each agent's room-gated observation window in
`REASONING.md`.

### Operative definition

An agent **KNOWS** an item's location only if both of the following
hold: (a) the agent's current belief about that item's location is
correct, and (b) that belief is justified by the agent having directly
observed the item's current position, with no possibility that the
item was moved again afterward without the agent seeing it. If either
condition fails — the belief is wrong, or the belief happens to be
right but the agent cannot rule out an unobserved later move — the
agent merely **BELIEVES** the location rather than KNOWS it.

### Narrative

Sol, Iris, and Rune are three colleagues working across two adjoining
rooms, ROOM_A and ROOM_B. ROOM_A contains two containers, a CHEST and a
SACK. ROOM_B contains two containers, a BIN and a HOOK. Two items are
in play: a MAP and a TORCH. An agent can only see an event if they are
physically present in the room where it happens at the moment it
happens; a closed door between the rooms blocks all sight and sound.

0. At the start, the MAP is in the CHEST (in ROOM_A) and the TORCH is
   in the HOOK (in ROOM_B). All three of Sol, Iris, and Rune have been
   briefed on both of these starting positions, regardless of which
   room each of them currently occupies. At this moment, Sol and Iris
   are physically in ROOM_A, and Rune is physically in ROOM_B.
1. While only Sol and Iris are present in ROOM_A (Rune is in ROOM_B and
   cannot see into ROOM_A), Iris takes the MAP out of the CHEST and
   puts it in the SACK. Sol directly watches this happen.
2. Sol then walks from ROOM_A into ROOM_B, closing the door behind him.
   From this point on, Sol is physically present in ROOM_B, not
   ROOM_A.
3. While only Rune and Sol are present in ROOM_B (Iris is still in
   ROOM_A and cannot see into ROOM_B), Rune takes the TORCH out of the
   HOOK and puts it in the BIN. Sol directly watches this happen, since
   he is now in ROOM_B.
4. Meanwhile, back in ROOM_A, with only Iris present (Sol has already
   left for ROOM_B, and Rune has never been in ROOM_A during this whole
   sequence), Iris takes the MAP out of the SACK and puts it back in
   the CHEST. No one besides Iris witnesses this second move.

The scene ends at this point, with Sol and Rune together in ROOM_B and
Iris alone in ROOM_A.

### Table to fill in

Produce exactly the following thirteen rows in `beliefs.md`. Location
answers must be drawn strictly from the token set `{CHEST, SACK, BIN,
HOOK}`. Knowledge answers must be drawn strictly from the token set
`{YES, NO}`.

**First-order beliefs — MAP location**
1. **Reality (MAP)**
2. **Sol's belief (MAP)**
3. **Iris's belief (MAP)**
4. **Rune's belief (MAP)**

**First-order beliefs — TORCH location**
5. **Reality (TORCH)**
6. **Sol's belief (TORCH)**
7. **Iris's belief (TORCH)**
8. **Rune's belief (TORCH)**

**Knowledge-vs-belief (apply the operative definition above)**
9. **Does Sol KNOW where the MAP is?**
10. **Does Rune KNOW where the MAP is?**

**Nested (second-order) beliefs**
11. **Iris-thinks-Sol(MAP)** — Where does Iris believe Sol currently
    believes the MAP is?
12. **Sol-thinks-Iris(TORCH)** — Where does Sol believe Iris currently
    believes the TORCH is?
13. **Rune-thinks-Iris(MAP)** — Where does Rune believe Iris currently
    believes the MAP is?

## Deliverables

- `beliefs.md`: exactly thirteen labeled rows as listed above. Each
  location answer must be exactly one verbatim token from `{CHEST,
  SACK, BIN, HOOK}` and nothing else; each knowledge answer must be
  exactly `YES` or `NO` and nothing else. No parentheticals, hedges, or
  explanatory clauses in the answer column itself.
- `REASONING.md`: for each agent, state which room they occupied during
  each numbered event and what they could and could not see, then show
  how that determines each of the thirteen answers, including applying
  the operative KNOWS/BELIEVES definition explicitly to rows 9 and 10.
  At most 500 words (whole file, `wc -w`).

## Constraints

- Every location answer must be exactly one token from `{CHEST, SACK,
  BIN, HOOK}`; every knowledge answer must be exactly `YES` or `NO` —
  no other wording, no combined answers, no qualifiers.
- A correct belief is not automatically knowledge — apply the operative
  definition literally, including its clause about ruling out an
  unobserved later move.
- An agent's belief is gated strictly by physical room presence at the
  moment of each event; being briefed on the starting positions at time
  0 counts as information, but nothing that happens afterward transfers
  to an agent who is not physically present for it.
- `REASONING.md` must be at most 500 words.
