---
id: tom-04c-workshop-partition-ledger
category: theory-of-mind
title: Two-workshop chisel and ladle epistemic ledger
deliverables:
  - beliefs.md
---

## Task

Read the short narrative below. Then fill in a fixed belief table in
`beliefs.md`, applying the operative definition of KNOWS given below,
and trace each member's workshop-gated observation window in
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

Mott, Adaeze, and Perrin are three co-op members working across two
adjoining workshops, STUDIO and ANNEX. STUDIO contains two containers,
a TOTE and a BASKET. ANNEX contains two containers, a BUCKET and a
CADDY. Two tools are in play: a CHISEL and a LADLE. A member can only
see an event if they are physically present in the workshop where it
happens at the moment it happens; a closed sliding partition between
the workshops blocks all sight and sound.

0. At the start, the CHISEL is in the TOTE (in STUDIO) and the LADLE is
   in the CADDY (in ANNEX). All three of Mott, Adaeze, and Perrin have
   been briefed on both of these starting positions, regardless of
   which workshop each of them currently occupies. At this moment, Mott
   and Adaeze are physically in STUDIO, and Perrin is physically in
   ANNEX.
1. While only Mott and Adaeze are present in STUDIO (Perrin is in ANNEX
   and cannot see into STUDIO), Adaeze takes the CHISEL out of the TOTE
   and puts it in the BASKET. Mott directly watches this happen.
2. Mott then walks from STUDIO into ANNEX, closing the partition behind
   him. From this point on, Mott is physically present in ANNEX, not
   STUDIO.
3. While only Perrin and Mott are present in ANNEX (Adaeze is still in
   STUDIO and cannot see into ANNEX), Perrin takes the LADLE out of the
   CADDY and puts it in the BUCKET. Mott directly watches this happen,
   since he is now in ANNEX.
4. Meanwhile, back in STUDIO, with only Adaeze present (Mott has
   already left for ANNEX, and Perrin has never been in STUDIO during
   this whole sequence), Adaeze takes the CHISEL out of the BASKET and
   puts it back in the TOTE. No one besides Adaeze witnesses this
   second move.

The scene ends at this point, with Mott and Perrin together in ANNEX
and Adaeze alone in STUDIO.

### Table to fill in

Produce exactly the following thirteen rows in `beliefs.md`. Location
answers must be drawn strictly from the token set `{TOTE, BASKET,
BUCKET, CADDY}`. Knowledge answers must be drawn strictly from the
token set `{YES, NO}`.

**First-order beliefs — CHISEL location**
1. **Reality (CHISEL)**
2. **Mott's belief (CHISEL)**
3. **Adaeze's belief (CHISEL)**
4. **Perrin's belief (CHISEL)**

**First-order beliefs — LADLE location**
5. **Reality (LADLE)**
6. **Mott's belief (LADLE)**
7. **Adaeze's belief (LADLE)**
8. **Perrin's belief (LADLE)**

**Knowledge-vs-belief (apply the operative definition above)**
9. **Does Mott KNOW where the CHISEL is?**
10. **Does Perrin KNOW where the CHISEL is?**

**Nested (second-order) beliefs**
11. **Adaeze-thinks-Mott(CHISEL)** — Where does Adaeze believe Mott
    currently believes the CHISEL is?
12. **Mott-thinks-Adaeze(LADLE)** — Where does Mott believe Adaeze
    currently believes the LADLE is?
13. **Perrin-thinks-Adaeze(CHISEL)** — Where does Perrin believe Adaeze
    currently believes the CHISEL is?

## Deliverables

- `beliefs.md`: exactly thirteen labeled rows as listed above. Each
  location answer must be exactly one verbatim token from `{TOTE,
  BASKET, BUCKET, CADDY}` and nothing else; each knowledge answer must
  be exactly `YES` or `NO` and nothing else. No parentheticals, hedges,
  or explanatory clauses in the answer column itself.
- `REASONING.md`: for each member, state which workshop they occupied
  during each numbered event and what they could and could not see,
  then show how that determines each of the thirteen answers, including
  applying the operative KNOWS/BELIEVES definition explicitly to rows 9
  and 10. At most 500 words (whole file, `wc -w`).

## Constraints

- Every location answer must be exactly one token from `{TOTE, BASKET,
  BUCKET, CADDY}`; every knowledge answer must be exactly `YES` or `NO`
  — no other wording, no combined answers, no qualifiers.
- A correct belief is not automatically knowledge — apply the operative
  definition literally, including its clause about ruling out an
  unobserved later move.
- A member's belief is gated strictly by physical workshop presence at
  the moment of each event; being briefed on the starting positions at
  time 0 counts as information, but nothing that happens afterward
  transfers to a member who is not physically present for it.
- `REASONING.md` must be at most 500 words.
